{
  id:'M06',
  title:'Constraint-time architecture governance',
  track:1,
  audience:['practitioner'],
  contentionClass:['code','validator'],
  duration:'40 min · 40 min lab',
  visuals:['mb_entropy_drift','mb_fitness_gate','mb_dependency_rule'],
  crossCard:`
<p>Architecture rules that live in a document cost a reviewer a glance on every diff, forever. The same rules as executable checks cost one afternoon each and then nothing. At five mobs, architecture governance is the largest single source of encodable rules on the platform, which makes it the largest available <strong>capacity multiplier</strong>.</p>
<table>
  <tr><th>The decision this module asks for</th><th>What it costs</th></tr>
  <tr><td>Name an <strong>architecture guardian</strong> who owns root steering and the fitness suite, measured on constraints encoded rather than reviews performed</td><td>Part of one senior engineer. If their calendar fills with reviews, the role has failed</td></tr>
  <tr><td>Budget one executable check per root invariant, and keep the root invariant list under ten</td><td>An afternoon per rule, once</td></tr>
</table>
<p>Two findings from the fixture worth carrying into a governance conversation. After twelve weeks of three-mob work the codebase held three error-handling idioms, two date libraries and four ways of asserting on a determination — no rule was broken, because there were no executable rules to break. And the platform's PHI annotation requirement, agreed by everyone and written down, silently stopped being applied when one mob's generated endpoints omitted it. <em>An invariant with no check is a preference.</em></p>
<p><em>Read the full module for:</em> which rules belong at generation time versus merge time, and why a fitness function with an unmeasured false-positive rate gets disabled within a month.</p>
`,
  body:`
<p>In most treatments, fitness functions are an architecture-hygiene topic. Here they are a capacity topic, and that reframing is why this module sits in Track 1 rather than with the mechanics. Every architectural rule you make executable is review time returned to a scarce human, permanently. Architecture governance is the largest single source of encodable rules on a platform — which makes it the largest available <strong>capacity multiplier</strong>.</p>

<h3>Entropy is not new. Its rate is.</h3>
<p>An agent makes locally-optimal decisions with excellent local justification. Asked to add retry logic, it adds a retry library — a real one, popular, well-maintained, and the third such library in the codebase. Nothing about that decision is wrong at the scale of one unit of work. Across five mobs and a quarter it is <strong>architecture entropy</strong> arriving at a rate no review cadence was designed for.</p>

<div data-viz="mb_entropy_drift"></div>

<p>The fixture is a modest example after twelve weeks of three-mob work: three error-handling idioms, two date libraries, two HTTP clients, four different ways to assert on a determination in tests. Every one of them was individually defensible, which is precisely why review did not stop them. A reviewer sees one diff; entropy is a property of the set.</p>
<p>The relevant term is <strong>dialect drift</strong>: five mobs, five idioms, one codebase, none of them wrong locally. It resists review as a control because the evidence for it is never in the change you are looking at.</p>

<h3>Move rules from review-time to constraint-time</h3>
<p><strong>Constraint-time governance</strong> means each architectural rule lives at the earliest point where it can be enforced mechanically rather than remembered.</p>

<div data-viz="mb_fitness_gate"></div>

<table>
  <tr><th>Where the rule lives</th><th>Enforcement</th><th>Right kind of rule</th><th>Failure mode</th></tr>
  <tr><td>Steering file</td><td>Advisory. The agent usually complies.</td><td>Conventions, naming, idiom preferences</td><td>Silently relaxed per mob — this is M12's whole subject</td></tr>
  <tr><td>Scaffold or generator</td><td>Present before the first line is written</td><td>Structural invariants: annotations, audit wiring, module layout</td><td>Only applies to new code; existing code drifts on</td></tr>
  <tr><td><strong>Fitness function</strong> in CI</td><td>Mechanical, every change, no exceptions</td><td>Layer boundaries, dependency direction, PHI paths, contract shape</td><td>False positives; mobs learn to disable it</td></tr>
  <tr><td>Runtime check</td><td>Blocks in production</td><td>Data-boundary and authorisation invariants</td><td>Fails late, when it is expensive</td></tr>
</table>
<p>The middle two rows are where the capacity comes from. A rule in a steering file costs a reviewer a glance on every diff forever; the same rule as a fitness function costs one afternoon once.</p>

<h3>PD-5: the dependency arrow that points the wrong way</h3>
<p><code>priorauth-clinical-rules</code> has a package that imports from the web tier — a display-formatting helper someone needed and nobody stopped. The library that both services depend on now depends on one of them, in one direction that was never designed and cannot be built independently.</p>

<div data-viz="mb_dependency_rule"></div>

<p>This is the canonical case for an executable layer rule, because it is invisible in review: the diff that introduced it was four lines and had a good reason. As a constraint it is one test that will never allow it again:</p>
<pre><code>@ArchTest
static final ArchRule clinical_rules_depend_on_nothing_above_them =
    noClasses().that().resideInAPackage("..clinical..")
      .should().dependOnClassesThat().resideInAnyPackage("..web..", "..portal..");</code></pre>
<p>Leave the planted violation in place on trunk when you are done with the lab — later modules need it, and PD-5 is curriculum rather than a bug to tidy up. Land your fix on a branch and let the test fail loudly on trunk, which is exactly the signal a new mob should meet on day one.</p>

<h3>PD-3: a constraint that existed only as a sentence</h3>
<p>The root steering file says every endpoint touching member data carries <code>@PhiBoundary</code>. The Gate mob's bolt dropped it — not maliciously, not even noticeably; the annotation was absent from the class they copied from, and the agent had no reason to add what it had not seen.</p>
<p>Nothing failed. Tests passed, review passed, and the audit trail for that path stopped being generated. The rule was real, written down, agreed by everyone, and had no mechanical existence at all. <em>An invariant with no check is a preference.</em> That sentence is the module in one line, and it is the answer to "but we already documented that".</p>

<h3>Cross-mob rules are contracts</h3>
<p>Some invariants cannot be checked inside one repository — the shape of the determination payload matters to <code>priorauth-web</code>, and no test in the api repository knows what the portal needs. The executable form of a cross-mob rule is a <strong>consumer-driven contract</strong>: a test the consumer writes, running in the provider's pipeline, failing when the provider breaks it.</p>
<p>That mechanism is what makes cross-repo change reviewable without a human holding both sides in their head. M09 shows what happens without it, and it is worse than a broken build — it is silence.</p>

<h3>What not to encode</h3>
<ul>
  <li><em>Taste.</em> A fitness function about naming style produces noise, and noise is how mobs learn to add an ignore annotation. The first ignore is the end of the mechanism.</li>
  <li><em>Anything with a false-positive rate you have not measured.</em> Run a candidate rule in report-only mode for a week and count. A rule that fires wrongly twice a week will be disabled inside a month, and you will not be told.</li>
  <li><em>Rules nobody can state.</em> The M05 limit applies here too: if the rule needs "it depends", it stays a human decision at Tier 3.</li>
</ul>
<p>Where an architectural rule genuinely resists encoding, the honest move is an <strong>architecture guardian</strong> — a named person who owns root steering and the fitness suite, measured on constraints encoded rather than reviews performed. If their calendar fills with reviews, the role has failed in the way M05 warned about.</p>
`,
  lab:{
    title:'Make the rule executable',
    pd:['PD-3','PD-5'],
    a:`
<p><em>Deliverable:</em> two fitness functions running in CI on branches of <code>priorauth-clinical-rules</code> and <code>priorauth-api</code>: a layer-dependency rule that fails on <em>PD-5</em>, and a PHI-annotation rule that fails on <em>PD-3</em>. Plus one report-only false-positive count for a third rule of your choosing, recorded in <code>governance/FITNESS.md</code>.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Ask the agent to map actual package dependencies in <code>priorauth-clinical-rules</code> from imports, not from documentation. The upward dependency (PD-5) is one class among several dozen.</li>
  <li>Write the ArchUnit layer rule. Run it: it must fail before you believe it. A fitness function you have never seen fail is not evidence of anything.</li>
  <li>Write the <code>@PhiBoundary</code> presence rule: any handler whose parameters or return type carry a member identifier must have the annotation. The PHI-adjacent hops in <code>records/M02_MAP.md</code> are your test set: the rule must fire on every one of them that lacks the annotation. Run it against trunk to catch PD-3, and record which mob's bolt dropped it and when — you will use that provenance question again in M16.</li>
  <li>Pick a third candidate rule you actually want (a test-assertion convention, say), run it in report-only mode across all three repositories, and count the false positives. Write the number down even if it kills the rule.</li>
  <li>Land both rules on a branch. Do not fix PD-3 or PD-5 on trunk — later modules use them, and the point of this lab is the check, not the tidy-up.</li>
</ol>
<h4>Graded moment</h4>
<p>Asked for an architectural rule, the agent will write one that passes. It will scope the package pattern to what the current code already satisfies — narrowing <code>..clinical..</code> to the one subpackage it inspected, so the rule is green and useless. Verify by construction: introduce a deliberate violation in a scratch commit and confirm the rule fails. Any rule that has only ever been green is a comment.</p>
<h4>Gate</h4>
<p>Both rules fail on the planted violations and pass on a corrected branch; the false-positive count for the third rule is recorded with the decision it drove; trunk still contains PD-3 and PD-5.</p>`,
    b:`
<p><em>Deliverable:</em> identical — the layer rule failing on PD-5, the PHI-annotation rule failing on PD-3, both in CI on branches, plus a recorded false-positive count for a third candidate rule. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Generate the dependency map with a build-tool query rather than the assistant: <code>./mvnw dependency:analyze</code> plus a search for cross-tier imports. Copilot summarises architecture confidently from partial context, and PD-5 sits in a class nothing else references.</li>
  <li>Ask for the ArchUnit rule with the package patterns given by you, explicitly. Left to itself the assistant will infer patterns from open files and scope the rule to what it can see.</li>
  <li>Write the <code>@PhiBoundary</code> rule; run it against trunk to catch PD-3, and record which bolt dropped the annotation.</li>
  <li>Run a third candidate rule report-only across the workspace and count false positives.</li>
  <li>Land on branches. Leave PD-3 and PD-5 on trunk.</li>
</ol>
<h4>Graded moment</h4>
<p>Same failure, arriving differently: Copilot will produce a rule that compiles and passes, then describe it as enforcing the layer boundary. Prove it by introducing a violation. Additionally, because it reasons from open files, it will often write the rule against the wrong package root — check the pattern against the actual package tree rather than the class you had open.</p>
<h4>Gate</h4>
<p>Identical to Path A: both rules demonstrably fail on the planted violations, pass on a fixed branch, false-positive count recorded, trunk unchanged.</p>`
  }
}
