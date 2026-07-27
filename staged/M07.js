{
  id:'M07',
  title:'Security review at generation volume',
  track:1,
  audience:['practitioner'],
  contentionClass:['validator','code'],
  duration:'35 min · 35 min lab',
  visuals:['mb_dependency_growth','mb_supply_chain_gate','mb_phi_leak'],
  crossCard:`
<p>Agents add dependencies enthusiastically and plausibly. In the fixture, one mob added 9 direct dependencies in a quarter; three mobs added 31, of which 14 brought new transitive packages — roughly 140 more third-party packages owned, with no change in the number of people reviewing them.</p>
<p>Human review does not scale to that and never did it well. A reviewer can judge whether a library call looks right; nobody reads the fourth level of a dependency tree. The planted advisory in this fixture is found by the pipeline in eleven seconds and by no reviewer at all.</p>
<table>
  <tr><th>The ask</th><th>Why this one</th></tr>
  <tr><td>Supply-chain checks in the merge queue, not in review: bill of materials per unit of work, advisory gate, licence gate</td><td>Applies to every mob's every change at three in the morning. The specialist's time moves to setting policy and handling exceptions</td></tr>
  <tr><td>Instrument <strong>security queue depth</strong> as its own number</td><td>Platforms that measure clinical queue time routinely leave this one invisible until an audit finds it</td></tr>
</table>
<p>The regulated-domain specific: agents log helpfully, and a helpful log line containing a member identifier is a reportable disclosure. It changes no behaviour, breaks no test, and reads as diligence in review. That control cannot be vigilance; it has to be a check that runs on every bolt.</p>
<p><em>Read the full module for:</em> where each check sits in the loop, and the two failure modes when an agent is asked to make the gate pass.</p>
`,
  body:`
<p>Security review has the same shape as clinical review: a scarce specialist, a queue, and a volume of changes that has just multiplied. It gets its own module because two of its failure modes are specific to generated code and neither is caught by a human reading a diff.</p>

<h3>Agents add dependencies enthusiastically and plausibly</h3>
<p>Ask for retry logic and you get a retry library. Ask for date arithmetic and you get a date library. Every one is real, popular, well-maintained, and unnecessary — and it arrives with a persuasive one-line justification in the pull request description.</p>

<div data-viz="mb_dependency_growth"></div>

<p>In the fixture, one mob added 9 direct dependencies in a quarter. Three mobs added 31, of which 6 were duplicates in function and 14 were transitively new — meaning the number of third-party packages the platform now owns rose by 140 while the number of people reviewing them stayed at one part-time specialist. That is the <strong>dependency surface</strong>, and it is the part of the estate that grows fastest under AI-DLC.</p>
<p>Human review does not scale here and it never did particularly well. A reviewer can assess whether a library call looks correct. They cannot assess whether a transitive package four levels down has a published advisory, and pretending otherwise is how the queue gets long without getting safer.</p>

<h3>Supply chain as constraint, not gate</h3>
<div data-viz="mb_supply_chain_gate"></div>
<p>Three mechanical checks, placed where they cost nothing per bolt:</p>
<table>
  <tr><th>Check</th><th>Where it runs</th><th>What it must do</th></tr>
  <tr><td><strong>SBOM per bolt</strong></td><td>Generated at build, attached to the unit of work</td><td>Give you the answer to "what did this bolt introduce" without a person reconstructing it later. This is also M16's evidence chain, produced as a by-product.</td></tr>
  <tr><td>CVE gate</td><td>In the merge queue, before landing</td><td>Block on new advisories at or above your agreed severity — including transitive. Blocking at merge rather than at review is the whole point: it applies to every bolt from every mob, at three in the morning.</td></tr>
  <tr><td>Licence check</td><td>Same gate</td><td>Fail on licences your legal team has not accepted. Agents pick libraries by popularity, not by licence compatibility.</td></tr>
</table>
<p>Note where these sit relative to review: the specialist's time goes to deciding policy — which severities block, which licences are acceptable, what the exception process is — not to inspecting individual dependency additions. That is the same conversion M05 described, applied to a different specialist.</p>

<h3>The PHI case is different, and worse</h3>
<p>Agents log helpfully. Asked to make a failure debuggable, an agent produces exactly the log line a good engineer would want, containing exactly the identifiers that make it a reportable breach.</p>

<div data-viz="mb_phi_leak"></div>

<p>Three properties make this the most dangerous generated-code pattern in a regulated system:</p>
<ul>
  <li>It looks like diligence. A reviewer scanning a diff sees good error handling.</li>
  <li>It is invisible in tests. The log line does not change behaviour, so nothing fails.</li>
  <li>It is discovered by a log audit weeks later, at which point the disclosure is historical fact and the conversation is with compliance rather than engineering.</li>
</ul>
<p>The control is not vigilance. It is a fitness function over log and exception paths, plus the <code>@PhiBoundary</code> enforcement from M06 — <strong>PHI-adjacent logging</strong> as a mechanical check, running on every bolt from every mob. Vigilance is what you have instead of a control, and it fails on the Friday of a release week.</p>

<h3>Tiering security review</h3>
<p>The M04 ladder applies with the specialist substituted. Most changes need no security attention at all; a small set needs it absolutely and cannot be delegated:</p>
<table>
  <tr><th>Tier</th><th>Example in this platform</th><th>Who validates</th></tr>
  <tr><td>0–1</td><td>Internal refactor, no new dependency, no data path change</td><td>Mechanical checks only</td></tr>
  <tr><td>2</td><td>New dependency, new outbound call, new public endpoint</td><td>Mob validator, with SBOM diff attached</td></tr>
  <tr><td>3</td><td>Auth, PHI path, audit surface, crypto, anything touching the member record</td><td>Security specialist and compliance. No delegation, same as clinical.</td></tr>
</table>
<p>Then measure <strong>security queue depth</strong> as its own number — it is one of the eight capstone metrics precisely because platforms that instrument clinical queue time often leave this one invisible until an audit finds it.</p>

<h3>PD-10: found by the pipeline, not by a person</h3>
<p>One of the Appeals mob's bolts pulls in a transitive package with a published advisory. It is four levels deep in the tree, introduced by a library the agent chose for an entirely reasonable purpose, and it is not mentioned anywhere in the diff. No reviewer in your organisation would have found it. The pipeline finds it in eleven seconds.</p>
<p>That contrast is the module's argument, and it is worth making to a security team directly: mechanical checks are not a downgrade from expert review. For this class of defect they are strictly better, and the expert's time is better spent on the policy and the exceptions.</p>
`,
  lab:{
    title:'Ship the CVE, then stop it',
    pd:['PD-10'],
    a:`
<p><em>Deliverable:</em> a merge-queue gate that blocks <em>PD-10</em>, a PHI-logging fitness test that catches a reintroduced violation, and <code>governance/SUPPLY_CHAIN.md</code> stating your blocking severity, your licence allow-list, and the exception process with a named approver.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Apply the Appeals bolt: <code>cd repos/priorauth-api &amp;&amp; git apply ../../branches/appeals-r2.patch</code>. Review the diff as you normally would and record your verdict before running any tooling. Most learners approve it, which is the data point.</li>
  <li>Generate an SBOM for the bolt and diff it against <code>pipeline/sbom/sbom-baseline.json</code>. Find the transitive addition. Note how many levels down it is and whether anything in the diff hinted at it.</li>
  <li>Add the CVE gate to the pipeline so it blocks on the advisory, and confirm the block by re-running the same bolt. Then confirm it does not block a clean bolt — a gate that blocks everything teaches mobs to bypass it.</li>
  <li>Add the PHI-logging fitness test over log statements and exception messages. Reintroduce a member identifier in a catch block, watch it fail, remove it.</li>
  <li>Write the policy file. The exception process needs a named role and a stated time box, or it becomes an unlogged habit.</li>
</ol>
<h4>Graded moment</h4>
<p>Two things go wrong here reliably. First, asked to fix the advisory, the agent will bump the direct dependency to a version that does not actually resolve the transitive package, and report success confidently — verify with the resolved tree, not the manifest. Second, asked to make the CVE gate pass, it will offer to add the advisory to an ignore list, phrased as a pragmatic unblock. Both are the same error: treating a green pipeline as the goal rather than the evidence.</p>
<h4>Gate</h4>
<p>The gate blocks the bolt carrying PD-10 and passes a clean bolt; the resolved dependency tree proves the advisory is gone rather than suppressed; the PHI test fails on a reintroduced violation; the policy file names a severity threshold, a licence list, and an approver.</p>`,
    b:`
<p><em>Deliverable:</em> identical — a blocking CVE gate, a working PHI-logging fitness test, and <code>governance/SUPPLY_CHAIN.md</code> with severity, licences and a named approver. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Apply the same Appeals bolt and review it in the Source Control view. Record your verdict before tooling.</li>
  <li>Generate the SBOM from the build rather than asking the assistant to enumerate dependencies — it will list what the manifest declares and miss transitive additions entirely, which is the failure this lab is about.</li>
  <li>Add the CVE gate as a workflow step. Ask Copilot for the workflow YAML, then verify the failure threshold yourself; generated pipeline configuration frequently sets a severity that lets the planted advisory through.</li>
  <li>Add the PHI-logging fitness test, reintroduce a violation, confirm the failure.</li>
  <li>Write the policy file with severity, licences, exception process and approver.</li>
</ol>
<h4>Graded moment</h4>
<p>Same two failures, plus a path-specific one: asked whether the advisory is resolved, Copilot will answer from the manifest it can see. The only acceptable evidence is the resolved tree from the build tool. Any claim about transitive dependencies that is not backed by build output is a guess wearing a citation.</p>
<h4>Gate</h4>
<p>Identical to Path A: blocks the PD-10 bolt, passes a clean one, resolved tree proves removal rather than suppression, PHI test catches a reintroduced violation, policy file complete with an approver.</p>`
  }
}
