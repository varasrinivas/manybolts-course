{
  id:'M08',
  title:'Trunk mechanics for concurrent bolts',
  track:2,
  audience:['practitioner'],
  contentionClass:['code','infrastructure'],
  duration:'40 min · 40 min lab',
  visuals:['mb_merge_queue','mb_migration_collision','mb_stack_landing'],
  crossCard:`
<p>This module looks like plumbing and decides your scarce reviewer's workload, which is why it is worth twenty minutes of a leader's attention.</p>
<p>The mechanism: an agent asked for a feature produces one wide change spanning several units of work. Review of that change cannot be tiered — it collapses to the highest tier it contains, so a diff with one clinical line and forty cosmetic ones consumes clinical review for all of it. Stacked changes, one unit of work each, are what make M04's tiering physically possible. Without them your Tier 3 queue fills with column-width adjustments.</p>
<table>
  <tr><th>Number</th><th>Fixture value</th><th>What it tells you</th></tr>
  <tr><td>Rebases per landed bolt</td><td>0.2 at two mobs, 2.7 at six</td><td>The felt cost of code contention: afternoons spent re-landing finished work</td></tr>
  <tr><td>Time from ready-to-land to landed</td><td>2.3 hours at three mobs</td><td>The trunk-mechanics number that is legible to leadership</td></tr>
</table>
<p>The ask is a merge queue — serialised landing, whole-repository build — plus stacked changes as a working convention. Days of work, and it is one of the six prerequisites in M19 for a reason.</p>
<p><em>Read the full module for:</em> expand–contract schema sequencing so two mobs can land in either order, and why no merge queue spans repositories.</p>
`,
  body:`
<p>This is the module where code contention becomes concrete. Nothing here is novel practice — merge queues and expand–contract migrations predate agents by a decade. What is new is that they move from good hygiene to load-bearing, because the thing they protect against now happens several times a day.</p>

<h3>"Green on my branch" means nothing</h3>
<p>With one mob, a green branch is a reasonable proxy for a green trunk: nothing else landed since you branched. With six mobs it is a statement about a state of the world that no longer exists. The trunk your tests passed against is two merges old.</p>
<p>The only mechanism that fixes this is serialisation at the point of landing — a <strong>merge queue</strong> that rebases each change onto the actual current trunk, runs the suite, and lands it only if it still passes. Not a policy. A gate.</p>

<div data-viz="mb_merge_queue"></div>

<p>Two configuration decisions carry most of the value, and both are usually got wrong:</p>
<ul>
  <li><em>Batch, but bisect on failure.</em> Serial landing at 34 minutes a run caps you at fourteen changes a day, which is under three mobs' output. Batching four changes and bisecting on failure gets throughput back; the cost is that one bad change delays three good ones.</li>
  <li><em>Build the whole repository, not the changed module.</em> Agent diffs are wide and often leave a caller in a module nobody thought was affected. Module-scoped builds are exactly the optimisation that lets that through, and M13's dialect comparison shows one engine doing it reliably.</li>
</ul>

<h3>Diff width is the variable that changed</h3>
<p><strong>Diff width</strong> — how many files a change touches — is the reason collision rates went up. Two changes collide when they touch a common file, so for random diffs the collision probability rises with the product of the widths. Human bolts in the fixture average 4 files; agent bolts average 11, and the wide tail is much heavier: 8% of agent bolts touch more than 30 files.</p>
<table>
  <tr><th>Concurrent bolts</th><th>Avg files per bolt</th><th>Pairs with a shared file</th><th>Rebases per landed bolt</th></tr>
  <tr><td>2</td><td>4</td><td>0.3</td><td>0.2</td></tr>
  <tr><td>3</td><td>11</td><td>1.4</td><td>0.9</td></tr>
  <tr><td>6</td><td>11</td><td>6.1</td><td>2.7</td></tr>
</table>
<p>The last column is the one to instrument, because it is the one an engineer feels: at 2.7 rebases per landed bolt, most of a mob's afternoon is spent re-landing work that was finished before lunch. And each rebase is resolved by an agent that will produce something plausible.</p>

<h3>Stacked changes</h3>
<div data-viz="mb_stack_landing"></div>
<p>A <strong>stacked change</strong> is one unit of work per stack entry, landed in order, each reviewable alone. The discipline matters more under AI-DLC than it did before, for a specific reason: when an agent produces a 40-file diff spanning three units of work, the review that follows cannot be tiered. One entry needs the clinical SME; the other two do not; the combined change needs the SME for all of it.</p>
<p>So stacking is not only a trunk hygiene practice. It is what makes M04's tiering possible at all — an unstacked change collapses to the highest tier it contains, and your Tier 3 queue fills with cosmetic work.</p>

<h3>PD-1: two mobs, one migration version</h3>
<div data-viz="mb_migration_collision"></div>
<p>Appeals and Gate both write <code>V47__</code> migrations on the same day. Both branches are green — Flyway only sees one of them in each branch. The second to land fails on trunk, or worse, lands in a repository whose checksum validation is off and creates two divergent schema histories in two environments.</p>
<p>Renumbering makes the build pass. It does not resolve the actual collision, which is semantic: both migrations alter the same table, and applying them in either order produces a schema neither mob designed. The mechanical fix and the real fix are different things here, which is what makes this a good planted defect.</p>
<p>The durable answer is <strong>expand–contract</strong>: phase schema change so the two mobs can land in either order and neither breaks the other.</p>
<pre><code>Phase 1 — expand   add the new nullable column / new enum value; nobody reads it yet
Phase 2 — migrate  dual-write, backfill, both mobs deploy against the widened schema
Phase 3 — contract remove the old column once no consumer references it

Landing order between mobs is now irrelevant, which is the entire point.</code></pre>
<p>Add a fitness check that fails on a duplicate migration version at merge time. It is fifteen lines and it removes PD-1 as a class rather than as an incident.</p>

<h3>Landing across repositories</h3>
<p>Everything above serialises one repository. Nothing serialises three. There is no merge queue that spans <code>priorauth-api</code>, <code>priorauth-web</code> and <code>priorauth-clinical-rules</code>, so a change that must land in two of them lands in two separate queues, at two separate times, with production between them.</p>
<p>Two rules that hold in practice:</p>
<ul>
  <li><em>Land in dependency order, provider first,</em> and make the provider change backward compatible so the window between landings is safe. If the provider change cannot be backward compatible, it is an expand–contract sequence across repositories and it will take days.</li>
  <li><em>The consumer's contract test runs in the provider's pipeline</em> (M06). Otherwise the window is unmonitored, and the failure mode is not a broken build — it is silence. That silence is PD-9, and it is M09's subject.</li>
</ul>

<h3>What to instrument</h3>
<table>
  <tr><th>Metric</th><th>Why this one</th><th>Fixture baseline</th></tr>
  <tr><td>Rebases per landed bolt</td><td>The felt cost of code contention</td><td>0.9 at three mobs</td></tr>
  <tr><td>Merge queue depth and wait</td><td>Distinguishes infrastructure contention from code contention</td><td>peak 6, mean wait 41 min</td></tr>
  <tr><td>Time from ready-to-land to landed</td><td>The number that makes trunk mechanics visible to leadership</td><td>2.3 h at three mobs</td></tr>
  <tr><td>Duplicate-version rejections</td><td>Proves the PD-1 class is closed</td><td>0 after the check, 2 in the quarter before</td></tr>
</table>
`,
  lab:{
    title:'Land two colliding bolts without breaking trunk',
    pd:['PD-1'],
    a:`
<p><em>Deliverable:</em> both mobs' round-1 bolts landed on trunk in either order without breaking it, an expand–contract migration plan at <code>platform-fixture/records/M08_SCHEMA.md</code>, a merge queue configuration, and a duplicate-migration-version check that rejects <em>PD-1</em> at merge time.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>From <code>repos/priorauth-api</code>, apply <code>../../branches/appeals-r1.patch</code> and <code>../../branches/gate-r1.patch</code> separately, resetting between them. Confirm each applies and builds alone. Then apply both and watch what happens — do this before reading further, because the failure mode is instructive and the fix you would reach for first is wrong.</li>
  <li>Diagnose <em>PD-1</em> properly. Ask two questions in order: do the versions collide, and do the <em>changes</em> collide? Only the second question matters. Write both answers down.</li>
  <li>Design the expand–contract sequence so either mob can land first. Both migrations must become additive and non-breaking; state which phase each existing migration belongs to.</li>
  <li>Configure the merge queue: batch size, whether it builds the whole repository, and what happens on failure. Justify the batch size against the 34-minute suite and three mobs' output.</li>
  <li>Add the duplicate-version check and prove it rejects a deliberately reintroduced duplicate.</li>
  <li>Land both bolts through the queue in one order; reset; land them in the other order. Both must work. That is the deliverable.</li>
</ol>
<h4>Graded moment</h4>
<p>Told the migrations conflict, the agent will renumber the second one to <code>V48__</code> and report the conflict resolved. The build will go green. The schema will be wrong in a way that surfaces weeks later as a nullable column two mobs interpret differently. Renumbering resolves the filename collision and not the change collision, and the distinction is the entire lesson. If your first commit in this lab renamed a file, undo it and start from the schema.</p>
<h4>Gate</h4>
<p>Both bolts land cleanly in either order; the expand–contract plan names the phase of every migration involved; the merge queue configuration is justified in writing against suite runtime and mob count; the duplicate-version check rejects a reintroduced duplicate.</p>`,
    b:`
<p><em>Deliverable:</em> identical — both bolts landing in either order, the expand–contract plan, a justified merge queue configuration, and a working duplicate-version check. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Apply each branch separately, confirm green, then apply both and observe the failure.</li>
  <li>Ask Copilot to compare the two migration files directly, side by side in the editor. Then ask the semantic question explicitly: what does the table look like after both, in each order? Generated answers to this question are frequently wrong in a checkable way — verify against the resulting schema, not the explanation.</li>
  <li>Write the expand–contract phases yourself and have the assistant generate the migration files for each phase. Review the nullability and default of every added column; this is where generated migrations are weakest.</li>
  <li>Configure the merge queue in the workflow file. Verify the batch and whole-repository build settings by reading the YAML rather than the summary.</li>
  <li>Add the duplicate-version check as a pipeline step and prove it rejects a reintroduced duplicate.</li>
  <li>Land in both orders from a clean reset.</li>
</ol>
<h4>Graded moment</h4>
<p>Same trap — renumbering presented as a fix. There is also a path-specific one: asked to make trunk green, Copilot may suggest merging the two migrations into a single file. That destroys the ability to roll back either mob's change independently, which you will want in M17 when one of them turns out to be the cause of an incident.</p>
<h4>Gate</h4>
<p>Identical to Path A: order-independent landing, phased plan, justified queue configuration, working duplicate-version check.</p>`
  }
}
