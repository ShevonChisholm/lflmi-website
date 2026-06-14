import { useState } from "react";
import { Plus, MapPin, Clock, Users, Edit2, Trash2, Search, Calendar } from "lucide-react";

const events = [
  { id: 1, title: "Family Faith Night", type: "Family", date: "Jun 22, 2025", time: "6:00 PM – 9:00 PM", location: "Main Sanctuary", rsvps: 87, capacity: 300, status: "Upcoming", organizer: "Pastor Emmanuel", description: "A special evening of worship, games, and fellowship for the entire family." },
  { id: 2, title: "Baptism Sunday", type: "Worship", date: "Jun 29, 2025", time: "10:30 AM Service", location: "Main Sanctuary", rsvps: 24, capacity: 500, status: "Upcoming", organizer: "Pastor Emmanuel", description: "Celebrate new beginnings as members take their next step of faith." },
  { id: 3, title: "Youth Summer Retreat", type: "Youth", date: "Jul 5 – Jul 7, 2025", time: "8:00 AM departure", location: "Camp Freedom, Jos", rsvps: 42, capacity: 60, status: "Upcoming", organizer: "Minister Kola Abiodun", description: "Three days of adventure, discipleship, and community for teens ages 13–18." },
  { id: 4, title: "Women's Conference 2025", type: "Women", date: "Jul 19, 2025", time: "9:00 AM – 5:00 PM", location: "Main Sanctuary + Fellowship Hall", rsvps: 156, capacity: 200, status: "Upcoming", organizer: "Deaconess Grace Obi", description: "Arise & Shine: A day of empowerment and spiritual refresh for women of all ages." },
  { id: 5, title: "Midyear Prayer & Fasting", type: "Prayer", date: "Jun 8–14, 2025", time: "6:00 AM – 8:00 AM daily", location: "Main Sanctuary", rsvps: 210, capacity: 500, status: "Past", organizer: "Pastor Emmanuel", description: "Seven days of corporate prayer and fasting seeking God's direction for the second half of the year." },
  { id: 6, title: "New Members Orientation", type: "Admin", date: "Jun 1, 2025", time: "12:30 PM – 2:00 PM", location: "Conference Room B", rsvps: 18, capacity: 30, status: "Past", organizer: "Deacon Samuel Tunde", description: "Orientation session for new church members." },
];

const typeColors: Record<string, string> = {
  Family: "bg-[#0E5AA7]/10 text-[#0E5AA7]",
  Worship: "bg-purple-50 text-purple-600",
  Youth: "bg-orange-50 text-orange-600",
  Women: "bg-pink-50 text-pink-600",
  Prayer: "bg-[#D7261E]/10 text-[#D7261E]",
  Admin: "bg-slate-100 text-slate-600",
};

const statusColors: Record<string, string> = {
  Upcoming: "bg-green-50 text-green-700",
  Past: "bg-slate-100 text-slate-500",
  Cancelled: "bg-red-50 text-red-600",
};

export default function Events() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = events.filter((e) => {
    const match = e.title.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return match && matchStatus;
  });

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Events</h1>
          <p className="text-sm text-[#6b7897] mt-1">{events.filter(e => e.status === "Upcoming").length} upcoming · {events.filter(e => e.status === "Past").length} past events</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={16} />Create Event
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7897]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8eef6] rounded-xl text-sm placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {["All", "Upcoming", "Past"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${statusFilter === s ? "bg-[#0E5AA7] text-white" : "bg-white border border-[#e8eef6] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((ev) => {
          const fillPct = Math.round((ev.rsvps / ev.capacity) * 100);
          return (
            <div key={ev.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
              {/* Date badge */}
              <div className="shrink-0 text-center w-12">
                <div className="text-[10px] font-black text-[#0E5AA7] uppercase">{ev.date.split(" ")[0]}</div>
                <div className="text-2xl font-black text-[#0d1b2e] leading-none">{ev.date.split(" ")[1]?.replace(",", "")}</div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-[#0d1b2e]">{ev.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[ev.type]}`}>{ev.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[ev.status]}`}>{ev.status}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button className="p-1.5 rounded-lg text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-colors"><Edit2 size={14} /></button>
                    <button className="p-1.5 rounded-lg text-[#6b7897] hover:bg-red-50 hover:text-[#D7261E] transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-xs text-[#6b7897] mb-3 leading-relaxed">{ev.description}</p>
                <div className="flex items-center gap-4 flex-wrap text-xs text-[#6b7897]">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#0E5AA7]" />{ev.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#0E5AA7]" />{ev.location}</span>
                  <span className="flex items-center gap-1.5"><Users size={12} className="text-[#0E5AA7]" />Organizer: {ev.organizer}</span>
                </div>
              </div>

              {/* RSVPs */}
              <div className="shrink-0 text-right min-w-[100px]">
                <div className="text-xl font-black text-[#0d1b2e]">{ev.rsvps}</div>
                <div className="text-[10px] text-[#6b7897] mb-2">of {ev.capacity} RSVPs</div>
                <div className="h-1.5 bg-[#e8eef6] rounded-full overflow-hidden w-24">
                  <div className="h-full bg-[#0E5AA7] rounded-full transition-all" style={{ width: `${Math.min(fillPct, 100)}%` }} />
                </div>
                <div className="text-[10px] text-[#6b7897] mt-1">{fillPct}% capacity</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
