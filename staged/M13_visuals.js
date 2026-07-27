case 'mb_engine_fanout': {
      const outs = [
        ['generated/CLAUDE.md','engine A dialect','var(--t2)'],
        ['generated/copilot-instructions.md','engine B dialect','var(--t3)'],
        ['generated/INVARIANTS.json','for the drift check','var(--t4)']
      ];
      let out = '';
      outs.forEach(function(o, i){
        const y = 24 + i * 52;
        out += '<rect x="360" y="' + y + '" width="306" height="38" rx="7" fill="var(--card)" stroke="' + o[2] + '" stroke-width="1.4"></rect>' +
          '<text x="374" y="' + (y + 17) + '" font-size="11" font-family="var(--mono)" fill="var(--ink)">' + o[0] + '</text>' +
          '<text x="374" y="' + (y + 31) + '" font-size="10" fill="var(--muted)">' + o[1] + '</text>' +
          '<line x1="230" y1="96" x2="352" y2="' + (y + 19) + '" stroke="' + o[2] + '" stroke-width="1.4" marker-end="url(#mbFanArrow)"></line>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="One canonical steering source generates the per-engine instruction files and a machine-readable invariant list; CI fails if a generated file is edited directly">' +
        '<defs><marker id="mbFanArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"></path></marker></defs>' +
        '<rect x="14" y="70" width="216" height="52" rx="8" fill="var(--paper-2)" stroke="var(--ok)" stroke-width="2"></rect>' +
        '<text x="30" y="92" font-size="11.5" font-family="var(--mono)" fill="var(--ink)">STEERING.canonical.md</text>' +
        '<text x="30" y="110" font-size="10.5" fill="var(--ok)">the only file a human edits</text>' + out +
        '<text x="14" y="176" font-size="11" fill="var(--ink)">CI fails if any generated file is newer than the canonical source. Four lines of pipeline.</text>' +
        '<text x="14" y="196" font-size="11" fill="var(--bad)">Hand-maintained parallel copies do not diverge loudly. They diverge one bullet at a time.</text>' +
        '</svg></div><div class="viz-cap">The fan-out. The enforcement is the timestamp check, not the convention.</div></div>';
    }

    case 'mb_dialect_compare': {
      const dims = [
        ['files touched', '3', '1 (caller left broken)', true],
        ['test methods', '14', '6', false],
        ['error idiom', 'domain exception', 'result type', true],
        ['comment density', 'high', 'low', false]
      ];
      let out = '<text x="200" y="24" font-size="10.5" fill="var(--muted)">ENGINE A</text>' +
        '<text x="380" y="24" font-size="10.5" fill="var(--muted)">ENGINE B</text>' +
        '<text x="560" y="24" font-size="10.5" fill="var(--muted)">REACHES CODE?</text>';
      dims.forEach(function(d, i){
        const y = 44 + i * 34;
        out += '<text x="14" y="' + (y + 16) + '" font-size="11.5" fill="var(--ink-2)">' + d[0] + '</text>' +
          '<rect x="190" y="' + y + '" width="160" height="26" rx="5" fill="var(--card)" stroke="var(--t2)"></rect>' +
          '<text x="200" y="' + (y + 17) + '" font-size="10.5" font-family="var(--mono)" fill="var(--ink)">' + d[1] + '</text>' +
          '<rect x="370" y="' + y + '" width="160" height="26" rx="5" fill="var(--card)" stroke="var(--t3)"></rect>' +
          '<text x="380" y="' + (y + 17) + '" font-size="10.5" font-family="var(--mono)" fill="var(--ink)">' + d[2] + '</text>' +
          '<text x="560" y="' + (y + 17) + '" font-size="11" fill="' + (d[3] ? 'var(--bad)' : 'var(--muted)') + '">' + (d[3] ? 'yes — govern it' : 'no — leave it') + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 210" role="img" ' +
        'aria-label="The same unit of work on two engines: files touched, test count, error idiom and comment density; only two of the four differences reach the codebase in a way worth governing">' + out +
        '<text x="14" y="196" font-size="11" fill="var(--ink)">One identical unit of work, one diff, recorded with engine versions. Re-run it when a model version changes.</text>' +
        '</svg></div><div class="viz-cap">A snapshot of one fixture run, not a benchmark. The method is the deliverable; the numbers expire.</div></div>';
    }

    case 'mb_steering_conflict': {
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Appeals throws a domain exception while Gate returns a result type; at the boundary the caller checks a return value that never signals failure, so the appeal reads as successful">' +
        '<rect x="14" y="20" width="290" height="72" rx="8" fill="var(--card)" stroke="var(--t1)" stroke-width="1.5"></rect>' +
        '<text x="28" y="42" font-size="11.5" fill="var(--ink)">Appeals mob steering</text>' +
        '<text x="28" y="60" font-size="10.5" font-family="var(--mono)" fill="var(--ink-2)">throw new CriteriaException(...)</text>' +
        '<text x="28" y="80" font-size="10.5" fill="var(--ok)">internally consistent, fully tested</text>' +
        '<rect x="376" y="20" width="290" height="72" rx="8" fill="var(--card)" stroke="var(--t2)" stroke-width="1.5"></rect>' +
        '<text x="390" y="42" font-size="11.5" fill="var(--ink)">Gate mob steering</text>' +
        '<text x="390" y="60" font-size="10.5" font-family="var(--mono)" fill="var(--ink-2)">return Result.failure(reason)</text>' +
        '<text x="390" y="80" font-size="10.5" fill="var(--ok)">internally consistent, fully tested</text>' +
        '<line x1="160" y1="94" x2="300" y2="126" stroke="var(--t1)" stroke-width="1.5"></line>' +
        '<line x1="520" y1="94" x2="380" y2="126" stroke="var(--t2)" stroke-width="1.5"></line>' +
        '<rect x="196" y="128" width="288" height="56" rx="8" fill="var(--paper-2)" stroke="var(--bad)" stroke-width="2"></rect>' +
        '<text x="212" y="150" font-size="11.5" fill="var(--bad)">the service boundary between them</text>' +
        '<text x="212" y="170" font-size="10.5" fill="var(--ink-2)">caller checks a return value; the other side throws</text>' +
        '<text x="14" y="206" font-size="11" fill="var(--ink)">A failed criteria evaluation returns something the caller reads as success. Both suites stay green.</text>' +
        '</svg></div><div class="viz-cap">PD-11. The contradiction has no representation in configuration — it exists only where the two idioms meet.</div></div>';
    }
