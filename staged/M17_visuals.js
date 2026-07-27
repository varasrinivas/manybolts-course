case 'mb_incident_timeline': {
      const rows = [
        ['02:40', 'symptom: determinations auto-approving below threshold', 'var(--bad)', ''],
        ['02:44', 'provenance query: UoWs touching the approval path, 8 weeks', 'var(--t2)', '4 min'],
        ['02:51', 'suspect UoW identified, mob and tier known', 'var(--t2)', '7 min'],
        ['03:05', 'validator unknown — record names the approver (PD-7)', 'var(--bad)', '+14 min lost'],
        ['03:22', 'mechanism established with a cited log line', 'var(--ink-2)', '17 min'],
        ['03:29', 'mitigated: flag off, path forced to nurse review', 'var(--ok)', '7 min']
      ];
      let out = '';
      rows.forEach(function(r, i){
        const y = 34 + i * 27;
        out += '<text x="14" y="' + y + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + r[0] + '</text>' +
          '<circle cx="72" cy="' + (y - 4) + '" r="4" fill="' + r[2] + '"></circle>' +
          (i < rows.length - 1 ? '<line x1="72" y1="' + y + '" x2="72" y2="' + (y + 19) + '" stroke="var(--rule)"></line>' : '') +
          '<text x="88" y="' + y + '" font-size="11.5" fill="' + (r[2] === 'var(--bad)' ? 'var(--bad)' : 'var(--ink)') + '">' + r[1] + '</text>' +
          '<text x="600" y="' + y + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + r[3] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Incident timeline from symptom at 02:40 to mitigation at 03:29, with fourteen minutes lost because the provenance record named an approver rather than a validator">' + out +
        '<text x="14" y="206" font-size="11" fill="var(--ink)">Context-gathering: 11 minutes with provenance. The 14 minutes lost to PD-7 is the business case for v2.</text>' +
        '</svg></div><div class="viz-cap">Provenance compresses the search for context. It does nothing for the reasoning about mechanism.</div></div>';
    }

    case 'mb_confabulation_tells': {
      const claims = [
        ['1', 'The threshold comparison uses a float and rounds 0.849 up. See ClinicalCriteriaEvaluator.java:212 and the 02:51 log line.', 'var(--t2)'],
        ['2', 'The auto-approve cache is stale because criteria.cache.ttl is set too high in the production profile.', 'var(--t1)'],
        ['3', 'Auto-approvals rose the same day the Gate bolt landed; provenance record UOW-47 confirms the date.', 'var(--t3)']
      ];
      let out = '';
      claims.forEach(function(c, i){
        const y = 30 + i * 58;
        out += '<g data-mb-claim="' + c[0] + '" opacity="1">' +
          '<rect x="14" y="' + y + '" width="652" height="46" rx="7" fill="var(--card)" stroke="' + c[2] + '" stroke-width="1.4"></rect>' +
          '<text x="30" y="' + (y + 20) + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">claim ' + c[0] + '</text>' +
          '<text x="86" y="' + (y + 20) + '" font-size="11" fill="var(--ink)">' + c[1].slice(0, 78) + '</text>' +
          '<text x="86" y="' + (y + 36) + '" font-size="11" fill="var(--ink)">' + c[1].slice(78) + '</text>' +
          '</g>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 206" role="img" ' +
        'aria-label="Three agent claims about the incident; one cites code and a log line, one names a configuration key that does not exist, one offers a correlation">' + out +
        '<text x="14" y="196" font-size="11" fill="var(--muted)">Select a claim to see the verdict. One of the three is a confabulation.</text>' +
        '</svg></div><div class="viz-ctl"><output data-mb="claim-read">Three claims, delivered with equal fluency at 03:10. Pick the unsupported one.</output></div>' +
        '<div class="viz-cap">The tell is never the tone. It is the absence of a file, a frame, or a line.</div></div>';
    }

    case 'mb_rollback_tree': {
      let out = '';
      const mobs = [['var(--t1)', 4], ['var(--t2)', 4], ['var(--t3)', 3]];
      mobs.forEach(function(m, r){
        for (let i = 0; i < m[1]; i++){
          const x = 250 + i * 92;
          const y = 40 + r * 44;
          const touches = (r === 0 && i < 2) || (r === 1 && i === 1) || (r === 2 && i === 0);
          out += '<rect x="' + x + '" y="' + y + '" width="80" height="28" rx="5" fill="' + (touches ? m[0] : 'var(--paper-2)') + '" stroke="var(--rule)"></rect>' +
            '<text x="' + (x + 40) + '" y="' + (y + 18) + '" text-anchor="middle" font-size="9.5" fill="' + (touches ? 'var(--paper)' : 'var(--muted)') + '">' + (touches ? 'same files' : 'unrelated') + '</text>';
        }
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="The suspect unit of work with eleven later changes from three mobs stacked on top, four of which touch the same files, so a plain revert is unavailable">' +
        '<rect x="14" y="62" width="200" height="52" rx="8" fill="var(--card)" stroke="var(--bad)" stroke-width="2"></rect>' +
        '<text x="30" y="84" font-size="11.5" fill="var(--ink)">suspect UoW</text>' +
        '<text x="30" y="102" font-size="10.5" fill="var(--muted)">landed 6 weeks ago, Tier 3</text>' +
        '<text x="250" y="26" font-size="11" fill="var(--muted)">11 units of work landed since, from three mobs — 4 touch the same files</text>' + out +
        '<text x="14" y="176" font-size="11" fill="var(--ok)">Flag off works instantly, if the change was behind a flag. That is the whole argument for M16&#39;s discipline.</text>' +
        '<text x="14" y="196" font-size="11" fill="var(--bad)">Full release rollback discards three mobs&#39; correct work and buys a second incident on Monday.</text>' +
        '</svg></div><div class="viz-cap">Revert is not available in the sense people mean it at 03:00. Decide from the option table, in writing, at the time.</div></div>';
    }
