case 'mb_dependency_growth': {
      const one = [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 9, 9];
      const five = [0, 3, 6, 10, 13, 16, 19, 22, 25, 27, 29, 30, 31];
      const X0 = 66, X1 = 560, Y0 = 178, MAX = 34;
      const px = function(i){ return X0 + (i / 12) * (X1 - X0); };
      const py = function(v){ return Y0 - (v / MAX) * (Y0 - 26); };
      const path = function(arr){
        let d = '';
        arr.forEach(function(v, i){ d += (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(v).toFixed(1) + ' '; });
        return d;
      };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 214" role="img" ' +
        'aria-label="Direct dependencies added over one quarter: nine with one mob, thirty-one with three mobs">' +
        '<line x1="' + X0 + '" y1="' + Y0 + '" x2="620" y2="' + Y0 + '" stroke="var(--rule)"></line>' +
        '<line x1="' + X0 + '" y1="20" x2="' + X0 + '" y2="' + Y0 + '" stroke="var(--rule)"></line>' +
        '<text x="14" y="26" font-size="10.5" fill="var(--muted)">direct deps</text>' +
        '<text x="14" y="40" font-size="10.5" fill="var(--muted)">added</text>' +
        '<text x="' + X0 + '" y="198" font-size="10.5" fill="var(--muted)">week 0</text>' +
        '<text x="' + (X1 - 30) + '" y="198" font-size="10.5" fill="var(--muted)">week 12</text>' +
        '<path d="' + path(five) + '" fill="none" stroke="var(--t1)" stroke-width="2"></path>' +
        '<path d="' + path(one) + '" fill="none" stroke="var(--t2)" stroke-width="2"></path>' +
        '<circle cx="' + px(12) + '" cy="' + py(31) + '" r="4" fill="var(--t1)"></circle>' +
        '<text x="' + (px(12) + 10) + '" y="' + (py(31) + 4) + '" font-size="11" fill="var(--ink)">31 · three mobs</text>' +
        '<circle cx="' + px(12) + '" cy="' + py(9) + '" r="4" fill="var(--t2)"></circle>' +
        '<text x="' + (px(12) + 10) + '" y="' + (py(9) + 4) + '" font-size="11" fill="var(--ink)">9 · one mob</text>' +
        '<text x="' + X0 + '" y="210" font-size="11" fill="var(--ink-2)">Six were duplicates in function. Fourteen brought new transitive packages: +140 packages owned.</text>' +
        '</svg></div><div class="viz-cap">Fixture measurement over one quarter. Reviewer count over the same period: unchanged, part-time.</div></div>';
    }

    case 'mb_supply_chain_gate': {
      const steps = [
        ['elaborate','var(--muted)', ''],
        ['generate','var(--muted)', ''],
        ['SBOM per bolt','var(--t2)', 'attached to the UoW'],
        ['merge queue','var(--ok)', 'CVE + licence block here'],
        ['land','var(--muted)', '']
      ];
      let out = '';
      steps.forEach(function(s, i){
        const x = 12 + i * 134;
        const hot = s[2] !== '';
        out += '<rect x="' + x + '" y="46" width="118" height="' + (hot ? 54 : 38) + '" rx="7" fill="var(--card)" stroke="' + s[1] + '" stroke-width="' + (hot ? 2 : 1.2) + '"></rect>' +
          '<text x="' + (x + 59) + '" y="70" text-anchor="middle" font-size="11.5" fill="var(--ink)">' + s[0] + '</text>' +
          (hot ? '<text x="' + (x + 59) + '" y="88" text-anchor="middle" font-size="10" fill="' + s[1] + '">' + s[2] + '</text>' : '') +
          (i < 4 ? '<text x="' + (x + 122) + '" y="70" font-size="13" fill="var(--rule)">&#8594;</text>' : '');
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 152" role="img" ' +
        'aria-label="The bolt loop with SBOM generation after generate and CVE plus licence blocking in the merge queue, not at human review">' +
        '<text x="12" y="28" font-size="11.5" fill="var(--muted)">the specialist decides policy; the pipeline applies it to every bolt from every mob</text>' + out +
        '<text x="12" y="132" font-size="11" fill="var(--ink)">Nothing here is a human gate. That is the design, not a compromise.</text>' +
        '</svg></div><div class="viz-cap">Where supply-chain checks belong in the loop.</div></div>';
    }

    case 'mb_phi_leak': {
      const line = function(x, y, txt, tok){ return '<text x="' + x + '" y="' + y + '" font-size="11" font-family="var(--mono)" fill="' + tok + '">' + txt + '</text>'; };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="An agent-generated catch block logs the member id and date of birth; the fitness function that fails the build on any member identifier in a log or exception path">' +
        '<rect x="12" y="14" width="656" height="86" rx="8" fill="var(--paper-2)" stroke="var(--bad)" stroke-width="1.4"></rect>' +
        '<text x="24" y="32" font-size="10.5" fill="var(--bad)">generated, reviewed, approved — and a reportable disclosure</text>' +
        line(24, 52, 'catch (CriteriaException e) {', 'var(--ink-2)') +
        line(40, 68, 'log.error("criteria eval failed for member {} dob {} proc {}",', 'var(--bad)') +
        line(56, 84, 'member.getId(), member.getDob(), request.getProcedureCode(), e);', 'var(--bad)') +
        '<text x="12" y="124" font-size="11.5" fill="var(--ink)">Behaviour unchanged, tests green, reviewer sees good error handling.</text>' +
        '<rect x="12" y="136" width="656" height="66" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="1.4"></rect>' +
        '<text x="24" y="154" font-size="10.5" fill="var(--ok)">the control that does not depend on anyone noticing</text>' +
        line(24, 174, 'PhiLoggingFitnessTest: no log or exception path may reference', 'var(--ink-2)') +
        line(24, 190, 'Member.id, Member.dob, or any @PhiField accessor  &#8594;  build fails', 'var(--ink-2)') +
        '</svg></div><div class="viz-cap">The most dangerous generated pattern in a regulated system, and its mechanical answer.</div></div>';
    }
