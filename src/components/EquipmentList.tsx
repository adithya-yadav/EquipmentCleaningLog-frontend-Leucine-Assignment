import type { Equipment } from "../types";

type Props = {
  equipment: Equipment[];
  selectedId: number | null;
  onSelect: (equipment: Equipment) => void;
};

export function EquipmentList({ equipment, selectedId, onSelect }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <h2>Equipment</h2>
        <span>{equipment.length}</span>
      </div>
      {equipment.map((item) => (
        <button
          className={`equipment-item ${selectedId === item.id ? "selected" : ""}`}
          key={item.id}
          onClick={() => onSelect(item)}
        >
          <strong>{item.name}</strong>
          <span>{item.code}</span>
          <small>{item.status}</small>
        </button>
      ))}
    </aside>
  );
}
