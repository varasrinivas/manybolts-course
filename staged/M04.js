{
  id:'M04',
  title:'The validation bottleneck under load',
  track:1,
  audience:['leader','practitioner'],
  contentionClass:['validator'],
  duration:'45 min · 40 min lab',
  visuals:['mb_queue_curve','mb_tier_ladder','mb_sme_load'],
  mount(host){
    const arr = host.querySelector('[data-mb="q-arr"]');
    const cap = host.querySelector('[data-mb="q-cap"]');
    if (!arr || !cap) return;
    const dot = host.querySelector('[data-mb="q-dot"]');
    const outA = host.querySelector('[data-mb="q-arr-out"]');
    const outC = host.querySelector('[data-mb="q-cap-out"]');
    const read = host.querySelector('[data-mb="q-read"]');
    const SERVICE = 0.75;
    const upd = function(){
      const a = Number(arr.value), c = Number(cap.value);
      const rho = Math.min(0.985, (a * SERVICE) / c);
      const x = 70 + rho * 560;
      const wq = SERVICE * rho / (1 - rho);
      const y = 200 - Math.min(178, (wq / 18) * 178);
      if (dot){ dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1)); }
      if (outA) outA.textContent = a + ' bolts/week';
      if (outC) outC.textContent = c + ' review hours/week';
      if (read){
        const u = Math.round(rho * 100);
        const txt = rho >= 0.98 ? 'utilisation ' + u + '% — queue grows without bound; bolts age until someone escalates'
          : 'utilisation ' + u + '% — expected wait ' + wq.toFixed(1) + ' h per bolt (' + (wq / SERVICE).toFixed(1) + ' review-lengths of pure waiting)';
        read.textContent = txt;
      }
    };
    arr.addEventListener('input', upd);
    cap.addEventListener('input', upd);
    upd();
  },
  body:`
<p>This is the keystone module. If you take one thing from the course, take this: the <strong>validation bottleneck</strong> is a shared resource, and the moment a second mob touches the same codebase, the method stops being a workflow question and becomes a capacity question.</p>

<h3>The gap that opened</h3>
<p>Agents changed one side of a two-sided system. Generation capacity per engineer rose; the capacity to decide whether generated code is correct and safe did not move at all, because it is bounded by the number of people who are allowed to make that decision.</p>
<p>Be careful how you quantify this in public. The published evidence is genuinely mixed: the 2025 DORA report describes throughput gains arriving together with stability regressions where review practice did not change, and METR's randomised trial of experienced developers working in their own repositories found tasks took longer with AI assistance while the developers believed they had been faster. What is not in dispute, and what you can measure on your own platform this month, is that <strong>generated diff volume per engineer went up and the number of people qualified to approve a clinical change did not</strong>.</p>
<p>That is the <strong>generation–validation throughput gap</strong>, and at one mob it is invisible: one mob cannot generate enough to saturate one reviewer.</p>

<h3>What utilisation does to queue time</h3>
<p>Move the sliders. Arrival rate is bolts per week needing clinical validation; capacity is the SME hours actually available for review — not their contracted hours, the hours left after nurse escalations and the Thursday board.</p>

<div data-viz="mb_queue_curve"></div>

<p>The shape is the point. Nothing dramatic happens between 40% and 70% utilisation, which is why pilots feel fine. Past roughly 80% the curve turns and each additional bolt costs the whole queue. Two consequences worth stating to leadership plainly:</p>
<ul>
  <li>A validator you have loaded to 95% is not "nearly at capacity". They are the reason cycle time tripled.</li>
  <li>Adding a mob adds arrivals. If validation capacity is unchanged, you have not added throughput — you have added <strong>queue time</strong>, which then gets reported as a tooling failure.</li>
</ul>

<h3>Where the week actually goes</h3>
<div data-viz="mb_sme_load"></div>
<p>The fixture's clinical SME is 0.6 FTE, which everyone rounds to "available". Of 24 nominal hours, 9 go to nurse escalations that cannot be deferred, 3 to the Thursday board, 4 to meetings and context switching. Roughly <em>8 hours a week</em> remain for validating code — about ten bolts at 45 minutes each, if none of them require a second pass. Three mobs at four bolts a week each generate twelve.</p>
<p>Read that as the <em>untiered</em> platform, because that is what most platforms are: every change goes to the person who is allowed to approve anything. Twelve arrivals against ten slots is not a small overshoot — it is utilisation above 100%, the runaway end of the curve above, and it is why the queue grows rather than settles. The arithmetic was never going to work, and no amount of prompt engineering changes it.</p>
<p>Hold on to those two numbers. The next section cuts the arrivals instead of raising the capacity, and the gap between twelve arrivals and what actually needs a clinician is the whole of Track 1.</p>

<h3>The delegation ladder</h3>
<p>The first correct response is not to add validators. It is to stop sending everything to the scarcest one. Classify by <strong>blast-radius tier</strong> — what breaks, and who is harmed, if this change is wrong.</p>

<div data-viz="mb_tier_ladder"></div>

<p>The share in that last column is what turns the arithmetic around. Twelve bolts a week at 13% Tier 3 is 1.6 changes needing a clinician — 1.2 hours against the 8 the SME has. <strong>Tiering alone takes this platform from 150% validator utilisation to about 15%.</strong> Which raises the obvious question, and it is the right one to be sceptical about: if it is that easy, why is anyone stuck? Three reasons, and you will meet all three. Tiering is a judgement call that goes wrong in the direction of PD-2 below. Tier 3 work grows as clinical surface grows, so the 13% is not a constant. And a mob that cannot get a Tier 2 review will escalate to Tier 3 to get an answer at all, which quietly refills the queue you just emptied.</p>

<table>
  <tr><th>Tier</th><th>Scope</th><th>Validator</th><th>Fixture examples</th></tr>
  <tr><td>0</td><td>Cosmetic, test-only, docs, formatting</td><td>Agent plus author</td><td>Nurse queue column widths; test naming</td></tr>
  <tr><td>1</td><td>Service-internal logic, no external contract</td><td>Peer inside the mob</td><td>Appeals' internal state machine helper</td></tr>
  <tr><td>2</td><td>Published contract, cross-team surface, shared aggregate</td><td>Owning mob's designated validator</td><td>The determination response payload; a component library change</td></tr>
  <tr><td>3</td><td>Clinical rule, threshold constant, PHI path, audit surface</td><td>Clinical SME and compliance. <em>No delegation.</em></td><td>Anything reading AUTO_APPROVE_THRESHOLD; criteria evaluation; audit writes</td></tr>
</table>

<div class="callout">
  <div class="k">You have already built this ladder once</div>
  <p style="margin:0">This is <code>AUTO_APPROVE_THRESHOLD</code> applied to code review. Your platform already routes clinical decisions to a scarce expert only when confidence is below a threshold and the consequence of being wrong is material; everything above the line is decided automatically and audited afterwards. Tiering review is the same mechanism with the same failure mode — set the threshold wrong and you either drown the expert or ship something you should not have. When you explain tiering to a risk officer, use their own auto-approval rule as the analogy. It moves the conversation faster than any argument about agents.</p>
</div>

<h3>PD-2: the tier that looks one level lower than it is</h3>
<p><code>ClinicalCriteriaEvaluator</code> in <code>priorauth-clinical-rules</code> reads like service-internal logic. It has no PHI in its signature, no audit call, and its tests look like unit tests over plain data. It is Tier 3: it decides whether a member's procedure is clinically indicated, and a wrong change to it produces wrong determinations that nobody detects, because the output is plausible.</p>
<p>An agent asked to tier the repositories will put it at Tier 1 with a confident justification, and a reviewer skimming the table will accept it. This is the single most expensive mistake in the tiering exercise, and it is planted deliberately in the lab below. <em>Tier by what code decides, never by what it imports.</em></p>

<h3>Five responses, in the order most platforms should try them</h3>
<table>
  <tr><th>Response</th><th>What it buys</th><th>What it costs</th></tr>
  <tr><td>1. Tier by blast radius</td><td>On this platform 87% of changes leave the scarce queue immediately — twelve weekly arrivals become about 1.6, or 1.2 hours against 8 available. Plan on 60–75% until you have measured your own</td><td>Real judgement, and the risk of the PD-2 mistake at scale</td></tr>
  <tr><td>2. Reduce arrival rate</td><td>Fewer, larger validated units instead of many small ones</td><td>Bigger diffs, later feedback, worse rollback granularity</td></tr>
  <tr><td>3. Asynchronous review with a stated SLA</td><td>Predictability; mobs can plan around a 24-hour promise</td><td><strong>Review SLA</strong> only helps if you measure the actual against it</td></tr>
  <tr><td>4. Add validators</td><td>Linear capacity increase</td><td>Linear cost, months of ramp, and clinical validators may simply not exist to hire</td></tr>
  <tr><td>5. Make the validation unnecessary</td><td>Non-linear: one encoded rule consumes zero validator time per bolt, forever</td><td>Up-front SME time, and it only works for rules that can be encoded</td></tr>
</table>
<p>Responses 1 through 4 are all variations on managing a queue. The fifth changes the arithmetic, and it is the one this course argues for: <strong>capacity multiplier</strong> work, where an hour of SME time spent encoding a rule replaces an hour of review on every future bolt rather than one. That is M05, and it is the treatment for the diagnosis you have just read.</p>
`,
  lab:{
    title:'Tier the platform, then find the mistier',
    pd:['PD-2'],
    a:`
<p><em>Deliverable:</em> <code>platform-fixture/governance/VALIDATION_TIERS.md</code> covering every package in all three repositories, plus a generated <code>.github/CODEOWNERS</code> per repo, plus a one-paragraph note on what the tiering does to the SME's weekly load using this module's arithmetic.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Open <code>records/M03_CONTENTION.md</code>. Its validator-contention rows are the packages most likely to be Tier 3, and its ranking is the order to audit in. Then run <code>/tier-repo</code>: it produces a first-draft tier per package with evidence and a confidence rating. Treat that as a draft written by someone competent who has never been sued.</li>
  <li>Audit every Tier 0 and Tier 1 row. For each, ask one question: if this were wrong for three weeks, who would be harmed and how would we find out? Anything whose answer is "a member, and we would not" is Tier 3 regardless of what it imports.</li>
  <li>Find <em>PD-2</em>. <code>ClinicalCriteriaEvaluator</code> will be proposed as Tier 1. Correct it, and write the evidence line that makes the correction obvious to the next reader.</li>
  <li>Handle the unowned library honestly: its Tier 3 packages have no accountable validator. Record that as an open risk rather than inventing an owner — M05 assigns one.</li>
  <li>Compute the load change: count expected weekly bolts per tier and compare Tier 3 hours against the 8 hours the SME actually has.</li>
</ol>
<h4>Graded moment</h4>
<p>Two failures are expected and both are graded. First, the agent under-tiers clinical logic that lacks obvious clinical vocabulary — PD-2 is the planted instance, and there is at least one more in the criteria package. Second, when you tell it the SME is overloaded, it will propose moving Tier 3 items to Tier 2 to fit the budget. That is not tiering, it is wishful thinking with a table. The correct move when Tier 3 exceeds capacity is to reduce Tier 3 arrivals or encode the rule, never to relabel the risk.</p>
<h4>Gate</h4>
<p>Every package tiered with evidence; PD-2 corrected with a written justification; no Tier 3 item downgraded to fit capacity; CODEOWNERS generated and the unowned library recorded as an open risk; the load note states the gap in hours.</p>`,
    b:`
<p><em>Deliverable:</em> identical — <code>platform-fixture/governance/VALIDATION_TIERS.md</code>, generated CODEOWNERS files, and the SME load note. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>There is no packaged tiering command here, so build the draft in three passes: ask for a package inventory per repository, then for evidence per package (PHI fields, threshold reads, audit writes, published contracts), then for a proposed tier given that evidence. Keeping the evidence pass separate is what stops the assistant tiering by package name.</li>
  <li>Paste the four-tier definition from this module into the workspace as <code>governance/TIERS.md</code> first and reference it explicitly; without it, Copilot will invent its own scale and label things "medium".</li>
  <li>Audit every Tier 0 and Tier 1 row with the harm question. Find <em>PD-2</em> in <code>ClinicalCriteriaEvaluator</code> and correct it with evidence.</li>
  <li>Generate CODEOWNERS per repository, and record the unowned shared library as an open risk rather than assigning it.</li>
  <li>Compute the Tier 3 load against 8 available hours.</li>
</ol>
<h4>Graded moment</h4>
<p>Same two failures, plus one specific to this path: asked to tier a package it has not opened, Copilot will tier it from the folder name and sound certain. Any row whose evidence column paraphrases the package name is not evidence — reject it and make it read the code.</p>
<h4>Gate</h4>
<p>Identical to Path A: full tiering with evidence, PD-2 corrected, no risk relabelled to fit capacity, CODEOWNERS generated, unowned library flagged, load gap stated in hours.</p>`
  }
}
