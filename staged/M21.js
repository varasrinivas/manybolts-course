{
  id:'M21',
  title:'Capstone: The Quarter',
  track:5,
  audience:['leader','practitioner'],
  contentionClass:['code','validator','infrastructure'],
  duration:'20 min setup · 2–3 hr simulation',
  visuals:['mb_event_deck','mb_quarter_board','mb_quarter_retro'],
  body:`
<p>Six timed rounds, each a compressed two-week window. Three mobs, one platform, one injected event per round. You play <strong>platform lead</strong>: you do not write the features, you run the governance and absorb what happens.</p>

<h3>Read the rubric before round 1</h3>
<p>This is deliberate and it is not a courtesy. Discovering the scoring at the end teaches you what you should have done; playing against it from the start teaches you to make the trade-offs under time pressure, which is the actual skill.</p>
<table>
  <tr><th>Dimension</th><th>Points</th><th>Scored on</th></tr>
  <tr><td>Bolts landed</td><td>15</td><td>Units of work landed on trunk across all three mobs</td></tr>
  <tr><td>Validator queue time</td><td>15</td><td>Mean hours a ready bolt waits, by tier</td></tr>
  <tr><td>Contract breakages</td><td>10</td><td>In-repo contract failures reaching trunk</td></tr>
  <tr><td>Cross-repo contract breakage</td><td>10</td><td>A consumer silently not receiving a change (PD-9's class)</td></tr>
  <tr><td>Steering drift events</td><td>10</td><td>Root invariants weakened or omitted below root</td></tr>
  <tr><td>Flag debt</td><td>10</td><td>Live flags past expiry, weighted by age</td></tr>
  <tr><td><strong>Evidence completeness</strong></td><td>20</td><td>Share of landed units of work with every required provenance field, none inferred</td></tr>
  <tr><td>Security queue depth</td><td>10</td><td>Dependency and PHI-path reviews outstanding at round end</td></tr>
</table>
<blockquote>Bolts landed is worth 15 of 100. Evidence completeness is worth 20. <strong>A run that lands everything fast and fails round 5 scores below a slower run that keeps its evidence</strong> — and that is not a scoring quirk, it is the course's thesis expressed as arithmetic.</blockquote>

<h3>The event deck</h3>
<div data-viz="mb_event_deck"></div>
<table>
  <tr><th>Round</th><th>Event</th><th>What it is really testing</th></tr>
  <tr><td>1</td><td>Baseline — three mobs start parallel bolts</td><td>Whether you ran Intent Sync and wrote the registry before elaboration, or after (M03, M14)</td></tr>
  <tr><td>2</td><td>The clinical SME goes on two weeks' leave</td><td>Whether your tier table already exists, whether anything has been encoded, and whether you check that a clinical change reached both of its consumers (M04, M05, M09)</td></tr>
  <tr><td>3</td><td>A fourth mob onboards mid-quarter</td><td>Whether steering is canonical and generated, and whether the newcomer is in the registry on day one (M12, M15, M19)</td></tr>
  <tr><td>4</td><td>Sev-2 in production, cause unclear, code six weeks old</td><td>Whether provenance is real, and whether you can resist a confident unevidenced claim at speed (M17, M16)</td></tr>
  <tr><td>5</td><td>Compliance requests evidence for a threshold change</td><td>Whether the evidence exists or is being reconstructed — the round that decides most runs (M16, M07)</td></tr>
  <tr><td>6</td><td>An executive asks which mob is performing best</td><td>Whether you answer the question behind the question without publishing a ranking (M18, M20)</td></tr>
</table>
<p>Every event changes what the right move is. If you find one that does not alter your decision, say so in the retro — an event that is decoration should be cut, and that feedback is more useful than a high score.</p>

<h3>How a round runs</h3>
<pre><code>./scripts/reset-quarter.sh          # once, before round 1
./scripts/time-round.sh 1 start     # starts the clock and the metric capture

  plan      15 min   what each mob will do, what you will govern
  run       20 min   bolts execute; you handle validation routing and landing
  event      –       the card fires partway through the run
  respond   10 min   your decision, written down before you act
  score      5 min   time-round.sh emits the eight dimensions

./scripts/time-round.sh 1 end</code></pre>
<p>Write the response decision down <em>before</em> acting on it, every round. That written record is what makes the retro worth anything, and it is the artifact that most resembles the job.</p>

<div data-viz="mb_quarter_board"></div>

<h3>Two runs, same platform</h3>
<table>
  <tr><th>Dimension</th><th>Fast run</th><th>Careful run</th></tr>
  <tr><td>Bolts landed</td><td>15 / 15</td><td>9 / 15</td></tr>
  <tr><td>Validator queue time</td><td>8 / 15</td><td>13 / 15</td></tr>
  <tr><td>Contract breakages</td><td>4 / 10</td><td>9 / 10</td></tr>
  <tr><td>Cross-repo breakage</td><td>3 / 10</td><td>8 / 10</td></tr>
  <tr><td>Steering drift</td><td>4 / 10</td><td>8 / 10</td></tr>
  <tr><td>Flag debt</td><td>2 / 10</td><td>8 / 10</td></tr>
  <tr><td>Evidence completeness</td><td>4 / 20</td><td>18 / 20</td></tr>
  <tr><td>Security queue depth</td><td>5 / 10</td><td>8 / 10</td></tr>
  <tr><td><em>Total</em></td><td><em>45</em></td><td><em>81</em></td></tr>
</table>
<p>The fast run landed 67% more work and scored 45. Note where it lost: not on the round it rushed, but on rounds 4 and 5, where it was asked for evidence it had never generated. That lag between the shortcut and the bill is the most realistic thing in this simulation.</p>

<h3>The retrospective</h3>
<div data-viz="mb_quarter_retro"></div>
<p>The retro is the graded artifact, not the score. Identify your two lowest dimensions and trace each to a specific practice you did not have in place — by module, with a sentence on what it would have cost to have it. The course's claim is that the spine modules are the ones whose absence hurts most under load, and your run is the test of that claim rather than a confirmation of it.</p>
<p>Then answer three questions in writing:</p>
<ol>
  <li>Which round did you handle worst, and was the cause a missing artifact or a decision made under pressure? Those have different fixes and conflating them wastes the exercise.</li>
  <li>What did you do in round 1 or 2 that you paid for in round 4 or 5? Name the decision and the delay.</li>
  <li>Which single practice, if it had already existed on day one, would have changed the most rounds? If your answer is not one of the six M19 prerequisites, that is an interesting finding and worth writing up.</li>
</ol>
<p>If you have time to run it twice, do. The second run scores better, and the useful part is which of your improvements came from having the artifacts versus from knowing the deck — those are very different transferable lessons, and only one of them exists in your real platform.</p>
`,
  lab:{
    title:'Run The Quarter',
    pd:['PD-4','PD-6','PD-7','PD-8','PD-9','PD-10'],
    engine:'ENGINE-AGNOSTIC',
    a:`
<p><em>Deliverable:</em> six completed rounds with a scorecard per round, a written response decision per event, and a retrospective at <code>platform-fixture/records/M21_RETRO.md</code> that names your two lowest dimensions and traces each to a specific practice and module.</p>
<p><em>Engine:</em> <strong>ENGINE-AGNOSTIC</strong>, and the reason is substantive rather than convenience. What is scored here is governance under contention — routing, sequencing, evidence, and the decisions you write down before acting. None of the eight dimensions is engine-sensitive, and running the simulation on whichever engine your platform actually uses is more faithful than switching to a prescribed one. If your estate is mixed, run the mobs on different engines: that is closer to your reality and it makes M13's dialect question visible inside a scored quarter.</p>
<h4>Setup, 20 minutes</h4>
<ol>
  <li><code>./scripts/verify-fixture.sh</code>, then <code>./scripts/reset-quarter.sh</code>. Confirm all three repositories build and the round-1 branches apply.</li>
  <li>Decide what you are starting with. Open <code>records/</code> and <code>governance/</code> and list what you actually built: tier table (M04), golden path and ownership decision (M05), fitness functions (M06), supply-chain policy (M07), merge queue and schema plan (M08), contract test and drift report (M09), quarantine policy (M10), canonical steering (M12), registry (M14), provenance v2 (M16). Write down which of the six M19 prerequisites those add up to. That list is your starting position, it changes your score, and the retro refers back to it.</li>
  <li>Read the rubric and the event deck. You are allowed to know what is coming; platform leads generally do.</li>
</ol>
<h4>The planted defects in play</h4>
<p><em>PD-4</em> (three overlapping units of work) fires in round 1 whether or not you ran Intent Sync. <em>PD-8</em> (the unowned shared library) shapes round 2 — if you never assigned an owner, every clinical change queues behind an absent SME. <em>PD-9</em> (version-pin no-op) is live from round 1 and surfaces in round 4 as part of the incident, earlier if you built the drift report. <em>PD-6</em> (time-dependent flake) will interfere with your pipeline at least once and tempt you into a retry. <em>PD-7</em> (provenance v1 without validator identity) is what round 5 breaks against. <em>PD-10</em> (transitive CVE) arrives with a round-3 bolt from the new mob.</p>
<h4>Rules of play</h4>
<ul>
  <li>Time boxes are real. Running long is the most common way to score well and learn nothing, because the platform lead you are simulating does not get extra hours.</li>
  <li>Write the response decision before acting. Every round, one paragraph.</li>
  <li>You may not fix a planted defect outside the round where it bites. They are the terrain.</li>
  <li>Do not read <code>.solutions/</code> until the retro is written.</li>
</ul>
<h4>Graded moments, one per round</h4>
<table>
  <tr><th>Round</th><th>What you will be tempted to do</th><th>What it costs</th></tr>
  <tr><td>1</td><td>Let the mobs elaborate in parallel and reconcile afterwards</td><td>PD-4 lands as a merge conflict in round 3 and the registry never becomes real</td></tr>
  <tr><td>2</td><td>Downgrade Tier 3 items so work keeps moving while the SME is away — and close the round without checking where the criteria change actually landed</td><td>Round 5 asks who validated them; the honest answer is nobody. And the consumer that never received the change stays behind for the rest of the quarter, silently, until round 4 makes it an incident</td></tr>
  <tr><td>3</td><td>Let the new mob copy an existing mob's steering file to move fast</td><td>Steering drift events, and a fourth idiom in the shared library</td></tr>
  <tr><td>4</td><td>Act on the agent's first confident cause</td><td>Mitigating the wrong thing while the real cause keeps producing wrong determinations</td></tr>
  <tr><td>5</td><td>Reconstruct the evidence from commit history and present it</td><td>Fabricated provenance. Score zero for this dimension, and the correct answer was an honest gap</td></tr>
  <tr><td>6</td><td>Give the executive the ranking they asked for</td><td>You lose the queue-time reporting you depend on, which is the metric that warns you first</td></tr>
</table>
<h4>Gate</h4>
<p>All six rounds completed inside their time boxes with a scorecard each; a written response decision per event, recorded before the action; a retrospective identifying the two lowest dimensions and tracing each to a specific module's practice; and one sentence on any event you judged to be decoration.</p>`
  }
}
