case 'mb_ci_contention': {
      const weeks = [11, 14, 17, 19, 22, 24, 26, 28, 30, 31, 33, 34, 34];
      const X0 = 70, X1 = 420, Y0 = 150;
      let d = '';
      weeks.forEach(function(v, i){ d += (i ? 'L' : 'M') + (X0 + (i / 12) * (X1 - X0)).toFixed(1) + ' ' + (Y0 - (v / 40) * (Y0 - 26)).toFixed(1) + ' '; });
      let pool = '';
      for (let i = 0; i < 6; i++){
        const busy = i < 5;
        pool += '<rect x="' + (486 + (i % 3) * 58) + '" y="' + (44 + Math.floor(i / 3) * 40) + '" width="50" height="32" rx="5" fill="' + (busy ? 'var(--t1)' : 'var(--paper-2)') + '" stroke="var(--rule)"></rect>' +
          '<text x="' + (511 + (i % 3) * 58) + '" y="' + (64 + Math.floor(i / 3) * 40) + '" text-anchor="middle" font-size="9.5" fill="' + (busy ? 'var(--paper)' : 'var(--muted)') + '">' + (busy ? 'busy' : 'free') + '</text>';
      }
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="Suite runtime rises from 11 to 34 minutes over twelve weeks while the shared runner pool of six sits at five-sixths utilisation">' +
        '<text x="14" y="20" font-size="11.5" fill="var(--muted)">full suite runtime, minutes</text>' +
        '<line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X1 + '" y2="' + Y0 + '" stroke="var(--rule)"></line>' +
        '<line x1="' + X0 + '" y1="26" x2="' + X0 + '" y2="' + Y0 + '" stroke="var(--rule)"></line>' +
        '<path d="' + d + '" fill="none" stroke="var(--t1)" stroke-width="2"></path>' +
        '<text x="' + (X0 + 4) + '" y="' + (Y0 - (11 / 40) * (Y0 - 26) - 8) + '" font-size="10.5" fill="var(--muted)">11 min</text>' +
        '<text x="' + (X1 - 46) + '" y="' + (Y0 - (34 / 40) * (Y0 - 26) - 8) + '" font-size="10.5" fill="var(--ink)">34 min</text>' +
        '<text x="' + X0 + '" y="170" font-size="10.5" fill="var(--muted)">week 0 — 1,240 tests</text>' +
        '<text x="' + (X1 - 96) + '" y="170" font-size="10.5" fill="var(--muted)">week 12 — 3,890 tests</text>' +
        '<text x="486" y="30" font-size="11.5" fill="var(--muted)">runner pool: 6</text>' + pool +
        '<text x="486" y="140" font-size="11" fill="var(--bad)">83% utilised, mean wait 41 min</text>' +
        '<text x="486" y="158" font-size="11" fill="var(--ok)">this server can be bought</text>' +
        '<text x="14" y="192" font-size="11" fill="var(--ink)">Coverage rose and no test was wrong. Landing capacity fell by two thirds anyway.</text>' +
        '</svg></div><div class="viz-cap">Same queueing shape as the validator, one important difference: you can fix this one with money.</div></div>';
    }

    case 'mb_flake_cost': {
      const rates = [[0.5, 6], [1, 6], [2, 6], [5, 6]];
      let out = '';
      rates.forEach(function(r, i){
        const p = (1 - Math.pow(1 - r[0] / 100, r[1])) * 100;
        const x = 60 + i * 150;
        const h = p * 4;
        const hot = p > 5;
        out += '<rect x="' + x + '" y="' + (160 - h) + '" width="70" height="' + h + '" rx="4" fill="' + (hot ? 'var(--bad)' : 'var(--t2)') + '"></rect>' +
          '<text x="' + (x + 35) + '" y="' + (156 - h) + '" text-anchor="middle" font-size="11" font-family="var(--mono)" fill="var(--ink)">' + p.toFixed(0) + '%</text>' +
          '<text x="' + (x + 35) + '" y="176" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + r[0] + '% per job</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="Per-job flake rates of 0.5, 1, 2 and 5 percent produce pipeline failure rates of 3, 6, 11 and 26 percent across six jobs">' +
        '<text x="14" y="22" font-size="11.5" fill="var(--muted)">probability at least one job fails spuriously, six-job pipeline</text>' +
        '<line x1="40" y1="160" x2="660" y2="160" stroke="var(--rule)"></line>' + out +
        '<text x="14" y="198" font-size="11" fill="var(--ink)">Past roughly 1% per job, engineers re-run red pipelines instead of reading them — and the gate stops being evidence.</text>' +
        '</svg></div><div class="viz-cap">The fixture sits at 2.1%. A flaky suite converts every mechanical control back into a cultural one.</div></div>';
    }

    case 'mb_env_queue': {
      const bands = [['Appeals demo prep', 20, 190, 'var(--t1)'], ['Gate criteria validation', 210, 150, 'var(--t2)'], ['Portal UAT', 370, 60, 'var(--t3)'], ['nightly restore', 440, 90, 'var(--muted)']];
      let out = '';
      bands.forEach(function(b, i){
        out += '<rect x="' + b[1] + '" y="' + (46 + i * 30) + '" width="' + b[2] + '" height="22" rx="4" fill="' + b[3] + '" opacity="0.9"></rect>' +
          '<text x="14" y="' + (62 + i * 30) + '" font-size="10.5" fill="var(--ink-2)">' + b[0] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="One shared UAT environment across three days: three mobs and a nightly restore compete for the same window before the Thursday board">' +
        '<text x="14" y="24" font-size="11.5" fill="var(--muted)">one shared UAT, one dataset, three days before the Thursday board</text>' +
        '<line x1="200" y1="36" x2="200" y2="172" stroke="var(--rule)" stroke-dasharray="3 3"></line>' +
        '<line x1="360" y1="36" x2="360" y2="172" stroke="var(--rule)" stroke-dasharray="3 3"></line>' +
        '<line x1="520" y1="36" x2="520" y2="172" stroke="var(--rule)" stroke-dasharray="3 3"></line>' + out +
        '<text x="14" y="188" font-size="11" fill="var(--bad)">Mean wait 6.5 h per bolt. The real risk is mobs quietly validating against local stubs instead.</text>' +
        '</svg></div><div class="viz-cap">Ephemeral environments fix this. Their cost is not compute — it is synthetic clinical data that a nurse would recognise.</div></div>';
    }
