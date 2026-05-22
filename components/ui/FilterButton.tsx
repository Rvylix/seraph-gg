"use client";
export function FilterButton({ active, onClick, children }: {
  active?: boolean; onClick?: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={`hbr-filter-btn${active ? " active" : ""}`}>
      {children}
    </button>
  );
}
