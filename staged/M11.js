{
  id:'M11',
  title:'Brownfield at scale: fifteen years, no tests, five mobs',
  track:2,
  audience:['practitioner'],
  contentionClass:['code','validator'],
  duration:'40 min · 45 min lab',
  visuals:['mb_brownfield_loop','mb_characterization','mb_strangler_seams'],
  crossCard:`
<p>Every published example of this method is greenfield. Your platform is not, and the mismatch breaks one specific thing rather than the method in general: the validation checkpoint needs an oracle, at one mob and at five. In untested legacy code nobody can tell whether a change is correct, so approval quietly degrades to <em>it compiles and the demo worked</em> — while every metric you watch still looks healthy.</p>
<p>The entry move is characterization: generate tests that pin what the code does today, including the parts that are wrong, so change becomes visible. This is the one place where agent-generated tests are unambiguously excellent, and it turns a week of work into an afternoon. That economic shift is what makes brownfield viable at all.</p>
<table>
  <tr><th>The decision you will be asked for</th><th>The answer this module defends</th></tr>
  <tr><td>Rewrite the fifteen-year-old service — agents make the first sixty per cent look achievable</td><td>No. The value in that service is years of encoded exceptions nobody can enumerate, and a rewrite must reproduce behaviour it cannot inventory. Characterize, then strangle</td></tr>
  <tr><td>Expect greenfield delivery rates in legacy</td><td>No. Expect materially slower, and say so before the second quarter arrives</td></tr>
</table>
<p><em>Read the full module for:</em> what characterization cannot do — including the real risk of pinning a bug and defending it for three years — and how to sequence strangler work so two mobs do not cut the same seam.</p>
`,
  body:`
<p>Every example in every published treatment of this method is greenfield. Real platforms are fifteen years old, and the module that matters most is the one nobody will touch.</p>

<h3>The specific breakage</h3>
<p>Brownfield does not make AI-DLC slower in some general way. It breaks one named component: the validation checkpoint needs an oracle, and at five mobs no engineer's memory can substitute for one. To validate a change you must be able to tell whether it is correct, and in untested legacy code you cannot — so validation quietly degrades into "it compiles and the demo works."</p>

<div data-viz="mb_brownfield_loop"></div>

<p>That degradation is invisible in every metric you have. Bolts land. Cycle time looks fine. The checkpoint is still in the process diagram and a human still approves. What has changed is that approval now means "I read a diff in a file I do not understand and nothing obviously wrong happened", which is not the control your risk officer thinks it is. Under one mob, a senior engineer's memory partly substitutes for the oracle. At five mobs there is not enough memory to go round.</p>

<h3>Characterization tests are the entry move</h3>
<p>A <strong>characterization test</strong> does not assert correct behaviour. It pins <em>current</em> behaviour, so that change becomes visible. You are not describing what the code should do; you are recording what it does, including the parts that are wrong.</p>

<div data-viz="mb_characterization"></div>

<p>This is the one place in this course where agent-generated tests are unambiguously excellent, and the reason is worth naming: "what does this code do with this input" is a question models answer well and humans find unbearably tedious. Feeding a 4,000-line service two hundred input permutations and recording the outputs is a job that used to cost a week and now costs an afternoon. That single change in economics is what makes brownfield AI-DLC viable at all.</p>
<p>Discipline that keeps it honest:</p>
<ul>
  <li><em>Pin observable behaviour, not implementation.</em> Inputs and outputs at the seam, not internal call sequences, or the suite breaks on every refactor and gets deleted.</li>
  <li><em>Do not let the agent "fix" what it finds.</em> It will notice that a branch returns the wrong eligibility for retirees and offer to correct it. Record the behaviour first. Whether that branch is a bug or fifteen years of deliberate accommodation is a question for someone in claims operations, not for the model.</li>
  <li><em>Name the counter-intuitive cases explicitly</em> in the test names. Those tests are documentation of the domain, and they are the artifact people will thank you for.</li>
</ul>

<h3>PD-12: EligibilityService</h3>
<p>Four thousand lines, no tests, touched by all three mobs this quarter, understood by nobody currently employed. It computes eligibility from member history, plan rules, employer overrides and three special cases that certainly matter and are certainly undocumented.</p>
<p>It is also, and this is the point, the highest-traffic module in the fixture. Legacy code that nobody touches is not a problem; legacy code that three mobs must touch, without an oracle, is where the validation checkpoint fails first at three mobs. Characterize it before anyone changes it, and prefer characterizing to understanding — you will not understand it, and you do not need to.</p>

<h3>Context scoping when the codebase exceeds any window</h3>
<table>
  <tr><th>Load</th><th>Summarise</th><th>Leave out</th></tr>
  <tr><td>The seam you are changing, its callers, its tests</td><td>Module structure, package roles, the data model</td><td>Everything not reachable from the seam</td></tr>
  <tr><td>The types crossing the seam, in full</td><td>Historical migrations, as a list of dates</td><td>Generated code, vendored libraries, build output</td></tr>
</table>
<p>Then watch for <strong>confabulated structure</strong> — the agent describing code it has not read. Concrete tells, all cheap to check:</p>
<ul>
  <li>It names a method that does not exist, usually one that <em>should</em> exist given the naming convention.</li>
  <li>It describes a hierarchy tidier than reality: three implementations of an interface that has one, or a strategy pattern where there is a switch statement.</li>
  <li>It cites a configuration key or feature flag by a plausible name that is absent from every properties file.</li>
  <li>It summarises behaviour without a single file reference. Requiring file and line per claim is the cheapest available discipline, and it changes output quality immediately.</li>
</ul>
<p>The rule: in brownfield, treat every unreferenced claim as unverified. Not wrong — unverified. Agents are excellent at reading unfamiliar code fast and dangerous at asserting what they have not read, and the difference between those two things is a file reference.</p>

<h3>Strangler fig across mobs</h3>
<div data-viz="mb_strangler_seams"></div>
<p>Strangler fig is old advice; the multi-mob part is not. Two rules:</p>
<ul>
  <li><em>Seams are ownership boundaries.</em> When you cut a seam you are creating a module that needs an owner, so choose seams that match how your mobs are actually composed (M15) rather than the cleanest cut in the code. A perfect seam with no owner becomes the next unowned library.</li>
  <li><em>One seam, one mob, one window.</em> Two mobs strangling the same seam concurrently produces two facades and a merge conflict nobody can resolve, because the conflict is between two designs rather than two diffs. Sequence it in the registry with the seam named as the resource. If you have not reached M14 yet, use <code>registry/UOW_REGISTRY.template.md</code> and record seam, mob and window — M14 is where the discipline behind that file is argued.</li>
</ul>

<h3>The rewrite pitch</h3>
<p>Be direct with the audience for this module, because they are the people who will be asked: the full rewrite is newly tempting because agents make the first 60% look achievable in weeks, and it is no more likely to succeed than it was in 2010. What has changed is that the first demo arrives sooner, which makes the commitment easier to obtain and the failure later and more expensive.</p>
<p>The specific reason it fails has not changed either: the value in <code>EligibilityService</code> is not its code, it is fifteen years of encoded exceptions that nobody can enumerate — and a rewrite must reproduce behaviour it cannot inventory. Characterization is the only tool that turns those exceptions into an inventory, which is why the honest sequence is characterize, then strangle, and why a rewrite proposal that has not characterized anything is a proposal to discover the requirements in production.</p>

<div class="callout honest-limit">
  <div class="k">Honest limit — what characterization cannot do</div>
  <p>A characterization suite pins behaviour, including bugs, and confers no correctness whatsoever. You can pin the wrong eligibility outcome for retirees and then defend it for three years, because every future change that would have fixed it now shows up as a test failure. That is a real cost of this practice, not a hypothetical one, and the mitigation is only partial: mark pinned behaviour you suspect is wrong, and review those marks with someone from operations who remembers 2013.</p>
  <p>Three more limits. <em>Coverage of a 4,000-line service is never complete</em> — you will pin the paths you thought to exercise, and the special case that matters is often the one nobody generated an input for. <em>Brownfield does not deliver greenfield cycle times</em>, and any number you have seen quoted for AI-assisted delivery was almost certainly measured somewhere with tests; expect materially slower, quote it that way, and you will keep your credibility when the second quarter arrives. And <em>some legacy code should be left alone</em>: if a module is stable, low-traffic and nobody needs to change it, characterizing it is a cost with no return. This module is about the modules your mobs must touch, which is a much smaller set than the codebase.</p>
</div>
`,
  lab:{
    title:'Pin it before you touch it',
    pd:['PD-12'],
    a:`
<p><em>Deliverable:</em> a characterization suite over <code>EligibilityService</code> covering its observable behaviour at the seam, including at least two counter-intuitive cases named as such; a small deliberate change with its blast radius visible in test output; and a strangler plan at <code>platform-fixture/records/M11_STRANGLER.md</code> assigning seams to mobs in sequence.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Scope the context before generating anything: load <code>EligibilityService</code>, its callers and the types crossing its public surface. Ask the agent to describe the seam with a file and line for every claim, and check three of them at random. Note anything it invented — you will use those tells for the rest of the course.</li>
  <li>Generate input permutations across the dimensions that plausibly matter: plan type, employment status, dependent status, effective dates spanning a plan-year boundary, and the employer override path. Record outputs as assertions. Target meaningful coverage of observable behaviour rather than a line-coverage number.</li>
  <li>Find at least two behaviours that contradict what a reasonable person would expect. They are in there, and finding them is the real output of this lab. Name the tests so that the surprise is in the test name.</li>
  <li>Now make a small change — a helper extraction, no intended behaviour change — and run the suite. Read what moved. If nothing moved, your suite is not pinning the paths the change touched, and the suite is the thing to fix.</li>
  <li>Identify one seam worth strangling. Write the plan: the facade, which mob owns the extracted module afterwards, the sequence relative to the other mobs' in-flight work, and what the registry entry says.</li>
</ol>
<h4>Graded moment</h4>
<p>Two failures, and the second is the expensive one. First, the agent will offer to fix the surprising behaviours it finds. Decline in writing — record them as pinned-and-suspect, and note who would have to be asked. Second, asked to characterize the service, it will produce tests against internal private methods it has reflected into, or against a refactored version of the code it proposes in the same breath. Both make the suite worthless for its actual purpose, which is to survive a refactor unchanged. Every assertion must go through the public seam.</p>
<h4>Gate</h4>
<p>Suite is green against unmodified trunk; at least two counter-intuitive behaviours pinned and named; the deliberate change produces visible, explainable movement in test output; the strangler plan names one seam, one owning mob, and a sequence that does not collide with another mob's in-flight unit of work.</p>`,
    b:`
<p><em>Deliverable:</em> identical — a seam-level characterization suite with two named counter-intuitive cases, a change whose blast radius is visible in test output, and a sequenced strangler plan. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Open <code>EligibilityService</code>, its callers and the types at its surface. Because context here is assembled from open files, what you open <em>is</em> your scoping decision — make it deliberately and write down what you left closed.</li>
  <li>Ask for the input dimensions first, as a list, before any test code. Then generate tests dimension by dimension; asked for a whole suite in one request this path produces broad shallow coverage that misses the override path entirely.</li>
  <li>Run continuously as you go and keep every assertion at the public seam. Reject any generated test that reaches a private method through reflection.</li>
  <li>Find and name two counter-intuitive behaviours. Record them as pinned-and-suspect rather than fixing them.</li>
  <li>Make the small refactor, observe what moves, and write the strangler plan with owner and sequence.</li>
</ol>
<h4>Graded moment</h4>
<p>Same two failures, plus the confabulation tell that this path produces most often: asked how the employer override works, the assistant will describe a configuration-driven mechanism with a plausible property key, because that is what such code usually looks like. The key does not exist in this codebase. Demand a file and line for the claim, and treat the absence of one as an answer in itself.</p>
<h4>Gate</h4>
<p>Identical to Path A: green suite against unmodified trunk, two named surprises pinned, blast radius of a deliberate change visible and explained, strangler plan with a single owning mob and a non-colliding sequence.</p>`
  }
}
