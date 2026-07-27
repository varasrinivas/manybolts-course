{
  id:'M16',
  title:'Release coordination and audit evidence',
  track:4,
  audience:['leader','practitioner'],
  contentionClass:['validator','infrastructure'],
  duration:'40 min · 40 min lab',
  visuals:['mb_release_train','mb_provenance_chain','mb_flag_debt'],
  body:`
<p>Six mobs land changes continuously. The business releases on a Thursday, after a board meeting, in a regulated market where a wrong clinical determination is a reportable event. Both of those facts are fixed, and the practice that reconciles them is old: separate deploying from releasing.</p>

<h3>Deploy–release decoupling</h3>
<p><strong>Deploy–release decoupling</strong> means code ships to production continuously behind flags, and the business decides when behaviour changes. It is standard practice and it is the only mechanism that lets continuous landing coexist with a Thursday change advisory board.</p>

<div data-viz="mb_release_train"></div>

<p>What changes under AI-DLC is the flag count. Bolts are small and frequent at three mobs, each one arrives wanting a flag, and nobody removes them. In the fixture's first quarter, three mobs created 34 flags and removed 6.</p>

<h3>Flag debt</h3>
<div data-viz="mb_flag_debt"></div>
<p><strong>Flag debt</strong> is not a tidiness problem. Each live flag doubles the number of code paths in production that nobody has tested in combination, and by flag twenty the combinatorics are past anyone's ability to reason about. The specific failure it produces in this domain: a determination path that behaves correctly under every flag combination tested and incorrectly under the one live in production on the day of an audit.</p>
<p>Two rules, and the second is the one that actually holds:</p>
<ul>
  <li><em>Every flag has an owner and an expiry at creation.</em> Not a review date — an expiry, in the flag definition, as a required field.</li>
  <li><em>A flag past expiry fails the build.</em> Reporting flag debt weekly produces a chart that goes up. Failing the build produces flag removal, and it is the same mechanical-versus-cultural argument as everywhere else in this course.</li>
</ul>
<p>Then measure flag <em>age</em>, not count. Twelve flags all under two weeks old is a healthy platform landing work continuously; four flags averaging nine months is an untested production configuration nobody can describe.</p>

<h3>The provenance chain</h3>
<p>Regulated release needs evidence: what changed, why, who decided it was safe, and what checked it. The <strong>provenance chain</strong> is that evidence, produced as a by-product of the bolt rather than assembled afterwards by a person.</p>

<div data-viz="mb_provenance_chain"></div>

<table>
  <tr><th>Field</th><th>Where it comes from</th><th>The question it answers</th></tr>
  <tr><td>Unit of work</td><td>Registry (M14)</td><td>What was this change for?</td></tr>
  <tr><td>Mob</td><td>Registry, CODEOWNERS</td><td>Who was accountable?</td></tr>
  <tr><td>Engine and version</td><td>Session metadata (M13)</td><td>What produced it? Also: does a systematic defect correlate with a producer?</td></tr>
  <tr><td><strong>Validator identity</strong></td><td>Review record</td><td>Who decided this was safe? This is the field auditors ask about first.</td></tr>
  <tr><td>Tier</td><td>Tier table (M04)</td><td>Was it reviewed at the right level?</td></tr>
  <tr><td>Steering version</td><td>Canonical steering hash (M12)</td><td>Which rules were in force when it was generated?</td></tr>
  <tr><td>Fitness gates passed</td><td>Pipeline output (M06, M07)</td><td>What was mechanically verified, and what was not?</td></tr>
</table>
<p>The economic argument for building this is not compliance. It is that the same record is the fastest path from a production symptom to the context you need at three in the morning — which is M17, and the reason this module comes first.</p>

<h3>PD-7: the field that is not there</h3>
<p>The fixture's provenance schema is v1, and it records the pull request approver rather than the validator. Those are different people and the difference is the entire point of tiering. The approver is whoever clicked; the validator is the person qualified for that tier who made the safety judgement. For a Tier 3 clinical change, v1 cannot tell you whether a clinician was ever involved.</p>
<p>So when compliance asks "who approved the threshold change on the 14th?", the honest answer from v1 is a name that may belong to an engineer who merged it. Producing that name and calling it evidence is worse than having no record, because it converts an unknown into a false statement in an audit file.</p>
<pre><code>PROVENANCE_SCHEMA.v2  — the fields v1 is missing
  validator_identity      required   who made the safety judgement
  validator_qualification required   why they were entitled to make it at this tier
  tier_at_review          required   tier assigned when reviewed, not current tier
  steering_hash           required   canonical steering in force at generation
  gates_passed[]          required   named fitness functions, with results
  engine, engine_version  required   producer identity (M13)

Backfill policy: any field that cannot be evidenced is recorded as
unknown. Never inferred. An inferred validator is a fabricated control.</code></pre>

<h3>Coordinating a release across three repositories</h3>
<table>
  <tr><th>Approach</th><th>Fits when</th><th>Cost</th></tr>
  <tr><td>Independent release per repo</td><td>Contracts are versioned and tested both ways (M06, M09)</td><td>Requires real contract discipline; without it you get M09's silence</td></tr>
  <tr><td>Coordinated train on the board's cadence</td><td>Cross-repo behaviour changes, clinical rule changes</td><td>Slowest common denominator; every mob waits for the least ready</td></tr>
  <tr><td>Independent deploy, coordinated release</td><td><em>This platform.</em> Continuous landing, flags flipped together on Thursday</td><td>Flag discipline becomes load-bearing — see above</td></tr>
</table>
<p>What the board actually needs, and it is less than most teams prepare: what behaviour changes for members and providers, what the rollback is and whether it has been tested, and which changes touched clinical rules with the validator named. If your provenance chain is real, that packet is generated rather than written, and the meeting gets shorter.</p>

<h3>Evidence completeness as a metric</h3>
<p>Count the share of landed units of work whose provenance record has every required field populated, with no inferred values. In the fixture's first quarter it is 61%, and every gap is a question someone will eventually ask about a change nobody remembers.</p>
<p>It is one of the eight capstone metrics, and it is the one that most reliably distinguishes a platform that will survive an audit from one that will spend three weeks reconstructing history from commit messages.</p>
`,
  lab:{
    title:'Answer the auditor',
    pd:['PD-7'],
    a:`
<p><em>Deliverable:</em> <code>platform-fixture/evidence/PROVENANCE_SCHEMA.v2.json</code>, a generator that emits a provenance record per landed bolt, a backfill of the quarter's records with unevidenced fields marked unknown, and written answers to the five questions in <code>evidence/auditor-questions.md</code> with a citation per answer.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Read the five auditor questions first, then read v1. Write down which questions v1 can answer and which it cannot before designing anything — that gap is the specification.</li>
  <li>Design v2. Add validator identity and qualification, tier at review, steering hash, named gates with results, and engine identity. Keep it flat and machine-generated; a schema requiring human narration will not be populated by week three.</li>
  <li>Wire the generator into the bolt loop so the record is a by-product: pipeline output plus registry entry plus review record, assembled automatically at land time.</li>
  <li>Backfill the quarter. This is the instructive part: for several Tier 3 changes there is no evidence of who validated them. Record those as unknown, and count them.</li>
  <li>Answer the five questions with a citation each. At least one answer is "we cannot evidence this, and here is the control we have added so that the next one is answerable." That is a legitimate audit answer; a fabricated name is not.</li>
</ol>
<h4>Graded moment</h4>
<p>Asked to backfill validator identity, the agent will populate it from git history — the approver, the last committer, or whoever reviewed the pull request — and the file will look complete. This is the single most dangerous artifact produced anywhere in this course: a fabricated control, in an audit record, that reads as evidence. It will not be described as inference; it will be presented as the backfill you asked for. Your backfill must distinguish evidenced from inferred, and every inferred value must become <code>unknown</code>.</p>
<h4>Gate</h4>
<p>v2 records validator identity and qualification separately from the approver; the generator produces a record without human narration; the backfill contains unknowns and a count of them; all five auditor questions answered with citations, including at least one honest "cannot evidence".</p>`,
    b:`
<p><em>Deliverable:</em> identical — v2 schema, an automatic record generator, an honest backfill with unknowns counted, and five cited answers. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Read the auditor questions and v1 side by side and list the gaps yourself before generating a schema.</li>
  <li>Ask for the v2 JSON schema with the fields you have specified. Review required-versus-optional carefully: generated schemas on this path habitually mark everything optional, which produces a format that can be satisfied by an empty record.</li>
  <li>Build the generator as a workflow step that assembles pipeline output, registry entry and review record. Verify it runs without a human filling anything in.</li>
  <li>Backfill the quarter, marking unevidenced fields unknown, and count them.</li>
  <li>Answer the five questions with citations.</li>
</ol>
<h4>Graded moment</h4>
<p>Same fabrication risk, and one path-specific amplifier: because the assistant reads the repository it has open, it will offer the pull request approver as validator identity with high confidence and no hedging, since from inside the repository those two fields genuinely look like the same thing. The distinction is organisational, not textual — the approver clicked, the validator judged — and no amount of context makes it inferable from the repository.</p>
<h4>Gate</h4>
<p>Identical to Path A: validator identity and qualification distinct from approver, required fields genuinely required, generator needs no human narration, backfill counts unknowns, five cited answers with at least one honest gap.</p>`
  }
}
