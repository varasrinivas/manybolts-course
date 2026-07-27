case 'mb_course_map': {
      const T = [
        [0,'Orientation & the scaling problem','M00 M01 M02 M03'],
        [1,'The validation economy','M04 M05 M06 M07'],
        [2,'Trunk & integration mechanics','M08 M09 M10 M11'],
        [3,'Coordination artifacts','M12 M13 M14 M15'],
        [4,'Operating the platform','M16 M17 M18'],
        [5,'Rolling it out','M19 M20 M21']
      ];
      const spine = ['M03','M04','M05','M06','M08','M12','M14','M18'];
      let rows = '';
      T.forEach(function(t, r){
        const y = 30 + r * 36;
        const tok = 'var(--t' + t[0] + ')';
        let chips = '';
        t[2].split(' ').forEach(function(id, k){
          const x = 288 + k * 70;
          const on = spine.indexOf(id) > -1;
          const fill = on ? tok : 'var(--paper-2)';
          const ink = on ? 'var(--paper)' : 'var(--muted)';
          chips += '<rect x="' + x + '" y="' + (y-13) + '" width="62" height="23" rx="5" fill="' + fill + '" stroke="var(--rule)"></rect>' +
                   '<text x="' + (x+31) + '" y="' + (y+3) + '" text-anchor="middle" font-size="11" font-family="var(--mono)" fill="' + ink + '">' + id + '</text>';
        });
        rows += '<rect x="10" y="' + (y-13) + '" width="6" height="23" rx="2" fill="' + tok + '"></rect>' +
                '<text x="26" y="' + (y+3) + '" font-size="12" fill="var(--ink-2)">' + t[1] + '</text>' + chips;
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 250" role="img" ' +
        'aria-label="Six tracks and twenty-two modules; the eight-module spine is highlighted">' + rows +
        '<text x="26" y="242" font-size="11" fill="var(--muted)">filled = the eight-module spine</text>' +
        '</svg></div><div class="viz-cap">Six tracks, 22 modules. The filled chips are what survives if the course has to shrink to eight.</div></div>';
    }

    case 'mb_repo_topology': {
      const box = function(x, y, w, label, sub, owner, dashed){
        const stroke = dashed ? 'var(--bad)' : 'var(--rule)';
        const dash = dashed ? ' stroke-dasharray="5 4"' : '';
        const fill = dashed ? 'var(--paper-2)' : 'var(--card)';
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="62" rx="8" fill="' + fill +
          '" stroke="' + stroke + '" stroke-width="1.5"' + dash + '></rect>' +
          '<text x="' + (x+14) + '" y="' + (y+24) + '" font-size="13" font-family="var(--mono)" fill="var(--ink)">' + label + '</text>' +
          '<text x="' + (x+14) + '" y="' + (y+41) + '" font-size="11" fill="var(--muted)">' + sub + '</text>' +
          '<text x="' + (x+14) + '" y="' + (y+55) + '" font-size="10.5" font-family="var(--mono)" fill="' + (dashed ? 'var(--bad)' : 'var(--ink-2)') + '">' + owner + '</text>';
      };
      const arrow = '<defs><marker id="mbArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"></path></marker></defs>';
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 232" role="img" ' +
        'aria-label="priorauth-web and priorauth-api both depend on priorauth-clinical-rules, which has no owner">' + arrow +
        box(30, 16, 250, 'priorauth-web', 'React portal, nurse queue UI', 'owner: Portal mob') +
        box(392, 16, 258, 'priorauth-api', 'Spring Boot, owns Determination', 'owner: Appeals + Gate mobs') +
        box(196, 150, 290, 'priorauth-clinical-rules', 'shared Java library, criteria + threshold', 'owner: nobody  (PD-8)', true) +
        '<line x1="284" y1="47" x2="386" y2="47" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#mbArrow)"></line>' +
        '<text x="300" y="40" font-size="10.5" fill="var(--muted)">REST</text>' +
        '<line x1="150" y1="82" x2="255" y2="144" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#mbArrow)"></line>' +
        '<line x1="520" y1="82" x2="430" y2="144" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#mbArrow)"></line>' +
        '<text x="120" y="126" font-size="10.5" fill="var(--muted)">consumes v2.3</text>' +
        '<text x="470" y="126" font-size="10.5" fill="var(--muted)">consumes v2.7</text>' +
        '<text x="196" y="228" font-size="11" fill="var(--bad)">Consumed by all. Owned by none. Two different versions in production.</text>' +
        '</svg></div><div class="viz-cap">The platform. The dashed box is why this course exists separately from any single-team treatment.</div></div>';
    }
