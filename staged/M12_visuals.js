case 'mb_steering_hierarchy': {
      const levels = [
        ['platform root','invariants that hold everywhere','var(--bad)', 0],
        ['repository','stack and structure','var(--t3)', 40],
        ['mob','local preferences','var(--t2)', 80],
        ['session','this task only','var(--muted)', 120]
      ];
      let out = '';
      levels.forEach(function(l, i){
        const y = 18 + i * 42;
        out += '<rect x="' + (14 + l[3]) + '" y="' + y + '" width="' + (440 - l[3]) + '" height="32" rx="6" fill="var(--card)" stroke="' + l[2] + '" stroke-width="1.5"></rect>' +
          '<text x="' + (28 + l[3]) + '" y="' + (y + 21) + '" font-size="12" fill="var(--ink)">' + l[0] + '</text>' +
          '<text x="' + (170 + l[3]) + '" y="' + (y + 21) + '" font-size="10.5" fill="var(--muted)">' + l[1] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="Four steering levels nested from platform root to session, with additive-only precedence: lower levels may add constraints, never remove them">' + out +
        '<line x1="500" y1="26" x2="500" y2="164" stroke="var(--ok)" stroke-width="2" marker-end="url(#mbStArrow)"></line>' +
        '<defs><marker id="mbStArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--ok)"></path></marker></defs>' +
        '<text x="512" y="70" font-size="11" fill="var(--ok)">may ADD</text>' +
        '<text x="512" y="86" font-size="11" fill="var(--ok)">constraints</text>' +
        '<text x="512" y="118" font-size="11" fill="var(--bad)">may never</text>' +
        '<text x="512" y="134" font-size="11" fill="var(--bad)">weaken one</text>' +
        '<text x="14" y="198" font-size="11" fill="var(--ink)">Weakening is usually implicit: a softer verb, or an invariant quietly left off the list.</text>' +
        '</svg></div><div class="viz-cap">Additive-only precedence. Simple to state, undetectable by reading, which is why it needs a check.</div></div>';
    }

    case 'mb_drift_trace': {
      const box = function(x, y, w, h, tok, label, sub){
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="var(--card)" stroke="' + tok + '" stroke-width="1.5"></rect>' +
          '<text x="' + (x + 12) + '" y="' + (y + 20) + '" font-size="11.5" fill="var(--ink)">' + label + '</text>' +
          '<text x="' + (x + 12) + '" y="' + (y + 37) + '" font-size="10.5" fill="var(--muted)">' + sub + '</text>';
      };
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 220" role="img" ' +
        'aria-label="PD-11 drifts through contradictory steering files; PD-3 drifts with no file change at all, because the agent copied a neighbouring class">' +
        '<text x="14" y="18" font-size="10.5" fill="var(--muted)">PD-11 — detectable in the files</text>' +
        box(14, 26, 190, 50, 'var(--t1)', 'mob steering A', 'wrap in domain exception') +
        box(240, 26, 190, 50, 'var(--t1)', 'mob steering B', 'return a result type') +
        '<text x="212" y="56" font-size="13" fill="var(--bad)">vs</text>' +
        box(466, 26, 200, 50, 'var(--bad)', 'two idioms meet', 'at one service boundary') +
        '<text x="14" y="112" font-size="10.5" fill="var(--muted)">PD-3 — invisible in the files</text>' +
        box(14, 120, 190, 50, 'var(--ok)', 'root steering', '@PhiBoundary required') +
        box(240, 120, 190, 50, 'var(--ok)', 'all mob files', 'unchanged, consistent') +
        box(466, 120, 200, 50, 'var(--bad)', 'generated endpoints', 'annotation absent, audit silent') +
        '<text x="14" y="196" font-size="11" fill="var(--ink)">Steering files can be perfectly consistent while the code diverges from them.</text>' +
        '<text x="14" y="212" font-size="11" fill="var(--muted)">Which is why the only reliable detector is a fitness function per invariant.</text>' +
        '</svg></div><div class="viz-cap">Two kinds of drift. Only one of them is visible in a diff of your steering estate.</div></div>';
    }

    case 'mb_shared_lib_steering': {
      let out = '';
      const mobs = [['Appeals','var(--t1)'], ['Gate','var(--t2)'], ['Portal','var(--t3)']];
      mobs.forEach(function(m, i){
        const y = 26 + i * 44;
        out += '<rect x="14" y="' + y + '" width="150" height="32" rx="6" fill="var(--card)" stroke="' + m[1] + '"></rect>' +
          '<text x="28" y="' + (y + 21) + '" font-size="11.5" fill="var(--ink)">' + m[0] + ' mob steering</text>' +
          '<line x1="166" y1="' + (y + 16) + '" x2="292" y2="96" stroke="' + m[1] + '" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#mbSlArrow)"></line>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="Three mobs edit the shared clinical library, each carrying its own steering; the library&#39;s own steering only binds if the agent actually loads it across the repository boundary">' +
        '<defs><marker id="mbSlArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"></path></marker></defs>' + out +
        '<rect x="300" y="66" width="200" height="64" rx="8" fill="var(--paper-2)" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="5 4"></rect>' +
        '<text x="316" y="90" font-size="12" font-family="var(--mono)" fill="var(--ink)">clinical-rules</text>' +
        '<text x="316" y="108" font-size="10.5" fill="var(--muted)">its own steering lives here</text>' +
        '<text x="316" y="123" font-size="10.5" fill="var(--bad)">loaded by the agent? verify it</text>' +
        '<line x1="504" y1="98" x2="560" y2="98" stroke="var(--muted)" stroke-width="1.4" marker-end="url(#mbSlArrow)"></line>' +
        '<text x="566" y="94" font-size="11" fill="var(--ink-2)">three</text>' +
        '<text x="566" y="110" font-size="11" fill="var(--ink-2)">idioms</text>' +
        '<text x="14" y="176" font-size="11" fill="var(--ink)">Ask the agent to quote the library&#39;s steering rules before it edits the library.</text>' +
        '<text x="14" y="194" font-size="11" fill="var(--muted)">If it cannot, that steering is decorative — and this is an engine limitation, not a policy failure.</text>' +
        '</svg></div><div class="viz-cap">The unowned library gets three mobs&#39; conventions unless its own steering both exists and is loaded.</div></div>';
    }
