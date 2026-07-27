{
  id:'M12',
  title:'Governing shared steering artifacts',
  track:3,
  audience:['leader','practitioner'],
  contentionClass:['code'],
  duration:'40 min · 35 min lab',
  visuals:['mb_steering_hierarchy','mb_drift_trace','mb_shared_lib_steering'],
  body:`
<p>A <strong>steering artifact</strong> is the file your agent reads before it writes anything: <code>CLAUDE.md</code>, <code>copilot-instructions.md</code>, whatever your engine calls it. Most organisations file these under documentation. That filing decision is the mistake this module is about.</p>

<h3>Steering is load-bearing architecture</h3>
<p>One sentence in a steering file changes every future bolt in its scope. "Prefer constructor injection" is a design decision applied by a machine, without exception, to code nobody has written yet. That makes it more consequential than most pull requests and it is reviewed with less care than any of them — typically by one person, in a diff nobody blocks.</p>
<p>The precise claim: at one mob, steering is a convenience. At five mobs it is the primary mechanism by which architecture either holds or dissolves, because it is the only control that acts before generation rather than after.</p>

<h3>The hierarchy, and one rule about it</h3>
<div data-viz="mb_steering_hierarchy"></div>
<table>
  <tr><th>Level</th><th>Owns</th><th>Example in this platform</th><th>Change control</th></tr>
  <tr><td>Platform root</td><td>Invariants that hold everywhere</td><td>No PHI in logs; audit before response; criteria only via the shared evaluator</td><td>Architecture guardian, Tier 2 review, with a fitness function per invariant</td></tr>
  <tr><td>Repository</td><td>Stack and structure for this codebase</td><td>Spring conventions in api; component library rules in web</td><td>Repo owners</td></tr>
  <tr><td>Mob</td><td>Local working preferences</td><td>Test naming, commit style, how the mob likes plans presented</td><td>The mob, freely</td></tr>
  <tr><td>Session</td><td>This task only</td><td>"We are refactoring, do not add features"</td><td>Nobody, by design</td></tr>
  </table>
<blockquote><strong>Additive-only precedence</strong>: a lower level may add constraints, never remove or weaken one from above. A mob steering file that says "audit writes are optional in this service" is not a local preference. It is an unreviewed architecture change, and at five mobs it is how invariants die.</blockquote>
<p>Additive-only is easy to state and impossible to enforce by reading, because the weakening is usually implicit — a mob file that re-states a rule with a softer verb, or omits a constraint while listing the others. Which is why the rule needs a check rather than a policy.</p>

<h3>Steering drift, and how to detect it mechanically</h3>
<p><strong>Steering drift</strong> is mob-local relaxation of a root invariant, propagating into the codebase unnoticed. Two of the fixture's planted defects are instances, and they drift differently:</p>
<table>
  <tr><th>Defect</th><th>What drifted</th><th>How it became invisible</th></tr>
  <tr><td><em>PD-11</em></td><td>Two mobs' steering files specify contradictory error-handling conventions — one wraps in a domain exception, one returns a result type</td><td>Both files are internally consistent and neither is wrong. The contradiction only exists in the codebase, where the two idioms now meet at a service boundary.</td></tr>
  <tr><td><em>PD-3</em></td><td>The <code>@PhiBoundary</code> requirement is in root steering; the Gate mob's generated endpoints stopped carrying it</td><td>No file changed. The agent copied a neighbouring class that predated the rule, and nothing checked.</td></tr>
</table>

<div data-viz="mb_drift_trace"></div>

<p>Note what PD-3 implies: <em>you cannot detect drift by diffing steering files.</em> The steering estate can be perfectly consistent while generated code diverges from it. Three checks that do work, in ascending order of usefulness:</p>
<ol>
  <li><em>Invariant checksum.</em> Each root invariant has an identifier; every steering file below root must reference the set. A file missing an identifier fails CI. Catches omission, which is the most common weakening.</li>
  <li><em>Contradiction scan.</em> A scheduled job that reads all steering files and asks an agent for pairwise contradictions. Cheap, noisy, and the only thing that finds PD-11 before the code does.</li>
  <li><em>Fitness function per invariant.</em> The invariant exists twice: as a sentence for the agent and as a test for the pipeline. Catches PD-3, and every future PD-3, without anyone reading anything.</li>
</ol>
<p>The third is the real answer and it costs the most. Budget one fitness function per root invariant and keep the root list short enough that this is possible — a root steering file with forty invariants has none.</p>

<h3>Steering for a library nobody owns</h3>
<div data-viz="mb_shared_lib_steering"></div>
<p><code>priorauth-clinical-rules</code> is where this gets genuinely hard. Three mobs' agents edit it, and each arrives carrying its own mob steering. The library's own conventions — criteria immutability, no I/O in evaluation, every rule change ships with a criteria test — need to bind whoever is editing, regardless of which mob they belong to and which engine they run.</p>
<p>Two things have to be true, and on most platforms neither is:</p>
<ul>
  <li><em>The steering must live with the library</em>, in its repository, not in the consuming mob's configuration. Otherwise the rule is only as good as whichever mob remembered to copy it.</li>
  <li><em>The agent must actually load it</em> when editing that repository. This is a real limitation rather than a policy problem: an agent working in a multi-root workspace or across a dependency boundary frequently does not pick up the dependency's steering file at all. Verify it empirically on your engine — ask the agent to quote the library's steering rules back before it edits. If it cannot, your steering for that library is decorative. M09 is about that boundary in general; this is its most expensive instance.</li>
</ul>

<h3>Treat a steering change as a code change</h3>
<p>The practice that separates platforms where this holds from platforms where it does not:</p>
<ul>
  <li>Root steering changes are <strong>Tier 2</strong> at minimum, reviewed by the <strong>architecture guardian</strong>, with the fitness function landing in the same change. No invariant without a check.</li>
  <li>Every root invariant carries an identifier, an owner, and the test that enforces it. Three columns, one table, in the repository.</li>
  <li><strong>Steering drift</strong> events are counted and reported, the same way you count contract breakages. It is one of the eight capstone metrics, and a rising count is the earliest available signal that mob autonomy has drifted into architectural divergence.</li>
</ul>
<p>None of this is in the published method, which describes steering files as capturing team conventions and stops there. At one mob that is sufficient. The hierarchy, the precedence rule and the drift checks are this course's addition, and they are the cheapest of the additions to adopt.</p>
`,
  lab:{
    title:'Reconcile the steering estate',
    pd:['PD-11','PD-3'],
    a:`
<p><em>Deliverable:</em> <code>platform-fixture/governance/STEERING.canonical.md</code> with a numbered root invariant list, one CI check that fails when a mob steering file omits an invariant identifier, and a written resolution of <em>PD-11</em> that ends in a fitness function rather than a longer document.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Inventory every steering file across the three repositories and the three mob directories. Expect more than you think: mob files, repo files, and at least one stale copy someone forgot.</li>
  <li>Extract the root invariants and give each an identifier (INV-1, INV-2, ...). Keep the list under ten. If you have twenty, you are writing documentation again.</li>
  <li>Find <em>PD-11</em>: two mobs' files that contradict each other on error handling. Decide which convention is the invariant, and record the decision with a reason. Then encode it — the resolution must be a check, because a resolved contradiction that lives only in prose will be re-broken by the next mob.</li>
  <li>Find <em>PD-3</em> by looking at code rather than files: the annotation requirement is in root steering and absent from Gate's endpoints. Confirm no steering file was ever edited. That is the finding.</li>
  <li>Write the CI check for invariant identifier coverage across all mob files, and confirm it fails on a file with a deliberate omission.</li>
</ol>
<h4>Graded moment</h4>
<p>Asked to resolve the error-handling contradiction, the agent will write an excellent paragraph. It will be balanced, cite both conventions, recommend one, and add three sentences to the root steering file. That is the wrong artifact: a longer steering document is precisely what fails at five mobs, because compliance is voluntary and invisible. The resolution has to be executable — a test that fails when the losing convention appears at a service boundary. Grade yourself on whether your resolution can fail a build.</p>
<h4>Gate</h4>
<p>Root invariants numbered and under ten; the identifier-coverage check fails on a deliberate omission; PD-11 resolved with a working fitness function and a one-line rationale; PD-3 documented as drift with no steering file change, naming the bolt that introduced it.</p>`,
    b:`
<p><em>Deliverable:</em> identical — canonical root invariants, an identifier-coverage CI check, and an executable resolution of PD-11. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Inventory steering files across the workspace, including <code>.github/copilot-instructions.md</code> and any per-directory instruction files. This estate is usually more scattered than the equivalent for Path A, and the stale copies matter.</li>
  <li>Number the root invariants, keeping the list under ten.</li>
  <li>Find <em>PD-11</em> and decide the invariant. Note the specific hazard on this path: the assistant will happily generate a merged instruction file that contains both conventions phrased compatibly. That reads like a resolution and resolves nothing.</li>
  <li>Find <em>PD-3</em> in the generated code rather than in configuration, and confirm no instruction file changed.</li>
  <li>Write the coverage check as a workflow step and prove it fails on an omission.</li>
</ol>
<h4>Graded moment</h4>
<p>Same trap: the deliverable must be able to fail a build. A merged instruction file that accommodates both error-handling conventions is the most likely output and the clearest failure — it converts a detectable contradiction into an undetectable one.</p>
<h4>Gate</h4>
<p>Identical to Path A: fewer than ten numbered invariants, a coverage check that fails on omission, PD-11 resolved by a fitness function, PD-3 recorded as drift with its originating bolt named.</p>`
  }
}
