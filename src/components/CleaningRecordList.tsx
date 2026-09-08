import type { CleaningRecord } from "../types";
import { Pagination } from "./Pagination";

type Props = {
  records: CleaningRecord[];
  loading: boolean;
  page: number;
  totalPages: number;
  filter: string;
  onFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (record: CleaningRecord) => void;
  onAudit: (record: CleaningRecord) => void;
};

export function CleaningRecordList(props: Props) {
  return (
    <div className="card">
      <div className="section-header">
        <h2>Cleaning Records</h2>
        <button onClick={props.onAdd}>Add Cleaning Record</button>
      </div>

      <div className="filter">
        <label>Status:</label>
        <select value={props.filter} onChange={(e) => props.onFilterChange(e.target.value)}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
        </select>
      </div>

      {props.loading ? (
        <p className="empty-state">Loading records...</p>
      ) : props.records.length === 0 ? (
        <p>No cleaning records found.</p>
      ) : (
        <div className="records-table"><table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Cleaned By</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.records.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.cleanedAt).toLocaleString()}</td>
                <td>{record.cleanedBy}</td>
                <td>{record.method}</td>
                <td><span className={`status status-${record.status.toLowerCase()}`}>{record.status}</span></td>
                <td className="record-actions">
                  <button onClick={() => props.onEdit(record)}>Edit</button>{" "}
                  <button onClick={() => props.onAudit(record)}>Audit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}

      <Pagination
        page={props.page}
        totalPages={props.totalPages}
        onPageChange={props.onPageChange}
      />
    </div>
  );
}
