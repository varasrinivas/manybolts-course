{
  id:'M02',
  title:'The Prior Auth platform: three services, five mobs, one trunk',
  track:0,
  audience:['leader','practitioner'],
  contentionClass:['code'],
  duration:'30 min · 20 min lab',
  visuals:['mb_domain_flow','mb_repo_topology','mb_mob_charters'],
  body:`
<p>Every example in this course is drawn from one platform. Learn it once here and the later modules can be short.</p>

<h3>Prior authorisation in five minutes</h3>
<p>A provider wants to perform a procedure. Before the payer agrees to pay, someone has to decide whether it meets clinical criteria. That decision is a <strong>prior authorisation</strong>, and the discipline around it is utilisation management: approve what is indicated, review what is not obviously indicated, and be able to explain either afterwards.</p>
<p>MeridianCare runs that decision as software. An <code>AuthRequest</code> arrives with a <code>Member</code>, a <code>Provider</code>, and a procedure code. The service evaluates it against <code>ClinicalCriteria</code> and produces a confidence score. Above <code>AUTO_APPROVE_THRESHOLD = 0.85</code> it issues a <code>Determination</code> automatically. Below it, the request lands in the <strong>nurse review queue</strong>, where a clinician decides.</p>

<div data-viz="mb_domain_flow"></div>

<p>Two facts about that queue matter for the rest of the course, and both are numbers you should hold on to:</p>
<table>
  <tr><th>Fact</th><th>Value in the fixture</th><th>Why it matters here</th></tr>
  <tr><td>Median nurse review time</td><td>11 minutes per request</td><td>Queue capacity is a headcount decision, not a software one.</td></tr>
  <tr><td>Requests routed to review</td><td>31% of volume</td><td>Moving the threshold moves clinical risk, not just throughput.</td></tr>
  <tr><td>Regulatory turnaround for a standard request</td><td>14 calendar days</td><td>The queue has a hard deadline attached to it.</td></tr>
</table>
<p>Notice the shape of that queue: many items, one class of scarce expert, a deadline. Hold it in mind, because in M04 the same shape appears one level up — the mobs are the requests and the clinical SME is the nurse. <code>AUTO_APPROVE_THRESHOLD</code> is not just domain trivia. It is a working example of routing work to a human only above a risk threshold, which is exactly the mechanism M04 applies to code review.</p>

<h3>Three repositories, and one of them is a problem</h3>
<div data-viz="mb_repo_topology"></div>
<table>
  <tr><th>Repo</th><th>Contains</th><th>Owns</th></tr>
  <tr><td><code>priorauth-api</code></td><td>Spring Boot service, <code>DeterminationService</code>, <code>EligibilityService</code>, Flyway migrations, audit writes</td><td><code>Determination</code> and <code>AuthStatus</code>. The only writer.</td></tr>
  <tr><td><code>priorauth-web</code></td><td>React provider portal, nurse queue UI, shared component library, design tokens</td><td>The rendering of a determination and its reasons.</td></tr>
  <tr><td><code>priorauth-clinical-rules</code></td><td>Criteria evaluation, <code>ClinicalCriteriaEvaluator</code>, the threshold constant, versioned and published as a jar</td><td><em>Nothing. Nobody.</em> No entry in CODEOWNERS.</td></tr>
</table>
<p>That third row is the course's central discomfort and it is worth sitting with rather than solving now. The library is consumed by both services. Every change to it is clinically material. No mob has clinical capacity of its own, and no mob is accountable for its design. In production right now, the two consumers are pinned to different versions of it — <code>web</code> to 2.3, <code>api</code> to 2.7 — which nobody chose and nobody is tracking.</p>
<p>M05 assigns it an owner. M09 shows what that version gap silently destroys. M15 explains why an unowned module ends up with the design it has. Until then, it stays uncomfortable.</p>
<p>One expectation to set now, from play-testing the fixture: this will not hurt you soon. For the first fortnight the unowned library and the version gap produce no failing test, no red build and no alarm of any kind. That is the property that makes them dangerous rather than annoying, and it is why the practices that catch them — a contract test in the provider's pipeline, a version-drift report, an owner with hours attached — have to be built before there is any evidence you need them.</p>

<h3>Five mobs, one trunk</h3>
<div data-viz="mb_mob_charters"></div>
<p>Three mobs have bolts in flight and appear in almost every lab. Two exist to make the platform realistic — a fourth arrives mid-quarter in M19, and the fifth is the one whose work you keep deferring.</p>
<p>Every pair of active mobs collides, deliberately: Appeals and Gate both write <code>AuthStatus</code> transitions; Gate and Portal both decide how a denial reason is worded; Portal and Appeals both add surfaces to the same queue screen. Pairwise collision is instructive. The three-way collision is the capstone.</p>

<h3>The constraints that do not move</h3>
<table>
  <tr><th>Constraint</th><th>Detail</th><th>Contention class</th></tr>
  <tr><td>One clinical SME</td><td>0.6 FTE, shared across all mobs, also the person who answers nurse escalations</td><td>validator</td></tr>
  <tr><td>Change advisory board</td><td>Meets Thursdays. Anything touching a clinical rule needs a slot.</td><td>validator</td></tr>
  <tr><td>One shared UAT environment</td><td>Single dataset, single deploy at a time, restored nightly</td><td>infrastructure</td></tr>
  <tr><td>One CI runner pool</td><td>Full suite is 34 minutes; five mobs share the queue</td><td>infrastructure</td></tr>
  <tr><td>HIPAA and PHI boundaries</td><td>Any path touching member data is audit-relevant and cannot be delegated away</td><td>validator</td></tr>
  <tr><td>One trunk per repo</td><td>No long-lived branches; wide agent diffs land on top of each other</td><td>code</td></tr>
</table>
<p>None of these are unusual, and none of them are what a pilot mob experiences. A pilot gets the SME's attention on demand and an empty CI queue, because there is nobody else in line. That difference — not the method, not the tooling — is what M19 calls the second-team cliff.</p>

<h3>Gate for this module</h3>
<p>You should be able to answer, without looking: which repository owns <code>Determination</code>, which repository owns nothing, and which two things in the constraint table are the same resource wearing different clothes. (The SME and the Thursday board. Both are one scarce clinical decision.)</p>
`,
  lab:{
    title:'Trace one AuthRequest across three repos',
    pd:['PD-8'],
    a:`
<p><strong>Deliverable:</strong> a system map at <code>platform-fixture/records/M02_MAP.md</code> tracing one <code>AuthRequest</code> from submission to determination across all three repositories, naming for each hop: the file, the aggregate touched, the owning mob, and whether the hop is PHI-adjacent. You keep this map and use it in M03, M06 and M09.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Start in <code>priorauth-web</code> at the submission form. Ask the agent to trace the request outward, and make it cite file and line for every hop rather than describing the architecture.</li>
  <li>Cross into <code>priorauth-api</code>. Identify where the confidence score is produced, where <code>AUTO_APPROVE_THRESHOLD</code> is read, and where the audit record is written.</li>
  <li>Cross into <code>priorauth-clinical-rules</code>. Record which version each consumer resolves — check the built dependency tree, not the documentation.</li>
  <li>For each hop, add the owning mob from CODEOWNERS. One hop will not have one.</li>
  <li>Mark PHI-adjacent hops. Anything carrying a member identifier counts, including logging.</li>
</ol>
<h4>Graded moment — PD-8</h4>
<p>When you ask who owns <code>priorauth-clinical-rules</code>, the agent will answer confidently by reading commit history and naming the most frequent committer. That is the failure. Commit frequency is not ownership: the most frequent committer to an unowned library is whoever needed it most recently, which is a symptom of the problem rather than a solution to it. Your map must record the owner as <em>unassigned</em> and list every Tier-3-looking file that therefore has no accountable reviewer.</p>
<h4>Gate</h4>
<p>The map names both consumer versions of the shared library, marks at least three PHI-adjacent hops, and records one hop with no owner — with a sentence on what that implies for review.</p>`,
    b:`
<p><strong>Deliverable:</strong> identical — the same system map at <code>platform-fixture/records/M02_MAP.md</code>, same four columns per hop, same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Open all three repositories in one multi-root workspace. This matters: with separate windows, the assistant cannot follow the hop across the repo boundary at all, which is a preview of M09.</li>
  <li>Use workspace search first to find the submission handler, then ask Copilot Chat to explain the call path with file references. Verify each reference by opening it — one will be wrong.</li>
  <li>For the shared library version, run <code>./mvnw dependency:tree</code> and <code>npm ls @meridiancare/clinical-rules</code> yourself. Do not ask the assistant to infer versions from manifests.</li>
  <li>Add owning mob per hop from CODEOWNERS, and mark PHI-adjacent hops.</li>
</ol>
<h4>Graded moment — PD-8</h4>
<p>Same trap, different shape: asked about ownership, Copilot will infer it from directory naming or from the package namespace, which reads as authoritative and is not. The correct entry is <em>unassigned</em>, plus the list of files that consequently have no accountable reviewer.</p>
<h4>Gate</h4>
<p>Identical to Path A: both consumer versions recorded, three or more PHI-adjacent hops marked, one ownerless hop named with its review consequence.</p>`
  }
}
