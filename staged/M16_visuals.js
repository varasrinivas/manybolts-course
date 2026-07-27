case 'mb_release_train': {
      let lands = '';
      const days = ['Mon','Tue','Wed','Thu','Fri'];
      const counts = [3, 4, 2, 3, 2];
      counts.forEach(function(n, d){
        const x = 60 + d * 118;
        for (let i = 0; i < n; i++){
          lands += '<rect x="' + (x + i * 16) + '" y="' + (60 - i * 4) + '" width="12" height="12" rx="3" fill="var(--t2)"></rect>';
        }
        lands += '<text x="' + (x + 20) + '" y="92" font-size="10.5" fill="var(--muted)">' + days[d] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="Fourteen bolts deploy to production across the week behind flags; behaviour changes only when flags are flipped after the Thursday board">' +
        '<text x="14" y="26" font-size="11.5" fill="var(--muted)">deploy: continuous, behind flags — 14 bolts this week</text>' + lands +
        '<line x1="414" y1="36" x2="414" y2="150" stroke="var(--t5)" stroke-width="2"></line>' +
        '<text x="424" y="120" font-size="11" fill="var(--t5)">Thursday board</text>' +
        '<text x="424" y="136" font-size="10.5" fill="var(--muted)">flags flipped here</text>' +
        '<text x="14" y="124" font-size="11.5" fill="var(--muted)">release: on the business&#39;s cadence</text>' +
        '<text x="14" y="172" font-size="11" fill="var(--ink)">Old practice, newly load-bearing: the flag count now rises with bolt count, and nobody removes them.</text>' +
        '</svg></div><div class="viz-cap">Deploying and releasing are different events. Only one of them needs a meeting.</div></div>';
    }

    case 'mb_provenance_chain': {
      const fields = [
        ['unit of work','registry','var(--t3)'],
        ['mob','CODEOWNERS','var(--t3)'],
        ['engine + version','session','var(--t4)'],
        ['validator identity','review record','var(--bad)'],
        ['tier at review','tier table','var(--t1)'],
        ['steering hash','canonical steering','var(--t2)'],
        ['gates passed','pipeline','var(--ok)']
      ];
      let out = '';
      fields.forEach(function(f, i){
        const x = 12 + i * 96;
        const missing = f[2] === 'var(--bad)';
        out += '<rect x="' + x + '" y="46" width="86" height="52" rx="7" fill="' + (missing ? 'var(--paper-2)' : 'var(--card)') + '" stroke="' + f[2] + '" stroke-width="' + (missing ? 2 : 1.4) + '"' + (missing ? ' stroke-dasharray="5 4"' : '') + '></rect>' +
          '<text x="' + (x + 43) + '" y="68" text-anchor="middle" font-size="9.5" fill="var(--ink)">' + f[0].split(' ')[0] + '</text>' +
          '<text x="' + (x + 43) + '" y="81" text-anchor="middle" font-size="9.5" fill="var(--ink)">' + (f[0].split(' ').slice(1).join(' ') || '&#160;') + '</text>' +
          '<text x="' + (x + 43) + '" y="94" text-anchor="middle" font-size="8.5" font-family="var(--mono)" fill="var(--muted)">' + f[1] + '</text>' +
          (i < 6 ? '<text x="' + (x + 90) + '" y="76" font-size="11" fill="var(--rule)">&#8594;</text>' : '');
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 190" role="img" ' +
        'aria-label="Seven provenance fields assembled automatically from registry, session, review record, tier table, steering and pipeline; validator identity is the field the v1 schema cannot record">' +
        '<text x="12" y="30" font-size="11.5" fill="var(--muted)">assembled as a by-product of the bolt — no human narration anywhere in this row</text>' + out +
        '<text x="12" y="132" font-size="11" fill="var(--bad)">PD-7: v1 records the pull request approver instead. Different person, different question.</text>' +
        '<text x="12" y="154" font-size="11" fill="var(--ink)">Also the fastest path from a production symptom to context — which is why M17 needs this built first.</text>' +
        '</svg></div><div class="viz-cap">Audit evidence and incident tooling are the same artifact. Only one of them justifies the build to a CFO.</div></div>';
    }

    case 'mb_flag_debt': {
      const flags = [[2, 6], [1, 5], [3, 4], [6, 3], [12, 2], [24, 1], [39, 1]];
      let out = '';
      flags.forEach(function(f, i){
        const x = 70 + i * 82;
        const h = f[1] * 16;
        const old = f[0] > 8;
        out += '<rect x="' + x + '" y="' + (150 - h) + '" width="52" height="' + h + '" rx="4" fill="' + (old ? 'var(--bad)' : 'var(--t2)') + '"></rect>' +
          '<text x="' + (x + 26) + '" y="' + (146 - h) + '" text-anchor="middle" font-size="10.5" font-family="var(--mono)" fill="var(--ink)">' + f[1] + '</text>' +
          '<text x="' + (x + 26) + '" y="166" text-anchor="middle" font-size="10" fill="var(--muted)">' + f[0] + 'w</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="Live flags by age: most are young but seven are older than eight weeks, and each live flag doubles the untested production path combinations">' +
        '<text x="14" y="24" font-size="11.5" fill="var(--muted)">live flags by age — 34 created, 6 removed, first quarter</text>' +
        '<line x1="56" y1="150" x2="660" y2="150" stroke="var(--rule)"></line>' + out +
        '<text x="14" y="186" font-size="11" fill="var(--ink)">Measure age, not count. Twelve young flags is continuous delivery; four nine-month flags is an undescribed production configuration.</text>' +
        '</svg></div><div class="viz-cap">A flag past its expiry should fail the build. Weekly reporting produces a chart; failing the build produces removals.</div></div>';
    }
