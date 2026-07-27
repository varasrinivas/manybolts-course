case 'mb_second_team_cliff': {
      const rows = [
        ['volunteers, strongest engineers', true, false],
        ['greenfield-ish work', true, false],
        ['SME attention on demand', true, false],
        ['empty CI queue', true, false],
        ['sponsor who takes the call', true, false],
        ['permission to break convention', true, false]
      ];
      let out = '<text x="300" y="26" font-size="10.5" fill="var(--ok)">PILOT</text>' +
        '<text x="470" y="26" font-size="10.5" fill="var(--bad)">THE NEXT TEAM</text>';
      rows.forEach(function(r, i){
        const y = 46 + i * 26;
        out += '<text x="14" y="' + (y + 4) + '" font-size="11.5" fill="var(--ink-2)">' + r[0] + '</text>' +
          '<text x="316" y="' + (y + 5) + '" font-size="13" fill="var(--ok)">&#10003;</text>' +
          '<text x="500" y="' + (y + 5) + '" font-size="13" fill="var(--bad)">&#215;</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Six conditions the pilot had and the next team does not: volunteers, greenfield work, on-demand SME attention, empty CI queue, an available sponsor and permission to break convention">' + out +
        '<text x="14" y="208" font-size="11" fill="var(--ink)">Same method, same tooling, six missing conditions. The result gets reported as a method failure.</text>' +
        '</svg></div><div class="viz-cap">The pilot proved the method is learnable. It proved nothing about contention.</div></div>';
    }

    case 'mb_prereq_checklist': {
      const items = [
        ['validation tiers','M04','var(--t1)', true],
        ['one golden path','M05','var(--t1)', false],
        ['three fitness functions','M06','var(--t1)', false],
        ['merge queue','M08','var(--t2)', true],
        ['canonical steering','M12 M13','var(--t3)', false],
        ['unit-of-work registry','M14','var(--t3)', false]
      ];
      let out = '';
      items.forEach(function(it, i){
        const x = 14 + (i % 3) * 222;
        const y = 40 + Math.floor(i / 3) * 76;
        out += '<rect x="' + x + '" y="' + y + '" width="204" height="58" rx="8" fill="var(--card)" stroke="' + (it[3] ? it[2] : 'var(--rule)') + '" stroke-width="' + (it[3] ? 2 : 1) + '"></rect>' +
          '<text x="' + (x + 14) + '" y="' + (y + 26) + '" font-size="11.5" fill="var(--ink)">' + it[0] + '</text>' +
          '<text x="' + (x + 14) + '" y="' + (y + 45) + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + it[1] + '</text>' +
          (it[3] ? '<text x="' + (x + 150) + '" y="' + (y + 45) + '" font-size="10" fill="' + it[2] + '">do first</text>' : '');
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="Six prerequisites before the next team starts, each linked to the module that builds it; the tier table and merge queue are marked do-first">' +
        '<text x="14" y="26" font-size="11.5" fill="var(--muted)">none of these takes more than a week for a competent platform pair</text>' + out +
        '<text x="14" y="200" font-size="11" fill="var(--ink)">Skip them and you get roughly three times the wait, invisible until it is a leadership conversation.</text>' +
        '</svg></div><div class="viz-cap">The cheapest insurance in this course, and the one most often deferred to a later phase.</div></div>';
    }

    case 'mb_rollout_sequence': {
      const cands = [
        ['boring, well-tested codebase; moderate enthusiasm; no deadline', 'go next', 'var(--ok)'],
        ['keen team, shares the contended module with the pilot', 'later — you could not read the result', 'var(--warn)'],
        ['regulatory deadline this quarter', 'not now', 'var(--bad)'],
        ['untested legacy monolith', 'characterize first, six weeks', 'var(--bad)']
      ];
      let out = '';
      cands.forEach(function(c, i){
        const y = 40 + i * 38;
        out += '<rect x="14" y="' + y + '" width="400" height="30" rx="6" fill="var(--card)" stroke="var(--rule)"></rect>' +
          '<text x="28" y="' + (y + 20) + '" font-size="11" fill="var(--ink-2)">' + c[0] + '</text>' +
          '<text x="430" y="' + (y + 20) + '" font-size="11" fill="' + c[2] + '">' + c[1] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Four candidate groups ordered by conditions rather than enthusiasm: the boring well-tested codebase goes next, the keen team sharing a contended module waits, the group with a deadline does not start, the legacy monolith characterizes first">' +
        '<text x="14" y="26" font-size="11.5" fill="var(--muted)">order by conditions, not by motivation — you are testing conditions now</text>' + out +
        '<text x="14" y="204" font-size="11" fill="var(--ink)">A rollout plan in which nobody waits is a schedule, not a plan.</text>' +
        '</svg></div><div class="viz-cap">Enthusiasm papers over the evidence you most need from the second cohort.</div></div>';
    }
