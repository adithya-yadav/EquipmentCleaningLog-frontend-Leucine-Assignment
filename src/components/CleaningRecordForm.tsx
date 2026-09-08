import { useEffect, useState } from "react";
import type { CleaningRecord } from "../types";

type Props = {
  record: CleaningRecord | null;
  onSave: (data: {
    cleanedBy: string;
    cleanedAt: string;
    method: string;
    notes: string;
    status: "PENDING" | "VERIFIED";
  }) => Promise<void>;
  onCancel: () => void;
};

export function CleaningRecordForm({ record, onSave, onCancel }: Props) {
  const [cleanedBy, setCleanedBy] = useState("");
  const [cleanedAt, setCleanedAt] = useState("");
  const [method, setMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"PENDING" | "VERIFIED">("PENDING");

  useEffect(() => {
    if (record) {
      setCleanedBy(record.cleanedBy);
      setCleanedAt(record.cleanedAt.slice(0, 16));
      setMethod(record.method);
      setNotes(record.notes ?? "");
      setStatus(record.status);
    } else {
      setCleanedBy("");
      setCleanedAt("");
      setMethod("");
      setNotes("");
      setStatus("PENDING");
    }
  }, [record]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await onSave({ cleanedBy, cleanedAt, method, notes, status });
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h3>{record ? "Edit Cleaning Record" : "Add Cleaning Record"}</h3>

      <label>Cleaned By</label>
      <input value={cleanedBy} onChange={(e) => setCleanedBy(e.target.value)} required />

      <label>Cleaned At</label>
      <input type="datetime-local" value={cleanedAt} onChange={(e) => setCleanedAt(e.target.value)} required />

      <label>Method</label>
      <input value={method} onChange={(e) => setMethod(e.target.value)} required />

      <label>Notes</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

      <label>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value as "PENDING" | "VERIFIED")}>
        <option value="PENDING">Pending</option>
        <option value="VERIFIED">Verified</option>
      </select>

      <div className="actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
