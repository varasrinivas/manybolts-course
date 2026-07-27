{
  id:'M01',
  title:'AI-DLC in one sitting, for people who have already run one',
  track:0,
  audience:['leader','practitioner'],
  contentionClass:['validator'],
  duration:'35 min · 15 min lab',
  visuals:['mb_aidlc_primitives','mb_singlemob_annotation'],
  mount(host){
    const btn = host.querySelector('[data-mb="annot"]');
    if (!btn) return;
    const groups = host.querySelectorAll('.mb-annot');
    const out = host.querySelector('[data-mb="annot-out"]');
    btn.addEventListener('click', function(){
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? 'Hide the assumptions' : 'Show the assumptions';
      groups.forEach(function(g){ g.setAttribute('opacity', on ? '1' : '0'); });
      if (out) out.textContent = on ? '5 phrases, 5 assumptions shown' : '5 phrases, 0 assumptions shown';
    });
  },
  body:`
<div class="callout">
  <div class="k">Read this as a recap</div>
  <p style="margin:0">This module has a hard length cap of 35 minutes. If it takes longer, it has stopped being a recap and become a different course. The goal is a shared vocabulary and one landed bolt, not fluency.</p>
</div>

<h3>Four primitives, stated precisely</h3>
<p>Most disagreements about this method are vocabulary disagreements. So, precisely:</p>
<table>
  <tr><th>Primitive</th><th>Definition</th><th>What it quietly assumes</th></tr>
  <tr><td><strong>Intent</strong></td><td>A business outcome stated without a solution. "Members can appeal a denied determination."</td><td>One intent owner, and no other intent in flight touching the same aggregate.</td></tr>
  <tr><td><strong>Unit of work</strong></td><td>The smallest slice of an intent that can be elaborated, built, validated and landed as a whole.</td><td>Sized by one mob, for one mob, with no register of what other mobs sliced.</td></tr>
  <tr><td><strong>Bolt</strong></td><td>One pass of elaborate → generate → validate → land, measured in hours, not days.</td><td>A single mob's bolt has the trunk, the pipeline and the reviewer effectively to itself.</td></tr>
  <tr><td><strong>Validation checkpoint</strong></td><td>The human decision that a generated change is correct and safe enough to land.</td><td>The validator is available when the bolt reaches them. No queue is modelled anywhere in the method.</td></tr>
</table>

<div data-viz="mb_aidlc_primitives"></div>

<h3>Three phases, one loop inside</h3>
<p>Inception turns a business problem into intents. Construction runs bolts against those intents. Operations runs what landed. The loop that matters sits inside Construction and it is short by design: a mob that cannot land in a day has sized the unit of work wrong.</p>
<p><strong>Mob Elaboration</strong> is the ritual where a mob and its agent turn an intent into units of work with acceptance criteria. <strong>Mob Construction</strong> is the ritual where a single mob drives generation and reviews output together rather than asynchronously. Both are defined for one mob in one room. Neither has a defined multi-mob form — that gap is M14.</p>

<h3>The load-bearing element</h3>
<p>Everything in the method rests on the validation checkpoint, which it models for one mob only. It is what makes generated code acceptable in a regulated system: not the tests, not the steering file, but a named human who says yes. Remove it and this becomes vibe coding with extra ceremony. Keep it and it becomes the constraint the rest of this course is about.</p>
<p>In the fixture's baseline round, one mob running four bolts spends roughly <em>18% of bolt wall-clock waiting</em> for a validator. The same four bolts with three mobs sharing that validator spend 61%. Nothing about the method changed. Only the arrival rate did.</p>

<h3>The annotation pass</h3>
<p>Now do the uncomfortable part. Re-read the method's own phrasing and mark every place it says <em>the mob</em> and means <em>the only mob</em>. Toggle the annotations:</p>

<div data-viz="mb_singlemob_annotation"></div>

<p>Five assumptions, none of them stated as assumptions, all of them false the moment a second mob shares the platform:</p>
<table>
  <tr><th>#</th><th>Assumption</th><th>Fails when</th><th>Module</th></tr>
  <tr><td>A1</td><td>One mob is elaborating this part of the domain</td><td>Two intents slice the same aggregate independently</td><td>M14</td></tr>
  <tr><td>A2</td><td>The validator is available when the bolt arrives</td><td>Arrival rate exceeds one reviewer's capacity</td><td>M04, M05</td></tr>
  <tr><td>A3</td><td>The mob can see all the code its change affects</td><td>The change crosses a repo the agent never loaded</td><td>M09</td></tr>
  <tr><td>A4</td><td>Steering is one file with one author</td><td>Five mobs edit five copies, none of them wrong locally</td><td>M12, M13</td></tr>
  <tr><td>A5</td><td>The trunk is quiet between bolts</td><td>Six wide diffs land the same afternoon</td><td>M08, M10</td></tr>
</table>
<p>That annotation is the whole course in one gesture. Nothing above is a criticism of the method — it is a description of its stated scope. The rest of these modules are about what to do outside that scope, and they are labelled as additions rather than citations wherever the published method is silent.</p>

<h3>Carry forward</h3>
<ul>
  <li>The four primitives, precisely, because every later module modifies exactly one of them.</li>
  <li>Two assumptions you can name unprompted. If you cannot, re-read the table — M03 will assume you can.</li>
  <li>One landed bolt, so that when the same bolt takes four times as long in M04 you have your own baseline rather than a claim of mine.</li>
</ul>
`,
  lab:{
    title:'One clean bolt, uncontended',
    pd:['PD-NONE'],
    a:`
<p><strong>Deliverable:</strong> one landed unit of work on <code>priorauth-api</code>, plus a four-line bolt record at <code>platform-fixture/records/M01_BOLT.md</code> naming the intent, the unit of work, who validated it, and the wall-clock split between working and waiting.</p>
<p>PD reference: <em>PD-NONE</em>, deliberately. This lab is declared defect-free because its only job is to establish the uncontended baseline every later lab degrades from. A planted defect here would contaminate that measurement, which is the one number you will keep quoting for the rest of the course.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>In <code>priorauth-api</code>, start a session and give it the intent verbatim: <em>"An auditor can see when a determination was made, to the second."</em> Do not suggest an implementation.</li>
  <li>Ask for units of work only. Expect two or three. Pick the smallest one that is independently landable and say why the others were not.</li>
  <li>Run the bolt: generate, run <code>./mvnw verify</code>, review the diff yourself before the agent summarises it. Note the time you started waiting for your own review and the time you finished.</li>
  <li>Land it on a branch. Write the bolt record. Include the waiting number even if it embarrasses you.</li>
</ol>
<h4>Graded moment</h4>
<p>The agent will offer to implement all the units of work at once, and the diff will look reasonable. Accepting that is the mistake — you lose the ability to measure a single bolt, and in M08 you will lose the ability to land one. Decline it and record that you declined.</p>
<h4>Gate</h4>
<p>A branch that builds; a bolt record with a real work-versus-wait split; and you can name the four primitives and two single-mob assumptions without looking.</p>`,
    b:`
<p><strong>Deliverable:</strong> identical — one landed unit of work on <code>priorauth-api</code> and the same four-line bolt record at <code>platform-fixture/records/M01_BOLT.md</code>. Same gate.</p>
<p>PD reference: <em>PD-NONE</em>, for the same reason as Path A: this is the baseline measurement, and a planted defect would contaminate it.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Open <code>priorauth-api</code> in the IDE. Put the intent in a scratch file as a comment block and ask Copilot Chat in agent mode for units of work — not code.</li>
  <li>Because the context window is assembled from open files, open <code>DeterminationService</code> and its test class first. Note what you had to open manually; that manual step is the A3 assumption showing itself early.</li>
  <li>Generate against the chosen unit of work, run <code>./mvnw verify</code> in the terminal, review the diff in the Source Control view before accepting.</li>
  <li>Land on a branch and write the same bolt record, including the work-versus-wait split.</li>
</ol>
<h4>Graded moment</h4>
<p>Copilot will hold less of the repo in context than you assume and will confidently reference a class it has not read. Ask it which files it used. If the answer omits something the diff touches, record that — it is the same failure that becomes expensive in M09.</p>
<h4>Gate</h4>
<p>Identical to Path A: building branch, bolt record with a real wait number, four primitives and two assumptions nameable unprompted.</p>`
  }
}
