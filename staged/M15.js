{
  id:'M15',
  title:"Conway's law at agent speed",
  track:3,
  audience:['leader','practitioner'],
  contentionClass:['code'],
  duration:'40 min · 30 min lab',
  visuals:['mb_conway_speed','mb_mob_split','mb_overlap_diagnostic'],
  body:`
<p>Conway's law, restated: a system mirrors the communication structure of the organisation that built it. The AI-DLC twist is uncomfortable and specific.</p>

<h3>Agents do not transcend Conway's law. They enforce it.</h3>
<p>A mob's agent is scoped to the mob's context: its repositories, its steering, its open files, its history. It has no view across the team boundary at all — not a partial view, none. Humans in the same position at least gossip. They overhear a standup, they were on the other team last year, they ask someone at lunch. That informal channel is the main thing that used to soften Conway's law, and an agent has no equivalent.</p>

<div data-viz="mb_conway_speed"></div>

<p>So the organisational structure now reaches the code faster, more literally, and with fewer accidental corrections. <strong>Conway acceleration</strong> is the term this course uses for it. The practical consequence: a badly placed team boundary used to take a year to become an architectural fact. It now takes a quarter.</p>

<h3>The evidence is in the fixture</h3>
<p><code>priorauth-clinical-rules</code> has no owner (<em>PD-8</em>), and its code shows exactly what that produces. Three mobs' idioms layered on each other: Appeals' exception style in one package, Gate's result types in another, Portal's null-tolerant helpers in a third, and two competing criteria-lookup paths that do the same thing differently.</p>
<blockquote>The architecture of an unowned module is the average of everyone who touched it — and an average of three good designs is not a design.</blockquote>
<p>Notice this is not a code-quality claim. Every individual contribution is defensible; the incoherence is structural, and it is a readout of the org chart. No amount of review effort inside individual pull requests produces coherence here, which is why M05's ownership decision is an architecture decision rather than an administrative one.</p>

<h3>Mob composition is an architecture decision</h3>
<div data-viz="mb_mob_split"></div>
<table>
  <tr><th></th><th>Split by feature</th><th>Split by service</th></tr>
  <tr><td>What a mob owns</td><td>An end-to-end capability across web, api and rules</td><td>One repository, all features in it</td></tr>
  <tr><td>Cross-repo bolts</td><td>Most bolts. Every one crosses the context boundary the agent cannot see</td><td>Rare. Bolts stay inside one context</td></tr>
  <tr><td>Cross-mob coordination</td><td>Low per feature, high per module — three mobs edit every module</td><td>High per feature — every feature needs three mobs in sequence</td></tr>
  <tr><td>What the codebase looks like after a quarter</td><td>Coherent features, incoherent modules. Shared libraries drift toward the PD-8 pattern</td><td>Coherent modules, features smeared across releases and hard to trace</td></tr>
  <tr><td>What it does to the registry</td><td>High overlap rate, mostly on shared aggregates</td><td>Low overlap rate, high sequencing dependency</td></tr>
</table>
<p>Neither is correct in general. What matters is that the choice is being made either way, and that under AI-DLC its consequences arrive inside a quarter instead of after a reorg cycle. Feature-split mobs need the M14 registry and boundary contracts to survive; service-split mobs need Intent Sync sequencing and will feel slow per feature. Choose the failure you can operate.</p>

<h3>Ownership boundaries should follow module seams</h3>
<p>When ownership and seams align, most bolts stay internal and the registry is quiet. When they do not, every bolt is a cross-boundary bolt, and the registry fills up with overlaps — which gives you a measurement you did not have before.</p>

<div data-viz="mb_overlap_diagnostic"></div>

<p>This reframes M14's artifact. The registry's <strong>overlap rate as diagnostic</strong> is not primarily a scheduling tool; it is an org-design instrument. Sustained overlap above roughly 20% in the same aggregate, quarter after quarter, is not a coordination failure to be managed harder. It is the codebase telling you that two mobs own one thing.</p>
<p>The diagnostic is cheap and it is the only one in this course that turns a coordination metric into an organisational argument you can put in front of a director with evidence attached.</p>

<h3>The inverse manoeuvre, honestly</h3>
<p>The textbook move is to change the team structure to get the architecture you want. It works. It is also expensive, political, slow, and usually not yours to call — and an inverse Conway manoeuvre justified by a chart of overlap rates will be received as an engineering team asking for a reorg.</p>
<p>What actually travels, in this order:</p>
<ol>
  <li><em>Assign the unowned thing.</em> Cheapest intervention available, requires no reorg, and fixes the specific defect PD-8 represents. Do this first and always.</li>
  <li><strong>Boundary contract</strong>s where two mobs must share an aggregate (M14). Makes the misalignment survivable and, importantly, makes its cost visible in build failures rather than in delay.</li>
  <li><strong>Designated maintainer</strong>s for shared modules — real hours, named people, an entry in CODEOWNERS.</li>
  <li><em>Move one person</em>, not a team. A single embedded engineer with dual context does more for a bad seam than a reorg proposal, and can be arranged this week.</li>
  <li><em>Propose the composition change</em> only when you can show the overlap rate over two quarters and the cost in delay-days. Then it is a business case rather than a preference.</li>
</ol>
<p>And when none of that is available: accept that some seams are badly placed, put the contracts in, and stop paying the coordination cost twice by also relitigating the org chart every quarter.</p>
`,
  lab:{
    title:'Read the org from the code',
    pd:['PD-8'],
    a:`
<p><em>Deliverable:</em> <code>platform-fixture/records/M15_ORG_INFERENCE.md</code> — team boundaries inferred from the code and its history alone, checked afterwards against the M02 mob charters, plus the one misaligned seam and two proposed fixes with costs.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Do not open the charters yet. Working from commit history, directory structure, idiom clusters and test styles, ask the agent to infer how many teams touch this platform and what each one owns. Insist on evidence per inference: a commit cluster, a naming convention, an error idiom, a review pattern.</li>
  <li>Cluster the shared library specifically. Three idioms in one repository is the fingerprint of <em>PD-8</em>; name which packages belong to which idiom.</li>
  <li>Now open the M02 charters and compare. Record where your inference was right, where it was wrong, and — most usefully — where the code says something the charter does not.</li>
  <li>Identify the one seam where ownership and module structure genuinely disagree. There is one clear answer; a second candidate is arguable, and arguing it in writing is worth more than getting the first one.</li>
  <li>Propose both fixes: a boundary contract, and a composition change. Attach the cost of each in hours, people and elapsed weeks. A composition proposal without a cost is not a proposal.</li>
</ol>
<h4>Graded moment</h4>
<p>The agent will infer teams from directory names and file headers, which is the same failure as M02's ownership question wearing different clothes: it produces a plausible org chart that reflects the folder layout rather than the people. Force it onto behavioural evidence — who commits together, which idioms cluster, where reviews come from — and you will get a different and better answer. Expect it to over-merge as well: two mobs with similar idioms will be reported as one, and the tell is the review pattern rather than the code.</p>
<h4>Gate</h4>
<p>Inference made before the charters were opened, with evidence per boundary; the shared library's three idiom clusters named by package; one misaligned seam identified; both fixes costed, with the cheap one recommended first.</p>`,
    b:`
<p><em>Deliverable:</em> identical — the org inference from code alone, the comparison against the charters, one misaligned seam and two costed fixes. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Charters closed. Generate the evidence with git itself rather than the assistant: <code>git shortlog -sne</code> per directory, <code>git log --format</code> grouped by path, and a search for the idiom markers (exception types, result types, assertion styles). Copilot is good at interpreting that output and unreliable at producing it.</li>
  <li>Ask for an inferred team map from the evidence you pasted in, with a stated confidence per boundary.</li>
  <li>Cluster the shared library's packages by idiom to expose <em>PD-8</em>.</li>
  <li>Open the charters, compare, and record the disagreements — especially anything the code says that no charter mentions.</li>
  <li>Name the misaligned seam and cost both fixes.</li>
</ol>
<h4>Graded moment</h4>
<p>Same trap, plus a specific one for this path: given a partial view, Copilot will describe boundaries confidently from the files currently open, and its confidence will not vary with the evidence. Any boundary claim you cannot trace to a commit cluster or an idiom marker should be marked low-confidence in your record, and the exercise is more useful when your document has three low-confidence rows than when it has none.</p>
<h4>Gate</h4>
<p>Identical to Path A: evidence-backed inference made before reading the charters, idiom clusters named, one misaligned seam, two fixes with real costs and the cheap one first.</p>`
  }
}
