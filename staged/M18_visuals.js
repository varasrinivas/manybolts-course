case 'mb_eight_metrics': {
      const metrics = [
        ['bolts landed', 'delivery', 'var(--t2)'],
        ['validator queue time', 'the bottleneck', 'var(--t1)'],
        ['contract breakages', 'in-repo coordination', 'var(--t3)'],
        ['cross-repo breakage', 'the silence (M09)', 'var(--bad)'],
        ['steering drift events', 'invariants dissolving', 'var(--t4)'],
        ['flag debt by age', 'untested production', 'var(--t5)'],
        ['evidence completeness', 'audit readiness', 'var(--ok)'],
        ['security queue depth', 'supply chain as gate', 'var(--warn)']
      ];
      let out = '';
      metrics.forEach(function(m, i){
        const x = 12 + (i % 4) * 168;
        const y = 34 + Math.floor(i / 4) * 78;
        out += '<rect x="' + x + '" y="' + y + '" width="152" height="62" rx="8" fill="var(--card)" stroke="var(--rule)"></rect>' +
          '<rect x="' + x + '" y="' + y + '" width="152" height="4" rx="2" fill="' + m[2] + '"></rect>' +
          '<text x="' + (x + 12) + '" y="' + (y + 28) + '" font-size="11" fill="var(--ink)">' + m[0] + '</text>' +
          '<text x="' + (x + 12) + '" y="' + (y + 48) + '" font-size="10" fill="var(--muted)">' + m[1] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="Eight portfolio metrics: bolts landed, validator queue time, contract breakages, cross-repo breakage, steering drift, flag debt by age, evidence completeness and security queue depth">' +
        '<text x="12" y="22" font-size="11.5" fill="var(--muted)">the four standard delivery metrics measure flow; these eight measure contention</text>' + out +
        '<text x="12" y="200" font-size="11" fill="var(--ink)">All aggregate at platform level. None is attributed to a group.</text>' +
        '</svg></div><div class="viz-cap">Each number detects one failure this course described. Publish the gaming risk beside each one.</div></div>';
    }

    case 'mb_comparison_trap': {
      let bars = '';
      const vals = [82, 61, 43];
      vals.forEach(function(v, i){
        const y = 46 + i * 30;
        bars += '<rect x="90" y="' + y + '" width="' + (v * 1.6) + '" height="20" rx="4" fill="var(--muted)" opacity="0.5"></rect>' +
          '<text x="20" y="' + (y + 15) + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">withheld</text>';
      });
      let trend = '';
      const q = [58, 54, 47, 41];
      q.forEach(function(v, i){
        const x = 400 + i * 62;
        const h = v * 1.6;
        trend += '<rect x="' + x + '" y="' + (140 - h) + '" width="40" height="' + h + '" rx="4" fill="var(--t1)"></rect>' +
          '<text x="' + (x + 20) + '" y="156" text-anchor="middle" font-size="10" fill="var(--muted)">Q' + (i + 1) + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="A per-group ranking with identities withheld and marked not published, beside the platform-level queue-time trend across four quarters which is what should be published">' +
        '<text x="20" y="30" font-size="11.5" fill="var(--bad)">what gets asked for — not published</text>' + bars +
        '<line x1="20" y1="130" x2="240" y2="40" stroke="var(--bad)" stroke-width="2"></line>' +
        '<text x="20" y="152" font-size="10.5" fill="var(--muted)">ranks module difficulty, not capability</text>' +
        '<text x="400" y="30" font-size="11.5" fill="var(--ok)">what to publish — platform queue time, hours</text>' + trend +
        '<text x="400" y="176" font-size="10.5" fill="var(--muted)">falling, with the contention story attached</text>' +
        '<text x="20" y="198" font-size="11" fill="var(--ink)">Attribute facts about artifacts — an unowned module, an expired flag. Never facts about groups.</text>' +
        '</svg></div><div class="viz-cap">The trap: publishing the left panel makes the right panel dishonest within one quarter.</div></div>';
    }

    case 'mb_cost_ratio': {
      const items = [['token spend', 4, 'var(--t2)', '$4'], ['CI minutes', 12, 'var(--t4)', '142 min'], ['validator time', 96, 'var(--t1)', '0.75 h of a scarce clinician']];
      let out = '';
      items.forEach(function(it, i){
        const y = 44 + i * 44;
        out += '<text x="14" y="' + (y + 16) + '" font-size="11.5" fill="var(--ink-2)">' + it[0] + '</text>' +
          '<rect x="150" y="' + y + '" width="' + (it[1] * 4.6) + '" height="24" rx="4" fill="' + it[2] + '"></rect>' +
          '<text x="' + (150 + it[1] * 4.6 + 12) + '" y="' + (y + 17) + '" font-size="11" font-family="var(--mono)" fill="var(--ink)">' + it[3] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="Cost per landed bolt: token spend and CI minutes are small and buyable; validator time dominates and cannot be bought">' +
        '<text x="14" y="24" font-size="11.5" fill="var(--muted)">cost per landed bolt, relative scale</text>' + out +
        '<text x="14" y="186" font-size="11" fill="var(--ink)">Token quotas control the smallest line and can cost you the largest one. Fund visibility, not caps.</text>' +
        '</svg></div><div class="viz-cap">The ratio surprises most finance conversations, and it is M05&#39;s argument arriving in a budget meeting.</div></div>';
    }
