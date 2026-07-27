{
  id:'M18',
  title:'Portfolio metrics, cost governance, and the comparison trap',
  track:4,
  audience:['leader'],
  contentionClass:['validator'],
  duration:'40 min · 35 min lab',
  visuals:['mb_eight_metrics','mb_comparison_trap','mb_cost_ratio'],
  crossCard:`
<p>These are the numbers you will be asked to produce, so it is worth knowing where each one comes from in your own pipeline — and what it costs you when someone games it.</p>
<table>
  <tr><th>Metric</th><th>Where it comes from</th><th>What gaming it looks like from the inside</th></tr>
  <tr><td>Bolts landed</td><td>Merge queue</td><td>Splitting units of work to inflate the count</td></tr>
  <tr><td>Validator queue time, by tier</td><td>Two timestamps per bolt: ready for validation, validation started</td><td>Not starting the clock until a validator picks it up</td></tr>
  <tr><td>Contract breakages</td><td>Contract suite</td><td>Deleting the test that fails</td></tr>
  <tr><td>Cross-repo contract breakage</td><td>Drift report, consumer tests</td><td>Never writing the outcome test, so nothing can break</td></tr>
  <tr><td>Steering drift events</td><td>Invariant coverage check</td><td>Removing the invariant from the root list</td></tr>
  <tr><td>Flag debt, by age</td><td>Flag registry</td><td>Renaming a flag resets its age</td></tr>
  <tr><td>Evidence completeness</td><td>Provenance records</td><td>Inferring a field instead of recording it unknown</td></tr>
  <tr><td>Security queue depth</td><td>Security review records</td><td>Auto-approving dependency additions</td></tr>
</table>
<p>Two things to insist on when this arrives. Queue-time timestamps are yours to instrument and they are two fields — build them first, because that number is what argues for capacity on your behalf. And contention metrics must aggregate at platform level: the moment queue time is attributed to a named group, it stops being reported honestly, and you lose the earliest warning you have.</p>
<p><em>Read the full module for:</em> the cost-per-bolt arithmetic that argues against token quotas, and the four reasons a per-group ranking destroys the measurement it depends on.</p>
`,
  body:`
<p>You will be asked three questions about this programme: is it working, what is it costing, and which group is doing best. The first two have good answers. The third has a correct refusal, and getting that refusal right is the most valuable thing in this module.</p>

<h3>Why the standard delivery metrics are not enough here</h3>
<p>Deployment frequency, lead time, change failure rate and time to restore are the right starting point and they measure flow through a system. They do not measure <em>contention for shared resources</em>, which is the thing that degrades when you add mobs to one platform. A platform can hold lead time flat for two quarters while validator queue time triples, and the four standard numbers will not show it until they collapse together.</p>
<p>So the portfolio set adds contention measurement. Eight numbers, each detecting one failure this course has described:</p>

<div data-viz="mb_eight_metrics"></div>

<table>
  <tr><th>Metric</th><th>Detects</th><th>Source</th><th>How it gets gamed</th></tr>
  <tr><td>Bolts landed</td><td>Whether governance has strangled delivery</td><td>Merge queue</td><td>Splitting units of work to inflate the count</td></tr>
  <tr><td>Validator queue time, by tier</td><td>The bottleneck, before it becomes visible in lead time</td><td>Review records</td><td>Not starting the clock until a validator picks it up</td></tr>
  <tr><td>Contract breakages</td><td>Cross-mob coordination failing inside one repository</td><td>Contract suite</td><td>Deleting the test that fails</td></tr>
  <tr><td>Cross-repo contract breakage</td><td>M09's silence — a consumer that stopped receiving changes</td><td>Drift report, consumer tests</td><td>Nobody writes the outcome test, so nothing ever breaks</td></tr>
  <tr><td>Steering drift events</td><td>Mob-local relaxation of a root invariant</td><td>Invariant coverage check, contradiction scan</td><td>Removing the invariant from the root list</td></tr>
  <tr><td>Flag debt, by age</td><td>Untested production configuration accumulating</td><td>Flag registry</td><td>Renaming a flag resets its age</td></tr>
  <tr><td>Evidence completeness</td><td>Whether you can answer an auditor without archaeology</td><td>Provenance records</td><td>Inferring fields instead of recording unknown</td></tr>
  <tr><td>Security queue depth</td><td>Supply-chain review being treated as a human gate</td><td>Security review records</td><td>Auto-approving Tier 2 dependency additions</td></tr>
</table>
<p>Publish the gaming column alongside the metric. Every one of these numbers has a cheap way to look better without being better, everyone knows it, and a metric set presented without its failure modes reads as naive to exactly the audience you need to convince.</p>

<h3>Cost governance, and the ratio nobody expects</h3>
<div data-viz="mb_cost_ratio"></div>
<p>Two costs per landed bolt. Token spend is measurable to the cent and rises visibly on a dashboard finance already watches. Validator hours are invisible, uncosted, and an order of magnitude larger.</p>
<table>
  <tr><th>Cost per landed bolt</th><th>Fixture figure</th><th>Notes</th></tr>
  <tr><td>Token spend</td><td>roughly 4 dollars</td><td>Varies by model and by how much context the bolt needed. Trending down per unit of work</td></tr>
  <tr><td>CI minutes</td><td>142 minutes</td><td>M10's number. Buyable, and worth buying</td></tr>
  <tr><td>Validator time</td><td>0.75 hours of a scarce clinician per Tier 3 bolt — about 0.1 hours averaged across everything landed</td><td>Still the dominant cost by a wide margin once you price an hour of clinical time against four dollars, and the only one with no purchase option</td></tr>
</table>
<p>The consequence for governance: <em>token quotas are the wrong control.</em> A quota that saves a few hundred dollars a month while causing one mob to skip the exploration that would have caught a contract break is a bad trade with a good-looking line item. What you want is visibility — spend per unit of work, visible to whichever mob spends it — plus an alert on anomalies rather than a cap. The finance conversation to have is not about reducing token spend; it is about how cheap token spend is relative to the review hours it can displace, which is M05's argument arriving in a budget meeting.</p>

<h3>The comparison trap</h3>
<div data-viz="mb_comparison_trap"></div>
<p>Someone senior will ask for a per-group ranking. It is a reasonable-sounding request and publishing it destroys the measurement you depend on, for four reasons that are worth having ready:</p>
<ol>
  <li><em>The hardest work looks worst.</em> Whichever group owns the clinical hotspot has the highest Tier 3 share and therefore the longest queue times. Ranking on cycle time ranks module difficulty, not capability.</li>
  <li><em>Rankings change behaviour immediately, and the cheapest behaviours are the harmful ones.</em> Split units of work smaller; classify a change one tier lower; start the review clock late. All three improve the number and worsen the platform.</li>
  <li><em>Queue time stops being reported honestly</em> the moment it is attributed. And queue time is the leading indicator this whole course rests on — losing it costs you the early warning in M19.</li>
  <li><em>It converts a shared problem into a competition.</em> Contention is a property of the platform. The groups that need to cooperate on a boundary contract now have a reason not to.</li>
</ol>
<blockquote>The rule: <em>contention metrics aggregate at platform level and are attributed to no group.</em> Per-group numbers exist, are visible to that group for its own use, and are never published upward or sideways.</blockquote>
<p>Two exceptions that hold up in practice. Metrics about <em>artifacts</em> rather than people can be attributed — an unowned module, an expired flag, a missing contract test are facts about the codebase and naming them creates no incentive to game. And a group may publish its own numbers voluntarily, which happens naturally once nobody is being ranked.</p>

<h3>Answering the ranking question without refusing to answer</h3>
<p>"Which group is performing best" cannot be answered honestly, but the question behind it usually can. What the executive wants is one of: are we getting value, where is the constraint, or is anyone in trouble. Offer those instead:</p>
<table>
  <tr><th>Instead of a ranking</th><th>Answer with</th></tr>
  <tr><td>Are we getting value?</td><td>Platform bolts landed and work-versus-wait split, quarter over quarter, with the contention story attached</td></tr>
  <tr><td>Where is the constraint?</td><td>Validator queue time by tier, and the encode-versus-review break-even for the top three recurring review comments</td></tr>
  <tr><td>Is anyone in trouble?</td><td>Yes, sometimes — brought as a specific request for help with a specific constraint, not as a position in a table</td></tr>
</table>
<p>M20 gives this the external-facing form, because the question arrives from outside engineering too and the version you give a board needs to be shorter and to survive being repeated without you.</p>

<h3>Build order for instrumentation</h3>
<ol>
  <li><em>Validator queue time.</em> Two timestamps per bolt. Cheapest, highest value, and the number that changes what you argue for.</li>
  <li><strong>Evidence completeness</strong>, once provenance records exist. A count of populated required fields.</li>
  <li><strong>Flag age</strong> and <strong>quarantined test age</strong>. Both are one query and both predict trouble a quarter out.</li>
  <li>Everything else, when the first three have changed a decision. A dashboard with eight numbers and no decisions attached becomes a wallpaper, and then a source of monthly argument.</li>
</ol>
`,
  lab:{
    title:'The portfolio one-screen',
    pd:['PD-9','PD-10'],
    a:`
<p><em>Deliverable:</em> a one-screen portfolio view specification at <code>platform-fixture/records/M18_PORTFOLIO.md</code> — the eight metrics with definitions, sources, refresh cadence, gaming risk, and the decision each one is supposed to inform. Plus a cost-per-landed-bolt calculation from fixture data, and a written answer to the ranking question suitable for a board paper.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Define each metric precisely enough to be implemented by someone who was not in the room. Queue time in particular: from which event to which event, and who starts the clock.</li>
  <li>Trace two metrics to their planted origins so the definitions stay concrete: cross-repo contract breakage exists because of <em>PD-9</em>, and security queue depth exists because of <em>PD-10</em>. Write one sentence per metric explaining the failure it would have caught and how long the gap lasted.</li>
  <li>Compute cost per landed bolt across all three components. State which one dominates and by what multiple.</li>
  <li>For every metric, write the decision it informs. Delete any metric where you cannot name one. Expect to delete at least one, and note which — that deletion is the most useful output of this lab.</li>
  <li>Write the ranking answer: what you will publish, what you will not, and the two exceptions. Three paragraphs, aimed at someone who will repeat it without you in the room.</li>
</ol>
<h4>Graded moment</h4>
<p>Asked to design a portfolio view, the agent will produce a per-group comparison — a leaderboard, or small multiples faceted by group, because that is the conventional shape of this artifact and it is what the training data contains. It reads as professional and it is the failure this module exists to prevent. Restructure to platform aggregate plus per-tier breakdown, use role descriptions rather than group identifiers anywhere a group must be referred to, and check the sample data too: generated example rows carry group names even after the headings are fixed.</p>
<h4>Gate</h4>
<p>Eight metrics, each with an implementable definition, a source, a gaming risk and a named decision; no group-level attribution anywhere in the specification or its sample data; cost per bolt computed with the dominant component identified; a ranking answer that neither refuses the question nor publishes a ranking.</p>`,
    b:`
<p><em>Deliverable:</em> identical — the eight-metric specification with definitions, sources, gaming risks and decisions, the cost calculation, and the board-ready ranking answer. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Draft the definitions in a document with the fixture's metric outputs open beside you, so each definition is written against data that exists rather than data you wish existed.</li>
  <li>Tie cross-repo contract breakage to <em>PD-9</em> and security queue depth to <em>PD-10</em>, with the duration of each gap stated.</li>
  <li>Compute cost per landed bolt from the CI minutes, token log and review records in the fixture. Have the assistant do the arithmetic and check the multiple yourself — the order of magnitude is the whole point and a wrong exponent destroys the argument.</li>
  <li>Name the decision each metric informs; delete any metric without one.</li>
  <li>Write the ranking answer in three paragraphs.</li>
</ol>
<h4>Graded moment</h4>
<p>Same trap and a sharper version of it: asked for a dashboard layout, this path will frequently generate a table with a group column already populated with plausible names, and once that shape exists in the document it tends to survive editing. Delete the column rather than blanking it. Then re-read the sample rows — the identifiers reappear there most often, and a specification that models group attribution will be implemented that way regardless of what its prose says.</p>
<h4>Gate</h4>
<p>Identical to Path A: implementable definitions with sources, gaming risks and decisions; no group attribution in prose or sample data; dominant cost component identified with the multiple; a ranking answer that answers the real question.</p>`
  }
}
