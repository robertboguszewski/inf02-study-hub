# tests/heatmap.test.md — Activity heatmap calendar

## Cel
30-dniowa wizualizacja aktywności w shell dashboard. Buduje się z `state.sessions[].endedAt`. 5 leveli zagęszczenia (0-4).

## Owner
shell.html `buildActivityHeatmap()` (~line 1330)

## Test scenariusze

### TEST-HEAT-01 (P0): empty sessions → 30 days all level 0
**Given:** state.sessions = []
**When:** buildActivityHeatmap()
**Then:** array length 30, all { level: 0, count: 0 }
**Verification:** every day.level === 0

### TEST-HEAT-02 (P0): 1 session today → today.level=1, count=1
**Given:** sessions = [{endedAt: today.toISOString()}]
**When:** build
**Then:** days[29].count === 1, days[29].level === 1
**Verification:** today entry correct

### TEST-HEAT-03 (P0): 5 sessions today → level=4 (max)
**Given:** 5 sessions all today
**When:** build
**Then:** today.count === 5, today.level === 3 (>=4 = level 3, >5 = level 4)
**Verification:** level mapping {0=0, 1=1, 2-3=2, 4-5=3, >5=4}

### TEST-HEAT-04 (P0): session 31 days ago → not in heatmap
**Given:** session 31 days ago
**When:** build
**Then:** count not included (window only 30 days)
**Verification:** sum of all counts === 0

### TEST-HEAT-05 (P0): session in future ignored
**Given:** session with endedAt = tomorrow
**When:** build
**Then:** not in heatmap (only past 30 days)
**Verification:** sum === 0

### TEST-HEAT-06 (P1): malformed endedAt skipped
**Given:** sessions = [{endedAt: 'invalid'}, {endedAt: today}]
**When:** build
**Then:** invalid skipped, today counted
**Verification:** today.count === 1

### TEST-HEAT-07 (P1): array length always 30
**Given:** any sessions input
**When:** build
**Then:** result.length === 30
**Verification:** length consistency

### TEST-HEAT-08 (P2): timezone consistency (uses ISO date slice)
**Given:** session 23:59 UTC, user in UTC+2
**When:** build (key = ISO yyyy-mm-dd)
**Then:** counts day per UTC date (not local)
**Verification:** intentional design choice (consistent across timezones)
