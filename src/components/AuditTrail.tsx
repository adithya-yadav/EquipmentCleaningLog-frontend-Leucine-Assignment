import type { AuditEntry } from "../types";

type Props = {
  entries: AuditEntry[];
  onClose: () => void;
};

export function AuditTrail({ entries, onClose }: Props) {
  return (
    <div className="card">
      <div className="section-header">
        <h3>Audit History</h3>
        <button onClick={onClose}>Close</button>
      </div>

      {entries.length === 0 ? (
        <p>No audit history found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Field</th>
              <th>Old Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.changedAt).toLocaleString()}</td>
                <td>{entry.changedBy}</td>
                <td>{entry.field}</td>
                <td>{entry.oldValue ?? "—"}</td>
                <td>{entry.newValue ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
