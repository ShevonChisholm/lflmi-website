import { useState } from "react";
import { Search, Phone, Mail, MapPin, Calendar, MessageSquare, X, Plus, Filter, ChevronDown } from "lucide-react";

const visitors = [
  { id: 1, name: "Adaeze Okonkwo", initials: "AO", email: "adaeze.o@gmail.com", phone: "+1 876 456 7890", address: "Half Way Tree, Kingston", date: "Jun 22, 2025", service: "10:30 AM", status: "New", source: "Friend Referral", notes: "First-time visitor, came with the Chukwu family. Very engaged during worship.", followUp: false },
  { id: 2, name: "Michael Osei", initials: "MO", email: "m.osei@outlook.com", phone: "+1 876 234 5678", address: "New Kingston, Kingston", date: "Jun 22, 2025", service: "8:00 AM", status: "Follow-up", source: "Social Media", notes: "Had a great conversation after service. Interested in joining a life group.", followUp: true },
  { id: 3, name: "Fatima Al-Hassan", initials: "FA", email: "fatima.ah@yahoo.com", phone: "+1 876 876 5432", address: "Mona, Kingston", date: "Jun 15, 2025", service: "10:30 AM", status: "Returning", source: "Website", notes: "Third visit this month. Expressed interest in Women's Fellowship.", followUp: false },
  { id: 4, name: "James Amaka", initials: "JA", email: "james.amaka@gmail.com", phone: "+1 876 701 2345", address: "Portmore, St. Catherine", date: "Jun 15, 2025", service: "8:00 AM", status: "New", source: "Walk-in", notes: "Came alone, seemed reserved. Greeter gave welcome packet.", followUp: true },
  { id: 5, name: "Grace Mensah", initials: "GM", email: "grace.m@gmail.com", phone: "+1 876 345 6789", address: "Spanish Town, St. Catherine", date: "Jun 8, 2025", service: "10:30 AM", status: "New", source: "Flyer/Poster", notes: "Arrived late but stayed for the full service and connect lunch.", followUp: false },
  { id: 6, name: "Chidi Nwosu", initials: "CN", email: "chidi.n@gmail.com", phone: "+1 876 789 0123", address: "Liguanea, Kingston", date: "Jun 8, 2025", service: "8:00 AM", status: "Returning", source: "Friend Referral", notes: "Second visit. Picked up membership class brochure.", followUp: false },
  { id: 7, name: "Amina Bello", initials: "AB", email: "amina.b@gmail.com", phone: "+1 876 432 1098", address: "Constant Spring, Kingston", date: "Jun 1, 2025", service: "10:30 AM", status: "Follow-up", source: "Social Media", notes: "Very responsive to the message. Left contact for pastoral follow-up.", followUp: true },
  { id: 8, name: "Peter Oluwaseun", initials: "PO", email: "peter.o@yahoo.com", phone: "+1 876 654 3210", address: "Papine, Kingston", date: "Jun 1, 2025", service: "10:30 AM", status: "New", source: "Walk-in", notes: "Recently relocated from Montego Bay. Looking for a church home.", followUp: false },
];

const statusColors: Record<string, string> = {
  New: "bg-[#0E5AA7]/10 text-[#0E5AA7]",
  "Follow-up": "bg-orange-50 text-orange-600",
  Returning: "bg-green-50 text-green-700",
};

const statusOptions = ["All", "New", "Follow-up", "Returning"];

export default function Visitors() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<typeof visitors[0] | null>(visitors[0]);
  const [showDetail, setShowDetail] = useState(false);
  const [note, setNote] = useState("");

  const filtered = visitors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selectVisitor = (v: typeof visitors[0]) => {
    setSelected(v);
    setShowDetail(true);
    setNote("");
  };

  return (
    <div className="flex h-full">
      {/* ── LIST PANEL ── */}
      <div className={`flex flex-col border-r border-[#e8eef6] bg-white ${showDetail && selected ? "hidden lg:flex lg:w-96 shrink-0" : "flex-1"}`}>
        {/* Header */}
        <div className="p-5 border-b border-[#e8eef6]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-black text-[#0d1b2e]">Visitors</h1>
              <p className="text-xs text-[#6b7897] mt-0.5">{visitors.length} total visitors</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors">
              <Plus size={14} />Add Visitor
            </button>
          </div>
          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7897]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2.5 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
          </div>
          {/* Status filter */}
          <div className="flex gap-1.5 flex-wrap">
            {statusOptions.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${statusFilter === s ? "bg-[#0E5AA7] text-white" : "bg-[#f0f4f9] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{s}</button>
            ))}
          </div>
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#e8eef6]">
          {filtered.map((v) => (
            <button key={v.id} onClick={() => selectVisitor(v)} className={`w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-[#f0f4f9] transition-colors ${selected?.id === v.id ? "bg-[#e8f0fb]" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-[#0E5AA7]/10 text-[#0E5AA7] text-sm font-black flex items-center justify-center shrink-0">{v.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-[#0d1b2e] truncate">{v.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusColors[v.status]}`}>{v.status}</span>
                </div>
                <div className="text-xs text-[#6b7897] mt-0.5">{v.date} · {v.service}</div>
                <div className="text-xs text-[#6b7897] truncate">{v.email}</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-10 text-center text-[#6b7897] text-sm">No visitors found</div>
          )}
        </div>
      </div>

      {/* ── DETAIL PANEL ── */}
      {selected && (
        <div className={`flex-1 flex flex-col bg-[#f0f4f9] overflow-y-auto ${!showDetail ? "hidden lg:flex" : "flex"}`}>
          {/* Mobile back */}
          <div className="lg:hidden bg-white border-b border-[#e8eef6] px-5 py-3">
            <button onClick={() => setShowDetail(false)} className="flex items-center gap-2 text-sm font-semibold text-[#0E5AA7]">
              <X size={16} />Back to list
            </button>
          </div>

          <div className="p-5 lg:p-7 space-y-5">
            {/* Profile card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#0E5AA7]/10 text-[#0E5AA7] text-xl font-black flex items-center justify-center shrink-0">{selected.initials}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-[#0d1b2e]">{selected.name}</h2>
                  <p className="text-sm text-[#6b7897] mt-0.5">Visited {selected.date} · {selected.service} Service</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#f0f4f9] text-[#6b7897]">Via: {selected.source}</span>
                  </div>
                </div>
              </div>
              {/* Contact */}
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: Mail, label: selected.email },
                  { icon: Phone, label: selected.phone },
                  { icon: MapPin, label: selected.address },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-[#f0f4f9] rounded-xl">
                    <c.icon size={14} className="text-[#0E5AA7] shrink-0" />
                    <span className="text-xs text-[#0d1b2e] font-medium truncate">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-[#0d1b2e] mb-3">Visit Notes</h3>
              <p className="text-sm text-[#6b7897] leading-relaxed bg-[#f0f4f9] rounded-xl p-4">{selected.notes}</p>
              <div className="mt-4">
                <div className="flex gap-2">
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a follow-up note..." className="flex-1 bg-[#f0f4f9] rounded-xl px-4 py-2.5 text-sm text-[#0d1b2e] placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
                  <button className="bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"><MessageSquare size={13} />Save</button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-[#0d1b2e] mb-3">Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { label: "Send Welcome Email", icon: Mail, color: "#0E5AA7" },
                  { label: "Schedule Call", icon: Phone, color: "#16a34a" },
                  { label: "Assign to Pastor", icon: Calendar, color: "#d97706" },
                  { label: "Mark Followed Up", icon: ChevronDown, color: "#0E5AA7" },
                  { label: "Add to Life Group", icon: MapPin, color: "#D7261E" },
                  { label: "Convert to Member", icon: Plus, color: "#16a34a" },
                ].map((a) => (
                  <button key={a.label} className="flex flex-col items-center gap-2 p-3 bg-[#f0f4f9] hover:bg-[#e8f0fb] rounded-xl transition-colors text-center">
                    <a.icon size={16} style={{ color: a.color }} />
                    <span className="text-[11px] font-semibold text-[#0d1b2e] leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Danger */}
            <div className="flex justify-end">
              <button className="text-xs text-[#D7261E]/60 hover:text-[#D7261E] font-semibold transition-colors flex items-center gap-1"><X size={13} />Remove Record</button>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-[#f0f4f9] text-[#6b7897] text-sm">Select a visitor to view details</div>
      )}
    </div>
  );
}
