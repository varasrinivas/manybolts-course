# Intent — Portal

**Outcome:** providers submit requests and track them without calling the plan.

**Why now:** 41% of inbound calls are status enquiries on requests that are simply
still in the queue.

**In scope**
- Submission from the portal, with validation before it reaches us.
- A status view for a submitted request, including an estimated decision date.
- The nurse queue shows the same reasons the provider sees.

**Out of scope**
- Changing determination logic.
- Notifications and email.

**Known constraints**
- Nothing in the portal may display more member data than the provider already holds.
- The queue is used by nurses under time pressure. Fewer clicks, not more.

**Mob:** Portal · **Primary repo:** priorauth-web, then priorauth-api
