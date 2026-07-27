{
  id:'M09',
  title:"Multi-repo, monorepo, and the agent's context boundary",
  track:2,
  audience:['practitioner'],
  contentionClass:['code'],
  duration:'40 min · 40 min lab',
  visuals:['mb_three_boundaries','mb_version_noop','mb_context_cost'],
  mount(host){
    const next = host.querySelector('[data-mb="noop-next"]');
    const back = host.querySelector('[data-mb="noop-back"]');
    if (!next) return;
    const steps = host.querySelectorAll('[data-mb-step]');
    const read = host.querySelector('[data-mb="noop-read"]');
    const captions = [
      'Step 1 of 4 — Gate lands a criteria change and publishes clinical-rules 2.8.',
      'Step 2 of 4 — the api consumer bumps to 2.8. Tests pass, behaviour changes. Gate marks the bolt done.',
      'Step 3 of 4 — the web consumer is pinned to 2.3. Nothing fails. No test anywhere in the platform is red.',
      'Step 4 of 4 — three weeks later the nurse queue is showing pre-change denial reasons. Nobody connects it to Gate.'
    ];
    let i = 0;
    const upd = function(){
      steps.forEach(function(el){
        const s = Number(el.getAttribute('data-mb-step'));
        el.setAttribute('opacity', s <= i ? '1' : '0.12');
      });
      if (read) read.textContent = captions[i];
      back.disabled = i === 0;
      next.disabled = i === captions.length - 1;
    };
    next.addEventListener('click', function(){ if (i < captions.length - 1){ i++; upd(); } });
    back.addEventListener('click', function(){ if (i > 0){ i--; upd(); } });
    upd();
  },
  crossCard:`
<p>One mob shipped a clinical criteria change. It went live in the service that consumes the shared library at the current version, and did nothing at all in the portal, which is pinned to an older one. No test failed anywhere. No alarm fired. Three weeks later a nurse noticed that the queue was showing denial reasons that no longer matched the service.</p>
<p>Nothing in that sequence is a bug in anyone's code. Every component behaved as configured, the mob's work was correct, and half of production did not receive a clinical change. This is the failure mode of a multi-repository estate: not breakage, which announces itself, but silence, which has no owner.</p>
<table>
  <tr><th>The ask</th><th>Cost</th></tr>
  <tr><td>Consumer-written contract tests running in the provider's pipeline, plus a version-drift report across all consumers</td><td>About a week. It closes this class of failure rather than this instance</td></tr>
</table>
<p>The honest part, which belongs in any risk conversation: contract tests only cover contracts someone wrote down, and no tooling answers whether these should be three repositories at all. That is a topology decision with real deployment consequences; what this module can do is make the current answer's cost visible.</p>
<p><em>Read the full module for:</em> why the repository, the team and the agent's context are three different boundaries, and which one is usually misaligned.</p>
`,
  body:`
<p>Repository topology is where this method has no opinion at all, and the silence is load-bearing. Everything in AI-DLC assumes a single mob can see all the code it is changing. At a repository boundary that assumption stops being true, and nothing tells you it stopped.</p>

<h3>Three boundaries, routinely treated as one</h3>
<div data-viz="mb_three_boundaries"></div>
<table>
  <tr><th>Boundary</th><th>What it actually governs</th><th>Who set it, and when</th></tr>
  <tr><td><em>Repository</em></td><td>Deployment unit, versioning, release cadence</td><td>Whoever split the system, probably years ago, for reasons that may no longer hold</td></tr>
  <tr><td>Team</td><td>Ownership, accountability, review authority</td><td>The org chart, which changes on a different cycle</td></tr>
  <tr><td><strong>Context boundary</strong></td><td>What the model can see when it generates</td><td>Nobody decided it. It is an emergent property of your workspace layout and engine</td></tr>
</table>
<p>Most multi-team AI-DLC pain is a mismatch between these three. The one that hurts is the third, because it is the only boundary that nobody chose and the only one with no diagram anywhere in your organisation.</p>

<h3>Monorepo and multi-repo, honestly</h3>
<div data-viz="mb_context_cost"></div>
<table>
  <tr><th></th><th>Monorepo</th><th>Multi-repo</th></tr>
  <tr><td>Agent visibility</td><td>Everything, in principle</td><td>One repository, unless you assemble more by hand</td></tr>
  <tr><td>Context cost per bolt</td><td>High — retrieval quality falls as you widen it, and a wide context is not a read context</td><td>Low and cheap</td></tr>
  <tr><td>Cross-cutting change</td><td>Atomic. One commit, one review, one build</td><td>Spans days and versions. Two queues, production in between</td></tr>
  <tr><td>Contract enforcement</td><td>Compiler and tests, immediately</td><td>Only what you made explicit. Nothing else is checked</td></tr>
  <tr><td>What fails</td><td>Builds get slower; blast radius of a bad change is wider</td><td>Silence. Nothing fails, which is worse</td></tr>
</table>
<p>The trap in the monorepo column is worth stating precisely, because it is the newest of these facts: <em>the agent can see everything</em> is a claim about the repository, not about the model. In a codebase larger than the window, retrieval picks a subset, and the subset is chosen by relevance heuristics rather than by whether the change is correct. A monorepo removes the excuse for missing a caller; it does not remove the failure.</p>

<h3>PD-9: the version pin that silently discards a mob's work</h3>
<p>This is the module's centrepiece and the failure that most reliably convinces a senior engineer that repository topology is not an aesthetic question. Step through it:</p>

<div data-viz="mb_version_noop"></div>

<p>Nothing in that sequence is a bug in anyone's code. Gate's change is correct. The api's bump is correct. The web pin was set deliberately eighteen months ago during an incident, by someone who has since left, and is still doing exactly what it was asked to do. The platform is behaving as configured and the outcome is that a clinical change reached half of production.</p>
<p>That is a <strong>version-pin no-op</strong>, and its defining property is that no test fails and no alarm fires. Compare it to a broken build, which announces itself in ninety seconds. The failure mode of multi-repo is not breakage. It is silence, and silence has no owner.</p>
<p>The fixture's discoverable symptom, deliberately placed so the defect is findable rather than merely cruel: the nurse queue shows denial reasons that no longer match what the api returns for the same request, and there is a support ticket in <code>platform-fixture/evidence/</code> filed by a nurse who noticed.</p>

<h3>Making contracts visible to the agent</h3>
<p>Across a repository boundary, an agent has no reliable view of the other side. It will infer the contract from names, and it will be plausible and wrong. Three mechanisms that work, cheapest first:</p>
<ol>
  <li><strong>Consumer-driven contract</strong> tests running in the provider's pipeline (M06). The only mechanism that turns a cross-repo assumption into a build failure. If you adopt one thing from this module, adopt this.</li>
  <li><em>Compatibility encoded, not documented.</em> A machine-readable minimum consumer version in the provider's manifest, checked at release. "Consumers should upgrade" in a release note is not a control.</li>
  <li><em>Version drift visibility.</em> A scheduled job that reports the deployed version of every shared library in every consumer, and fails when the spread exceeds one minor version. Fifty lines, and it would have caught PD-9 on day two rather than week three.</li>
</ol>

<h3>The pragmatic middle</h3>
<table>
  <tr><th>Approach</th><th>Worth it when</th><th>Cost you are accepting</th></tr>
  <tr><td>Vendored contracts</td><td>Two repositories, stable schema</td><td>Copies drift; you need a check that they match</td></tr>
  <tr><td>Generated clients from a spec</td><td>The provider has a real spec and honours it</td><td>Generation pipeline becomes load-bearing infrastructure</td></tr>
  <tr><td>Contracts repository</td><td>Three or more consumers of one provider — this platform</td><td>A third thing to version, and a new place for changes to queue</td></tr>
  <tr><td>Merge the repositories</td><td>The split has no independent deployment reason left</td><td>Weeks of build work, and a bigger blast radius per change</td></tr>
</table>
<p>For this platform the defensible move is a contracts directory in <code>priorauth-clinical-rules</code> with consumer tests from both consumers running in its pipeline, plus the drift report. That is a week of work and it closes PD-9 as a class.</p>

<div class="callout honest-limit">
  <div class="k">Honest limit — the method has no position here</div>
  <p>AI-DLC does not tell you how to organise repositories, and it does not tell you what to do when a unit of work crosses one. It assumes one mob can see all the code. That assumption is the first thing to break at multi-team scale, and the method's silence is not an oversight you can read around — there is nothing in it to apply. Everything in this module is this course's addition, and you should present it that way rather than as guidance from the method.</p>
  <p>Two further limits worth being blunt about. <em>Contract tests only cover contracts you wrote down.</em> PD-9 concerns behaviour inside an evaluation function — a rule change, not a signature change — and a contract test written against the payload shape would have passed. Catching it required a test asserting on evaluation outcomes, which someone has to think to write; there is no mechanism that finds the unwritten test. And <em>no tooling resolves the underlying question</em>, which is whether these three repositories should be three repositories. That is a topology decision with real deployment consequences, and this course cannot make it for you — it can only make the cost of the current answer visible.</p>
</div>
`,
  lab:{
    title:'Find the silent no-op',
    pd:['PD-9'],
    a:`
<p><em>Deliverable:</em> a written trace of <em>PD-9</em> at <code>platform-fixture/records/M09_NOOP.md</code> naming which consumer was unaffected and why, a contract test that fails against the pinned version, and a version-drift report that would have caught it within 48 hours.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Ship the Gate mob's change: <code>git apply ../../branches/gate-r2.patch</code> in <code>repos/priorauth-api</code>, which moves the consumer to <code>clinical-rules</code> 2.8. Run both suites. Everything is green. Verify the behaviour change is real in the api — denial reasons are now sentences.</li>
  <li>Now prove it works everywhere. Your M02 system map already recorded a version per consumer — reread that line before you trust anything else. Then check each consumer's resolved dependency version yourself rather than asking the agent. One of them is pinned.</li>
  <li>Find the symptom without being told where it is: compare what the portal renders for a given request against what the api returns for the same request, and read the support ticket in <code>evidence/</code>. Write the trace: what changed, who consumed it, who did not, how long the gap would have lasted.</li>
  <li>Write the contract test that would have caught it. It must assert on evaluation <em>outcomes</em>, not payload shape — a shape test passes here, which is the subtle part of this lab.</li>
  <li>Add the version-drift report across all shared dependencies in both consumers, and set the failure threshold. Justify the threshold you chose.</li>
  <li>State which of the three boundaries was actually misaligned. There is a defensible answer and it is not the repository boundary.</li>
</ol>
<h4>Graded moment</h4>
<p>Asked whether the change is live in both consumers, the agent will read the manifests and answer yes. Manifests declare intent; the resolved tree and the deployed artifact describe reality, and in this fixture they disagree. The graded moment is whether you accepted a manifest as evidence. Expect a second failure too: asked to write a test that would have caught this, it will write a payload-shape assertion, which passes against the pinned version and proves nothing.</p>
<h4>Gate</h4>
<p>The trace names the unaffected consumer and its pin with the date and reason it was set; the contract test fails against 2.3 and passes against 2.8; the drift report exists with a justified threshold; the misaligned boundary is named as the context boundary, with a sentence of argument.</p>`,
    b:`
<p><em>Deliverable:</em> identical — the written trace, an outcome-asserting contract test that fails against the pinned version, and a version-drift report with a justified threshold. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Ship the Gate change, bump the api consumer, run both suites. Green.</li>
  <li>Check resolved versions with the build tools directly — <code>./mvnw dependency:tree</code> and <code>npm ls</code>. This path makes the lesson unusually vivid: with each repository in its own window, there is no view in which the two versions appear together at all.</li>
  <li>Find the symptom by comparing rendered output against the api response for one request, and read the support ticket in <code>evidence/</code>.</li>
  <li>Write the outcome-asserting contract test. Ask Copilot for it explicitly in terms of evaluation results; asked generically for a contract test it will produce a schema assertion.</li>
  <li>Add the drift report as a scheduled workflow and justify the threshold.</li>
  <li>Name the boundary that was misaligned.</li>
</ol>
<h4>Graded moment</h4>
<p>Same two failures. The path-specific sharpening: when you ask about the other repository, the assistant will answer from the repository you have open, without noting that it cannot see the other one. Confident answers about code outside the workspace are the single most reliable source of cross-repo error, and this lab is the cheapest place to learn to distrust them.</p>
<h4>Gate</h4>
<p>Identical to Path A: trace with pin date and reason, contract test failing against 2.3 and passing against 2.8, drift report with justified threshold, and the context boundary named as the misalignment.</p>`
  }
}
