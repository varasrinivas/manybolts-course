{
  id:'M19',
  title:'The second-team cliff',
  track:5,
  audience:['leader'],
  contentionClass:['validator'],
  duration:'40 min · 30 min lab',
  visuals:['mb_second_team_cliff','mb_prereq_checklist','mb_rollout_sequence'],
  crossCard:`
<p>The six prerequisites in this module are your build list, and you will be asked which of them exist before another team starts. Each is one of your modules, and none takes more than a week for a competent platform pair:</p>
<table>
  <tr><th>Prerequisite</th><th>Built in</th></tr>
  <tr><td>Validation tiers, with Tier 3 capped by the specialist hours you actually have</td><td>M04</td></tr>
  <tr><td>One encoded golden path for your most common change shape</td><td>M05</td></tr>
  <tr><td>Three fitness functions: layer boundaries, your data-boundary rule, one contract</td><td>M06</td></tr>
  <tr><td>A merge queue with whole-repository build</td><td>M08</td></tr>
  <tr><td>Canonical steering, generated per engine, under ten root invariants</td><td>M12, M13</td></tr>
  <tr><td>A platform-scoped unit-of-work registry, loaded into elaboration context</td><td>M14</td></tr>
</table>
<p>Why it matters to you specifically: without them the next team hits the queue you already live in, and the resulting slowdown gets reported as a method failure or as your team blocking them. The tier table and the merge queue are the two to have first — they address the contention classes that bite earliest.</p>
<p>The leading indicator to watch, and to raise early, is <strong>validator queue time</strong> rising two weeks in a row. It moves before cycle time does and long before anyone complains in a status meeting.</p>
<p><em>Read the full module for:</em> why the second team's difficulties are a conditions failure rather than a method failure, and what onboarding artifacts remove most of a quarter's friction.</p>
`,
  body:`
<p>Pilots succeed almost everywhere. Second teams fail often enough that it has a shape, and the shape is consistent enough to plan around.</p>

<h3>The cliff</h3>
<div data-viz="mb_second_team_cliff"></div>
<p>Look at what the pilot actually had. Volunteers, usually the strongest engineers, on work that was greenfield or nearly so, with the clinical SME's attention on demand because nobody else was asking, an empty CI queue, an executive sponsor who took their calls, and permission to break convention because the point was to learn.</p>
<p>The next team has none of that. They were assigned. Their codebase is fifteen years old. The SME is now shared. The CI queue already has the pilot mob in it. And they are told to follow a method that the pilot demonstrated under conditions no longer available.</p>
<blockquote>Every rollout failure looks like a method failure and is a <strong>conditions failure</strong>. The pilot proved the method works under ideal conditions. It said nothing about contention — which is the entire subject of this course.</blockquote>
<p>The practical consequence for a rollout plan: your pilot's results are not a forecast for anyone else, and presenting them as one is how you lose credibility in the second quarter. What the pilot legitimately proved is that the method is learnable and that the tooling works in your environment. Both are real, and neither predicts throughput at three mobs.</p>

<h3>Prerequisites before the next team starts</h3>
<div data-viz="mb_prereq_checklist"></div>
<table>
  <tr><th>Prerequisite</th><th>Minimum viable version</th><th>Built in</th></tr>
  <tr><td>Validation tiers</td><td>A tier per package with evidence, and Tier 3 explicitly capped by available SME hours</td><td>M04</td></tr>
  <tr><td>One encoded golden path</td><td>A single scaffold for your most common change shape, with its fitness test</td><td>M05</td></tr>
  <tr><td>Fitness functions</td><td>Three: layer boundaries, your data-boundary rule, one contract</td><td>M06</td></tr>
  <tr><td>Merge queue</td><td>Serialised landing on trunk, whole-repository build</td><td>M08</td></tr>
  <tr><td>Canonical steering</td><td>One source, generated per-engine files, under ten root invariants</td><td>M12, M13</td></tr>
  <tr><td>Unit-of-work registry</td><td>Platform-scoped, aggregates named, loaded into elaboration context</td><td>M14</td></tr>
</table>
<p>Rolling out without these is how a platform gets M03's cycle-time regression — roughly three times the wait, none of it visible until it is a leadership conversation. Six items, and none takes more than a week for a competent platform pair. It is the cheapest insurance in this course.</p>
<p>One honest note on sequencing them: the tier table and the merge queue matter most, because they address the two contention classes that bite first. If you can only do two, do those, and say clearly what you have not done.</p>

<h3>Which team goes next</h3>
<div data-viz="mb_rollout_sequence"></div>
<p>The instinct is to pick the most enthusiastic team. Resist it, for a specific reason: you are testing conditions now, not motivation. The pilot already established that motivated people can do this. What you do not know is whether the method survives an ordinary codebase and a shared reviewer — and enthusiasm papers over exactly the evidence you need.</p>
<p>Pick a team with a boring, well-tested codebase, moderate enthusiasm, and no deadline in the next six weeks. When they succeed, you have evidence that transfers. When they struggle, the cause will be legible rather than hidden behind goodwill and unpaid overtime.</p>
<p>What to avoid for the next slot, in order of severity: the group with the untested legacy monolith (M11 is a course of its own), the group with a regulatory deadline this quarter, the group whose lead is publicly sceptical, and the group that shares its most contended module with the pilot. That last one is tempting because the pilot can help, and it guarantees you cannot distinguish contention from learning curve.</p>

<h3>Onboarding a mob mid-quarter</h3>
<p>Round 3 of The Quarter is this exercise, and it is worth rehearsing before doing it for real. The failures it produces, reliably:</p>
<ul>
  <li>The new mob's steering diverges in week one, because they copied another mob's file instead of generating from canonical.</li>
  <li>Their first three bolts all land in the Tier 3 queue, because nobody told them the tier table exists. Validator queue time doubles, and the pilot mob notices before you do.</li>
  <li>They add a unit of work that overlaps an in-flight one, because nobody wrote them into the registry at Intent Sync.</li>
</ul>
<p>All three are onboarding artifacts you can write once: generate-your-steering, read-the-tier-table, you-are-in-the-registry-from-day-one. Half a day of preparation removes most of a quarter's friction, and the reason it usually does not exist is that the pilot never needed it.</p>

<h3>Early warning that a rollout is stalling</h3>
<table>
  <tr><th>Indicator</th><th>Why it leads</th><th>Threshold to act on</th></tr>
  <tr><td><strong>Validator queue time</strong></td><td>Rises before cycle time does, and before anyone complains</td><td>Two consecutive weeks up, at any absolute level</td></tr>
  <tr><td>Tier 3 share of changes</td><td>A rising share means tiering is being applied defensively, or the new mob does not know the table exists</td><td>Above the platform's SME hour budget</td></tr>
  <tr><td>Steering drift events</td><td>The new mob is diverging quietly, which is normal and needs catching early</td><td>Any event in a new mob's first month</td></tr>
  <tr><td>Bolts abandoned or substantially reworked</td><td>The signal nobody raises in a status meeting</td><td>Any sustained rise</td></tr>
</table>
<p>Note what is absent from that list: velocity, satisfaction survey scores, and adoption percentage. All three lag, and the first two are reported by people with an interest in the answer.</p>

<h3>Saying no, and why it protects the rollout</h3>
<p>Some teams should not migrate yet, and saying so plainly is the strongest available move, because it is what makes your yes worth anything. The conversation, roughly: <em>"Your codebase has no tests around the module you would need to change first. If you start now the validation checkpoint has nothing to check against, at one mob or five, and we will both conclude the method does not work. Six weeks of characterization tests first, then you go, and you go with a real chance."</em></p>
<p>That is a defensible position with a date and a condition attached, and it reads as competence rather than obstruction. The alternative — everyone starts, half stall, and the programme acquires a reputation — is how rollouts die, and it takes about two quarters.</p>

<div class="callout honest-limit">
  <div class="k">Honest limit — the cliff is not fully preventable</div>
  <p>Every prerequisite in this module reduces the drop. None of them removes it, and it would be dishonest to imply otherwise. The pilot had scarce attention that genuinely cannot be manufactured: an SME who answered in minutes, a sponsor who cleared obstacles personally, and volunteers who wanted it to work. You can encode rules, you cannot encode enthusiasm or executive availability, and the second cohort will be slower than the pilot even when you do everything in this module. Plan for that gap and state it in advance, because a rollout plan that promises pilot-equivalent results is a plan that will be judged to have failed.</p>
  <p>Two further limits. <em>The prerequisite list is derived from one fixture and a class of platform</em> — three services, one regulated domain, one scarce specialist. If your constraint is a shared data platform, a certification body, or a single overloaded staff engineer rather than a clinical SME, the six items still apply in shape but the order will differ, and you should re-derive it rather than adopt this one. And <em>the sequencing advice assumes you get to choose</em>. Frequently you do not: the next team is chosen politically, and it is the one with the deadline and the monolith. In that case the honest move is not to refuse but to name the two conditions you know are missing, in writing, before the start — so that when the quarter goes badly the conversation is about conditions rather than about the method or the people.</p>
</div>
`,
  lab:{
    title:'Sequence your own rollout',
    pd:['PD-NONE'],
    a:`
<p><em>Deliverable:</em> a sequenced rollout plan for your real organisation: every candidate group mapped against the six prerequisites, the order you propose, the conditions each group is missing, and at least one group that should wait with the condition and date attached.</p>
<p>PD reference: <em>PD-NONE</em>, and the justification is that this lab's artifact is your own organisation rather than the fixture. A planted defect would give you a rehearsal of someone else's constraints, and the judgement being graded here is about yours. The fixture returns in M21, where the six prerequisites are scored under load.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>List your candidate groups with three facts each, from evidence rather than impression: test coverage around the module they would change first, the specialist they depend on and that specialist's current load, and any hard deadline in the next quarter.</li>
  <li>Score each against the six prerequisites — present, partial, absent. Use the agent to structure the matrix and to challenge your scoring; do not let it supply the facts.</li>
  <li>Propose the order. For each position, write the reason in terms of conditions, not motivation. Any reason that reduces to "they are keen" gets rewritten or deleted.</li>
  <li>Identify at least one group that should wait, with the missing condition, what would fix it, and a date you would revisit. This is the graded artifact.</li>
  <li>Address validator capacity explicitly before the second group starts: state the hours available, the Tier 3 demand you expect, and what you will encode first if the gap is negative.</li>
</ol>
<h4>Graded moment</h4>
<p>Asked to sequence a rollout, the agent will produce a plan in which every group starts, ordered by readiness, with a training and enablement track. It will look like a professional programme plan and it will contain no refusals, because nothing in the prompt suggested that not starting is an option. A rollout plan with no group waiting is not a plan, it is a schedule. The second failure: it will put capacity work after the second group starts, as an enablement workstream. Capacity has to precede arrival or the plan reproduces M03 on purpose.</p>
<h4>Gate</h4>
<p>Every group scored against all six prerequisites from evidence; at least one group deferred with a stated missing condition and a revisit date; validator capacity addressed before the second group starts rather than in parallel; no ordering reason that reduces to enthusiasm.</p>`,
    b:`
<p><em>Deliverable:</em> identical — the prerequisite matrix, the proposed order with condition-based reasons, at least one deferral with a date, and validator capacity addressed before the second group starts.</p>
<p>PD reference: <em>PD-NONE</em>, for the same reason as Path A: the artifact is your own organisation, and substituting a fixture defect would replace the judgement being graded with a rehearsal.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Build the matrix in a document in your own repository, with the six prerequisites as columns. Keeping it in the repo matters more than it sounds: this plan gets revised three times and the versions are the useful record.</li>
  <li>Gather the three facts per group yourself. Where coverage numbers exist, cite them; where they do not, write "unknown" rather than an estimate — an unknown in this matrix is itself a finding about readiness.</li>
  <li>Ask the assistant to challenge each ordering decision in turn, one question at a time. Ask it explicitly which group in your list should not start yet; asked generically it will not volunteer a deferral.</li>
  <li>Write the deferral with condition, remedy and revisit date.</li>
  <li>State the validator capacity arithmetic before the second start: available hours, expected Tier 3 demand, and the first rule you will encode if the gap is negative.</li>
</ol>
<h4>Graded moment</h4>
<p>Same two failures — no deferrals, and capacity work scheduled in parallel rather than before. A third is specific to drafting this in a document with an assistant: the plan will acquire a confident timeline with week numbers that nothing supports. Delete every date you cannot defend with a condition, and keep only the revisit dates you chose deliberately.</p>
<h4>Gate</h4>
<p>Identical to Path A: all groups scored from evidence with unknowns marked, one deferral with condition and date, capacity before arrival, and no enthusiasm-based ordering.</p>`
  }
}
