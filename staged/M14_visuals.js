case 'mb_overlap_map': {
      const mobs = [['Appeals','var(--t1)', 60], ['Gate','var(--t2)', 110], ['Portal','var(--t3)', 160]];
      const aggs = [['AuthStatus', 300], ['Determination', 430], ['criteria-eval jar', 560]];
      const links = [[0, 0], [0, 1], [1, 1], [1, 0], [1, 2], [2, 0]];
      let out = '';
      mobs.forEach(function(m){
        out += '<rect x="14" y="' + (m[2] - 16) + '" width="120" height="30" rx="6" fill="var(--card)" stroke="' + m[1] + '" stroke-width="1.5"></rect>' +
          '<text x="30" y="' + (m[2] + 4) + '" font-size="11.5" fill="var(--ink)">' + m[0] + '</text>';
      });
      aggs.forEach(function(a){
        out += '<rect x="' + (a[1] - 60) + '" y="96" width="120" height="30" rx="6" fill="var(--paper-2)" stroke="var(--rule)"></rect>' +
          '<text x="' + a[1] + '" y="116" text-anchor="middle" font-size="10.5" font-family="var(--mono)" fill="var(--ink)">' + a[0] + '</text>';
      });
      links.forEach(function(l){
        const m = mobs[l[0]], a = aggs[l[1]];
        const hot = l[1] === 0;
        out += '<line x1="136" y1="' + m[2] + '" x2="' + (a[1] - 62) + '" y2="111" stroke="' + (hot ? m[1] : 'var(--rule)') + '" stroke-width="' + (hot ? 2 : 1.2) + '" opacity="' + (hot ? '0.95' : '0.6') + '"></line>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Three mobs and the aggregates their units of work touch; all three touch AuthStatus, which none of the three intents mentions">' + out +
        '<text x="240" y="60" font-size="11" fill="var(--bad)">three mobs, one enum, three separate elaborations</text>' +
        '<text x="14" y="186" font-size="11" fill="var(--ink)">PD-4: two overlaps are obvious in a room. The third is described as presentation work.</text>' +
        '<text x="14" y="204" font-size="11" fill="var(--muted)">Overlap rate in round 1: 27% of units of work — unknown before the registry existed.</text>' +
        '</svg></div><div class="viz-cap">Ask which aggregates, not what the work is about. The framing is the whole mechanism.</div></div>';
    }

    case 'mb_intent_sync': {
      const lane = function(y, label, tok, items){
        let out = '<text x="14" y="' + (y + 4) + '" font-size="11" fill="var(--muted)">' + label + '</text>';
        items.forEach(function(it){
          out += '<rect x="' + it[0] + '" y="' + (y - 14) + '" width="' + it[1] + '" height="26" rx="5" fill="var(--card)" stroke="' + tok + '" stroke-width="1.4"></rect>' +
            '<text x="' + (it[0] + 10) + '" y="' + (y + 4) + '" font-size="10.5" fill="var(--ink)">' + it[2] + '</text>';
        });
        return out;
      };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 214" role="img" ' +
        'aria-label="Intent Sync sits before three parallel elaborations and produces registry entries, boundary contracts and sequencing decisions; without it the reconciliation happens in a merge conflict weeks later">' +
        '<rect x="120" y="20" width="130" height="48" rx="8" fill="var(--paper-2)" stroke="var(--t4)" stroke-width="2"></rect>' +
        '<text x="185" y="40" text-anchor="middle" font-size="12" fill="var(--ink)">Intent Sync</text>' +
        '<text x="185" y="57" text-anchor="middle" font-size="10" fill="var(--t4)">90 min, before</text>' +
        lane(96, 'then', 'var(--t2)', [[120, 150, 'Appeals elaborates'], [290, 150, 'Gate elaborates'], [460, 160, 'Portal elaborates']]) +
        lane(150, 'outputs', 'var(--ok)', [[120, 150, 'registry entries'], [290, 150, 'boundary contract'], [460, 160, 'sequencing decision']]) +
        '<line x1="185" y1="70" x2="185" y2="80" stroke="var(--rule)"></line>' +
        '<text x="14" y="196" font-size="11" fill="var(--bad)">Run it after elaboration and it is a conflict-resolution meeting — which you already have.</text>' +
        '</svg></div><div class="viz-cap">The addition this course makes to elaboration. One question, two artifacts, no plan.</div></div>';
    }

    case 'mb_uow_registry': {
      const rows = [
        ['UOW-41','appeals','AuthStatus, Determination','GET /determinations/{id}','var(--t1)'],
        ['UOW-47','gate','Determination, AuthStatus','criteria-eval v3 (jar)','var(--t2)'],
        ['UOW-52','portal','AuthStatus (derived)','none declared','var(--t3)']
      ];
      let out = '<text x="18" y="26" font-size="10" fill="var(--muted)">UOW</text>' +
        '<text x="96" y="26" font-size="10" fill="var(--muted)">MOB</text>' +
        '<text x="186" y="26" font-size="10" fill="var(--muted)">AGGREGATES — NAMED, NOT DESCRIBED</text>' +
        '<text x="436" y="26" font-size="10" fill="var(--muted)">CONTRACT SURFACES</text>';
      rows.forEach(function(r, i){
        const y = 44 + i * 34;
        out += '<rect x="14" y="' + y + '" width="652" height="28" rx="5" fill="var(--card)" stroke="var(--rule)"></rect>' +
          '<rect x="14" y="' + y + '" width="4" height="28" rx="2" fill="' + r[4] + '"></rect>' +
          '<text x="26" y="' + (y + 19) + '" font-size="10.5" font-family="var(--mono)" fill="var(--ink)">' + r[0] + '</text>' +
          '<text x="96" y="' + (y + 19) + '" font-size="10.5" fill="var(--ink-2)">' + r[1] + '</text>' +
          '<text x="186" y="' + (y + 19) + '" font-size="10.5" font-family="var(--mono)" fill="var(--ink)">' + r[2] + '</text>' +
          '<text x="436" y="' + (y + 19) + '" font-size="10.5" fill="var(--muted)">' + r[3] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="A three-row unit-of-work registry showing that all three units touch AuthStatus, and that the portal entry declares no contract surface">' + out +
        '<text x="14" y="164" font-size="11" fill="var(--bad)">Row three declares no contract surface and changes a shared enum. That is the entry that lies.</text>' +
        '<text x="14" y="184" font-size="11" fill="var(--ink)">Scope: one registry per platform. A per-repo registry cannot see the collisions worth catching.</text>' +
        '</svg></div><div class="viz-cap">Written at Intent Sync, before the bolt, and loaded into agent context during elaboration.</div></div>';
    }
