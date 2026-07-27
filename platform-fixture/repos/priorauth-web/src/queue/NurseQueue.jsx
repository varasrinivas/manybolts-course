import React from 'react';
import { denialReasons } from '@meridiancare/clinical-rules';

/**
 * Nurse review queue.
 *
 * Renders reasons from the clinical rules package rather than from the API
 * response, so that the queue and the provider portal always agree.
 */
export function NurseQueue({ items }) {
  return (
    <table className="nurse-queue">
      <thead>
        <tr>
          <th>Request</th>
          <th>Member</th>
          <th>Procedure</th>
          <th>Why it is here</th>
          <th>Decide by</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.requestId}>
            <td>{item.requestId}</td>
            <td>{item.memberRef}</td>
            <td>{item.procedureCode}</td>
            <td>
              <ul>
                {denialReasons(item.evaluation).map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </td>
            <td>{item.decisionDeadline}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
