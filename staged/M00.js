{
  id:'M00',
  title:'Orientation: the platform, the fixture, how to use this course',
  track:0,
  audience:['leader','practitioner'],
  contentionClass:['validator'],
  duration:'20 min · no lab',
  visuals:['mb_course_map','mb_repo_topology'],
  body:`
<blockquote>Your pilot mob succeeded. That was the easy part. This course is about the second mob, and the fifth — five mobs against one platform, one clinical SME, one CI pipeline, and a change advisory board that meets Thursdays.</blockquote>

<h3>Who this is for, and who it is not for</h3>
<table>
  <tr><th>Your situation</th><th>Where to go</th></tr>
  <tr><td>One team, one codebase, first bolts</td><td>Optional prerequisite, not required here: AI-DLC for Sprint Teams covers the single-team migration. This course assumes contention you do not have yet.</td></tr>
  <tr><td>Two or more mobs, one trunk, one scarce reviewer</td><td>Start at M01 and go straight through. This is the course.</td></tr>
  <tr><td>Platform lead or architect, several teams asking for the same thing</td><td>All of it. Track 1 first if you only get one week.</td></tr>
  <tr><td>You have to defend this to a risk officer or a CFO next month</td><td>M03, M04, M18, M20. Use the Leader filter.</td></tr>
</table>

<h3>The unit of analysis is the platform</h3>
<p>Every other treatment of this method takes the team as the unit: one mob, one intent, one loop. That framing works exactly until a second mob shares your trunk, your reviewer, and your pipeline. Then the interesting variable is no longer how fast a mob works — it is how much of the platform each mob has to wait for.</p>
<p>So the object of study here is the shared thing: the codebase, the validator, the environment. The mobs are load.</p>

<div data-viz="mb_repo_topology"></div>

<p>Three repositories, and the awkward one is at the bottom. <code>priorauth-clinical-rules</code> is consumed by both services and owned by neither. Every change to it needs clinical review; no mob has clinical capacity of its own. Hold that discomfort — M02 names it, M05 resolves it, and M15 explains why it produced the code it did.</p>
<div class="callout">
  <div class="k">Where the third repository does and does not matter</div>
  <p style="margin:0">Worth setting expectations, because the fixture was play-tested for exactly this. In the first two rounds of the simulation, nothing about the third repository hurts: every collision you meet is inside <code>priorauth-api</code> — the same file, the same enum, the same migration version. The multi-repo damage in those rounds is real and completely silent, which is why round 2 now asks you to go and check for it rather than waiting for a build to tell you. The third repository starts costing you visibly in M09, M11 and M15, and it becomes an incident in round 4. If you are looking for the argument that repository topology matters, it is there, and it is not in week one.</p>
</div>

<h3>The course in one screen</h3>
<div data-viz="mb_course_map"></div>
<p>Twenty-two modules, six tracks. Budget <em>about 25 hours of reading and labs plus a 2–3 hour capstone</em> — the per-module timings in each header add up to that, and they assume the fixture already builds. The filled chips are the spine: if this had to shrink to eight modules, those eight survive. Read them in order and you have the argument end to end.</p>

<h3>What you need before M01</h3>
<table>
  <tr><th>Requirement</th><th>Used for</th><th>Check it now</th></tr>
  <tr><td>JDK 17 or later, and Maven</td><td><code>priorauth-api</code> and <code>priorauth-clinical-rules</code> build in most labs</td><td><code>java -version</code>, then <code>./mvnw -v</code> from either repo. The wrapper finds Maven on your PATH, or via <code>MAVEN_HOME</code> if it is installed somewhere else</td></tr>
  <tr><td>Node 20 and npm</td><td><code>priorauth-web</code>, and the dependency-tree checks in M07 and M09</td><td><code>node -v</code>, <code>npm -v</code></td></tr>
  <tr><td>git, and a shell that runs <code>.sh</code> scripts</td><td>fixture setup, round scripts, the capstone harness</td><td><code>git --version</code></td></tr>
  <tr><td><em>One agent engine</em> — Claude Code or GitHub Copilot</td><td>every lab, either path</td><td>open it against a scratch repo once</td></tr>
  <tr><td><em>Both</em> engines, for M13 only</td><td>M13 is the one module about engine difference; its lab diffs two engines against one canonical steering source</td><td>if you have one, M13 tells you what to run instead</td></tr>
</table>
<p>No cloud account, no licence beyond your engine, and nothing to install for the player itself.</p>

<h3>Set up the fixture before M01</h3>
<p>The fixture is one repository that carries the intents, governance templates, round scripts and evidence, and pulls the three service repositories in beside them. Clone and verify it now — a broken fixture discovered in the middle of M04 costs more than ten minutes of setup.</p>
<pre><code>git clone &lt;host&gt;/platform-fixture
cd platform-fixture
./scripts/setup.sh          # clones priorauth-api, priorauth-web,
                            # priorauth-clinical-rules into repos/
./scripts/verify-fixture.sh # all three build; round-1 branches apply</code></pre>
<p>After that you have <code>platform-fixture/repos/</code> for the three services, and <code>intents/</code>, <code>governance/</code>, <code>registry/</code>, <code>evidence/</code>, <code>branches/</code>, <code>scripts/</code> and an empty <code>records/</code> for the artifacts you produce. Every lab path in this course is relative to <code>platform-fixture/</code>.</p>
<p><strong>Gate:</strong> all three repos build and <code>verify-fixture.sh</code> reports green. Nothing else in M00 matters as much as this.</p>

<div class="callout">
  <div class="k">The fixture is not clean, on purpose</div>
  <p style="margin:0">The repositories contain twelve planted defects. They are curriculum, not accidents — a duplicate migration, an unowned library, a version pin that silently discards another mob's work. When a lab tells you something is broken, it is broken deliberately. Do not fix what you were not asked to fix, and do not read anything under <code>.solutions/</code> until the module says so.</p>
</div>

<h3>The audience filter</h3>
<p>The sidebar filter has two settings beyond All. <em>Leader</em> shows the modules about capacity, cost, evidence, and rollout sequencing. <em>Builder</em> shows the mechanics: trunk, CI, contracts, brownfield. Several modules appear in both with different emphasis — M04 and M05 in particular, because the validation economy is simultaneously a staffing decision and a merge-queue decision.</p>
<p>If you are a director reading the Builder track anyway, you will be fine. If you are an engineer skipping the Leader modules, you will lose the argument in M20 that you will eventually be asked to make.</p>

<h3>How the capstone is scored, and why speed alone loses</h3>
<p>M21 is <strong>The Quarter</strong>: six timed rounds, three mobs, one platform, one injected event per round. You play platform lead — you do not write the features. Eight scored dimensions:</p>
<table>
  <tr><th>Dimension</th><th>What it punishes</th></tr>
  <tr><td>Bolts landed</td><td>Governance so heavy nothing ships</td></tr>
  <tr><td>Validator queue time</td><td>Routing everything to the scarcest human</td></tr>
  <tr><td>Contract breakages</td><td>Cross-repo changes landed on faith</td></tr>
  <tr><td>Steering drift events</td><td>Mob-local relaxation of a root invariant</td></tr>
  <tr><td>Flag debt</td><td>Flags created without an owner or an expiry</td></tr>
  <tr><td>Evidence completeness</td><td>Shipping without provenance, then being asked for it</td></tr>
  <tr><td>Security queue depth</td><td>Treating supply chain as a human gate</td></tr>
  <tr><td>Cross-repo contract breakage</td><td>Not noticing a consumer that silently stopped receiving your change</td></tr>
</table>
<p>The rubric is visible from round 1, deliberately. <strong>A run that lands everything fast and fails round 5 scores below a slower run that keeps its evidence.</strong> Any scoring scheme that rewards throughput alone would teach the opposite of this course.</p>

<h3>What this course does not do</h3>
<ul>
  <li><em>It does not re-teach the method.</em> M01 is a 35-minute recap for people who have already run a bolt, not an introduction.</li>
  <li><em>It does not claim the published method solves multi-team coordination.</em> It does not. There is no defined ritual for coordinating parallel elaborations, no position on repo topology, and no model of validator capacity. Where the method is silent, this course says so and then offers something — clearly labelled as an addition, not a citation.</li>
  <li><em>It does not reassure.</em> Six modules carry an explicit honest-limit section stating where the practice fails or the argument stops. Those sections are the most useful pages here, and the ones most likely to be edited out by anyone summarising this course for you.</li>
</ul>
`
}
