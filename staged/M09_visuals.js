case 'mb_three_boundaries': {
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="Repository, team and context boundaries drawn as three overlapping regions that do not coincide; the context boundary is the one nobody chose">' +
        '<ellipse cx="250" cy="100" rx="150" ry="70" fill="none" stroke="var(--t3)" stroke-width="1.8"></ellipse>' +
        '<text x="120" y="52" font-size="11.5" fill="var(--t3)">repository</text>' +
        '<text x="120" y="68" font-size="10" fill="var(--muted)">deploy + version</text>' +
        '<ellipse cx="360" cy="100" rx="150" ry="70" fill="none" stroke="var(--t2)" stroke-width="1.8"></ellipse>' +
        '<text x="452" y="52" font-size="11.5" fill="var(--t2)">team</text>' +
        '<text x="452" y="68" font-size="10" fill="var(--muted)">ownership + review</text>' +
        '<ellipse cx="305" cy="128" rx="118" ry="56" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="6 4"></ellipse>' +
        '<text x="240" y="196" font-size="11.5" fill="var(--bad)">context boundary — what the model can actually see</text>' +
        '<text x="14" y="20" font-size="11" fill="var(--ink)">Three boundaries. Two were decided by people. One emerged from your workspace layout.</text>' +
        '<text x="470" y="150" font-size="10.5" fill="var(--muted)">outside every</text>' +
        '<text x="470" y="164" font-size="10.5" fill="var(--muted)">context: the</text>' +
        '<text x="470" y="178" font-size="10.5" fill="var(--muted)">other repo</text>' +
        '</svg></div><div class="viz-cap">Most multi-team pain is a mismatch between these three. The dashed one has no diagram in your organisation.</div></div>';
    }

    case 'mb_version_noop': {
      const g = function(step, inner){ return '<g data-mb-step="' + step + '" opacity="0.12">' + inner + '</g>'; };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 226" role="img" ' +
        'aria-label="Gate publishes clinical-rules 2.8; the api consumer upgrades and changes behaviour; the web consumer stays pinned to 2.3 and is silently unaffected; three weeks later a nurse notices stale denial reasons">' +
        '<defs><marker id="mbNoopArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"></path></marker></defs>' +
        g(0, '<rect x="14" y="24" width="200" height="52" rx="8" fill="var(--card)" stroke="var(--t2)" stroke-width="1.6"></rect>' +
              '<text x="28" y="46" font-size="11.5" fill="var(--ink)">Gate lands criteria change</text>' +
              '<text x="28" y="64" font-size="10.5" font-family="var(--mono)" fill="var(--t2)">clinical-rules 2.8 published</text>') +
        g(1, '<line x1="216" y1="40" x2="292" y2="40" stroke="var(--muted)" stroke-width="1.4" marker-end="url(#mbNoopArrow)"></line>' +
              '<rect x="300" y="14" width="200" height="52" rx="8" fill="var(--card)" stroke="var(--ok)" stroke-width="1.6"></rect>' +
              '<text x="314" y="36" font-size="11.5" fill="var(--ink)">priorauth-api &#8594; 2.8</text>' +
              '<text x="314" y="54" font-size="10.5" fill="var(--ok)">tests pass, behaviour changes</text>') +
        g(2, '<line x1="216" y1="60" x2="292" y2="96" stroke="var(--muted)" stroke-width="1.4" marker-end="url(#mbNoopArrow)"></line>' +
              '<rect x="300" y="76" width="200" height="52" rx="8" fill="var(--paper-2)" stroke="var(--bad)" stroke-width="1.8" stroke-dasharray="5 4"></rect>' +
              '<text x="314" y="98" font-size="11.5" fill="var(--ink)">priorauth-web pinned 2.3</text>' +
              '<text x="314" y="116" font-size="10.5" fill="var(--bad)">no test fails anywhere</text>') +
        g(3, '<rect x="14" y="146" width="486" height="52" rx="8" fill="var(--card)" stroke="var(--t1)" stroke-width="1.6"></rect>' +
              '<text x="28" y="168" font-size="11.5" fill="var(--ink)">week 3: nurse queue shows pre-change denial reasons</text>' +
              '<text x="28" y="186" font-size="10.5" fill="var(--muted)">support ticket filed; nobody connects it to a bolt that was marked done</text>') +
        '<text x="520" y="40" font-size="10.5" fill="var(--muted)">half of</text>' +
        '<text x="520" y="54" font-size="10.5" fill="var(--muted)">production</text>' +
        '<text x="520" y="102" font-size="10.5" fill="var(--bad)">the other</text>' +
        '<text x="520" y="116" font-size="10.5" fill="var(--bad)">half</text>' +
        '</svg></div>' +
        '<div class="viz-ctl"><button data-mb="noop-back" class="mark">Back</button><button data-mb="noop-next" class="mark">Next step</button></div>' +
        '<div class="viz-ctl"><output data-mb="noop-read">Step 1 of 4</output></div>' +
        '<div class="viz-cap">Nothing in this sequence is a bug in anyone&#39;s code. Every component is behaving as configured.</div></div>';
    }

    case 'mb_context_cost': {
      const bars = [
        ['monorepo, wide context', 88, 'var(--t1)', 'retrieval picks a subset — and picks by relevance, not by correctness'],
        ['multi-repo, one repo loaded', 26, 'var(--t2)', 'cheap, fast, and blind to the other side of the contract']
      ];
      let out = '';
      bars.forEach(function(b, i){
        const y = 40 + i * 62;
        out += '<text x="14" y="' + (y - 6) + '" font-size="11.5" fill="var(--ink-2)">' + b[0] + '</text>' +
          '<rect x="14" y="' + y + '" width="' + (b[1] * 5.6) + '" height="24" rx="4" fill="' + b[2] + '"></rect>' +
          '<text x="' + (b[1] * 5.6 + 24) + '" y="' + (y + 17) + '" font-size="11" font-family="var(--mono)" fill="var(--ink)">' + b[1] + '% of window</text>' +
          '<text x="14" y="' + (y + 42) + '" font-size="10.5" fill="var(--muted)">' + b[3] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 186" role="img" ' +
        'aria-label="Context consumed on one real bolt: 88 percent of the window in a monorepo, 26 percent with a single repository loaded">' +
        '<text x="14" y="22" font-size="11.5" fill="var(--muted)">context consumed by one real cross-cutting bolt in the fixture</text>' + out +
        '<text x="14" y="176" font-size="11" fill="var(--ink)">&quot;The agent can see everything&quot; is a claim about the repository, not about the model.</text>' +
        '</svg></div><div class="viz-cap">A monorepo removes the excuse for missing a caller. It does not remove the failure.</div></div>';
    }
