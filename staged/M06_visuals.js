case 'mb_entropy_drift': {
      const items = [
        ['error-handling idioms', 1, 3],
        ['date/time libraries', 1, 2],
        ['HTTP clients', 1, 2],
        ['determination assertions in tests', 1, 4],
        ['retry strategies', 0, 3]
      ];
      let out = '';
      items.forEach(function(it, i){
        const y = 34 + i * 30;
        out += '<text x="14" y="' + (y + 12) + '" font-size="11.5" fill="var(--ink-2)">' + it[0] + '</text>';
        for (let k = 0; k < it[2]; k++){
          const x = 330 + k * 26;
          const before = k < it[1];
          out += '<rect x="' + x + '" y="' + y + '" width="20" height="16" rx="3" fill="' + (before ? 'var(--t2)' : 'var(--t1)') + '" opacity="' + (before ? '1' : '0.85') + '"></rect>';
        }
        out += '<text x="' + (330 + it[2] * 26 + 8) + '" y="' + (y + 13) + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + it[1] + ' &#8594; ' + it[2] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="After twelve weeks of three-mob work the codebase holds three error idioms, two date libraries, two HTTP clients, four determination assertion styles and three retry strategies">' +
        '<text x="14" y="20" font-size="11.5" fill="var(--muted)">One quarter, three mobs, no rule broken</text>' +
        '<rect x="330" y="8" width="10" height="10" rx="2" fill="var(--t2)"></rect><text x="346" y="17" font-size="10.5" fill="var(--muted)">at week 0</text>' +
        '<rect x="424" y="8" width="10" height="10" rx="2" fill="var(--t1)"></rect><text x="440" y="17" font-size="10.5" fill="var(--muted)">added since</text>' +
        out +
        '<text x="14" y="192" font-size="11" fill="var(--ink)">Each addition was defensible in its own diff. Entropy is a property of the set, so review cannot see it.</text>' +
        '</svg></div><div class="viz-cap">Dialect drift in the fixture. Nobody violated a rule; there were no executable rules to violate.</div></div>';
    }

    case 'mb_fitness_gate': {
      const stages = [
        ['steering file','advisory','var(--muted)','conventions, idiom'],
        ['scaffold','pre-satisfied','var(--t2)','structure, annotations'],
        ['fitness test in CI','mechanical','var(--ok)','layers, PHI, contracts'],
        ['runtime check','blocks late','var(--t1)','data boundaries']
      ];
      let out = '';
      stages.forEach(function(s, i){
        const x = 12 + i * 168;
        out += '<rect x="' + x + '" y="40" width="150" height="70" rx="8" fill="var(--card)" stroke="' + s[2] + '" stroke-width="1.6"></rect>' +
          '<text x="' + (x + 12) + '" y="64" font-size="11.5" fill="var(--ink)">' + s[0] + '</text>' +
          '<text x="' + (x + 12) + '" y="82" font-size="10.5" font-family="var(--mono)" fill="' + s[2] + '">' + s[1] + '</text>' +
          '<text x="' + (x + 12) + '" y="100" font-size="10.5" fill="var(--muted)">' + s[3] + '</text>';
        if (i < 3) out += '<text x="' + (x + 156) + '" y="80" font-size="14" fill="var(--rule)">&#8594;</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 160" role="img" ' +
        'aria-label="Four places an architectural rule can live, from advisory steering to a runtime check, with the kind of rule that belongs at each">' +
        '<text x="12" y="24" font-size="11.5" fill="var(--muted)">earliest mechanical enforcement wins — cost per bolt falls to zero from the middle two onward</text>' + out +
        '<text x="12" y="140" font-size="11" fill="var(--ink)">A rule in the leftmost box costs a reviewer a glance on every diff, forever.</text>' +
        '</svg></div><div class="viz-cap">Constraint-time governance is just this: move each rule as far left as it can be enforced mechanically.</div></div>';
    }

    case 'mb_dependency_rule': {
      const layer = function(y, name, tok){
        return '<rect x="150" y="' + y + '" width="380" height="40" rx="7" fill="var(--card)" stroke="' + tok + '" stroke-width="1.5"></rect>' +
          '<text x="168" y="' + (y + 25) + '" font-size="12" font-family="var(--mono)" fill="var(--ink)">' + name + '</text>';
      };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 190" role="img" ' +
        'aria-label="The web tier should depend downward on the clinical library, but a formatting helper in the clinical library imports from web, reversing the arrow">' +
        layer(18, 'priorauth-web  ..web.. ..portal..', 'var(--t3)') +
        layer(112, 'priorauth-clinical-rules  ..clinical..', 'var(--bad)') +
        '<line x1="240" y1="58" x2="240" y2="108" stroke="var(--ok)" stroke-width="2" marker-end="url(#mbDepArrow)"></line>' +
        '<text x="252" y="88" font-size="10.5" fill="var(--ok)">designed: downward only</text>' +
        '<line x1="470" y1="112" x2="470" y2="62" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#mbDepArrow)"></line>' +
        '<text x="330" y="' + 106 + '" font-size="10.5" fill="var(--bad)">PD-5: CriteriaDisplayFormatter imports ..web..</text>' +
        '<defs><marker id="mbDepArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"></path></marker></defs>' +
        '<text x="150" y="176" font-size="11" fill="var(--ink)">Four lines, a good reason, and the shared library can no longer be built alone.</text>' +
        '</svg></div><div class="viz-cap">The violation nobody catches in review, and the one-test rule that never allows it again.</div></div>';
    }
