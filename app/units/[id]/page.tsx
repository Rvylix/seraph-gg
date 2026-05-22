interface Props { params: { id: string } }

export default function UnitDetailPage({ params }: Props) {
  return (
    <div className="px-6 py-6">
      <a href="/units" className="text-hbr-muted text-xs uppercase tracking-widest hover:text-hbr-silver">
        ← Back to all units
      </a>
      <p className="text-hbr-muted text-sm mt-6">
        Unit profile for ID: <span className="text-hbr-silver font-mono">{params.id}</span>
        — connect Supabase to load data.
      </p>
    </div>
  );
}
