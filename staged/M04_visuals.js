case 'mb_queue_curve': {
      let path = '';
      for (let i = 0; i <= 95; i++) {
        const rho = i / 100;
        const wq = 0.75 * rho / (1 - rho);
        const x = 70 + rho * 560;
        const y = 200 - Math.min(178, (wq / 18) * 178);
        path += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
      }
      const knee = 70 + 0.8 * 560;
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 236" role="img" ' +
        'aria-label="Expected queue time against validator utilisation: flat below 70 percent, rising steeply past 80 percent">' +
        '<line x1="70" y1="200" x2="655" y2="200" stroke="var(--rule)"></line>' +
        '<line x1="70" y1="20" x2="70" y2="200" stroke="var(--rule)"></line>' +
        '<line x1="' + knee + '" y1="20" x2="' + knee + '" y2="200" stroke="var(--warn)" stroke-dasharray="4 4" opacity="0.7"></line>' +
        '<text x="' + (knee + 6) + '" y="34" font-size="10.5" fill="var(--warn)">80% — the knee</text>' +
        '<path d="' + path + '" fill="none" stroke="var(--t1)" stroke-width="2"></path>' +
        '<circle data-mb="q-dot" cx="300" cy="180" r="6" fill="var(--t1)" stroke="var(--card)" stroke-width="2"></circle>' +
        '<text x="70" y="222" font-size="10.5" fill="var(--muted)">0%</text>' +
        '<text x="340" y="222" font-size="10.5" fill="var(--muted)">validator utilisation</text>' +
        '<text x="628" y="222" font-size="10.5" fill="var(--muted)">100%</text>' +
        '<text x="14" y="26" font-size="10.5" fill="var(--muted)">queue time</text>' +
        '<text x="14" y="40" font-size="10.5" fill="var(--muted)">per bolt</text>' +
        '</svg></div>' +
        '<div class="viz-ctl">' +
        '<label>arrivals <input data-mb="q-arr" type="range" min="2" max="30" step="1" value="12"><output data-mb="q-arr-out">12 bolts/week</output></label>' +
        '<label>capacity <input data-mb="q-cap" type="range" min="2" max="30" step="1" value="8"><output data-mb="q-cap-out">8 review hours/week</output></label>' +
        '</div>' +
        '<div class="viz-ctl"><output data-mb="q-read">utilisation 100%</output></div>' +
        '<div class="viz-cap">Single-server approximation, 45 minutes per review. Direction and magnitude are trustworthy; the exact hours are not a forecast.</div></div>';
    }

    case 'mb_tier_ladder': {
      const tiers = [
        ['Tier 0','cosmetic, tests, docs','agent + author','var(--ok)', 34],
        ['Tier 1','service-internal logic','peer in the mob','var(--t2)', 26],
        ['Tier 2','published contract, shared aggregate','owning mob validator','var(--t3)', 27],
        ['Tier 3','clinical rule, threshold, PHI, audit','clinical SME + compliance — no delegation','var(--bad)', 13]
      ];
      let out = '';
      tiers.forEach(function(t, i){
        const y = 16 + i * 46;
        out += '<rect x="12" y="' + y + '" width="480" height="38" rx="7" fill="var(--card)" stroke="var(--rule)"></rect>' +
          '<rect x="12" y="' + y + '" width="5" height="38" rx="2" fill="' + t[3] + '"></rect>' +
          '<text x="28" y="' + (y + 16) + '" font-size="12" font-family="var(--mono)" fill="' + t[3] + '">' + t[0] + '</text>' +
          '<text x="86" y="' + (y + 16) + '" font-size="11.5" fill="var(--ink)">' + t[1] + '</text>' +
          '<text x="86" y="' + (y + 31) + '" font-size="10.5" fill="var(--muted)">' + t[2] + '</text>' +
          '<rect x="504" y="' + (y + 8) + '" width="' + (t[4] * 1.5) + '" height="22" rx="4" fill="' + t[3] + '" opacity="0.85"></rect>' +
          '<text x="' + (504 + t[4] * 1.5 + 8) + '" y="' + (y + 24) + '" font-size="11" font-family="var(--mono)" fill="var(--ink-2)">' + t[4] + '%</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Four blast-radius tiers with their validators and the share of fixture changes in each">' + out +
        '<text x="504" y="12" font-size="10" fill="var(--muted)">share of changes</text>' +
        '<text x="12" y="208" font-size="11" fill="var(--ink)">Tiering moves 87% of changes out of the scarce queue. The 13% left is where the argument happens.</text>' +
        '</svg></div><div class="viz-cap">Shares are the fixture&#39;s. Yours will differ; the discipline of measuring them will not.</div></div>';
    }

    case 'mb_sme_load': {
      const seg = [['nurse escalations', 9, 'var(--t5)'], ['Thursday board', 3, 'var(--t4)'], ['meetings, switching', 4, 'var(--muted)'], ['code validation', 8, 'var(--t1)']];
      let x = 60, out = '';
      seg.forEach(function(s){
        const w = s[1] * 22;
        out += '<rect x="' + x + '" y="40" width="' + (w - 2) + '" height="40" rx="4" fill="' + s[2] + '"></rect>' +
          '<text x="' + (x + (w - 2) / 2) + '" y="65" text-anchor="middle" font-size="11" fill="var(--paper)">' + s[1] + ' h</text>' +
          '<text x="' + (x + (w - 2) / 2) + '" y="100" text-anchor="middle" font-size="10.5" fill="var(--ink-2)">' + s[0] + '</text>';
        x += w;
      });
      const demand = 12 * 0.75;
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 190" role="img" ' +
        'aria-label="The clinical SME has 24 nominal hours: 9 to escalations, 3 to the board, 4 to meetings, leaving 8 for code validation against 9 hours of demand">' +
        '<text x="14" y="26" font-size="11.5" fill="var(--muted)">One clinical SME, 0.6 FTE, 24 nominal hours a week</text>' + out +
        '<rect x="60" y="126" width="' + (8 * 22 - 2) + '" height="18" rx="4" fill="var(--t1)" opacity="0.35"></rect>' +
        '<rect x="60" y="126" width="' + (demand * 22 - 2) + '" height="18" rx="4" fill="none" stroke="var(--bad)" stroke-width="2"></rect>' +
        '<text x="' + (60 + demand * 22 + 10) + '" y="140" font-size="11" fill="var(--bad)">' + demand + ' h of demand from three mobs, before tiering</text>' +
        '<text x="60" y="164" font-size="11" fill="var(--ink)">8 hours of supply, 9 of demand — until tiering cuts arrivals to the 13% needing a clinician.</text>' +
        '</svg></div><div class="viz-cap">The bottleneck is not an attitude problem. It is nine hours of work in an eight-hour hole.</div></div>';
    }
