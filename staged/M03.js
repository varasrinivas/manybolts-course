{
  id:'M03',
  title:'Where the method stops',
  track:0,
  audience:['leader','practitioner'],
  contentionClass:['code','validator','infrastructure'],
  duration:'40 min · 30 min lab',
  visuals:['mb_contention_classes','mb_cycletime_regression','mb_method_gap'],
  body:`
<h3>Tuesday, week two of the rollout</h3>
<p>Gate finishes a bolt at 10:40 — criteria-specific thresholds, twelve files, tests green. It needs the clinical SME, who is in nurse escalations until Thursday. Appeals finishes at 11:15 and lands first, because their change looked smaller. Gate rebases at 14:00 onto a schema Appeals just changed, and the agent resolves the conflict plausibly and wrongly. Portal, meanwhile, has been waiting since Monday for the UAT environment, which Appeals is holding for a demo.</p>
<p>Three mobs, three good bolts, one platform. Nobody did anything wrong and the week produced one landed change. This is the failure mode the course exists for, and none of it is visible from inside a single mob.</p>

<h3>Contention has exactly three classes</h3>
<p>Every delay above belongs to one of three classes. This taxonomy is the course's organising device: it is worth being able to recite, because the correct response differs by class and the classes get confused constantly.</p>

<div data-viz="mb_contention_classes"></div>

<table>
  <tr><th>Class</th><th>The shared resource</th><th>Measure it as</th><th>Response track</th></tr>
  <tr><td><strong>code contention</strong></td><td>Files, aggregates, migrations, the trunk itself</td><td>Rebase count per landed bolt; diff overlap between in-flight bolts</td><td>Track 2 mechanics, Track 3 artifacts</td></tr>
  <tr><td><strong>validator contention</strong></td><td>The scarce human who must say yes</td><td>Queue time as a share of bolt cycle time</td><td>Track 1 — the spine of this course</td></tr>
  <tr><td><strong>infrastructure contention</strong></td><td>CI runners, UAT, test data, seats, tokens</td><td>Wait-for-resource time per bolt; pipeline queue depth</td><td>M10</td></tr>
</table>
<p>Two of these three are familiar problems that agents made worse. Only one of them is new, and it is the one nobody instrumented: nothing in a standard delivery dashboard measures how long a change waited for a person, as distinct from how long it took to make.</p>

<h3>The number that actually moves</h3>
<p>Here is the same four-bolt workload run through the fixture harness at one, three and five mobs. Generation capacity is identical in all three. Only the arrival rate against shared resources changes.</p>

<div data-viz="mb_cycletime_regression"></div>

<p>Working time is flat, as it should be — the agents did not get slower. Cycle time is 3.7 times longer at five mobs, and all of that increase is waiting. This is the regression that gets reported upward as <em>the AI thing is not working</em>, and reported sideways as <em>the platform team is blocking us</em>, and it is neither.</p>
<p>The measurement discipline that follows is unglamorous and cheap: split every bolt's cycle time into <strong>work time</strong> and <strong>queue time</strong>, and attribute the queue time to one of the three classes. You can do it in a spreadsheet for two weeks and it will change what you argue for.</p>

<h3>Where the published method is silent</h3>
<p>Be precise about this, because overstating it invites a fair rebuttal. The method is not wrong. It is scoped to a mob, it says so, and at that scope it works. What it does not contain is any mechanism for arbitration between mobs.</p>

<div data-viz="mb_method_gap"></div>

<table>
  <tr><th>The method defines</th><th>It does not define</th><th>Addressed in</th></tr>
  <tr><td>Mob Elaboration for one mob</td><td>How two mobs elaborating the same domain reconcile before they build</td><td>M14</td></tr>
  <tr><td>A human validation checkpoint</td><td>What happens when arrivals exceed one validator's capacity — no queue model, no tiering, no capacity concept</td><td>M04, M05</td></tr>
  <tr><td>That the mob reviews the code</td><td>Which repository the code is in, or what to do when the change crosses one at multi-mob scale</td><td>M09</td></tr>
  <tr><td>Steering files as team convention</td><td>Precedence between five mobs' steering files, and how to detect divergence</td><td>M12, M13</td></tr>
  <tr><td>Bolts landing on trunk</td><td>Serialisation when six wide diffs arrive in an afternoon</td><td>M08, M10</td></tr>
  <tr><td>Traceability of a unit of work</td><td>Provenance across mobs, engines and validators, as audit evidence</td><td>M16</td></tr>
</table>
<p>Anyone who tells you the published method answers the right-hand column has not run it with five mobs. The honest framing for your own leadership: <em>the method is a mob-level method; platform-level arbitration is ours to build, and here is what it costs.</em></p>

<h3>Why adding mobs does not add throughput</h3>
<p>Two pieces of standard queueing arithmetic explain most of the chart above, and both are worth having at hand when someone proposes solving this with more mobs.</p>
<ul>
  <li><em>Little's law.</em> Work in progress equals throughput multiplied by cycle time. Add mobs without adding validation capacity and you have raised work in progress; since throughput is capped by the validator, cycle time is the only variable left to absorb it.</li>
  <li><em>Utilisation and queue time.</em> For a single server, queue time rises non-linearly with utilisation and becomes unbounded as it approaches capacity. A validator at 95% utilisation is not 15% worse than one at 80%; the queue behind them is several times longer.</li>
</ul>

<div class="callout">
  <div class="k">Where this model is an approximation</div>
  <p style="margin:0">Reviews are not a tidy single-server queue. They arrive in bursts, get batched, jump the line for politics, and are sometimes done badly under pressure — which produces rework, a feedback loop the arithmetic above does not capture. Use the model to predict direction and rough magnitude, never to promise a number. If you present a queueing chart to executives, present it as an argument for measuring, not as a forecast.</p>
</div>

<h3>Three cheap moves, this week</h3>
<ol>
  <li><em>Instrument queue time.</em> One field per bolt: when it became ready for validation, when validation started. Nothing else changes yet.</li>
  <li><em>Inventory your contention</em> in the three classes, which is this module's lab. Most platforms discover an infrastructure constraint they had stopped noticing.</li>
  <li><em>Stop routing everything to the scarcest human.</em> That is M04, and it is the single highest-leverage change available to most platforms.</li>
</ol>
`,
  lab:{
    title:'Contention inventory across three repos',
    pd:['PD-4','PD-8'],
    a:`
<p><strong>Deliverable:</strong> <code>platform-fixture/records/M03_CONTENTION.md</code> — a table of contention points across the three repositories, each classified as code, validator or infrastructure, each with the measurement you would use and the current in-flight bolts it affects. This inventory feeds M04's tiering, M10's pipeline work, and your capstone run in M21, so keep it.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Open <code>records/M02_MAP.md</code> from the M02 lab and start there: every hop it names is a candidate contention point, and its PHI-adjacent column tells you which are likely to be Tier 3. Then load all three repositories plus <code>platform-fixture/intents/</code> and ask for contention points classified into the three classes, with evidence per row.</li>
  <li>Add the resources code cannot see: the SME's calendar, the Thursday board, the single UAT dataset, the CI runner pool, the seat and token limits. Read <code>.github/workflows/</code> and the fixture's constraint notes rather than guessing.</li>
  <li>Cross-reference the three intents in <code>platform-fixture/intents/</code>. Find the units of work that overlap — <em>PD-4</em> puts three of them on the same aggregate.</li>
  <li>Add a row for <code>priorauth-clinical-rules</code> as a whole (<em>PD-8</em>): a shared resource whose contention class is validator, not code, because the constraint is clinical review capacity rather than the file itself.</li>
  <li>Rank by expected days lost per quarter. Ranking forces the judgement the table alone lets you avoid.</li>
</ol>
<h4>Graded moment</h4>
<p>The agent will produce a good code-contention list and almost nothing else, because code is what it can see. Expect nine rows of overlapping files and zero rows about the SME's calendar. That asymmetry is the lesson: the class of contention that dominates cycle time is invisible to the tool you are using to look for it. Your inventory must have at least three validator rows and two infrastructure rows, and you have to get them from humans and config, not from the model.</p>
<h4>Gate</h4>
<p>All three classes populated; PD-4's overlapping units of work named with the aggregate they share; the shared library recorded as validator contention with a stated reason; rows ranked by days lost.</p>`,
    b:`
<p><strong>Deliverable:</strong> identical — the same ranked inventory at <code>platform-fixture/records/M03_CONTENTION.md</code>, all three classes, same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Multi-root workspace with all three repositories. Use workspace-wide chat for the code-contention pass; ask for file-level overlap between the three intents.</li>
  <li>Because retrieval is narrower here, do the intent cross-reference manually: open the three intent files side by side and list units of work touching <code>AuthStatus</code>, <code>Determination</code>, or the threshold constant. <em>PD-4</em> is three overlapping units of work; two are easy to spot and the third reads as unrelated until you check the aggregate.</li>
  <li>Ask Copilot to read <code>.github/workflows/</code> and summarise the shared pipeline resources. Verify the runner count yourself.</li>
  <li>Add the validator rows from the fixture's constraint notes, including the ownerless shared library (<em>PD-8</em>).</li>
  <li>Rank by expected days lost per quarter.</li>
</ol>
<h4>Graded moment</h4>
<p>Same asymmetry, sharper: with a narrower view of the workspace, Copilot will confidently return fewer code-contention rows and describe them as complete. Treat any inventory that arrives without validator rows as evidence about the tool, not about the platform.</p>
<h4>Gate</h4>
<p>Identical to Path A: three classes populated, PD-4's overlaps named with the shared aggregate, the shared library as validator contention with a reason, and a ranking by days lost.</p>`
  }
}
