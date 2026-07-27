{
  id:'M05',
  title:'Platform teams as validator-capacity multipliers',
  track:1,
  audience:['leader','practitioner'],
  contentionClass:['validator'],
  duration:'45 min · 40 min lab',
  visuals:['mb_capacity_math','mb_golden_path','mb_ownership_models','mb_platform_bottleneck'],
  mount(host){
    const enc = host.querySelector('[data-mb="c-enc"]');
    const mob = host.querySelector('[data-mb="c-mob"]');
    const reu = host.querySelector('[data-mb="c-reu"]');
    if (!enc || !mob || !reu) return;
    const lineR = host.querySelector('[data-mb="c-review"]');
    const lineE = host.querySelector('[data-mb="c-encode"]');
    const mark = host.querySelector('[data-mb="c-mark"]');
    const read = host.querySelector('[data-mb="c-read"]');
    const outs = {
      enc: host.querySelector('[data-mb="c-enc-out"]'),
      mob: host.querySelector('[data-mb="c-mob-out"]'),
      reu: host.querySelector('[data-mb="c-reu-out"]')
    };
    const X0 = 70, X1 = 650, Y0 = 196, YMAX = 60, WEEKS = 12;
    const px = function(w){ return X0 + (w / WEEKS) * (X1 - X0); };
    const py = function(h){ return Y0 - Math.min(1, h / YMAX) * (Y0 - 24); };
    const upd = function(){
      const E = Number(enc.value), M = Number(mob.value), R = Number(reu.value) / 100;
      const weekly = M * 4 * R * 0.75;
      const upkeep = E * 0.025;
      let dR = '', dE = '';
      for (let w = 0; w <= WEEKS; w++){
        dR += (w ? 'L' : 'M') + px(w).toFixed(1) + ' ' + py(weekly * w).toFixed(1) + ' ';
        dE += (w ? 'L' : 'M') + px(w).toFixed(1) + ' ' + py(E + upkeep * w).toFixed(1) + ' ';
      }
      if (lineR) lineR.setAttribute('d', dR);
      if (lineE) lineE.setAttribute('d', dE);
      const net = weekly - upkeep;
      const be = net > 0 ? E / net : Infinity;
      if (mark){
        const on = be <= WEEKS;
        mark.setAttribute('opacity', on ? '1' : '0');
        if (on){ mark.setAttribute('cx', px(be).toFixed(1)); mark.setAttribute('cy', py(weekly * be).toFixed(1)); }
      }
      if (outs.enc) outs.enc.textContent = E + ' SME hours to encode';
      if (outs.mob) outs.mob.textContent = M + (M === 1 ? ' mob' : ' mobs');
      if (outs.reu) outs.reu.textContent = Number(reu.value) + '% of bolts touch the rule';
      if (read){
        read.textContent = net <= 0 ? 'no break-even — upkeep costs more than the review it saves; leave this one at Tier 3'
          : be <= WEEKS ? 'break-even at week ' + be.toFixed(1) + ' · saves ' + (weekly - upkeep).toFixed(1) + ' SME hours every week after that'
          : 'break-even at week ' + be.toFixed(1) + ' — beyond a quarter, so encode only if the rule will outlive the mobs';
      }
    };
    [enc, mob, reu].forEach(function(el){ el.addEventListener('input', upd); });
    upd();
  },
  body:`
<p>M04 was the diagnosis. This is the treatment, and it is the one response that changes the arithmetic instead of managing it.</p>

<h3>The fifth response: make the validation unnecessary</h3>
<p>Four of M04's responses manage a queue: tier it, slow the arrivals, promise a turnaround, hire another server. All four leave the underlying relationship intact — each bolt still consumes some scarce human attention, so cost scales with bolt count forever.</p>
<p>The fifth breaks that relationship. A rule expressed as a constraint the agent must satisfy — a fitness test, a scaffold default, a steering invariant with a check behind it — consumes SME time <em>once</em> and then costs nothing per bolt. That is what a <strong>capacity multiplier</strong> is: not a faster reviewer, but a rule that no longer needs reviewing.</p>
<p>This is the honest justification for a platform team in an AI-DLC estate, and it is a different justification from the usual one. The platform team is not there to build shared tooling. It is there to convert scarce human judgement into mechanical checks, and its output is measured in validator hours returned per quarter.</p>

<h3>The economics, worked</h3>
<p>The argument has to be numeric or it is just a preference. Encoding a rule costs SME hours up front and a small upkeep. Reviewing against it costs a fraction of an SME hour per bolt, every bolt, forever. Move the sliders to find where the crossover sits on your platform.</p>

<div data-viz="mb_capacity_math"></div>

<p>Three readings worth taking from that model:</p>
<ul>
  <li><em>At one mob, encoding rarely pays inside a quarter.</em> This is why pilots do not build golden paths, and why the pilot team's advice does not transfer. Their arithmetic genuinely said no.</li>
  <li><em>At five mobs, most encodable rules break even inside two weeks.</em> The same rule, the same cost, five times the reuse.</li>
  <li><em>Reuse dominates.</em> A rule that applies to 20% of bolts is usually not worth encoding; one that applies to 80% almost always is. Ask what fraction of bolts touch the rule before you argue about the hours.</li>
</ul>
<p>That is the <strong>encode-vs-review break-even</strong>, and it is the sentence to take into a staffing conversation: <em>at our mob count, an SME hour spent encoding returns four to six review hours per quarter; an SME hour spent reviewing returns nothing next quarter.</em></p>

<h3>Golden paths are scaffolds, not wiki pages</h3>
<p>A <strong>golden path</strong> is not documentation that describes the right way. It is a generated starting point where the invariants are already satisfied, so no mob can forget what was never optional.</p>

<div data-viz="mb_golden_path"></div>

<p>Concretely, in this platform: a new endpoint that touches member data is scaffolded with the <code>@PhiBoundary</code> annotation present, the audit write wired, the PHI-logging fitness test committed, and the criteria call routed through the shared evaluator rather than reimplemented. A mob starts from a change that already passes the four checks a clinical reviewer would have asked about. What remains for the SME is the part that is actually clinical judgement.</p>
<pre><code>platform/scaffolds/phi-endpoint/
  Controller.java.tmpl        # @PhiBoundary present, not optional
  AuditWrite.java.tmpl        # audit record written before response
  PhiLoggingFitnessTest.java  # fails if a member identifier reaches a log
  README.md                   # what you may change, and what you may not</code></pre>
<p>The test is the load-bearing file. A scaffold without an executable check is a template, and templates decay the first time someone is in a hurry.</p>

<h3>PD-8: the library nobody owns</h3>
<p><code>priorauth-clinical-rules</code> is consumed by three mobs and owned by none. Every change to it is clinically material, so every change needs the SME; no mob has clinical capacity of its own; changes queue behind whichever mob happened to need one first. Meanwhile its design drifts, because three mobs' idioms have been layered on it without an editor.</p>

<div data-viz="mb_ownership_models"></div>

<table>
  <tr><th>Model</th><th>How it works</th><th>Honest cost</th></tr>
  <tr><td>Owning mob</td><td>One mob takes the library into its charter and reviews all changes to it</td><td>That mob becomes a service desk for the other two, and its own roadmap slips. Works only if the library is mostly theirs.</td></tr>
  <tr><td>Platform team owns it</td><td>The platform team maintains and reviews the library</td><td>Recreates the SME queue one layer down unless the platform team owns constraints rather than changes. See the anti-pattern below.</td></tr>
  <tr><td>Inner-source with designated maintainers</td><td>Any mob may change it; two named maintainers review; the criteria tests are the contract</td><td>Requires real maintainer time — 4 to 6 hours a week that someone must actually have — and it fails silently when maintainers are also the busiest engineers.</td></tr>
</table>
<p>For this platform the defensible answer is inner-source with designated maintainers, one of whom is the clinical SME, <em>plus</em> a hard requirement that criteria changes come with a criteria test. That combination is what makes most changes reviewable by a non-clinician: the clinical question becomes "is this test right?", which is a question the SME can answer in minutes rather than reading a diff.</p>

<h3>When the platform team becomes the new bottleneck</h3>
<div data-viz="mb_platform_bottleneck"></div>
<p>The failure is easy to diagnose and hard to admit: mobs are waiting on platform. It happens when the platform team starts reviewing changes instead of encoding rules, usually for good reasons — they know the system best, and the first few reviews are genuinely faster.</p>
<blockquote>The rule that prevents it: <em>platform owns constraints and scaffolds, never the change itself.</em> A platform team that reviews changes has recreated the SME queue with extra steps and a worse claim to authority.</blockquote>
<p>The measurable version: if platform review appears in the critical path of more than one mob's bolts, the platform team is a validator, not a multiplier. Track it the same way you track SME queue time — that number is what tells you before the mobs do.</p>

<h3>Staffing this honestly</h3>
<p>What it costs, in the fixture's terms: two engineers and a fraction of the SME, for one quarter, to produce the tier definitions, two scaffolds, the fitness function suite, and the merge queue. That is not free and it is not a rounding error on a five-mob programme.</p>
<p>One observation from every rollout that worked: <em>the first platform hire is usually the SME who was drowning.</em> Not a new person — the existing bottleneck, moved from reviewing to encoding, with their review load explicitly reduced to make room. If you cannot free them, you have not funded the platform team; you have added a job title to someone who is already the constraint.</p>

<div class="callout honest-limit">
  <div class="k">Honest limit — where this stops working</div>
  <p>Encoding only reaches rules you can state. A constraint is an executable sentence, and the moment a rule needs the words "depends on the clinical picture", there is nothing to execute. In the fixture, roughly a third of the SME's recurring review comments are genuinely unencodable — not because nobody tried, but because the judgement is the work. Those stay at Tier 3 permanently, and a platform team that tries to encode them ships constraints that are subtly wrong and now trusted, which is worse than the queue.</p>
  <p>Three further limits, stated plainly. <em>The break-even model assumes reuse holds</em> — rules decay as the domain changes, and a rule encoded for a criteria set that gets replaced next quarter was a loss. <em>Constraints catch only what you thought of</em>, so encoding shifts risk from "reviewed badly" to "never considered", which is harder to notice and does not appear in any queue metric. And <em>the platform team's own capacity is finite</em>: it has a utilisation curve exactly like the SME's, and at high utilisation it produces the same non-linear queue this module claims to solve. Encoding raises the ceiling. It does not remove it.</p>
</div>
`,
  lab:{
    title:'Encode the SME out of the loop',
    pd:['PD-8'],
    a:`
<p><em>Deliverable:</em> two encoded constraints landed in the fixture, one written rationale for the comment you did <em>not</em> encode, and a CODEOWNERS entry for <code>priorauth-clinical-rules</code> with a maintainer model stated in <code>governance/OWNERSHIP.md</code>.</p>
<p>Supplied: three review comments the clinical SME has made repeatedly across past bolts, in <code>platform-fixture/governance/sme-comments.md</code>.</p>
<ol>
  <li><em>"Any endpoint returning a determination must include the criteria version that produced it."</em></li>
  <li><em>"Member identifiers must never appear in logs, including in exception messages."</em></li>
  <li><em>"If the member has an active appeal and a new request for the same procedure, use clinical judgement about whether this is a duplicate or a change in condition."</em></li>
</ol>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>For each comment, decide the mechanism before writing anything: fitness test, scaffold default, or steering invariant. Write the decision and the reason in <code>governance/OWNERSHIP.md</code>. The mechanism matters — a steering line with no check behind it is a wish.</li>
  <li>Encode comment 1 as an executable check across both consumers, not just the api. Prove it fails before it passes.</li>
  <li>Encode comment 2 as a fitness test that scans generated log statements and exception paths. Then reintroduce a violation deliberately and confirm the test catches it.</li>
  <li>Comment 3 is the graded one. Read it again before you let the agent near it.</li>
  <li>Assign ownership for the shared library (<em>PD-8</em>): pick a model from this module, write the CODEOWNERS entry, and state the maintainer hours the model requires. An ownership model with no hours attached is an announcement, not a decision.</li>
  <li>Compute the return: SME hours spent encoding versus review hours saved per quarter at three mobs, using this module's model.</li>
</ol>
<h4>Graded moment</h4>
<p>The agent will encode all three. For comment 3 it will produce something confident — a duplicate-detection heuristic with a time window, probably 30 days, possibly with a similarity score. It will pass its own tests. It is wrong, and it is the most dangerous artifact in this lab, because a wrong clinical rule that is now mechanical will be trusted by every future bolt and reviewed by nobody. Identify comment 3 as unencodable judgement, leave it at Tier 3, and write the one-paragraph rationale. If you shipped a heuristic here, you failed the lab in the way this module exists to prevent.</p>
<h4>Gate</h4>
<p>Two constraints executable and demonstrably failing on a reintroduced violation; comment 3 left at Tier 3 with a written rationale; <code>priorauth-clinical-rules</code> has an owner, a model, and stated maintainer hours; the return calculation is present with its assumptions visible.</p>`,
    b:`
<p><em>Deliverable:</em> identical — two encoded constraints, one written rationale for the unencodable comment, and a CODEOWNERS entry plus <code>governance/OWNERSHIP.md</code> for the shared library. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Open the three comments in the editor beside the code they refer to. Decide the mechanism for each yourself first and write it down; Copilot will otherwise default to generating a test for everything, including the one that must not have a test.</li>
  <li>Encode comment 1 as a check that runs in both repositories. In a multi-root workspace, generate the api check first, then explicitly ask for the web equivalent — it will not volunteer the second consumer.</li>
  <li>Encode comment 2 as a fitness test over log and exception paths. Reintroduce a violation and confirm the failure.</li>
  <li>Comment 3: ask Copilot to state, in one sentence, the rule it would encode. Read that sentence. This path makes the trap unusually visible because the generated heuristic arrives with a plausible constant in it — a 30-day window nobody clinical has ever agreed to.</li>
  <li>Write the CODEOWNERS entry and the ownership model with maintainer hours (<em>PD-8</em>).</li>
  <li>Compute the encode-versus-review return at three mobs.</li>
</ol>
<h4>Graded moment</h4>
<p>Identical trap: comment 3 must not be encoded. The correct artifact is a rationale explaining why a clinical judgement about duplicate versus changed condition cannot be a constraint, and what stays at Tier 3 as a result.</p>
<h4>Gate</h4>
<p>Identical to Path A: two working constraints proven against a reintroduced violation, comment 3 left as human judgement with a rationale, shared library owned with hours attached, and the return calculation visible.</p>`
  }
}
