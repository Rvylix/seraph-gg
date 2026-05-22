export default function GuidesPage() {
  return (
    <div className="px-6 py-6">
      <p className="font-mono text-[10px] tracking-widest2 text-hbr-red uppercase mb-2">// Knowledge</p>
      <h1 className="text-2xl font-bold text-white mb-1">Guides</h1>
      <p className="text-sm text-hbr-muted mb-6">Beginner progression · Team building · Gacha tips</p>
      {/* TODO: GuideList from DB */}
      <p className="text-hbr-muted text-sm">Guides load here — connect Supabase.</p>
    </div>
  );
}
