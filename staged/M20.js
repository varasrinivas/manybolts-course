{
  id:'M20',
  title:'Making the case: risk, compliance, and the executive ask',
  track:5,
  audience:['leader'],
  contentionClass:['validator'],
  duration:'40 min · 30 min lab',
  visuals:['mb_control_chain','mb_evidence_ladder','mb_cost_ratio'],
  crossCard:`
<p>This is the argument being made about your work in rooms you are not in, so it is worth knowing what a defensible version sounds like — and supplying the parts only you have.</p>
<p>The strong form is legitimate: tiering, executable constraints, supply-chain gates and provenance are <strong>mechanical vs cultural control</strong>s. A cultural control degrades quietly under deadline pressure and leaves no record; a mechanical one runs or fails visibly. That is a real improvement in control quality and it is the sentence that opens the risk conversation.</p>
<p>Then the limits, which is where you are needed:</p>
<ul>
  <li><em>Constraints catch what someone thought to encode.</em> The residual risk is the novel failure, and it is not small — it is different from the risk you had before.</li>
  <li><em>A mechanical control can be disabled</em> with one ignore annotation, one suppressed advisory, one quarantined test. If nobody audits who may disable a check, the claim is weaker than it sounds.</li>
  <li><em>Evidence completeness is a number, not a state.</em> Give the real one and name the fields that are missing.</li>
</ul>
<p>What to refuse to supply: a productivity multiple. Mob-level speed-ups do not survive contention at platform level, published evidence is genuinely mixed, and a quoted number you cannot defend in six months costs more than the ask it wins. Refuse unattributable statistics the same way — including the ones an assistant offers while drafting.</p>
<p><em>Read the full module for:</em> the control-chain table as a risk officer reads it, and the order to make an ask in — capacity or platform before tooling.</p>
`,
  body:`
<p>Everything in this course eventually has to survive two conversations you do not control: one with someone whose job is to find the hole in your controls, and one with someone who wants a number for the board. This module is about both, and about being credible in them.</p>

<h3>The risk conversation</h3>
<p>The risk officer's concern is not that AI wrote the code. It is that a control they understood has been replaced by something they cannot inspect. Answer that directly, and the answer is stronger than most engineers realise:</p>

<div data-viz="mb_control_chain"></div>

<table>
  <tr><th>Before</th><th>How it was enforced</th><th>Now</th><th>How it is enforced</th></tr>
  <tr><td>Senior engineer reviews clinical logic</td><td>Culturally — if they had time, and if they noticed</td><td>Tier 3 routing to a named clinical validator</td><td>Mechanically, by the tier table in the repository</td></tr>
  <tr><td>Layer boundaries respected</td><td>By convention and code review</td><td>Fitness function</td><td>Every change, no exceptions, build fails</td></tr>
  <tr><td>No member data in logs</td><td>A rule in the wiki everyone had read once</td><td>Executable check over log and exception paths</td><td>Every change, and it has caught real violations</td></tr>
  <tr><td>Dependency additions reviewed</td><td>When a reviewer happened to look at the manifest</td><td>SBOM per bolt plus CVE gate in the merge queue</td><td>Mechanically, including transitive packages</td></tr>
  <tr><td>Traceability for an audit</td><td>Reconstructed afterwards from tickets and memory</td><td>Provenance record per unit of work</td><td>Generated as a by-product at land time</td></tr>
</table>
<p>The strong form of the argument, and it is legitimate: <em>these controls are mechanical where the previous ones were cultural.</em> A cultural control degrades quietly under deadline pressure and leaves no record of having degraded. A mechanical control either runs or fails visibly. That is a real improvement in control quality, and it is the sentence to lead with.</p>

<h3>Where the argument runs out</h3>
<p>Then stop and say the other thing, plainly, because a competent risk officer will find it and it is much better coming from you:</p>
<blockquote>Constraints catch what we thought to encode. Novel failure modes are still novel, and we will not have a check for the thing that has not occurred to anyone yet. Anyone claiming this eliminates review risk is selling something.</blockquote>
<p>Ending on the limit rather than the strong form is what makes the whole argument credible. Two further honest items to volunteer rather than concede:</p>
<ul>
  <li><em>Mechanical controls can be disabled.</em> An ignore annotation, a suppressed advisory, a quarantined test. So the control set needs its own audit: who may disable a check, and where that is recorded. If you have not built that, say so and give a date.</li>
  <li><em>Evidence completeness is not 100%.</em> Ours is a number, we know what it is, and we know which fields are missing. A programme claiming complete provenance in its first year is describing an aspiration.</li>
</ul>
<p>This is also where <strong>the honest limit</strong> earns its keep as a habit rather than a section heading. Volunteering the boundary of your own claim is the cheapest credibility available in a room full of people whose job is to test claims.</p>

<h3>The executive productivity question</h3>
<div data-viz="mb_evidence_ladder"></div>
<p>You will be asked for a productivity multiple. The defensible answer has three parts and none of them is a multiple:</p>
<ol>
  <li><em>What the published evidence supports.</em> The 2025 DORA report describes throughput improvements arriving alongside stability regressions where review and delivery practice did not change. METR's randomised trial of experienced developers in their own repositories found tasks took longer with AI assistance while the developers believed they had been faster. Cite both, including the one that cuts against you — quoting only the favourable study is how you lose the room the second time.</li>
  <li><em>What we measured here.</em> Our own numbers, with their limits stated: generation is faster, validator queue time is the constraint, and cycle time at the platform level moved by X — which is a smaller number than any mob would report for itself.</li>
  <li><em>The mechanism, in one sentence.</em> Mob-level gains vanish at platform level through contention. That sentence is this entire course, and it is the part an executive can repeat accurately to someone else.</li>
</ol>
<p>What not to do: quote a mob-level speed-up as a platform result. It is the most common overclaim in this field, it is checkable, and being caught costs you the ask.</p>

<h3>Cost, honestly</h3>
<div data-viz="mb_cost_ratio"></div>
<p>Token spend per unit of work is small, measurable and falling; per mob it is a rounding error. Validator hours are large, invisible and fixed. That ratio is usually a surprise in a budget meeting, and it argues for two things: visibility over quotas, and funding capacity rather than tooling.</p>
<p>Say the second part out loud, because it is counter-intuitive coming from an engineering group: <em>we are not asking for more tools. We are asking for the specialist's time to be reallocated from reviewing to encoding, and for that reallocation to be protected.</em></p>

<h3>The ranking question, in its external form</h3>
<p>Executives ask which group is performing best, and outside parties ask which vendor or engine is performing best. M18's refusal holds and needs a shorter form for this audience: <em>"We measure the platform, not the groups, because attributing contention metrics to groups makes them stop reporting the number we most need. Here is what we do publish, and here is what it tells us to fix."</em></p>
<p>Then give them the substitute they actually wanted: where the constraint is, what it costs, and what you are doing about it. In practice that lands better than a ranking, because it comes with a decision attached.</p>

<h3>Assembling the ask</h3>
<table>
  <tr><th>Ask</th><th>When it is the right one</th><th>Evidence to bring</th></tr>
  <tr><td>Validator capacity — hours reallocated or a hire</td><td>Queue time is the constraint, which it usually is</td><td>Queue time by tier, the SME hour arithmetic, the encode break-even</td></tr>
  <tr><td>A platform pair for one quarter</td><td>You have encodable rules and nobody to encode them</td><td>The top three recurring review comments and their reuse rate</td></tr>
  <tr><td>CI capacity</td><td>Pipeline wait is material and it is cheap to fix</td><td>Queue depth, minutes per bolt, the monthly figure</td></tr>
  <tr><td>Tooling or licences</td><td>Rarely. Usually already sufficient</td><td>Only ask if you can show tooling is the binding constraint</td></tr>
</table>
<p>The order matters. Leading with a tooling request signals that you have not diagnosed the constraint, and it is the easiest ask to approve and the least likely to change the outcome — which means you will be asked next quarter why nothing improved.</p>

<div class="callout honest-limit">
  <div class="k">Honest limit — where this argument legitimately stops</div>
  <p>The control-chain argument is genuine and it is bounded in three ways you should state before someone else does. <em>Constraints only cover the failure modes you imagined</em>, so the residual risk after all of this is the novel failure, and it is not small — it is merely different from the risk you had before. <em>Mechanical controls are only as strong as the discipline around disabling them</em>: one ignore annotation added at 17:00 on a Friday and the control is gone with no alarm, so the honest position is that you have moved risk from "reviewed inattentively" to "suppressed deliberately", and the second is easier to audit but not automatically less likely. And <em>none of this addresses whether the generated code is good</em>, only whether it satisfies stated constraints. Those are different claims, and conflating them is exactly the overclaim this module tells you to avoid.</p>
  <p>One more, about the productivity question specifically: there is currently no measurement of AI-assisted delivery at multi-team scale that would satisfy a sceptical economist. The published studies are at individual or team level, with mixed results, on short horizons. If your executive wants certainty about platform-level productivity, the honest answer is that it does not exist yet, and that you are proposing to measure it rather than to assume it. That answer is available to you and it is more durable than a number you cannot defend in six months.</p>
</div>
`,
  lab:{
    title:'The one-page ask',
    pd:['PD-NONE'],
    a:`
<p><em>Deliverable:</em> a genuine one-page document for your own leadership: the ask, the evidence, the honest limits, the cost, and what you will report in ninety days. One page. If it runs to two, the ask is not clear enough yet.</p>
<p>PD reference: <em>PD-NONE</em>, justified: the artifact is a document for your actual organisation, and the judgement being graded is whether its limits section is real. A planted fixture defect would let you practise on someone else's constraints instead of stating yours.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Write the ask first, in one sentence, and make it capacity or platform rather than tooling. If you cannot state it in a sentence, you have a wish rather than an ask.</li>
  <li>Assemble evidence for it: queue time by tier, the specialist-hour arithmetic, the encode-versus-review break-even for your top three recurring review comments, and cost per unit of work. Have the agent structure and tighten the prose; supply every number yourself.</li>
  <li>Write the limits section without hedging language. Name what your controls do not cover, what your evidence does not support, and one thing that could go wrong with what you are asking for.</li>
  <li>Add the ninety-day report line: the one number you will bring back and what it will mean either way. An ask with no return commitment reads as a request for faith.</li>
  <li>Read it once as the risk officer and once as the CFO. Cut every sentence that neither of them would care about.</li>
</ol>
<h4>Graded moment</h4>
<p>The agent will write you a persuasive page. Its limits section will be a balanced-sounding paragraph containing no actual limit — "as with any change, careful monitoring will be required" — because that is the shape such paragraphs usually take in the material it learned from. That paragraph is worse than nothing: it signals to a competent reader that you have not looked. Replace it with a specific, checkable limitation. This lab is graded on that section and nothing else, which is why the deliverable is one page.</p>
<h4>Gate</h4>
<p>One page; the ask is capacity or platform, stated in one sentence; every number sourced; a limits section containing at least one specific checkable limitation and no unsupported productivity claim; a named ninety-day return number.</p>`,
    b:`
<p><em>Deliverable:</em> identical — one page, a capacity-or-platform ask, sourced evidence, a real limits section, and a ninety-day return number.</p>
<p>PD reference: <em>PD-NONE</em>, for the same reason: this artifact is about your organisation, and its honesty is the thing being graded.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Draft in a document in your own repository so the versions are reviewable. Write the one-sentence ask before anything else.</li>
  <li>Paste your real numbers in as a table first, then ask for prose that references only what is in the table. Without that constraint this path will supply plausible figures of its own, and a fabricated number in a leadership document is the worst possible failure of this lab.</li>
  <li>Write the limits section yourself, then ask the assistant to attack it as a sceptical risk officer. Keep whatever survives and add whatever the attack revealed.</li>
  <li>Add the ninety-day return number and what it will mean in either direction.</li>
  <li>Cut to one page.</li>
</ol>
<h4>Graded moment</h4>
<p>Same failure — a limits section that hedges rather than limits. Watch for the path-specific one too: asked to strengthen the document, the assistant will add an industry productivity statistic with a confident attribution. Delete any number you cannot trace to a source you have read. A single unattributable statistic in front of a CFO costs you more than the whole document gains.</p>
<h4>Gate</h4>
<p>Identical to Path A: one page, a one-sentence capacity or platform ask, every number sourced and traceable, at least one specific checkable limitation, and a named ninety-day return number.</p>`
  }
}
