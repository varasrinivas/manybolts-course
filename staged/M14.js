{
  id:'M14',
  title:'Cross-mob intent decomposition and Intent Sync',
  track:3,
  audience:['leader','practitioner'],
  contentionClass:['code','validator'],
  duration:'45 min · 40 min lab',
  visuals:['mb_intent_sync','mb_uow_registry','mb_overlap_map'],
  body:`
<p>Elaboration is where the method is strongest and where the multi-mob gap is widest. A mob turns an intent into units of work with acceptance criteria, and does it well. Two mobs do that independently, both well, and produce work that collides — not at merge time, which would be survivable, but at design time, which is not visible until merge time.</p>

<h3>The unmodelled step</h3>
<p>There is no defined ritual for reconciling parallel elaborations. Mob Elaboration assumes one mob is decomposing this part of the domain; nothing in the method says what happens when three are. In practice the reconciliation happens anyway — in a merge conflict, six days later, resolved by whichever agent is asked to fix the rebase.</p>

<div data-viz="mb_overlap_map"></div>

<p><em>PD-4</em> is the fixture's instance and it is deliberately realistic. Three intents, elaborated separately, produce three units of work that all write <code>AuthStatus</code> transitions:</p>
<table>
  <tr><th>Mob</th><th>Unit of work</th><th>Aggregate touched</th><th>How it reads in isolation</th></tr>
  <tr><td>Appeals</td><td>Add APPEALED and APPEAL_UPHELD states</td><td><code>AuthStatus</code>, <code>Determination</code></td><td>Obviously theirs. Nobody would question it.</td></tr>
  <tr><td>Gate</td><td>Emit a criteria-specific threshold decision on the determination</td><td><code>Determination</code>, <code>AuthStatus</code> (sets AUTO_APPROVED)</td><td>Reads as a rules change, not a status change. This is the one that hides.</td></tr>
  <tr><td>Portal</td><td>Show pending-review status with an estimated decision date</td><td><code>AuthStatus</code> (adds a derived state)</td><td>Reads as a UI change. It adds a state to the enum.</td></tr>
</table>
<p>Two of these are easy to spot in the same room. The third — Portal's derived state — reads as presentation work and arrives as a change to the shared enum. Any deconfliction process that relies on people describing their own work in their own words will miss it; a process that asks which aggregates you will touch will not.</p>

<h3>Intent Sync</h3>
<p>This is the course's addition, and it is deliberately small: a 90-minute session <strong>before</strong> parallel elaborations begin, not a review after they finish. If it runs after elaboration, it is a conflict-resolution meeting, which is what you already have.</p>

<div data-viz="mb_intent_sync"></div>

<table>
  <tr><th>Element</th><th>Specification</th></tr>
  <tr><td>When</td><td>Before mobs elaborate, once per planning window. Fifteen minutes per active intent, hard-stopped.</td></tr>
  <tr><td>Who</td><td>One person per mob who will actually be in that mob's elaboration, plus the architecture guardian. Not managers reporting on behalf of mobs.</td></tr>
  <tr><td>The only question</td><td>Which aggregates, contracts and shared files will your intent touch? Named, not described.</td></tr>
  <tr><td>Outputs</td><td>Registry entries for every planned unit of work; a boundary contract wherever two mobs must touch one aggregate; a sequencing decision wherever they must not both proceed.</td></tr>
  <tr><td>Not an output</td><td>Estimates, commitments, capacity allocation, or a plan for the quarter.</td></tr>
</table>

<div class="callout">
  <div class="k">This is not a scaled-agile planning event</div>
  <p style="margin:0">Say so before someone else says it for you. There is no cadence beyond "before elaboration", no commitment ritual, no capacity negotiation, no dependency board carried forward between sessions, and no role that owns the meeting's throughput. It exists to answer one question — who is touching what — and it ends when that question is answered. The honest similarity is that both practices exist because independent teams share a codebase. The honest difference is that this one produces two artifacts and no plan, and it takes 90 minutes rather than two days.</p>
</div>

<h3>The unit-of-work registry</h3>
<p>The registry is the durable artifact. It is an in-repo record of which mob owns which unit of work, which aggregates it touches, and which contract surfaces it changes.</p>

<div data-viz="mb_uow_registry"></div>

<pre><code>| UoW    | Mob     | Aggregates            | Contract surfaces        | Status   |
|--------|---------|-----------------------|--------------------------|----------|
| UOW-41 | appeals | AuthStatus, Determ.   | GET /determinations/{id} | in bolt  |
| UOW-47 | gate    | Determ., AuthStatus   | criteria-eval v3 (jar)   | elaborated |
| UOW-52 | portal  | AuthStatus (derived)  | none declared            | in bolt  |</code></pre>

<p>Four properties matter, and three of them are commonly got wrong:</p>
<ul>
  <li><em>Scope is per platform, not per repository.</em> The registry that lives in one repo cannot see the collision that matters, because the collisions worth catching cross repositories. Put it in the fixture's <code>registry/</code> directory, alongside the intents, and have all three repos reference it.</li>
  <li><em>Written at Intent Sync, before the bolt.</em> A registry updated after landing is a changelog.</li>
  <li><em>Loaded into agent context during elaboration.</em> This is the payoff: an agent that can see the registry will flag "UOW-47 already touches this aggregate" while the elaborating mob is still deciding, which is the only moment the information is cheap. It is the single highest-value context injection on the platform.</li>
  <li><em>Aggregates named, not described.</em> "Status handling" catches nothing. <code>AuthStatus</code> catches PD-4.</li>
</ul>

<h3>Boundary contracts</h3>
<p>Sometimes sequencing is not an option and two mobs must touch one aggregate in the same window. The answer is a <strong>boundary contract</strong>: an explicit, tested surface between them, agreed at Intent Sync and enforced in CI.</p>
<p>For PD-4, the defensible contract is that <code>AuthStatus</code> transitions are owned by <code>priorauth-api</code> and exposed as a state machine with an enumerated transition table; Appeals adds transitions to the table; Portal derives display state from it and adds nothing to the enum; Gate writes only through the existing transition API. One consumer-driven contract test per party, all three running in the api pipeline (M06's mechanism). Now the collision is a build failure on the day it happens rather than a rebase three weeks later.</p>

<h3>Overlap rate</h3>
<p>Count the units of work that touch an aggregate another mob's unit of work also touches, as a share of all units of work in the window. In the fixture's round 1 it is 27%, which is high and which nobody knew before the registry existed.</p>
<p>Treat that number as a diagnostic rather than a scheduling problem. A persistent overlap rate above roughly 20% is telling you that mob boundaries do not match the module seams — the same information M15 reads from the code, arriving here as a metric. Deconfliction manages the symptom; M15 asks whether the org chart is the actual defect.</p>
`,
  lab:{
    title:'Build the registry, find the third overlap',
    pd:['PD-4'],
    a:`
<p><em>Deliverable:</em> <code>platform-fixture/registry/UOW_REGISTRY.md</code> covering all units of work from the three intents, with aggregates and contract surfaces named per entry; one boundary contract with a consumer-driven test per party; and a sequencing decision for any pair that cannot be contracted.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Load the three intents from <code>platform-fixture/intents/</code>. Elaborate each into units of work <em>separately</em> — one session per intent, no cross-contamination. This is the fidelity that makes the lab work: if you elaborate all three together you have already done the reconciliation by accident and learned nothing.</li>
  <li>For each unit of work, extract the aggregates and contract surfaces it touches. Insist on named types and endpoints. Reject any entry whose aggregate column contains a phrase rather than an identifier.</li>
  <li>Merge into the registry and compute the overlap. Two overlaps are obvious. <em>PD-4</em>'s third is Portal's derived state, described as presentation work in an intent that never mentions the enum — the mobs' in-flight work is in <code>branches/</code>, and <code>portal-r1.patch</code> is where the claim becomes undeniable.</li>
  <li>Write the boundary contract for <code>AuthStatus</code>: who owns the transition table, who may add to it, who may only read it. One contract test per party, all running in the provider's pipeline.</li>
  <li>Add the registry to the context your agents load during elaboration, and verify by starting a fourth elaboration and checking whether the agent surfaces the existing claim unprompted.</li>
</ol>
<h4>Graded moment</h4>
<p>Elaborating Portal's intent, the agent will produce a unit of work that adds a value to the <code>AuthStatus</code> enum and will describe it in the registry as a UI change with no contract surface — because from inside that intent, it is. Both descriptions are honest and the registry entry is wrong. You catch it only by asking the aggregate question directly rather than accepting the mob's own framing. If your registry has two overlaps, you have the lab's answer and not the lesson.</p>
<h4>Gate</h4>
<p>All three overlaps present, including PD-4's hidden one; every aggregate column contains identifiers; one boundary contract with three contract tests that fail when the contract is violated; overlap rate computed and stated.</p>`,
    b:`
<p><em>Deliverable:</em> identical — the platform-scoped registry with named aggregates, one boundary contract with a test per party, and a sequencing decision where contracting is impossible. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Elaborate each intent in its own workspace session, deliberately isolated. Close the other intent files — with file-based context assembly, leaving them open does the deconfliction for you and hides the lesson.</li>
  <li>Extract aggregates per unit of work. Ask for named types and verify each by opening the type; this path infers aggregate names from prose more often than it reads them from code.</li>
  <li>Merge into the registry and compute overlap. Find <em>PD-4</em>'s third overlap by searching the enum's usages across the workspace rather than by reading the intents.</li>
  <li>Write the <code>AuthStatus</code> boundary contract and one consumer-driven test per party in the provider pipeline.</li>
  <li>Put the registry in the workspace instruction context and verify a fresh elaboration surfaces the existing claim.</li>
</ol>
<h4>Graded moment</h4>
<p>Same trap, and one addition: asked to compute overlap, Copilot will compare the registry rows as text and report no conflict, because "AuthStatus" and "status handling" are different strings. The overlap check has to run against identifiers you have already normalised — which is the practical reason the registry demands named types rather than descriptions.</p>
<h4>Gate</h4>
<p>Identical to Path A: three overlaps including the hidden one, identifiers throughout, three failing-when-violated contract tests, and a stated overlap rate.</p>`
  }
}
