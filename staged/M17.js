{
  id:'M17',
  title:'Incident response for code nobody remembers writing',
  track:4,
  audience:['practitioner'],
  contentionClass:['code','validator'],
  duration:'40 min · 40 min lab',
  visuals:['mb_incident_timeline','mb_confabulation_tells','mb_rollback_tree'],
  mount(host){
    const cards = host.querySelectorAll('[data-mb-claim]');
    if (!cards.length) return;
    const read = host.querySelector('[data-mb="claim-read"]');
    const verdicts = {
      '1': 'Supported. The stack trace and the log line are cited, and both exist in the incident bundle.',
      '2': 'Unsupported — this is the confabulation. A plausible cause with no evidence: no file reference, no trace, and the named config key does not exist in this platform.',
      '3': 'Supported but insufficient. The correlation is real and cited; it establishes timing, not causation. Ask for the mechanism before acting on it.'
    };
    cards.forEach(function(card){
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(){
        const id = card.getAttribute('data-mb-claim');
        cards.forEach(function(c){ c.setAttribute('opacity', c === card ? '1' : '0.45'); });
        if (read) read.textContent = 'Claim ' + id + ': ' + verdicts[id];
      });
    });
  },
  crossCard:`
<p>The postmortem section, which is the part of this module that is yours.</p>
<p>The new failure mode is a Sev-2 whose cause sits in code that landed six weeks ago and that nobody on the call has read. Under sprints someone always remembered; at this volume nobody does. That is a trade your organisation made deliberately — authorship memory for throughput — and it needs a replacement mechanism rather than an apology.</p>
<p><em>"The agent wrote it" is not a cause.</em> A review that stops there produces no system change and teaches everyone to be more careful, which is not a control. The causes actually available, each with a fix that lands as a change:</p>
<table>
  <tr><th>Cause</th><th>Fix</th><th>Built in</th></tr>
  <tr><td>Tier misassignment — clinical logic reviewed as service-internal</td><td>Correct the tier table; add the evidence rule that prevents the class</td><td>M04</td></tr>
  <tr><td>Missing constraint — the invariant existed only as a sentence</td><td>Write the executable check</td><td>M06</td></tr>
  <tr><td>Steering drift — a mob relaxed a root invariant locally</td><td>Invariant coverage check</td><td>M12</td></tr>
  <tr><td>Boundary invisibility — the change crossed a repository nobody validated</td><td>Consumer-driven contract test</td><td>M09</td></tr>
  <tr><td>Evidence gap — you could not tell who validated it</td><td>Provenance with validator identity</td><td>M16</td></tr>
</table>
<p>Hold your incident reviews to this standard: name one of those, land the fix that week, with an owner. A review that produces a reminder has scheduled the same incident. And the operational argument for funding M16's provenance chain is here rather than in compliance — under incident it takes context-gathering from tens of minutes to a query.</p>
<p><em>Read the full module for:</em> how to keep an agent from asserting causation under time pressure, and what rollback means when three mobs have shipped on top of the suspect change.</p>
`,
  body:`
<p>This module is the payoff for M16. If you have not built the provenance chain, everything below is advice you cannot follow.</p>

<h3>The new failure mode, stated plainly</h3>
<p>Sev-2 at 02:40. Determinations are being auto-approved that should have gone to nurse review. The cause is somewhere in code that landed six weeks ago, and nobody on the call has read it. Not "nobody remembers the details" — nobody has read it, because it was generated, validated at the right tier by someone now asleep, and landed correctly.</p>
<p>Under sprints, someone always remembered. There was a person who had typed those lines, and finding them was a Slack message. At AI-DLC volume that person does not exist for most of the codebase, and this is not a hypothetical: it is the predictable consequence of the throughput this method delivers. <strong>Cold code</strong> is the term this course uses, and the honest framing for your organisation is that you have traded authorship memory for throughput, deliberately, and now need a mechanism to replace it.</p>

<h3>Provenance as an investigative tool</h3>
<div data-viz="mb_incident_timeline"></div>
<p>The chain from M16 — unit of work, mob, engine, validator, tier, steering version, gates passed — is not audit paperwork under incident conditions. It is the index. The query "which units of work in the last eight weeks touched the auto-approval path" replaces the forty minutes an on-call engineer would otherwise spend reading commit messages, and it replaces it with an answer that is complete rather than probable.</p>
<p>This reframing is the argument that funds the provenance work in the first place. Nobody approves an evidence-chain project on audit grounds alone; the operational case is stronger and it is the one to make: <strong>provenance-led investigation</strong> takes the median incident's context-gathering phase from tens of minutes to a query.</p>

<h3>Working with the agent under time pressure</h3>
<p>An agent reading unfamiliar code fast is genuinely excellent, which is exactly why the failure mode is dangerous: it is equally fluent when asserting causation it has not established. Under pressure, at 03:00, with three people watching a screen share, that fluency is very hard to resist.</p>
<p>Pick the unsupported claim:</p>

<div data-viz="mb_confabulation_tells"></div>

<p>The <strong>confabulation tell</strong>s worth internalising, all of them cheap to check:</p>
<ul>
  <li>A causal claim with no file reference, no stack frame, and no log line.</li>
  <li>A named configuration key, flag or property that sounds exactly right and does not exist.</li>
  <li>Correlation presented as mechanism: "this changed around then, so this caused it."</li>
  <li>Certainty that does not move when you supply contradicting evidence. A model that revises its story when shown a log line was reasoning; one that absorbs the contradiction without changing the conclusion was not.</li>
</ul>
<p>The discipline: <em>evidence per claim, or the claim is a hypothesis.</em> Write hypotheses in a list, mark each supported or unsupported, and do not let an unsupported one drive a rollback. Say it out loud on the call — it gives everyone else permission to ask too.</p>

<h3>Rolling back when three mobs have shipped on top</h3>
<div data-viz="mb_rollback_tree"></div>
<p>The suspect unit of work landed six weeks ago and eleven units of work from three mobs have landed on top of it, four of them touching the same files. A revert is not available in the sense people mean it.</p>
<table>
  <tr><th>Option</th><th>When it works</th><th>What it costs</th></tr>
  <tr><td>Flip the flag off</td><td>The change is behind a live flag — the reason M16's flag discipline matters at 03:00</td><td>Nothing. This is why you did it.</td></tr>
  <tr><td>Forward fix behind a new flag</td><td>Cause is understood and narrow</td><td>Another flag, which needs an owner and expiry even at 03:00</td></tr>
  <tr><td>Surgical revert of one unit of work</td><td>Stacked changes (M08) kept it independently revertible</td><td>Rebase risk on eleven subsequent changes; do it in the merge queue, not by hand</td></tr>
  <tr><td>Roll back the whole release</td><td>Nothing else works</td><td>Discards three mobs' correct work and buys a second incident on Monday</td></tr>
</table>
<p>When the change predates your flag discipline, and some will, the honest sequence is: mitigate at the edge — rate-limit the path, force everything to nurse review, accept the queue — then fix forward in daylight. Forcing all determinations to human review costs the SME queue dearly and is the correct trade at 03:00, because the failure mode you are stopping is wrong clinical outcomes.</p>

<h3>Postmortem without a scapegoat</h3>
<p>"The agent wrote it" is not a cause. It is a description of the tool, and a postmortem that stops there produces no system change and quietly teaches everyone to be more careful, which is not a control. The causes actually available to you, each one a system fix:</p>
<table>
  <tr><th>Cause</th><th>Fix</th><th>Module</th></tr>
  <tr><td>Tier misassignment — clinical logic reviewed as service-internal</td><td>Correct the tier table; add the evidence rule that prevents the class</td><td>M04</td></tr>
  <tr><td>Missing constraint — the invariant existed only as a sentence</td><td>Write the fitness function</td><td>M06</td></tr>
  <tr><td>Steering drift — a mob relaxed a root invariant locally</td><td>Invariant coverage check; contradiction scan</td><td>M12</td></tr>
  <tr><td>Boundary invisibility — the change crossed a repository nobody validated</td><td>Consumer-driven contract test in the provider pipeline</td><td>M09</td></tr>
  <tr><td>Evidence gap — you could not tell who validated it</td><td>Provenance v2 with validator identity</td><td>M16</td></tr>
</table>
<p>A <strong>systemic postmortem</strong> names one of those and lands the fix as a change, in the same week, with an owner. If your incident review produces a reminder rather than a commit, the same incident is scheduled.</p>

<div class="callout honest-limit">
  <div class="k">Honest limit — what provenance does not give you</div>
  <p>Provenance tells you what happened and who signed it. It does not tell you why the code is wrong, and it will not shorten the hard part of an incident — the reasoning about mechanism. Expect the chain to compress context-gathering substantially and diagnosis not at all. Selling it internally as a way to resolve incidents faster overall will produce a disappointed sponsor after the first genuinely hard Sev-2.</p>
  <p>Three further limits. <em>Cold code stays cold.</em> Nothing in this module gives you back the engineer who understood the module; the agent reading it at 03:00 is fast and has no history with the system, and for a subtle domain bug that history is exactly what would have helped. <em>The chain is only as good as its weakest field</em> — one unknown validator, as PD-7 produces, and the interesting question about a Tier 3 change becomes unanswerable at the moment you most need it. And <em>the discipline degrades under pressure precisely when it matters</em>: demanding evidence per claim is easy to write in a module and hard at 03:40 with an executive on the bridge. Assume it will slip, and make the slip cheap — a hypothesis list in the incident channel, written as you go, is the only version of this practice that survives a real night.</p>
</div>
`,
  lab:{
    title:'Sev-2, six weeks cold',
    pd:['PD-7'],
    a:`
<p><em>Deliverable:</em> a resolved incident inside a 60-minute time box, a hypothesis list with each claim marked supported or unsupported and its evidence cited, and a postmortem at <code>platform-fixture/records/M17_POSTMORTEM.md</code> naming a systemic cause and no individual.</p>
<p>Run <code>platform-fixture/scripts/break-round4.sh</code> to start. You do not need to have played rounds 1 to 3: the script fast-forwards the fixture to round-4 state — three mobs' work landed on top of a suspect change six weeks old — and then injects the live break, which is that determinations are auto-approving below the threshold. Start the clock before you read anything else.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Symptom first, in numbers: what share of determinations is auto-approving, since when, and which criteria are involved. Do not form a hypothesis before you have the shape of the symptom.</li>
  <li>Query provenance for units of work touching the auto-approval path in the last eight weeks. You will get a short list. Note how long this step took — that number is the module's argument.</li>
  <li>Investigate with the agent, one hypothesis at a time, demanding a file reference or a log line per claim. Maintain the hypothesis list as you go; you will need it for the postmortem and you will not reconstruct it afterwards.</li>
  <li>Mitigate before you fix. Decide between flag, forward fix, surgical revert and release rollback using the table in this module, and write down why you chose it while you are choosing it.</li>
  <li><em>PD-7 will cost you time.</em> The suspect change is Tier 3 and its provenance record names an approver rather than a validator, so you cannot tell whether a clinician ever saw it. Record what that gap cost you in minutes — that number is the business case for M16's v2 schema, and it is more persuasive than any argument in this course.</li>
  <li>Write the postmortem: timeline, systemic cause from the table above, the fix as a landed change with an owner, and the evidence gap as a second finding.</li>
</ol>
<h4>Graded moment</h4>
<p>Within the first ten minutes the agent will name a cause confidently — usually the most recently changed file in the path, occasionally a configuration key that does not exist. It will be plausible, it will be delivered without hedging, and under time pressure with people watching you will want to act on it. Challenge at least one claim for lack of evidence and record the challenge. The second failure to expect: asked for a postmortem, the agent will write "the AI-generated change introduced the defect", which names the tool and no cause. Reject it and name the system fix.</p>
<h4>Gate</h4>
<p>Cause found inside the time box; at least one agent claim explicitly challenged for lack of evidence, with the challenge recorded; mitigation chosen with a written reason; the PD-7 time cost quantified in minutes; postmortem names a systemic cause and no individual.</p>`,
    b:`
<p><em>Deliverable:</em> identical — incident resolved in the time box, an evidence-marked hypothesis list, and a postmortem naming a systemic cause. Same gate.</p>
<p>Same start: run <code>platform-fixture/scripts/break-round4.sh</code>, start the clock, work from round 4 state.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Quantify the symptom from the fixture's metrics output before touching the code.</li>
  <li>Query the provenance records directly — they are files; search them rather than asking the assistant to summarise them. Under time pressure a summary of evidence is a liability, because you cannot tell which part was read.</li>
  <li>Investigate hypothesis by hypothesis with the relevant files open. Demand a file reference per claim; on this path an unreferenced claim is frequently about a file outside the workspace, which the assistant will not tell you.</li>
  <li>Mitigate, with the reason written down at the time.</li>
  <li>Hit <em>PD-7</em>: the Tier 3 change has an approver and no validator. Time the detour and record the minutes.</li>
  <li>Write the postmortem with a systemic cause and a landed fix with an owner.</li>
</ol>
<h4>Graded moment</h4>
<p>Same two failures. The path-specific one is worth watching for: asked what changed in the auto-approval path, the assistant answers from open files, so a suspect change in the shared library will be omitted silently rather than reported as unknown. In an incident, "I cannot see that repository" is the most valuable sentence a tool can produce and this one will not produce it — so ask explicitly which repositories are in scope, before you trust a negative answer.</p>
<h4>Gate</h4>
<p>Identical to Path A: cause inside the time box, one recorded evidence challenge, mitigation reasoned in writing, PD-7 cost in minutes, systemic postmortem with no individual named.</p>`
  }
}
