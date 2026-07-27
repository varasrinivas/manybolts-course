case 'mb_brownfield_loop': {
      const step = function(x, label, ok, note){
        const tok = ok ? 'var(--ok)' : 'var(--bad)';
        return '<rect x="' + x + '" y="46" width="130" height="44" rx="7" fill="var(--card)" stroke="' + tok + '" stroke-width="' + (ok ? 1.4 : 2.2) + '"></rect>' +
          '<text x="' + (x + 65) + '" y="73" text-anchor="middle" font-size="11.5" fill="var(--ink)">' + label + '</text>' +
          '<text x="' + (x + 65) + '" y="108" text-anchor="middle" font-size="10.5" fill="' + tok + '">' + note + '</text>';
      };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 190" role="img" ' +
        'aria-label="In the bolt loop, elaborate, generate and land work as normal in legacy code, but validate has no oracle so approval degrades to it compiles and the demo works">' +
        step(20, 'elaborate', true, 'works') +
        step(180, 'generate', true, 'works well') +
        step(340, 'validate', false, 'no oracle') +
        step(500, 'land', true, 'works') +
        '<text x="158" y="72" font-size="14" fill="var(--rule)">&#8594;</text>' +
        '<text x="318" y="72" font-size="14" fill="var(--rule)">&#8594;</text>' +
        '<text x="478" y="72" font-size="14" fill="var(--rule)">&#8594;</text>' +
        '<text x="20" y="26" font-size="11.5" fill="var(--muted)">the same loop, in a module with no tests</text>' +
        '<text x="20" y="146" font-size="11" fill="var(--bad)">Approval becomes: I read a diff in a file I do not understand and nothing obviously wrong happened.</text>' +
        '<text x="20" y="168" font-size="11" fill="var(--muted)">Invisible in every metric. Bolts land, cycle time looks fine, and the control has quietly gone.</text>' +
        '</svg></div><div class="viz-cap">One component breaks, not the method as a whole. Naming which one is what makes the fix findable.</div></div>';
    }

    case 'mb_characterization': {
      const rows = [
        ['retiree + dependent, mid-year', 'ELIGIBLE', 'ELIGIBLE', false],
        ['employer override, expired plan', 'INELIGIBLE', 'INELIGIBLE', false],
        ['COBRA, day 61', 'ELIGIBLE (surprising)', 'ELIGIBLE (surprising)', false],
        ['effective date crosses plan year', 'PENDING', 'ELIGIBLE', true]
      ];
      let out = '<text x="18" y="34" font-size="10" fill="var(--muted)">INPUT AT THE SEAM</text>' +
        '<text x="330" y="34" font-size="10" fill="var(--muted)">PINNED BEFORE</text>' +
        '<text x="490" y="34" font-size="10" fill="var(--muted)">AFTER THE CHANGE</text>';
      rows.forEach(function(r, i){
        const y = 46 + i * 32;
        out += '<rect x="14" y="' + y + '" width="652" height="26" rx="5" fill="var(--card)" stroke="' + (r[3] ? 'var(--bad)' : 'var(--rule)') + '" stroke-width="' + (r[3] ? 1.8 : 1) + '"></rect>' +
          '<text x="26" y="' + (y + 17) + '" font-size="10.5" fill="var(--ink-2)">' + r[0] + '</text>' +
          '<text x="330" y="' + (y + 17) + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + r[1] + '</text>' +
          '<text x="490" y="' + (y + 17) + '" font-size="10.5" font-family="var(--mono)" fill="' + (r[3] ? 'var(--bad)' : 'var(--muted)') + '">' + r[2] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="Four pinned behaviours at the seam; after a small change one output moved from PENDING to ELIGIBLE, which is the blast radius made visible">' + out +
        '<text x="14" y="192" font-size="11" fill="var(--ink)">One row moved. That is the blast radius of a change nobody could otherwise have bounded.</text>' +
        '</svg></div><div class="viz-cap">Characterization confers no correctness. Row three is pinned and probably wrong, and that is recorded deliberately.</div></div>';
    }

    case 'mb_strangler_seams': {
      const seams = [
        ['plan-rule lookup', 'Gate', 'var(--t2)', 'window 1'],
        ['employer override', 'Appeals', 'var(--t1)', 'window 2'],
        ['dependent resolution', 'unassigned', 'var(--bad)', 'do not start'],
        ['date-boundary math', 'Gate', 'var(--t2)', 'window 3']
      ];
      let out = '';
      seams.forEach(function(s, i){
        const y = 44 + i * 34;
        out += '<rect x="200" y="' + y + '" width="200" height="26" rx="5" fill="var(--card)" stroke="' + s[2] + '" stroke-width="1.5"></rect>' +
          '<text x="212" y="' + (y + 17) + '" font-size="10.5" fill="var(--ink)">' + s[0] + '</text>' +
          '<text x="416" y="' + (y + 17) + '" font-size="10.5" fill="' + s[2] + '">' + s[1] + '</text>' +
          '<text x="540" y="' + (y + 17) + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + s[3] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="EligibilityService with four seams; three are assigned to a mob and a window, one is unassigned and therefore must not be started">' +
        '<rect x="14" y="44" width="160" height="128" rx="8" fill="var(--paper-2)" stroke="var(--rule)"></rect>' +
        '<text x="94" y="100" text-anchor="middle" font-size="11.5" fill="var(--ink)">EligibilityService</text>' +
        '<text x="94" y="118" text-anchor="middle" font-size="10.5" fill="var(--muted)">4,000 lines</text>' +
        '<text x="94" y="134" text-anchor="middle" font-size="10.5" fill="var(--bad)">PD-12</text>' +
        '<text x="200" y="34" font-size="10" fill="var(--muted)">SEAM</text>' +
        '<text x="416" y="34" font-size="10" fill="var(--muted)">OWNER AFTER EXTRACTION</text>' +
        '<text x="540" y="34" font-size="10" fill="var(--muted)">SEQUENCE</text>' + out +
        '<text x="14" y="196" font-size="11" fill="var(--ink)">A seam with no owner after extraction is the next unowned library. Do not cut it yet.</text>' +
        '</svg></div><div class="viz-cap">One seam, one mob, one window — sequenced in the registry with the seam itself named as the contended resource.</div></div>';
    }
