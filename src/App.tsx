import { useEffect, useState } from "react";
import { api } from "./services/api";
import type { AuditEntry, CleaningRecord, CleaningResponse, Equipment } from "./types";
import { EquipmentList } from "./components/EquipmentList";
import { CleaningRecordList } from "./components/CleaningRecordList";
import { CleaningRecordForm } from "./components/CleaningRecordForm";
import { AuditTrail } from "./components/AuditTrail";
import { Login } from "./components/Login";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("cleaning-log-token"));
  const [username, setUsername] = useState(() => localStorage.getItem("cleaning-log-user") ?? "");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<CleaningRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recordsVersion, setRecordsVersion] = useState(0);

  function handleLogin(nextToken: string, nextUsername: string) {
    localStorage.setItem("cleaning-log-token", nextToken);
    localStorage.setItem("cleaning-log-user", nextUsername);
    setToken(nextToken);
    setUsername(nextUsername);
  }

  function logout() {
    localStorage.removeItem("cleaning-log-token");
    localStorage.removeItem("cleaning-log-user");
    setToken(null);
    setUsername("");
  }

  useEffect(() => {
    if (!token) return;
    api.get<Equipment[]>("/equipment")
      .then((response) => {
        setEquipment(response.data);
        if (response.data.length > 0) setSelected(response.data[0]);
      })
      .catch(() => setError("Unable to load equipment. Check that the API is running."))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!selected) return;

    const params = new URLSearchParams({
      page: String(page),
      limit: "5"
    });

    if (filter) params.set("status", filter);

    setLoading(true);
    api
      .get<CleaningResponse>(
        `/equipment/${selected.id}/cleaning-records?${params.toString()}`
      )
      .then((response) => {
        setRecords(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setError("");
        })
        .catch(() => setError("Unable to load cleaning records."))
        .finally(() => setLoading(false));
      }, [selected, page, filter, recordsVersion]);

  function selectEquipment(item: Equipment) {
    setSelected(item);
    setPage(1);
    setFilter("");
    setEditing(null);
    setShowForm(false);
    setAudit([]);
  }

  function startAddingRecord() {
    setEditing(null);
    setShowForm(true);
    setAudit([]);
  }

  async function saveRecord(data: {
    cleanedBy: string;
    cleanedAt: string;
    method: string;
    notes: string;
    status: "PENDING" | "VERIFIED";
  }) {
    if (!selected) return;

    try {
      if (editing) {
        await api.put(`/cleaning-records/${editing.id}`, data);
      } else {
        await api.post(`/equipment/${selected.id}/cleaning-records`, data);
      }

      setShowForm(false);
      setEditing(null);
      setPage(1);
      setRecordsVersion((version) => version + 1);
      setError("");
    } catch {
      setError("Unable to save this record. Please check the form and try again.");
    }
  }

  async function showAudit(record: CleaningRecord) {
    try {
      const response = await api.get<AuditEntry[]>(
        `/cleaning-records/${record.id}/audit`
      );
      setAudit(response.data);
    } catch {
      setError("Unable to load the audit history.");
    }
  }

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Manufacturing operations</p>
          <h1>Equipment Cleaning Log</h1>
          <p>Traceable cleaning records, ready for review.</p>
        </div>
        <div className="header-tools">
          <span className="header-mark">{username} · QMS / 01</span>
          <button className="logout-button" onClick={logout}>Sign out</button>
        </div>
      </header>

      {error && <div className="alert" role="alert">{error}</div>}

      <main className="layout">
        <EquipmentList
          equipment={equipment}
          selectedId={selected?.id ?? null}
          onSelect={selectEquipment}
        />

        <section className="content">
          {loading && !selected ? (
            <div className="card empty-state">Loading equipment...</div>
          ) : !selected ? (
            <div className="card">No equipment available.</div>
          ) : (
            <>
              <div className="card equipment-summary">
                <div>
                  <p className="eyebrow">Selected equipment</p>
                  <h2>{selected.name}</h2>
                  <p>
                    {selected.code} · {selected.status} · Updated {formatDate(selected.updatedAt)}
                  </p>
                </div>
                {/* <button onClick={startAddingRecord}>Add Cleaning Record</button> */}
              </div>

              {showForm && (
                <CleaningRecordForm
                  record={editing}
                  onSave={saveRecord}
                  onCancel={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                />
              )}

              <CleaningRecordList
                records={records}
                loading={loading}
                page={page}
                totalPages={totalPages}
                filter={filter}
                onFilterChange={(value) => {
                  setFilter(value);
                  setPage(1);
                }}
                onPageChange={setPage}
                onAdd={() => {
                  startAddingRecord();
                }}
                onEdit={(record) => {
                  setEditing(record);
                  setShowForm(true);
                  setAudit([]);
                }}
                onAudit={showAudit}
              />

              {audit.length > 0 && (
                <AuditTrail entries={audit} onClose={() => setAudit([])} />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
