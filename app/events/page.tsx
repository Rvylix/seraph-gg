export default function EventsPage() {
  return (
    <div className="px-6 py-6">
      <p className="font-mono text-[10px] tracking-widest2 text-hbr-red uppercase mb-2">// Tracker</p>
      <h1 className="text-2xl font-bold text-white mb-1">Events</h1>
      <p className="text-sm text-hbr-muted mb-6">Live events · Upcoming · Reward guides</p>
      {/* TODO: EventList with countdown timers */}
      <p className="text-hbr-muted text-sm">Event tracker loads here — connect Supabase.</p>
    </div>
  );
}
