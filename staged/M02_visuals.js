case 'mb_domain_flow': {
      const node = function(x, y, w, h, label, sub, tok){
        let s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="var(--card)" stroke="' + tok + '" stroke-width="1.6"></rect>' +
          '<text x="' + (x + w/2) + '" y="' + (y + (sub ? 22 : h/2 + 4)) + '" text-anchor="middle" font-size="12" fill="var(--ink)">' + label + '</text>';
        if (sub) s += '<text x="' + (x + w/2) + '" y="' + (y + 38) + '" text-anchor="middle" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + sub + '</text>';
        return s;
      };
      const link = function(x1, y1, x2, y2, label, lx, ly, tok){
        return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#mbFlowArrow)"></line>' +
          (label ? '<text x="' + lx + '" y="' + ly + '" font-size="10.5" fill="' + (tok || 'var(--muted)') + '">' + label + '</text>' : '');
      };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 246" role="img" ' +
        'aria-label="An AuthRequest is scored against clinical criteria; above 0.85 it is auto-approved, below it enters the nurse review queue; both paths produce a Determination">' +
        '<defs><marker id="mbFlowArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"></path></marker></defs>' +
        node(14, 78, 118, 52, 'AuthRequest', 'member, code', 'var(--t3)') +
        node(170, 78, 140, 52, 'ClinicalCriteria', 'evaluate, score', 'var(--t3)') +
        node(360, 20, 150, 46, 'auto-approve', 'score &#8805; 0.85', 'var(--ok)') +
        node(360, 140, 150, 46, 'nurse review queue', '11 min, 31% of volume', 'var(--t1)') +
        node(552, 78, 116, 52, 'Determination', 'AuthStatus', 'var(--t2)') +
        link(132, 104, 166, 104) +
        link(310, 96, 356, 52, '', 0, 0) +
        link(310, 112, 356, 156, '', 0, 0) +
        link(510, 46, 556, 92) +
        link(510, 160, 556, 118) +
        '<text x="316" y="80" font-size="10.5" font-family="var(--mono)" fill="var(--ok)">&#8805; 0.85</text>' +
        '<text x="316" y="136" font-size="10.5" font-family="var(--mono)" fill="var(--t1)">&lt; 0.85</text>' +
        '<text x="360" y="212" font-size="11" fill="var(--ink-2)">One scarce class of expert. Many items. A 14-day statutory deadline.</text>' +
        '<text x="360" y="230" font-size="11" fill="var(--muted)">The same shape as the validation bottleneck in M04 — one level up.</text>' +
        '</svg></div><div class="viz-cap">The domain. AUTO_APPROVE_THRESHOLD is a confidence gate that routes work to a scarce human only above a risk level.</div></div>';
    }

    case 'mb_mob_charters': {
      const mobs = [
        ['Appeals','Members can appeal a denied Determination','api','var(--t1)','active'],
        ['Gate','Threshold becomes criteria-specific','rules to api','var(--t2)','active'],
        ['Portal','Provider submission and status portal','web to api','var(--t3)','active'],
        ['Intake','EDI 278 submission channel','api','var(--t4)','queued'],
        ['Reporting','Utilisation dashboards for compliance','web','var(--t5)','queued']
      ];
      let rows = '';
      mobs.forEach(function(m, i){
        const y = 22 + i * 40;
        const dim = m[4] === 'queued';
        rows += '<rect x="10" y="' + y + '" width="4" height="28" rx="2" fill="' + m[3] + '" opacity="' + (dim ? '0.45' : '1') + '"></rect>' +
          '<text x="26" y="' + (y + 13) + '" font-size="12.5" fill="var(--ink)">' + m[0] + '</text>' +
          '<text x="26" y="' + (y + 27) + '" font-size="10.5" font-family="var(--mono)" fill="var(--muted)">' + m[2] + '</text>' +
          '<text x="150" y="' + (y + 19) + '" font-size="11.5" fill="' + (dim ? 'var(--muted)' : 'var(--ink-2)') + '">' + m[1] + '</text>' +
          '<text x="600" y="' + (y + 19) + '" font-size="10.5" font-family="var(--mono)" fill="' + (dim ? 'var(--muted)' : 'var(--ok)') + '">' + m[4] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 224" role="img" ' +
        'aria-label="Five mobs with charters and primary repositories; three active, two queued">' + rows +
        '<text x="26" y="216" font-size="11" fill="var(--ink-2)">Every pair of active mobs collides. That is deliberate.</text>' +
        '</svg></div><div class="viz-cap">Three mobs in flight, two waiting. The fourth onboards mid-quarter in M19.</div></div>';
    }
