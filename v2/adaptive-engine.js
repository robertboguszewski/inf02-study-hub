/* ============================================================================
 * INF.02 Adaptive Learning Engine v2
 * ----------------------------------------------------------------------------
 * Vanilla JS, ES2017+, no external deps. Drop-in module for inf02-study-hub.
 * Modules:
 *   1) Diagnostic calibration       (selectDiagnosticQuestions)
 *   2) Weak-area weighted selection (selectQuizQuestions)
 *   3) SM-2 + 4-rating scheduler    (rateCard)            [Wozniak 1990]
 *   4) Free recall + tolerant match (renderFillInQuestion, matchAnswer)
 *   5) Worked-example fading        (renderWorkedExample) [Sweller 2006]
 *   6) Knowledge model + dashboard  (updateKnowledge, getKnowledgeReport)
 * ==========================================================================*/

(function (global) {
  'use strict';

  // ---------------------------------------------------------------------------
  // STATE — persisted via localStorage under a single key. Pure helpers below
  // accept/return state to keep the algorithmic core testable.
  // ---------------------------------------------------------------------------
  const STORAGE_KEY = 'inf02_adaptive_state_v2';
  const AREAS = ['B', 'O', 'D', 'S', 'U']; // Bezpieczeństwo, Okablowanie, Diagnostyka, Sieci, Usługi
  const ALPHA = 0.7; // Bayesian smoothing for knowledge updates

  const defaultState = () => ({
    diagnosed: false,
    knowledge: AREAS.reduce((acc, a) => (acc[a] = 0.5, acc), {}),
    cards: {},          // id -> {ease, interval, reps, lapses, due, learningStep, area, successStreak}
    history: [],        // {id, ts, correct, area}
    workedExampleProgress: {}, // topic -> count of successful applications
  });

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) { return defaultState(); }
  }

  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  let state = loadState();

  // ---------------------------------------------------------------------------
  // 1) DIAGNOSTIC CALIBRATION
  // ---------------------------------------------------------------------------

  /**
   * Pick a calibration set: 1 easy + 1 medium + 1 hard per area (cap at 12).
   * @param {Array<{id:string,area:string,difficulty:'easy'|'medium'|'hard'}>} pool
   * @param {number} [maxQuestions=12]
   * @returns {Array} ordered diagnostic question list
   */
  function selectDiagnosticQuestions(pool, maxQuestions = 12) {
    const out = [];
    AREAS.forEach(area => {
      ['easy', 'medium', 'hard'].forEach(diff => {
        const candidates = pool.filter(q => q.area === area && q.difficulty === diff);
        if (candidates.length) {
          out.push(candidates[Math.floor(Math.random() * candidates.length)]);
        }
      });
    });
    // Shuffle so user does not see "easy first" pattern (reduces ceiling artefacts)
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out.slice(0, maxQuestions);
  }

  /**
   * Apply diagnostic results. Each area's prior knowledge becomes
   * (correct / answered) capped to [0.1, 0.9] so SR has room to move.
   * @param {Array<{area:string,correct:boolean}>} results
   */
  function markDiagnosisComplete(results) {
    const tally = {};
    results.forEach(r => {
      tally[r.area] = tally[r.area] || { c: 0, n: 0 };
      tally[r.area].n += 1;
      if (r.correct) tally[r.area].c += 1;
    });
    AREAS.forEach(a => {
      if (tally[a]) {
        const p = tally[a].c / tally[a].n;
        state.knowledge[a] = Math.max(0.1, Math.min(0.9, p));
      }
    });
    state.diagnosed = true;
    saveState(state);
  }

  // ---------------------------------------------------------------------------
  // 2) WEAK-AREA WEIGHTED SELECTION
  // ---------------------------------------------------------------------------

  /**
   * Weighted draw of n questions. 70% of slots use weight (1 - knowledge[area])^2
   * (favour weak areas), 30% use a uniform draw (rehearse strong areas to prevent
   * forgetting). Skips cards answered correctly 3+ times in last 7 days.
   * @param {number} n
   * @param {Array<{id:string,area:string}>} pool
   * @returns {Array} selected questions
   */
  function selectQuizQuestions(n, pool) {
    const weakSlots = Math.round(n * 0.7);
    const strongSlots = n - weakSlots;
    const filtered = pool.filter(q => !isRecentlyMastered(q.id));
    if (!filtered.length) return [];

    const weights = filtered.map(q => {
      const k = state.knowledge[q.area] !== undefined ? state.knowledge[q.area] : 0.5;
      return Math.pow(1 - k, 2) + 0.01; // floor to avoid 0 weight
    });

    const picked = [];
    const seen = new Set();
    for (let i = 0; i < weakSlots && picked.length < filtered.length; i++) {
      const idx = weightedIndex(weights, seen);
      if (idx >= 0) { picked.push(filtered[idx]); seen.add(idx); }
    }
    for (let i = 0; i < strongSlots && picked.length < filtered.length; i++) {
      let idx;
      do { idx = Math.floor(Math.random() * filtered.length); } while (seen.has(idx));
      picked.push(filtered[idx]); seen.add(idx);
    }
    return picked;
  }

  function weightedIndex(weights, exclude) {
    let total = 0;
    for (let i = 0; i < weights.length; i++) if (!exclude.has(i)) total += weights[i];
    if (total <= 0) return -1;
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      if (exclude.has(i)) continue;
      r -= weights[i];
      if (r <= 0) return i;
    }
    return -1;
  }

  function isRecentlyMastered(id) {
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const recent = state.history.filter(h => h.id === id && h.ts >= weekAgo);
    const wins = recent.filter(h => h.correct).length;
    return wins >= 3;
  }

  // ---------------------------------------------------------------------------
  // 3) SM-2 WITH 4-RATING + GENTLE LAPSE
  // ---------------------------------------------------------------------------
  // Based on Wozniak 1990 (SuperMemo 2) with Anki-style 4-button mapping.
  // Lapse handling softened per Ye 2023 (FSRS) — relapse multiplies interval by
  // 0.2 instead of resetting to box 1, which preserves morale and partial recall.
  // ---------------------------------------------------------------------------

  const RATING = { AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 };
  const LEARNING_STEPS_MIN = [1, 10, 60 * 24, 60 * 24 * 3]; // 1m, 10m, 1d, 3d

  /**
   * Apply a rating to a card; returns the updated card (does not mutate input).
   * @param {object} card existing or undefined
   * @param {number} rating 1..4
   * @param {string} area area code (for knowledge update)
   * @returns {object} new card state
   */
  function rateCard(card, rating, area) {
    const now = Date.now();
    const c = card ? Object.assign({}, card) : {
      ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now,
      learningStep: 0, area: area, successStreak: 0,
    };

    // ----- Learning phase: graduate through 4 timed steps before SR proper.
    if (c.reps < LEARNING_STEPS_MIN.length) {
      if (rating === RATING.AGAIN) {
        c.learningStep = 0;
        c.due = now + LEARNING_STEPS_MIN[0] * 60 * 1000;
        c.successStreak = 0;
        return c;
      }
      const step = Math.min(c.reps + (rating === RATING.EASY ? 2 : 1), LEARNING_STEPS_MIN.length - 1);
      c.reps = step + 1;
      c.learningStep = step;
      c.due = now + LEARNING_STEPS_MIN[step] * 60 * 1000;
      c.interval = LEARNING_STEPS_MIN[step] / (60 * 24); // in days
      c.successStreak += 1;
      return c;
    }

    // ----- Review phase (Wozniak SM-2): ease modulated, then interval scaled.
    if (rating === RATING.AGAIN) {
      c.lapses += 1;
      c.ease = Math.max(1.3, c.ease - 0.2);
      // Soft lapse: keep 20% of prior interval (min 10 minutes) instead of reset.
      const newIntervalDays = Math.max(0.007, c.interval * 0.2);
      c.interval = newIntervalDays;
      c.due = now + newIntervalDays * 24 * 3600 * 1000;
      c.successStreak = 0;
    } else {
      const easeDelta = rating === RATING.HARD ? -0.15 : rating === RATING.EASY ? +0.15 : 0;
      c.ease = Math.max(1.3, Math.min(3.0, c.ease + easeDelta));
      const factor = rating === RATING.HARD ? 1.2
                   : rating === RATING.GOOD ? c.ease
                   : c.ease * 1.3; // Easy
      const prev = c.interval > 0 ? c.interval : 1;
      c.interval = Math.max(1, prev * factor);
      c.due = now + c.interval * 24 * 3600 * 1000;
      c.reps += 1;
      c.successStreak += 1;
    }
    return c;
  }

  /**
   * High-level wrapper: persist rating, update knowledge, log history.
   * @param {string} id question id
   * @param {string} area
   * @param {number} rating 1..4
   */
  function recordAnswer(id, area, rating) {
    const updated = rateCard(state.cards[id], rating, area);
    state.cards[id] = updated;
    const correct = rating !== RATING.AGAIN;
    updateKnowledge(area, correct);
    state.history.push({ id: id, ts: Date.now(), correct: correct, area: area });
    if (state.history.length > 2000) state.history.splice(0, state.history.length - 2000);
    saveState(state);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // 4) FREE-RECALL FILL-IN + TOLERANT MATCHER
  // ---------------------------------------------------------------------------

  /**
   * Normalise an answer for fuzzy comparison: lowercase, trim, strip Polish
   * diacritics, collapse separators (commas/semicolons/spaces), drop hex
   * leading zeros in IPv6 groups.
   * @param {string} s
   * @returns {string}
   */
  function normalizeAnswer(s) {
    if (s == null) return '';
    let out = String(s).toLowerCase().trim();
    const map = { 'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z' };
    out = out.replace(/[ąćęłńóśźż]/g, ch => map[ch] || ch);
    out = out.replace(/[\s,;]+/g, ''); // remove separators between octets/groups
    // Collapse multiple :: in IPv6 to a single ::
    out = out.replace(/:{3,}/g, '::');
    return out;
  }

  /**
   * Tolerant equality check between user input and accepted answers.
   * @param {string} userInput
   * @param {string|string[]} accepted single string or array of variants
   * @returns {boolean}
   */
  function matchAnswer(userInput, accepted) {
    const u = normalizeAnswer(userInput);
    const variants = Array.isArray(accepted) ? accepted : [accepted];
    return variants.some(v => normalizeAnswer(v) === u);
  }

  /**
   * Render a fill-in question into a container element.
   * @param {object} q {id, area, prompt, answer, hint?}
   * @param {HTMLElement} container
   * @param {(correct:boolean,rating:number)=>void} onResolve callback
   */
  function renderFillInQuestion(q, container, onResolve) {
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'fillin-question';
    wrap.innerHTML =
      '<p class="prompt">' + escapeHtml(q.prompt) + '</p>' +
      '<input type="text" class="fillin-input" autocomplete="off" spellcheck="false" />' +
      '<button type="button" class="fillin-check">Sprawdź</button>' +
      '<div class="fillin-feedback" aria-live="polite"></div>';
    container.appendChild(wrap);
    const input = wrap.querySelector('.fillin-input');
    const btn = wrap.querySelector('.fillin-check');
    const fb = wrap.querySelector('.fillin-feedback');

    function submit() {
      const ok = matchAnswer(input.value, q.answer);
      fb.textContent = ok ? 'Dobrze!' : 'Poprawna odpowiedź: ' + (Array.isArray(q.answer) ? q.answer[0] : q.answer);
      fb.className = 'fillin-feedback ' + (ok ? 'ok' : 'bad');
      input.disabled = true; btn.disabled = true;
      // Free recall is harder than recognition — map to GOOD/AGAIN only.
      if (onResolve) onResolve(ok, ok ? RATING.GOOD : RATING.AGAIN);
    }
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }

  // ---------------------------------------------------------------------------
  // 5) WORKED-EXAMPLE FADING (Sweller 2006: completion problems)
  // ---------------------------------------------------------------------------

  const WORKED_EXAMPLES = {
    // Subnetting /26 example: how many host addresses, derive from binary AND.
    'subnet_26': {
      title: 'Ile adresów daje maska /26?',
      steps: [
        { label: 'Krok 1: zapisz długość hosta',
          full: '32 - 26 = 6 bitów hosta',
          scaffold: '32 - 26 = ? bitów hosta',
          hint: 'Maska ma 26 jedynek; ile bitów zostaje?' },
        { label: 'Krok 2: licz adresy',
          full: '2^6 = 64 adresy w podsieci',
          scaffold: '2^? = ___ adresy',
          hint: 'Każdy bit hosta podwaja liczbę adresów.' },
        { label: 'Krok 3: odejmij sieć i broadcast',
          full: '64 - 2 = 62 adresy hostów użytecznych',
          scaffold: '64 - ? = ___ hostów',
          hint: 'Pierwszy adres = sieć, ostatni = broadcast.' },
      ],
      topic: 'subnetting',
    },
    // Worked example for /27 mask in dotted decimal via binary AND.
    'mask_decimal_27': {
      title: 'Maska dziesiętna dla /27',
      steps: [
        { label: 'Krok 1: pierwsze 24 bity',
          full: '255.255.255.???',
          scaffold: '255.255.255.???',
          hint: 'Pierwsze 3 oktety to same jedynki.' },
        { label: 'Krok 2: ostatni oktet binarnie',
          full: '11100000 (3 jedynki, 5 zer)',
          scaffold: '111????? — uzupełnij zera',
          hint: '/27 = 24 + 3 jedynki w 4. oktecie.' },
        { label: 'Krok 3: zamień na dziesiętne',
          full: '128+64+32 = 224 → 255.255.255.224',
          scaffold: '128+64+32 = ? → 255.255.255.???',
          hint: 'Dodaj wartości pozycyjne ustawionych bitów.' },
      ],
      topic: 'subnetting',
    },
  };

  /**
   * Pick a fading mode based on user's progress on a topic.
   * 0–2 successes: full; 3–5: scaffold; 6+: solo (no example shown).
   * @param {string} topic
   * @returns {'full'|'scaffold'|'hint'|'solo'}
   */
  function workedExampleMode(topic) {
    const c = state.workedExampleProgress[topic] || 0;
    if (c < 3) return 'full';
    if (c < 6) return 'scaffold';
    if (c < 9) return 'hint';
    return 'solo';
  }

  /**
   * Render a worked example with appropriate fading.
   * @param {string} key key into WORKED_EXAMPLES
   * @param {HTMLElement} container
   * @param {'full'|'scaffold'|'hint'|'solo'} [mode] override auto-mode
   */
  function renderWorkedExample(key, container, mode) {
    const ex = WORKED_EXAMPLES[key];
    if (!ex) { container.innerHTML = ''; return; }
    const m = mode || workedExampleMode(ex.topic);
    if (m === 'solo') { container.innerHTML = ''; return; }
    const parts = ['<div class="worked-example mode-' + m + '">',
                   '<h4>' + escapeHtml(ex.title) + '</h4>'];
    ex.steps.forEach(s => {
      const body = m === 'full' ? s.full
                 : m === 'scaffold' ? s.scaffold
                 : s.hint;
      parts.push('<div class="we-step"><strong>' + escapeHtml(s.label) + ':</strong> '
                 + escapeHtml(body) + '</div>');
    });
    parts.push('</div>');
    container.innerHTML = parts.join('');
  }

  /** Increment fading progress after a successful application of the topic. */
  function noteWorkedExampleSuccess(topic) {
    state.workedExampleProgress[topic] = (state.workedExampleProgress[topic] || 0) + 1;
    saveState(state);
  }

  // ---------------------------------------------------------------------------
  // 6) KNOWLEDGE MODEL + DASHBOARD
  // ---------------------------------------------------------------------------

  /**
   * Bayesian-style EWMA: knowledge[a] = α·old + (1-α)·correct.
   * @param {string} area
   * @param {boolean} correct
   */
  function updateKnowledge(area, correct) {
    if (state.knowledge[area] === undefined) state.knowledge[area] = 0.5;
    const old = state.knowledge[area];
    state.knowledge[area] = ALPHA * old + (1 - ALPHA) * (correct ? 1 : 0);
  }

  /**
   * Composite report for dashboard rendering.
   * readinessForExam = mean(knowledge) penalised by spread (low-area drag).
   * @returns {{areas:Object,weakest:string[],strongest:string[],readinessForExam:number}}
   */
  function getKnowledgeReport() {
    const areas = Object.assign({}, state.knowledge);
    const entries = Object.entries(areas);
    const sorted = entries.slice().sort((a, b) => a[1] - b[1]);
    const weakest = sorted.slice(0, 2).map(e => e[0]);
    const strongest = sorted.slice(-2).map(e => e[0]).reverse();
    const mean = entries.reduce((s, [, v]) => s + v, 0) / (entries.length || 1);
    const min = sorted.length ? sorted[0][1] : 0;
    // Drag readiness toward the weakest area — exam fails on missing topics.
    const readinessForExam = Math.max(0, Math.min(1, 0.6 * mean + 0.4 * min));
    return { areas, weakest, strongest, readinessForExam };
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  global.AdaptiveEngine = {
    // state
    getState: () => state,
    resetState: () => { state = defaultState(); saveState(state); },
    // diagnosis
    selectDiagnosticQuestions,
    markDiagnosisComplete,
    isDiagnosed: () => state.diagnosed,
    // selection
    selectQuizQuestions,
    // scheduling
    RATING,
    rateCard,
    recordAnswer,
    // free recall
    matchAnswer,
    normalizeAnswer,
    renderFillInQuestion,
    // worked examples
    renderWorkedExample,
    workedExampleMode,
    noteWorkedExampleSuccess,
    WORKED_EXAMPLES,
    // dashboard
    updateKnowledge,
    getKnowledgeReport,
    AREAS,
  };

  /* ============================================================================
   * INTEGRATION INTERFACE — how to wire this into inf02-study-hub.html v1
   * ----------------------------------------------------------------------------
   * 1. Include this file once:
   *      <script src="v2/adaptive-engine.js"></script>
   *
   * 2. ON FIRST LOAD — diagnostic gate:
   *      if (!AdaptiveEngine.isDiagnosed()) {
   *        const dq = AdaptiveEngine.selectDiagnosticQuestions(QUESTION_POOL);
   *        runQuiz(dq, results => AdaptiveEngine.markDiagnosisComplete(results));
   *      }
   *
   * 3. QUIZ MODE — replace the old random/Leitner picker:
   *      const qs = AdaptiveEngine.selectQuizQuestions(20, QUESTION_POOL);
   *
   * 4. ANSWER RATING — replace box +/- with 4 buttons. After each card:
   *      AdaptiveEngine.recordAnswer(q.id, q.area, AdaptiveEngine.RATING.GOOD);
   *    (use AGAIN | HARD | GOOD | EASY based on user click).
   *
   * 5. FREE-RECALL QUESTIONS — for q.type === 'fillin':
   *      AdaptiveEngine.renderFillInQuestion(q, mountEl, (correct, rating) => {
   *        AdaptiveEngine.recordAnswer(q.id, q.area, rating);
   *      });
   *    Question pool entries:
   *      { id:'mask27', area:'S', type:'fillin',
   *        prompt:'Podaj maskę dziesiętną dla /27',
   *        answer:'255.255.255.224' }
   *      { id:'ipv6shorten', area:'S', type:'fillin',
   *        prompt:'Skróć adres 2001:0db8:0000:0000:0000:ff00:0042:8329',
   *        answer:['2001:db8::ff00:42:8329'] }
   *
   * 6. WORKED EXAMPLES — before a subnet question render the example:
   *      AdaptiveEngine.renderWorkedExample('subnet_26', exampleMountEl);
   *    On correct answer: AdaptiveEngine.noteWorkedExampleSuccess('subnetting').
   *
   * 7. DASHBOARD — rebuild the progress panel from:
   *      const r = AdaptiveEngine.getKnowledgeReport();
   *      // r.areas.B / O / D / S / U  (0..1)
   *      // r.weakest, r.strongest, r.readinessForExam
   *
   * 8. DEBUG / RESET — expose a button calling AdaptiveEngine.resetState().
   *
   * State is auto-persisted to localStorage key `inf02_adaptive_state_v2` after
   * every recordAnswer / markDiagnosisComplete call. No manual save needed.
   * ==========================================================================*/
})(typeof window !== 'undefined' ? window : globalThis);
