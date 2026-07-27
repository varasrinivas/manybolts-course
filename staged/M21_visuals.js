case 'mb_event_deck': {
      const cards = [
        ['1', 'three mobs start parallel bolts', 'M03 M14', 'var(--t0)'],
        ['2', 'clinical SME on two weeks&#39; leave', 'M04 M05', 'var(--t1)'],
        ['3', 'a fourth mob onboards mid-quarter', 'M12 M15 M19', 'var(--t3)'],
        ['4', 'Sev-2, cause unclear, code six weeks old', 'M17 M16', 'var(--t5)'],
        ['5', 'compliance requests threshold evidence', 'M16 M07', 'var(--t4)'],
        ['6', 'exec asks which mob is best', 'M18 M20', 'var(--t2)']
      ];
      let out = '';
      cards.forEach(function(c, i){
        const x = 12 + (i % 3) * 224;
        const y = 20 + Math.floor(i / 3) * 96;
        out += '<rect x="' + x + '" y="' + y + '" width="208" height="80" rx="9" fill="var(--card)" stroke="' + c[3] + '" stroke-width="1.6"></rect>' +
          '<text x="' + (x + 14) + '" y="' + (y + 24) + '" font-size="11" font-family="var(--mono)" fill="' + c[3] + '">round ' + c[0] + '</text>' +
          '<text x="' + (x + 14) + '" y="' + (y + 46) + '" font-size="11" fill="var(--ink)">' + c[1].slice(0, 30) + '</text>' +
          '<text x="' + (x + 14) + '" y="' + (y + 61) + '" font-size="11" fill="var(--ink)">' + c[1].slice(30) + '</text>' +
          '<text x="' + (x + 14) + '" y="' + (y + 74) + '" font-size="10" font-family="var(--mono)" fill="var(--muted)">' + c[2] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 220" role="img" ' +
        'aria-label="Six event cards, one per round, each naming the modules it puts under test">' + out +
        '</svg></div><div class="viz-cap">Every card must change what the right move is. One that does not is decoration — say so in the retro.</div></div>';
    }

    case 'mb_quarter_board': {
      const dims = ['bolts landed', 'validator queue', 'contract breaks', 'cross-repo breaks', 'steering drift', 'flag debt', 'evidence', 'security queue'];
      const grid = [
        [2, 2, 2, 1, 2, 2],
        [2, 0, 1, 1, 1, 2],
        [2, 2, 1, 2, 2, 2],
        [1, 1, 1, 0, 1, 1],
        [2, 2, 0, 1, 1, 1],
        [2, 1, 1, 1, 0, 0],
        [1, 1, 1, 0, 0, 1],
        [2, 2, 1, 1, 1, 2]
      ];
      const tok = ['var(--bad)', 'var(--warn)', 'var(--ok)'];
      let out = '';
      for (let r = 0; r < 6; r++){
        out += '<text x="' + (206 + r * 62) + '" y="24" font-size="10" font-family="var(--mono)" fill="var(--muted)">R' + (r + 1) + '</text>';
      }
      dims.forEach(function(d, i){
        const y = 34 + i * 22;
        out += '<text x="14" y="' + (y + 13) + '" font-size="10.5" fill="var(--ink-2)">' + d + '</text>';
        grid[i].forEach(function(v, r){
          out += '<rect x="' + (196 + r * 62) + '" y="' + y + '" width="52" height="16" rx="3" fill="' + tok[v] + '" opacity="' + (v === 2 ? '0.85' : '0.95') + '"></rect>';
        });
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 226" role="img" ' +
        'aria-label="A scoreboard of eight dimensions across six rounds; evidence completeness and cross-repo breakage degrade from round three onward while bolts landed stays healthy">' +
        out +
        '<text x="570" y="24" font-size="10" fill="var(--muted)">sample run</text>' +
        '<text x="14" y="218" font-size="11" fill="var(--ink)">Bolts kept landing. Evidence and cross-repo integrity decayed from round 3 — and round 5 sends the bill.</text>' +
        '</svg></div><div class="viz-cap">Eight dimensions, six rounds, visible from the start. The rubric is not a surprise you earn.</div></div>';
    }

    case 'mb_quarter_retro': {
      const rows = [
        ['bolts landed', 15, 15, ''],
        ['validator queue time', 13, 15, ''],
        ['contract breakages', 9, 10, ''],
        ['cross-repo breakage', 3, 10, 'M09 — no drift report, no outcome test'],
        ['steering drift events', 8, 10, ''],
        ['flag debt', 7, 10, ''],
        ['evidence completeness', 5, 20, 'M16 — provenance stayed at v1'],
        ['security queue depth', 8, 10, '']
      ];
      let out = '';
      rows.forEach(function(r, i){
        const y = 30 + i * 22;
        const worst = r[3] !== '';
        out += '<text x="14" y="' + (y + 12) + '" font-size="10.5" fill="var(--ink-2)">' + r[0] + '</text>' +
          '<rect x="150" y="' + y + '" width="' + (r[2] * 5) + '" height="15" rx="3" fill="var(--paper-2)" stroke="var(--rule)"></rect>' +
          '<rect x="150" y="' + y + '" width="' + (r[1] * 5) + '" height="15" rx="3" fill="' + (worst ? 'var(--bad)' : 'var(--t2)') + '"></rect>' +
          '<text x="' + (150 + r[2] * 5 + 10) + '" y="' + (y + 12) + '" font-size="10" font-family="var(--mono)" fill="var(--muted)">' + r[1] + '/' + r[2] + '</text>' +
          (worst ? '<text x="330" y="' + (y + 12) + '" font-size="10.5" fill="var(--bad)">' + r[3] + '</text>' : '');
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 220" role="img" ' +
        'aria-label="A finished scorecard of 68 out of 100, with cross-repo breakage and evidence completeness as the two lowest dimensions, each traced to the module whose practice was missing">' +
        out +
        '<text x="14" y="212" font-size="11" fill="var(--ink)">68 / 100. The retro is the graded artifact: two lowest dimensions, each traced to a practice you did not have.</text>' +
        '</svg></div><div class="viz-cap">Your run is a test of the course&#39;s claim about which absences hurt most — not a confirmation of it.</div></div>';
    }
