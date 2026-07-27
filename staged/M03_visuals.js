case 'mb_contention_classes': {
      const cards = [
        ['code','var(--t2)','files, aggregates, migrations, trunk','Gate rebases onto Appeals and the agent resolves it plausibly and wrongly','rebases per landed bolt'],
        ['validator','var(--t1)','one clinical SME, one Thursday board','a finished bolt waits two days for the only person allowed to approve it','queue time / cycle time'],
        ['infrastructure','var(--t4)','CI runners, one UAT, test data, seats','Portal waits since Monday for an environment another mob is holding','wait-for-resource per bolt']
      ];
      let out = '';
      cards.forEach(function(c, i){
        const x = 8 + i * 224;
        out += '<rect x="' + x + '" y="10" width="212" height="176" rx="10" fill="var(--card)" stroke="var(--rule)"></rect>' +
          '<rect x="' + x + '" y="10" width="212" height="5" rx="2" fill="' + c[1] + '"></rect>' +
          '<text x="' + (x+14) + '" y="40" font-size="13" font-family="var(--mono)" fill="' + c[1] + '">' + c[0] + '</text>' +
          '<text x="' + (x+14) + '" y="60" font-size="10.5" fill="var(--muted)">' + c[2] + '</text>';
        const words = c[3].split(' ');
        let line = '', ly = 88;
        words.forEach(function(w){
          if ((line + ' ' + w).length > 30) { out += '<text x="' + (x+14) + '" y="' + ly + '" font-size="11.5" fill="var(--ink-2)">' + line + '</text>'; line = w; ly += 16; }
          else { line = line ? line + ' ' + w : w; }
        });
        out += '<text x="' + (x+14) + '" y="' + ly + '" font-size="11.5" fill="var(--ink-2)">' + line + '</text>' +
          '<text x="' + (x+14) + '" y="170" font-size="10.5" font-family="var(--mono)" fill="var(--ink)">' + c[4] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 196" role="img" ' +
        'aria-label="Three contention classes: code, validator and infrastructure, each with its shared resource, a symptom and a measurement">' + out +
        '</svg></div><div class="viz-cap">The taxonomy. The response differs by class, which is why conflating them wastes quarters.</div></div>';
    }

    case 'mb_cycletime_regression': {
      const rows = [['1 mob', 6.0, 1.3], ['3 mobs', 6.0, 9.4], ['5 mobs', 6.0, 21.3]];
      const x0 = 96, scale = 18.6;
      let out = '';
      rows.forEach(function(r, i){
        const y = 40 + i * 46;
        const wWork = r[1] * scale, wWait = r[2] * scale;
        out += '<text x="' + (x0 - 12) + '" y="' + (y + 16) + '" text-anchor="end" font-size="12" fill="var(--ink-2)">' + r[0] + '</text>' +
          '<rect x="' + x0 + '" y="' + y + '" width="' + wWork + '" height="24" rx="4" fill="var(--t2)"></rect>' +
          '<rect x="' + (x0 + wWork + 2) + '" y="' + y + '" width="' + wWait + '" height="24" rx="4" fill="var(--t1)"></rect>' +
          '<text x="' + (x0 + wWork + wWait + 12) + '" y="' + (y + 17) + '" font-size="11.5" font-family="var(--mono)" fill="var(--ink)">' + (r[1] + r[2]).toFixed(1) + ' h</text>';
        if (i === 0) {
          out += '<text x="' + (x0 + 10) + '" y="' + (y + 17) + '" font-size="11" fill="var(--paper)">work 6.0</text>' +
                 '<text x="' + (x0 + wWork + 12) + '" y="' + (y + 17) + '" font-size="11" fill="var(--paper)">wait 1.3</text>';
        } else {
          out += '<text x="' + (x0 + 10) + '" y="' + (y + 17) + '" font-size="11" fill="var(--paper)">work 6.0</text>' +
                 '<text x="' + (x0 + wWork + 12) + '" y="' + (y + 17) + '" font-size="11" fill="var(--paper)">wait ' + r[2].toFixed(1) + '</text>';
        }
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 214" role="img" ' +
        'aria-label="Bolt cycle time at one, three and five mobs: working time stays at six hours while waiting rises from 1.3 to 21.3 hours">' +
        '<text x="14" y="20" font-size="11.5" fill="var(--muted)">Median cycle time for the same four-bolt workload, fixture harness</text>' +
        out +
        '<line x1="96" y1="180" x2="660" y2="180" stroke="var(--rule)"></line>' +
        '<rect x="96" y="192" width="10" height="10" rx="2" fill="var(--t2)"></rect><text x="112" y="201" font-size="11" fill="var(--ink-2)">work time</text>' +
        '<rect x="186" y="192" width="10" height="10" rx="2" fill="var(--t1)"></rect><text x="202" y="201" font-size="11" fill="var(--ink-2)">queue time</text>' +
        '<text x="300" y="201" font-size="11" fill="var(--ink)">3.7x cycle time, identical generation capacity</text>' +
        '</svg></div><div class="viz-cap">Fixture measurement, not an industry benchmark. The shape generalises; the numbers are ours.</div></div>';
    }

    case 'mb_method_gap': {
      const pairs = [
        ['Mob Elaboration, one mob','reconciling two elaborations','M14'],
        ['a human validation checkpoint','validator capacity and queueing','M04 M05'],
        ['the mob reviews the code','changes that cross a repo','M09'],
        ['steering as team convention','precedence across five mobs','M12 M13'],
        ['bolts land on trunk','serialising six wide diffs','M08 M10'],
        ['unit-of-work traceability','provenance as audit evidence','M16']
      ];
      let out = '';
      pairs.forEach(function(p, i){
        const y = 34 + i * 28;
        out += '<text x="14" y="' + y + '" font-size="11.5" fill="var(--ink-2)">' + p[0] + '</text>' +
          '<line x1="266" y1="' + (y - 4) + '" x2="316" y2="' + (y - 4) + '" stroke="var(--rule)" stroke-dasharray="3 3"></line>' +
          '<text x="326" y="' + y + '" font-size="11.5" fill="var(--bad)">' + p[1] + '</text>' +
          '<text x="604" y="' + y + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + p[2] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="What the method defines, beside what it leaves undefined at multi-mob scale, and the module that addresses each gap">' +
        '<text x="14" y="16" font-size="10.5" text-transform="uppercase" fill="var(--muted)">DEFINED, FOR ONE MOB</text>' +
        '<text x="326" y="16" font-size="10.5" fill="var(--muted)">UNDEFINED AT PLATFORM SCALE</text>' +
        out +
        '<text x="14" y="208" font-size="11" fill="var(--ink)">The left column is not wrong. It is scoped — and the scope is the whole problem.</text>' +
        '</svg></div><div class="viz-cap">Six gaps. Each one is a module, and each one is labelled as an addition rather than a citation.</div></div>';
    }
