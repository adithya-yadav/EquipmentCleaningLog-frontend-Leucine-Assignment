export type Equipment = {
  id: number;
  name: string;
  code: string;
  updatedAt: string;
  status: "ACTIVE" | "RETIRED";
};

export type CleaningRecord = {
  id: number;
  equipmentId: number;
  cleanedBy: string;
  cleanedAt: string;
  method: string;
  notes: string | null;
  status: "PENDING" | "VERIFIED";
};

export type AuditEntry = {
  id: number;
  cleaningRecordId: number;
  changedBy: string;
  changedAt: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
};

export type CleaningResponse = {
  data: CleaningRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
