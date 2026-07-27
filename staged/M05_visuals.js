case 'mb_capacity_math': {
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 236" role="img" ' +
        'aria-label="Cumulative SME hours over twelve weeks: reviewing every bolt rises linearly, encoding once is flat after an up-front cost; they cross at break-even">' +
        '<line x1="70" y1="196" x2="650" y2="196" stroke="var(--rule)"></line>' +
        '<line x1="70" y1="24" x2="70" y2="196" stroke="var(--rule)"></line>' +
        '<text x="14" y="30" font-size="10.5" fill="var(--muted)">SME hours</text>' +
        '<text x="14" y="44" font-size="10.5" fill="var(--muted)">cumulative</text>' +
        '<text x="70" y="216" font-size="10.5" fill="var(--muted)">week 0</text>' +
        '<text x="606" y="216" font-size="10.5" fill="var(--muted)">week 12</text>' +
        '<path data-mb="c-review" d="M70 196" fill="none" stroke="var(--t1)" stroke-width="2"></path>' +
        '<path data-mb="c-encode" d="M70 196" fill="none" stroke="var(--t2)" stroke-width="2"></path>' +
        '<circle data-mb="c-mark" cx="0" cy="0" r="6" fill="none" stroke="var(--ink)" stroke-width="2" opacity="0"></circle>' +
        '<rect x="110" y="36" width="10" height="10" rx="2" fill="var(--t1)"></rect><text x="126" y="45" font-size="11" fill="var(--ink-2)">review every bolt</text>' +
        '<rect x="110" y="54" width="10" height="10" rx="2" fill="var(--t2)"></rect><text x="126" y="63" font-size="11" fill="var(--ink-2)">encode once, then upkeep</text>' +
        '</svg></div>' +
        '<div class="viz-ctl">' +
        '<label>encode cost <input data-mb="c-enc" type="range" min="2" max="40" step="1" value="12"><output data-mb="c-enc-out">12 SME hours to encode</output></label>' +
        '<label>mobs <input data-mb="c-mob" type="range" min="1" max="6" step="1" value="3"><output data-mb="c-mob-out">3 mobs</output></label>' +
        '</div><div class="viz-ctl">' +
        '<label>reuse <input data-mb="c-reu" type="range" min="10" max="100" step="5" value="60"><output data-mb="c-reu-out">60% of bolts touch the rule</output></label>' +
        '</div><div class="viz-ctl"><output data-mb="c-read">break-even</output></div>' +
        '<div class="viz-cap">Four bolts per mob per week, 45 minutes of review per bolt, upkeep at 2.5% of encode cost per week. Change the assumptions to yours before quoting it.</div></div>';
    }

    case 'mb_golden_path': {
      const col = function(x, title, items, tok, note){
        let out = '<text x="' + x + '" y="20" font-size="12" fill="var(--ink)">' + title + '</text>';
        items.forEach(function(it, i){
          const y = 36 + i * 30;
          const ok = it[1];
          out += '<rect x="' + x + '" y="' + y + '" width="270" height="24" rx="5" fill="var(--card)" stroke="' + (ok ? tok : 'var(--rule)') + '"></rect>' +
            '<text x="' + (x + 10) + '" y="' + (y + 16) + '" font-size="11" fill="' + (ok ? 'var(--ink)' : 'var(--muted)') + '">' + it[0] + '</text>' +
            '<text x="' + (x + 250) + '" y="' + (y + 16) + '" font-size="12" fill="' + (ok ? tok : 'var(--bad)') + '">' + (ok ? '&#10003;' : '&#215;') + '</text>';
        });
        out += '<text x="' + x + '" y="' + (36 + items.length * 30 + 18) + '" font-size="11" fill="' + (note[1] ? tok : 'var(--bad)') + '">' + note[0] + '</text>';
        return out;
      };
      const checks = ['@PhiBoundary present', 'audit record written', 'no member id in logs', 'criteria via shared evaluator'];
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="A bolt starting from a blank file satisfies none of the four invariants; a bolt starting from the scaffold satisfies all four before generation begins">' +
        col(14, 'starting from blank', checks.map(function(c){ return [c, false]; }), 'var(--ok)', ['4 clinical review questions to answer', false]) +
        col(340, 'starting from the scaffold', checks.map(function(c){ return [c, true]; }), 'var(--ok)', ['1 question left, and it is the clinical one', true]) +
        '</svg></div><div class="viz-cap">The scaffold does not make the mob faster at writing code. It removes four things the SME would otherwise have to check.</div></div>';
    }

    case 'mb_ownership_models': {
      const models = [
        ['owning mob','one mob adopts it','becomes a service desk','var(--t1)', 2],
        ['platform team owns it','platform reviews changes','recreates the queue','var(--t4)', 1],
        ['inner-source + maintainers','anyone changes, two review','needs 4-6 real hours a week','var(--t2)', 3]
      ];
      let out = '';
      models.forEach(function(m, i){
        const x = 8 + i * 224;
        out += '<rect x="' + x + '" y="12" width="212" height="150" rx="10" fill="var(--card)" stroke="' + (m[4] === 3 ? m[3] : 'var(--rule)') + '" stroke-width="' + (m[4] === 3 ? 2 : 1) + '"></rect>' +
          '<text x="' + (x + 14) + '" y="36" font-size="12" fill="var(--ink)">' + m[0] + '</text>' +
          '<text x="' + (x + 14) + '" y="58" font-size="11" fill="var(--muted)">' + m[1] + '</text>' +
          '<text x="' + (x + 14) + '" y="88" font-size="10.5" fill="var(--muted)">honest cost</text>' +
          '<text x="' + (x + 14) + '" y="106" font-size="11.5" fill="var(--bad)">' + m[2] + '</text>';
        let stars = '';
        for (let s = 0; s < 3; s++) stars += '<rect x="' + (x + 14 + s * 16) + '" y="130" width="12" height="12" rx="3" fill="' + (s < m[4] ? m[3] : 'var(--paper-2)') + '"></rect>';
        out += stars + '<text x="' + (x + 66) + '" y="140" font-size="10.5" fill="var(--muted)">fit here</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 190" role="img" ' +
        'aria-label="Three ownership models for the shared clinical library with their honest costs; inner-source with designated maintainers fits this platform best">' + out +
        '<text x="14" y="182" font-size="11" fill="var(--ink)">Plus one hard requirement either way: a criteria change ships with a criteria test.</text>' +
        '</svg></div><div class="viz-cap">Three models, three real costs. The choice is a staffing decision disguised as a governance decision.</div></div>';
    }

    case 'mb_platform_bottleneck': {
      const stage = function(x, label, mobs, tok, caption){
        let out = '<text x="' + x + '" y="18" font-size="11.5" fill="var(--ink)">' + label + '</text>';
        for (let i = 0; i < 3; i++){
          out += '<rect x="' + x + '" y="' + (30 + i * 26) + '" width="64" height="20" rx="4" fill="var(--paper-2)" stroke="var(--rule)"></rect>' +
            '<text x="' + (x + 32) + '" y="' + (44 + i * 26) + '" text-anchor="middle" font-size="10" fill="var(--muted)">mob</text>' +
            '<line x1="' + (x + 66) + '" y1="' + (40 + i * 26) + '" x2="' + (x + 108) + '" y2="' + (mobs === 'queue' ? 56 : 40 + i * 26) + '" stroke="' + tok + '" stroke-width="1.4" marker-end="url(#mbPbArrow)"></line>';
        }
        out += '<rect x="' + (x + 110) + '" y="' + (mobs === 'queue' ? 44 : 30) + '" width="76" height="' + (mobs === 'queue' ? 26 : 72) + '" rx="6" fill="var(--card)" stroke="' + tok + '" stroke-width="1.6"></rect>' +
          '<text x="' + (x + 148) + '" y="' + (mobs === 'queue' ? 61 : 70) + '" text-anchor="middle" font-size="10" fill="' + tok + '">' + (mobs === 'queue' ? 'review' : 'constraints') + '</text>' +
          '<text x="' + x + '" y="126" font-size="11" fill="' + (mobs === 'queue' ? 'var(--bad)' : 'var(--ok)') + '">' + caption + '</text>';
        return out;
      };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 150" role="img" ' +
        'aria-label="A platform team that reviews changes serialises three mobs through itself; a platform team that owns constraints does not sit in any mob&#39;s path">' +
        '<defs><marker id="mbPbArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"></path></marker></defs>' +
        stage(14, 'platform reviews changes', 'queue', 'var(--bad)', 'three mobs, one new queue') +
        stage(370, 'platform owns constraints', 'flow', 'var(--ok)', 'nobody waits on platform') +
        '</svg></div><div class="viz-cap">The anti-pattern and its correction. If platform review is in any mob&#39;s critical path, you have built the left-hand picture.</div></div>';
    }
