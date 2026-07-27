import React from 'react';

/** Provider-facing view of a determination. Reads the API response directly. */
export function DeterminationPanel({ determination }) {
  return (
    <section className="determination">
      <h2>{determination.status.replace('_', ' ').toLowerCase()}</h2>
      <ul>
        {determination.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <p className="deadline">Decision due {determination.decisionDeadline}</p>
    </section>
  );
}
