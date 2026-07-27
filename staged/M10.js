{
  id:'M10',
  title:'Shared CI, test volume, and environment contention',
  track:2,
  audience:['practitioner'],
  contentionClass:['infrastructure'],
  duration:'35 min · 35 min lab',
  visuals:['mb_ci_contention','mb_flake_cost','mb_env_queue'],
  crossCard:`
<p>Infrastructure contention is the least glamorous of the three classes and often the actual constraint this quarter. It is also the only one you can fix with money, which makes it the cheapest conversation you will have about this programme.</p>
<table>
  <tr><th>Fixture number</th><th>Value</th><th>Reading</th></tr>
  <tr><td>Suite runtime, week 0 to week 12</td><td>11 min becomes 34 min</td><td>Coverage rose, no test was wrong, and landing capacity fell by two thirds</td></tr>
  <tr><td>Runner pool utilisation</td><td>83%, mean wait 41 min</td><td>Past the knee. Buy runners; the monthly figure is trivial against a clinician's hour</td></tr>
  <tr><td>Flake rate per job</td><td>2.1%</td><td>Above roughly 1%, engineers re-run red pipelines instead of reading them — and every mechanical control you funded becomes a cultural one again</td></tr>
</table>
<p>The line item people underestimate is not compute. Ephemeral test environments in this domain need synthetic clinical data realistic enough for criteria to evaluate meaningfully, because production data carries protected health information and cannot be cloned. Generating it is real platform work, it needs clinical input, and it removes both the environment queue and part of the review burden.</p>
<p><em>Read the full module for:</em> the quarantine policy that keeps a flaky suite from quietly losing coverage, and what tiered suites let through.</p>
`,
  body:`
<p>Infrastructure contention is the least glamorous of the three classes and the one most likely to be the actual constraint this quarter. It is also the only one you can fix with money, which makes the conversation different.</p>

<h3>Test volume is now a capacity problem</h3>
<p>Agents write tests willingly, which is the good news and the arithmetic problem. In the fixture, twelve weeks of three-mob work took the suite from 1,240 tests at 11 minutes to 3,890 tests at 34 minutes. Coverage went up. Nothing was wrong with any individual test. And the platform's ability to land a change fell by two thirds, because every merge-queue run now costs 34 minutes on a shared runner pool.</p>

<div data-viz="mb_ci_contention"></div>

<p>The queueing behaviour is the same as M04's — a shared server, an arrival rate, a knee past roughly 80% utilisation — with one important difference: this server can be bought. Six runners becomes twelve for a known monthly figure, and that is a far cheaper conversation than hiring a clinical SME. Take it. Then note what it does not fix: parallelism cuts wall-clock, not the number of times a suite must run, so the flake problem below gets worse per unit time rather than better.</p>

<h3>Flakes are a trust problem before they are a technical one</h3>
<div data-viz="mb_flake_cost"></div>
<p>A 2% per-job failure rate feels negligible. Across a six-job pipeline it produces a red build 11% of the time, which is once or twice a day at this platform's volume. What happens next is predictable and it is the real damage:</p>
<ol>
  <li>An engineer re-runs a red pipeline instead of reading it, because last time it was nothing.</li>
  <li>Re-runs double the load on the pool, which lengthens the queue for everyone.</li>
  <li>The pipeline stops being evidence. When a real failure arrives it gets re-run twice before anyone looks, and the merge queue lands it in the meantime.</li>
</ol>
<p>The gate you built in M06 and M07 is only worth what people believe about it. A flaky suite converts a mechanical control back into a cultural one, which is the exact regression this course spends Track 1 arguing against.</p>

<h3>PD-6, and the debugging instinct it teaches</h3>
<p><code>DeterminationServiceIT</code> fails intermittently — on the fixture, anywhere from four to eleven runs in twenty on the same machine, measured with the real runner. The cause is concurrency, not randomness. Audit records ship in 100-millisecond batches, and each determination carries the batch window of the request it decided. The service keeps that window in a field so the audit interceptor can read it without every call site threading it through — and intake decides eight requests in parallel. When two determinations overlap, one request's window lands on another's determination, and the evidence export can no longer reassemble either decision.</p>
<p>This defect is deliberately time-dependent rather than seed-dependent, because the debugging instinct differs and one of them is a habit worth building:</p>
<table>
  <tr><th>Instinct</th><th>What it does here</th></tr>
  <tr><td>Retry the test</td><td>Passes, teaches nothing, and hides a race that misfiles audit evidence whenever two determinations overlap in production</td></tr>
  <tr><td>Add a sleep</td><td>Passes locally, fails in CI, and adds runtime to a suite that is already the constraint</td></tr>
  <tr><td>Reproduce deterministically first</td><td>Pin the thread count, find the shared field, fix the code. The test was right</td></tr>
</table>
<p>Note the last row: the flaky test was not the defect. It was the only thing on the platform that knew about a real race in <code>DeterminationService</code> — one that misfiles audit evidence under load, which is exactly the gap M16 is about. Under one mob's traffic it fires rarely enough to look like a flake. Under five mobs' traffic it is a Tuesday.</p>
<h4>Quarantine policy that survives contact with a deadline</h4>
<ul>
  <li>Detected automatically — a test that fails and then passes on the same commit is flagged by the pipeline, not by a person noticing.</li>
  <li>Quarantined within 24 hours, out of the blocking suite, still running and still reporting.</li>
  <li><em>An owner and an expiry at the moment of quarantine.</em> Same rule as a feature flag, same failure mode without it: quarantine becomes a graveyard and the suite silently loses coverage.</li>
  <li>Quarantine count is reported weekly. A growing count is the leading indicator that the suite is being abandoned rather than maintained.</li>
</ul>

<h3>Tiered suites, with the cost stated</h3>
<table>
  <tr><th>Suite</th><th>Runs on</th><th>Runtime</th><th>What you accept</th></tr>
  <tr><td>Smoke</td><td>Every push</td><td>3 min</td><td>Fast signal, shallow coverage</td></tr>
  <tr><td>Merge suite</td><td>Merge queue only</td><td>12 min, impact-selected</td><td>Selection is heuristic; a wide agent diff can defeat it, so selection must fall back to full on any change touching shared modules</td></tr>
  <tr><td>Full suite</td><td>Nightly and pre-release</td><td>34 min</td><td>Up to 24 hours between a defect landing and the full suite seeing it</td></tr>
  <tr><td>Contract suite</td><td>Provider pipeline, every change</td><td>4 min</td><td>Never skip this one. It is the only thing standing between you and M09's silence</td></tr>
</table>
<p>Impact-based selection is the standard advice and it interacts badly with wide diffs: the more files a change touches, the less selection helps, and agent diffs are wide. Measure how often selection falls back to full before you promise anyone a 12-minute pipeline.</p>

<h3>Environments, and the constraint nobody costs</h3>
<div data-viz="mb_env_queue"></div>
<p>One shared UAT environment, one dataset, one deploy at a time, restored nightly. Three mobs need it for the same three days before the Thursday board. The visible cost is waiting; the hidden cost is that mobs stop using it and validate against a local stub, which moves defect discovery to production.</p>
<p>Ephemeral per-bolt environments are the correct answer and their cost is not compute — it is data. In this domain you cannot clone production: the dataset contains PHI, so every ephemeral environment needs synthetic data that is realistic enough for clinical criteria to evaluate meaningfully. Generating that data is real platform work, it needs clinical input to be credible, and it is the single most commonly underestimated item in a platform plan.</p>
<p>Which makes it an M05 investment with an unusual property: the synthetic dataset is itself a <strong>capacity multiplier</strong>, because it removes both the environment queue and part of the SME's review need — a criteria change that can be demonstrated against realistic data is a much shorter conversation than one that cannot.</p>

<h3>What to instrument</h3>
<table>
  <tr><th>Metric</th><th>Fixture baseline</th><th>What a bad number means</th></tr>
  <tr><td>Pipeline queue depth and wait</td><td>peak 6, mean 41 min</td><td>Buy runners. This one is cheap</td></tr>
  <tr><td>Flake rate per job</td><td>2.1%</td><td>Above roughly 1% the pipeline stops being read as evidence</td></tr>
  <tr><td>Quarantined test count and age</td><td>4, oldest 9 days</td><td>Age is the number that matters; a 90-day quarantine is deleted coverage</td></tr>
  <tr><td>CI minutes per landed bolt</td><td>142</td><td>Cost governance input for M18, and the first number finance will ask for</td></tr>
  <tr><td>Environment wait per bolt</td><td>6.5 h</td><td>Mobs are about to start skipping UAT, and you will find out in production</td></tr>
</table>
`,
  lab:{
    title:'Make the flake deterministic',
    pd:['PD-6'],
    a:`
<p><em>Deliverable:</em> a deterministic reproduction of <em>PD-6</em>, the underlying date-boundary fix in the service rather than in the test, a quarantine policy at <code>platform-fixture/governance/QUARANTINE.md</code> with owner and expiry fields, and a tiered-suite proposal with runtimes and the accepted risk of each tier stated.</p>
<h4>Steps — Path A, Claude Code</h4>
<ol>
  <li>Run <code>DeterminationServiceIT</code> twenty times and record the failure count — <code>./scripts/flake-check.sh</code> does exactly this if you have no Maven to hand. Do not skip it: you need your own number, and the pattern in the failures is the clue.</li>
  <li>Make it deterministic before you make it pass. Vary the thread count — one worker never fails, eight fail often — and note that the rate itself is not stable, which is the tell for a race rather than a clock. State the reproduction as a rule: "fails when two determinations are decided concurrently, because the audit window is shared state."</li>
  <li>Fix the defect where it lives. The test is not wrong; the service holds per-request state in a field. Make it a local, and leave the test asserting what it always asserted. Twenty runs should go from several failures to none.</li>
  <li>Write the quarantine policy: automatic detection of pass-after-fail on one commit, 24-hour quarantine window, mandatory owner, mandatory expiry, weekly count report.</li>
  <li>Propose the tiered suites with real runtimes measured from the fixture, and write down what each tier lets through. Include how often impact selection falls back to the full suite on the fixture's actual diffs. Then check the proposal against the infrastructure rows of <code>records/M03_CONTENTION.md</code>: if it does not move the constraint you ranked highest there, you have optimised the wrong queue.</li>
</ol>
<h4>Graded moment</h4>
<p>Asked to fix a flaky test, the agent will offer a retry annotation, and it will be phrased as standard practice for integration tests. It will work. It will also permanently hide a real date-boundary bug that fires in production at 23:50 on the last day of a month, which is exactly when a determination deadline calculation matters most. Second failure to expect: offered a clock-freezing fix, the agent will freeze the clock in the test <em>and</em> leave the service comparing zones, which makes the test green and the production bug invisible. The graded question is whether your change is in the service or in the test.</p>
<h4>Gate</h4>
<p>Twenty runs green after the fix (<code>./scripts/flake-check.sh</code>); the reproduction rule stated in one sentence; the change is in <code>DeterminationService</code>, not in test configuration; quarantine policy has owner and expiry as required fields; the tiered proposal states each tier's accepted risk and the measured fallback rate.</p>`,
    b:`
<p><em>Deliverable:</em> identical — deterministic reproduction, service-side fix, quarantine policy with owner and expiry, and a tiered-suite proposal with measured runtimes and stated risks. Same gate.</p>
<h4>Steps — Path B, GitHub Copilot</h4>
<ol>
  <li>Run the integration test twenty times from the terminal and record which assertions failed and for which request. Paste those into chat — the pattern across request ids is the input the assistant needs and cannot obtain itself.</li>
  <li>Ask for hypotheses ranked by what the failure messages support, not for a fix. Then test the top hypothesis by dropping the pool to one thread.</li>
  <li>Fix the service. Ask explicitly which state is shared between concurrent calls; generic requests to "fix the flaky test" reliably produce test-side changes on this path.</li>
  <li>Write the quarantine policy with required owner and expiry fields, and a weekly report step in the workflow.</li>
  <li>Measure the tier runtimes yourself and write the proposal, including the impact-selection fallback rate on the fixture's diffs.</li>
</ol>
<h4>Graded moment</h4>
<p>Same trap: a retry or a rerun-on-failure workflow setting, offered as convention. On this path there is an additional temptation — adding <code>continue-on-error</code> to the pipeline step, which silently converts a blocking gate into a notification and will not be noticed for months. Any change to pipeline configuration in this lab needs a sentence justifying why it is not hiding a defect.</p>
<h4>Gate</h4>
<p>Identical to Path A: twenty green runs, a one-sentence reproduction rule, the fix in the service, quarantine policy with mandatory owner and expiry, and a tiered proposal with measured numbers and named risks.</p>`
  }
}
