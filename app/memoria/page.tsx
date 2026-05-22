export default function MemoriaPage() {
  return (
    <div className="px-6 py-6">
      <p className="font-mono text-[10px] tracking-widest2 text-hbr-red uppercase mb-2">// Database</p>
      <h1 className="text-2xl font-bold text-white mb-1">Memoria DB</h1>
      <p className="text-sm text-hbr-muted mb-6">All Memorias · Skills · Booster & Accessory recommendations</p>
      {/* TODO: MemoriaGrid with filter/search */}
      <p className="text-hbr-muted text-sm">Memoria grid loads here — connect Supabase.</p>
    </div>
  );
}
