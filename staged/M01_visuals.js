case 'mb_aidlc_primitives': {
      const phase = function(x, w, name, sub){
        return '<rect x="' + x + '" y="14" width="' + w + '" height="46" rx="8" fill="var(--paper-2)" stroke="var(--rule)"></rect>' +
          '<text x="' + (x + w/2) + '" y="35" text-anchor="middle" font-size="12.5" fill="var(--ink)">' + name + '</text>' +
          '<text x="' + (x + w/2) + '" y="51" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + sub + '</text>';
      };
      const steps = [['elaborate','var(--t3)'],['generate','var(--t3)'],['validate','var(--t1)'],['land','var(--t2)']];
      let loop = '';
      steps.forEach(function(s, i){
        const x = 96 + i * 130;
        const hot = s[0] === 'validate';
        loop += '<rect x="' + x + '" y="112" width="106" height="44" rx="8" fill="var(--card)" stroke="' + s[1] +
          '" stroke-width="' + (hot ? 2.5 : 1.4) + '"></rect>' +
          '<text x="' + (x + 53) + '" y="139" text-anchor="middle" font-size="12" fill="var(--ink)">' + s[0] + '</text>';
        if (i < 3) {
          loop += '<line x1="' + (x + 106) + '" y1="134" x2="' + (x + 128) + '" y2="134" stroke="var(--muted)" stroke-width="1.4" marker-end="url(#mbArrow)"></line>';
        }
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="Inception, Construction and Operations, with the bolt loop inside Construction and the validation step emphasised">' +
        '<defs><marker id="mbArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"></path></marker></defs>' +
        phase(20, 190, 'Inception', 'problem to intents') +
        phase(232, 216, 'Construction', 'intents to landed code') +
        phase(470, 190, 'Operations', 'run what landed') +
        '<line x1="340" y1="62" x2="340" y2="104" stroke="var(--rule)" stroke-width="1.4"></line>' +
        '<text x="96" y="98" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">one bolt, one unit of work, hours not days</text>' +
        loop +
        '<line x1="149" y1="160" x2="149" y2="178" stroke="var(--rule)"></line>' +
        '<line x1="149" y1="178" x2="597" y2="178" stroke="var(--rule)"></line>' +
        '<line x1="597" y1="178" x2="597" y2="160" stroke="var(--rule)" marker-end="url(#mbArrow)"></line>' +
        '<text x="352" y="196" text-anchor="middle" font-size="10.5" fill="var(--t1)">the validation step is the only one that needs a scarce human</text>' +
        '</svg></div><div class="viz-cap">The canonical loop. Three of the four steps scale with compute; one scales with people.</div></div>';
    }

    case 'mb_singlemob_annotation': {
      const rows = [
        ['"The mob elaborates the intent into units of work."','...the only mob, so no register of who sliced what', 'A1'],
        ['"The mob validates the generated change."','...a validator with nothing else queued, at that moment', 'A2'],
        ['"The mob reviews the code the agent produced."','...code entirely inside repositories the mob can see', 'A3'],
        ['"Steering files capture the team conventions."','...one file, one author, no reconciliation problem', 'A4'],
        ['"The mob lands the change on trunk."','...a trunk nobody else landed on in the last hour', 'A5']
      ];
      let out = '';
      rows.forEach(function(r, i){
        const y = 24 + i * 40;
        out += '<text x="14" y="' + y + '" font-size="12.5" fill="var(--ink)">' + r[0] + '</text>' +
          '<g class="mb-annot" opacity="0"><text x="34" y="' + (y + 17) + '" font-size="11.5" fill="var(--bad)">' + r[1] + '</text>' +
          '<text x="620" y="' + y + '" font-size="10.5" font-family="var(--mono)" fill="var(--bad)">' + r[2] + '</text></g>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 206" role="img" ' +
        'aria-label="Five phrases from the method, each with a hidden single-mob assumption revealed on toggle">' + out +
        '</svg></div><div class="viz-ctl"><button data-mb="annot" aria-pressed="false" class="mark">Show the assumptions</button>' +
        '<output data-mb="annot-out">5 phrases, 0 assumptions shown</output></div>' +
        '<div class="viz-cap">The method as written, then the same sentences with their scope made explicit.</div></div>';
    }
