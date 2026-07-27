{
  id:'M13',
  title:'Mixed-engine estates',
  track:3,
  audience:['practitioner'],
  contentionClass:['code'],
  duration:'35 min · 30 min lab',
  visuals:['mb_engine_fanout','mb_dialect_compare','mb_steering_conflict'],
  crossCard:`
<p>Procurement bought one engine, a mob was already faster with another, and a third arrived with an acquisition. One platform running several engines is normal rather than pathological. It becomes a governance problem only when the same architectural intent is maintained twice, in two dialects of configuration, and the copies diverge one bullet at a time in files nobody diffs.</p>
<table>
  <tr><th>Rule</th><th>Consequence if you skip it</th></tr>
  <tr><td>One <strong>canonical steering source</strong>; per-engine files are generated, and CI fails if a generated file is edited directly</td><td>The first hotfix typed into a generated file becomes the truth for one engine only</td></tr>
  <tr><td>Standardise only where two mobs' code meets: invariants, security, error handling at boundaries, contract shape</td><td>Governing comment density spends the goodwill you need for the rules that matter</td></tr>
  <tr><td>Provenance records the engine and its version</td><td>When a systematic defect appears across nine files, you cannot ask whether they share a producer</td></tr>
</table>
<p>One thing not to fund: an engine bake-off. Model releases move the differences, so any comparison's conclusions expire. What is durable is the measurement — one identical unit of work per engine, diffed and kept, re-run when a version changes.</p>
<p><em>Read the full module for:</em> which differences actually reach the codebase and which are cosmetic, and how two internally consistent conventions produce a bug that survives both mobs' test suites.</p>
`,
  body:`
<p>Every other module in this course is engine-neutral and offers both paths. This one is about the difference between them, because on a real platform you do not get to choose one.</p>

<h3>The reality nobody planned</h3>
<p>Procurement bought one engine for the enterprise. A mob was already using another and is faster with it. A third arrived with an acquisition. Somebody has a personal preference and a good argument. The result is normal rather than pathological: <em>one platform, several engines, one codebase.</em></p>
<p>Two mobs on different engines is not a governance problem in itself. It becomes one when the same architectural intent is expressed twice, in two dialects of configuration, and the two copies diverge silently. That is the whole subject of this module.</p>

<h3>One canonical source, generated fan-out</h3>
<div data-viz="mb_engine_fanout"></div>
<p>The rule is simple and it is violated almost everywhere: maintain one <strong>canonical steering source</strong> and generate the per-engine files from it. Never hand-maintain parallel copies, because parallel copies do not diverge loudly — they diverge one bullet at a time, in files nobody diffs.</p>
<pre><code>governance/STEERING.canonical.md        # the only file a human edits
  → generated/CLAUDE.md                # engine A dialect
  → generated/copilot-instructions.md  # engine B dialect
  → generated/INVARIANTS.json          # machine-readable, for the drift check

CI fails if any generated file is newer than the canonical source.</code></pre>
<p>That last line is the entire enforcement mechanism, and it is four lines of pipeline. Without it, the first hotfix edited directly into a generated file becomes the new truth for one engine only.</p>

<h3>Dialect, observed rather than asserted</h3>
<p>Engines differ systematically in what they produce from identical instructions. That systematic difference is <strong>engine dialect</strong>, and it shows up in a codebase as divergence when mobs split by engine.</p>

<div data-viz="mb_dialect_compare"></div>

<div class="callout">
  <div class="k">Measure this on your own estate, and expect it to change</div>
  <p style="margin:0">The differences below are what the fixture's unit of work produced on the engines available when it was recorded. Model releases change them, sometimes substantially, and any course that hands you a fixed table of engine characteristics is selling you a stale benchmark. The durable skill is the measurement: run one identical unit of work on each engine your platform uses, diff the output, and keep the diff. Repeat it when a model version changes. That artifact is worth more than anyone's comparison chart, including this one.</p>
</div>

<table>
  <tr><th>Dimension</th><th>What varied in the fixture run</th><th>Does it matter?</th></tr>
  <tr><td>Test verbosity</td><td>One engine produced 14 test methods for the unit of work, the other 6, covering the same paths</td><td>Only as suite runtime — which is M10's problem, and 34 minutes is already the constraint</td></tr>
  <tr><td>Error-handling idiom</td><td>Domain-exception wrapping versus result objects, each consistent with its own mob's steering</td><td><strong>Yes.</strong> Two idioms meeting at a service boundary is PD-11, and it is a correctness surface, not a style question</td></tr>
  <tr><td>Comment density</td><td>Roughly twice as many explanatory comments in one</td><td>No. Do not spend governance on this.</td></tr>
  <tr><td>Cross-file reach</td><td>One engine edited three files for the change; the other edited one and left a caller broken</td><td><strong>Yes.</strong> It changes what your merge queue must catch — see M08</td></tr>
</table>

<h3>PD-11 surfacing</h3>
<div data-viz="mb_steering_conflict"></div>
<p>Two mobs, two engines, two steering files, both internally consistent. One wraps failures in a domain exception; the other returns a result type. Neither convention is wrong. Neither steering file mentions the other. The contradiction has no representation anywhere in configuration — it exists only in the generated code, at the boundary where an Appeals service calls a Gate service, where one side throws and the other checks a return value.</p>
<p>What that costs, concretely: the caller handles the failure path that its own convention predicts and silently ignores the other. An appeal that fails criteria evaluation returns a result the caller reads as success. This is the class of bug that survives both mobs' test suites, because each mob tests its own convention.</p>

<h3>What to standardise, and what to leave alone</h3>
<table>
  <tr><th>Standardise</th><th>Leave to the mob</th></tr>
  <tr><td>Architectural invariants and layer boundaries</td><td>Prompt style and how a mob likes plans presented</td></tr>
  <tr><td>Error-handling convention at service boundaries</td><td>Formatting, naming preferences, comment density</td></tr>
  <tr><td>Security and PHI rules, without exception</td><td>Test framework preference within a repo's stack</td></tr>
  <tr><td>Contract shape and versioning</td><td>Which engine, mostly — see the caveat below</td></tr>
</table>
<p>Standardise a convention only where two mobs' code meets. Everything else is preference dressed as governance, and governing it costs you the goodwill you will need for the rules that matter.</p>
<p>The caveat on engine choice: leave it to the mob <em>if</em> your provenance chain records which engine produced which change (M16) and <em>if</em> your steering fan-out is generated rather than hand-copied. Without both, engine choice is a governance decision you have delegated by accident.</p>

<h3>Provenance across engines</h3>
<p>The record must name the engine and its version, alongside mob, validator, tier and steering version. Two reasons, and the second is the one that matters at three in the morning:</p>
<ul>
  <li>Auditors ask what produced a clinical change. "An AI assistant" is not an answer that closes a finding.</li>
  <li>When a systematic defect appears — the same missing null check across nine files — the first useful question is whether those nine changes share an engine, a steering version, or a mob. Without the engine field you cannot ask it, and M17 is the module where you will want to.</li>
</ul>
<p>This course teaches two engines, and that is a deliberate scoping decision rather than a claim that two is all you will have. A third engine adds a column to your fan-out and nothing to the lesson: the mechanism is one canonical source, generated outputs, standardisation only where code meets, and provenance that names the producer.</p>
`,
  lab:{
    title:'One source, two engines, one divergence',
    pd:['PD-11'],
    engine:'ENGINE-COMPARATIVE',
    a:`
<p><em>Deliverable:</em> a canonical steering source with generated per-engine files, a CI check that fails when a generated file is edited directly, the same unit of work run on both engines with the outputs diffed and kept, and a resolution of <em>PD-11</em> that is a fitness function rather than a longer steering document.</p>
<h4>Both engines — the shared procedure</h4>
<ol>
  <li>Write <code>governance/STEERING.canonical.md</code> containing the numbered invariants from M12 plus the error-handling convention you are about to decide. One file, one author, no engine-specific phrasing in it.</li>
  <li>Generate the per-engine files with a script in <code>platform-fixture/scripts/</code>. Keep the generator boring: read the canonical source, emit each engine's expected filename and format. Add the CI check that fails when a generated file is newer than its source.</li>
  <li>Pick one small unit of work — <code>UOW-52</code>, the derived status display, is the right size, and it is in <code>registry/UOW_REGISTRY.template.md</code> if you have not reached M14 and built the registry yet — and run it end to end on <em>both</em> engines from the same canonical steering, in separate branches.</li>
  <li>Diff the two outputs. Record what differed under four headings: files touched, test count, error-handling idiom, callers updated. Save the diff at <code>records/M13_DIALECT.md</code> with the engine versions written down — the versions are what make the record re-checkable in six months.</li>
  <li>Now resolve <em>PD-11</em>: decide which error-handling convention is the invariant at service boundaries, write the one-line reason, and encode it as a check that fails when the losing convention crosses a boundary.</li>
</ol>
<h4>If you only have one engine</h4>
<p>Run steps 1, 2 and 5 as written: the canonical source, the generated fan-out, the direct-edit check and the PD-11 resolution are all single-engine work, and they are most of the gate. For steps 3 and 4, substitute a second <em>configuration</em> for the second engine — run the same unit of work twice on your engine, once with the canonical steering loaded and once with it deliberately withheld, and diff the output under the same four headings. That measures whether your steering is load-bearing, which is the more useful finding of the two and the one that survives a model release. Record it at <code>records/M13_DIALECT.md</code> with the same version detail. You will not have seen engine dialect, and you should not claim to have.</p>
<h4>Graded moment</h4>
<p>Asked to resolve the convention conflict, both engines will suggest adding guidance to the steering file, and one will offer to write an adapter that accepts either convention. The adapter is the more seductive answer and the worse one: it makes the divergence permanent and invisible by design. The gate for this lab is explicit about it — the resolution must be able to fail a build, because a convention that cannot fail a build is not a convention on a platform with more than one mob.</p>
<h4>Gate</h4>
<p>Canonical source is the only hand-edited file; the direct-edit check fails when you edit a generated file; the dialect diff exists with engine versions recorded; PD-11 resolved by a fitness function, and the divergence correctly classified as convention rather than correctness — except at the boundary, where it is both.</p>`,
    b:`
<p><em>What diverged, and what to do with it.</em> This panel is the analysis half of the same lab — read it after you have both branches in front of you.</p>
<h4>The four readings</h4>
<table>
  <tr><th>Reading</th><th>Question to answer from your diff</th><th>What the answer changes</th></tr>
  <tr><td>Files touched</td><td>Did both engines update every caller of the changed signature?</td><td>If one did not, your merge queue must build the whole repo rather than the changed module (M08)</td></tr>
  <tr><td>Test count</td><td>Do the extra tests cover extra paths, or the same paths more verbosely?</td><td>Verbose duplication is suite-runtime debt on a shared runner pool (M10)</td></tr>
  <tr><td>Error idiom</td><td>Do the two outputs agree on what a failure looks like at the boundary?</td><td>This is PD-11. Disagreement here is a correctness surface, not a preference</td></tr>
  <tr><td>Steering fidelity</td><td>Did both engines actually honour every invariant in the canonical source?</td><td>An invariant one engine ignores needs a fitness function today, not a stronger sentence</td></tr>
</table>
<h4>The divergence that is not a dialect problem</h4>
<p>One finding in this lab is commonly misread. If an engine omits an invariant from the canonical source, that is not dialect — that is your steering not being load-bearing on that engine, and the correct response is a check in the pipeline rather than a rewrite of the instruction. Mobs will otherwise spend weeks rephrasing prose to persuade a model, which is the least durable control available.</p>
<h4>Where this lab stops</h4>
<p>You have not learned which engine is better and the lab is not designed to tell you. You have learned which differences reach the codebase and which do not, and you now own a re-runnable measurement for the next model release. If a comparison of engines is what your organisation actually wants, it needs its own study with your own units of work — and its conclusions expire.</p>
<h4>Gate</h4>
<p>Same gate as the shared procedure: canonical source is the only hand-edited file, the direct-edit check works, the dialect diff is recorded with engine versions, and PD-11 is resolved by something that can fail a build.</p>`
  }
}
