case 'mb_control_chain': {
      const rows = [
        ['clinical logic reviewed', 'if the reviewer had time', 'Tier 3 routing, named validator'],
        ['layer boundaries', 'convention', 'fitness function, every change'],
        ['no member data in logs', 'a wiki page', 'executable check on log paths'],
        ['dependency additions', 'when someone looked', 'SBOM + CVE gate at merge'],
        ['audit traceability', 'reconstructed from memory', 'provenance record per unit of work']
      ];
      let out = '<text x="150" y="26" font-size="10.5" fill="var(--muted)">CULTURAL — DEGRADED QUIETLY</text>' +
        '<text x="430" y="26" font-size="10.5" fill="var(--ok)">MECHANICAL — RUNS OR FAILS VISIBLY</text>';
      rows.forEach(function(r, i){
        const y = 46 + i * 30;
        out += '<text x="14" y="' + (y + 4) + '" font-size="11" fill="var(--ink-2)">' + r[0] + '</text>' +
          '<text x="150" y="' + (y + 4) + '" font-size="11" fill="var(--muted)">' + r[1] + '</text>' +
          '<text x="416" y="' + (y + 4) + '" font-size="12" fill="var(--rule)">&#8594;</text>' +
          '<text x="436" y="' + (y + 4) + '" font-size="11" fill="var(--ink)">' + r[2] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Five controls moving from cultural enforcement to mechanical enforcement, with the caveat that a mechanical control can be disabled">' + out +
        '<text x="14" y="204" font-size="11" fill="var(--bad)">And the limit: a mechanical control can be disabled with one annotation. Audit who may disable a check.</text>' +
        '</svg></div><div class="viz-cap">Lead with the strong form. End on the limit — that ordering is what makes it credible.</div></div>';
    }

    case 'mb_evidence_ladder': {
      const rungs = [
        ['&quot;AI makes teams 3x faster&quot;', 'nothing supports this at platform level', 'var(--bad)'],
        ['&quot;published research shows throughput gains&quot;', 'true, alongside stability regressions', 'var(--warn)'],
        ['&quot;our generation step is faster&quot;', 'measured, and not the constraint', 'var(--t2)'],
        ['&quot;our platform cycle time moved by X&quot;', 'measured, with contention included', 'var(--ok)'],
        ['&quot;mob-level gains vanish through contention&quot;', 'the mechanism — repeatable without you', 'var(--ok)']
      ];
      let out = '';
      rungs.forEach(function(r, i){
        const y = 30 + i * 34;
        out += '<rect x="14" y="' + y + '" width="380" height="26" rx="5" fill="var(--card)" stroke="' + r[2] + '" stroke-width="1.4"></rect>' +
          '<text x="28" y="' + (y + 17) + '" font-size="11" fill="var(--ink)">' + r[0] + '</text>' +
          '<text x="406" y="' + (y + 17) + '" font-size="10.5" fill="' + r[2] + '">' + r[1] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Five claims from unsupportable to defensible: a three-times speed-up claim at the bottom, the contention mechanism at the top">' + out +
        '<text x="14" y="208" font-size="11" fill="var(--ink)">Cite the study that cuts against you too. Quoting only the favourable one costs you the second meeting.</text>' +
        '</svg></div><div class="viz-cap">Claim, evidence, and what the evidence does not support. The bottom rung is the common overclaim.</div></div>';
    }
