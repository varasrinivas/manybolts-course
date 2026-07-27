case 'mb_conway_speed': {
      const X0 = 70, X1 = 620, Y0 = 150;
      const px = function(q){ return X0 + (q / 4) * (X1 - X0); };
      const py = function(v){ return Y0 - (v / 100) * (Y0 - 30); };
      const human = [0, 12, 26, 44, 62];
      const agent = [0, 46, 74, 88, 94];
      const path = function(a){ let d = ''; a.forEach(function(v, i){ d += (i ? 'L' : 'M') + px(i) + ' ' + py(v) + ' '; }); return d; };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 206" role="img" ' +
        'aria-label="Org structure imprinting on code structure over four quarters: human-paced reaches 62 percent, agent-paced reaches 94 percent by the same point">' +
        '<line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X1 + '" y2="' + Y0 + '" stroke="var(--rule)"></line>' +
        '<line x1="' + X0 + '" y1="24" x2="' + X0 + '" y2="' + Y0 + '" stroke="var(--rule)"></line>' +
        '<text x="14" y="30" font-size="10.5" fill="var(--muted)">code mirrors</text>' +
        '<text x="14" y="44" font-size="10.5" fill="var(--muted)">org structure</text>' +
        '<path d="' + path(agent) + '" fill="none" stroke="var(--t1)" stroke-width="2"></path>' +
        '<path d="' + path(human) + '" fill="none" stroke="var(--t2)" stroke-width="2" stroke-dasharray="5 4"></path>' +
        '<text x="' + (px(4) - 150) + '" y="' + (py(94) - 10) + '" font-size="11" fill="var(--t1)">agent-paced: one quarter to a fact</text>' +
        '<text x="' + (px(4) - 120) + '" y="' + (py(62) + 18) + '" font-size="11" fill="var(--t2)">human-paced: a year, softened by gossip</text>' +
        '<text x="' + X0 + '" y="170" font-size="10.5" fill="var(--muted)">Q1</text>' +
        '<text x="' + px(4) + '" y="170" font-size="10.5" fill="var(--muted)">Q4</text>' +
        '<text x="' + X0 + '" y="196" font-size="11" fill="var(--ink)">The agent has no view across the team boundary at all. Humans at least overhear each other.</text>' +
        '</svg></div><div class="viz-cap">Illustrative shape, not a measurement. The claim is the ordering: agent-scoped context removes the informal correction, so the imprint lands faster.</div></div>';
    }

    case 'mb_mob_split': {
      const grid = function(x, title, tok, cells, caption){
        let out = '<text x="' + x + '" y="20" font-size="12" fill="var(--ink)">' + title + '</text>' +
          '<text x="' + (x + 84) + '" y="40" font-size="9.5" fill="var(--muted)">web</text>' +
          '<text x="' + (x + 134) + '" y="40" font-size="9.5" fill="var(--muted)">api</text>' +
          '<text x="' + (x + 184) + '" y="40" font-size="9.5" fill="var(--muted)">rules</text>';
        cells.forEach(function(row, r){
          out += '<text x="' + x + '" y="' + (62 + r * 30) + '" font-size="10" fill="var(--muted)">mob ' + (r + 1) + '</text>';
          row.forEach(function(v, c){
            out += '<rect x="' + (x + 74 + c * 50) + '" y="' + (48 + r * 30) + '" width="42" height="20" rx="4" fill="' + (v ? tok : 'var(--paper-2)') + '" stroke="var(--rule)"></rect>';
          });
        });
        out += '<text x="' + x + '" y="' + (62 + cells.length * 30 + 8) + '" font-size="10.5" fill="var(--ink-2)">' + caption + '</text>';
        return out;
      };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="Feature-split mobs touch all three repositories each; service-split mobs each own one repository. The resulting codebases differ within a quarter">' +
        grid(14, 'split by feature', 'var(--t1)', [[1,1,1],[1,1,1],[1,1,1]], 'coherent features, drifting modules') +
        grid(370, 'split by service', 'var(--t2)', [[1,0,0],[0,1,0],[0,0,1]], 'coherent modules, smeared features') +
        '<text x="14" y="190" font-size="11" fill="var(--ink)">Neither is right. Both consequences arrive inside one quarter, so choose the failure you can operate.</text>' +
        '</svg></div><div class="viz-cap">Mob composition is an architecture decision made by whoever writes the team list.</div></div>';
    }

    case 'mb_overlap_diagnostic': {
      const q = [['Q1', 27], ['Q2', 24], ['Q3', 26], ['Q4', 28]];
      let out = '';
      q.forEach(function(d, i){
        const x = 90 + i * 120;
        const h = d[1] * 3.6;
        out += '<rect x="' + x + '" y="' + (170 - h) + '" width="58" height="' + h + '" rx="4" fill="var(--t1)"></rect>' +
          '<text x="' + (x + 29) + '" y="' + (166 - h) + '" text-anchor="middle" font-size="11" font-family="var(--mono)" fill="var(--ink)">' + d[1] + '%</text>' +
          '<text x="' + (x + 29) + '" y="186" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + d[0] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 214" role="img" ' +
        'aria-label="Registry overlap rate holds between 24 and 28 percent across four quarters, above the 20 percent threshold, indicating two mobs own one aggregate">' +
        '<text x="14" y="22" font-size="11.5" fill="var(--muted)">share of units of work touching an aggregate another mob is also touching</text>' +
        '<line x1="80" y1="170" x2="660" y2="170" stroke="var(--rule)"></line>' +
        '<line x1="80" y1="' + (170 - 20 * 3.6) + '" x2="660" y2="' + (170 - 20 * 3.6) + '" stroke="var(--warn)" stroke-dasharray="4 4"></line>' +
        '<text x="560" y="' + (170 - 20 * 3.6 - 6) + '" font-size="10.5" fill="var(--warn)">20% — read it as org design</text>' + out +
        '<text x="14" y="208" font-size="11" fill="var(--ink)">Four quarters of managing it harder. The number is not a schedule problem; it is a boundary in the wrong place.</text>' +
        '</svg></div><div class="viz-cap">M14&#39;s artifact, reread as an instrument. This is the chart that makes an org argument evidential.</div></div>';
    }
