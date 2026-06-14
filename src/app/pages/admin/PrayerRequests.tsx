import { useState } from "react";
import { Search, Heart, X, MessageSquare, Plus, CheckCircle, Clock, User } from "lucide-react";

const requests = [
  { id: 1, name: "Anonymous", initials: "AN", email: null, phone: null, category: "Health", date: "Jun 22, 2025", status: "Open", urgency: "High", prayerCount: 12, request: "Please pray for my mother's recovery from a serious surgery she had last week. The doctors are cautiously optimistic but we need a miracle from God. She's been fighting for years and we believe healing is possible.", response: "" },
  { id: 2, name: "David Eze", initials: "DE", email: "david.eze@gmail.com", phone: "+234 803 123 4567", category: "Family", date: "Jun 21, 2025", status: "Prayed", urgency: "Medium", prayerCount: 8, request: "Requesting prayer for reconciliation in my marriage. We've been going through a difficult season and I believe God can restore what has been broken. Please keep us in your prayers.", response: "We have been lifting David and his family in prayer. Pastor has also reached out personally for a counseling session." },
  { id: 3, name: "Sarah K.", initials: "SK", email: "sarah.k@yahoo.com", phone: null, category: "Financial", date: "Jun 21, 2025", status: "Open", urgency: "High", prayerCount: 6, request: "I am a small business owner and facing serious financial pressure. Believing God for a breakthrough and for doors to open that no man can shut. Please agree with me in prayer.", response: "" },
  { id: 4, name: "Emmanuel O.", initials: "EO", email: "emm.o@gmail.com", phone: "+234 806 789 0123", category: "Spiritual", date: "Jun 20, 2025", status: "Open", urgency: "Low", prayerCount: 4, request: "I need prayer for clarity on God's purpose for my life. I feel stuck and unsure of the direction I should go. Pray that God gives me wisdom and clear direction.", response: "" },
  { id: 5, name: "Mary Johnson", initials: "MJ", email: "mary.j@gmail.com", phone: "+234 811 234 5678", category: "Health", date: "Jun 18, 2025", status: "Answered", urgency: "Medium", prayerCount: 20, request: "Praying for complete healing from a chronic condition. The doctors said there was no cure but I serve a God who heals!", response: "Praise God! Mary reported a miraculous improvement at her last doctor's visit. The congregation rejoiced with her." },
  { id: 6, name: "Anonymous", initials: "AN", email: null, phone: null, category: "Relationships", date: "Jun 17, 2025", status: "Open", urgency: "Medium", prayerCount: 3, request: "Please pray for restoration in a broken friendship. It has been painful and I believe reconciliation is possible with God's help.", response: "" },
  { id: 7, name: "Pastor Yemi", initials: "PY", email: "yemi@lflmi.org", phone: "+234 802 345 6789", category: "Ministry", date: "Jun 16, 2025", status: "Prayed", urgency: "Low", prayerCount: 35, request: "Please intercede for our upcoming outreach in Kuje community. We are believing God for souls to be saved and lives transformed.", response: "The prayer team has been in intercession daily. We believe God will move mightily." },
];

const categories = ["All", "Health", "Family", "Financial", "Spiritual", "Relationships", "Ministry"];
const statusOptions = ["All", "Open", "Prayed", "Answered"];

const statusColors: Record<string, string> = {
  Open: "bg-[#D7261E]/10 text-[#D7261E]",
  Prayed: "bg-[#0E5AA7]/10 text-[#0E5AA7]",
  Answered: "bg-green-50 text-green-700",
};

const urgencyColors: Record<string, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-orange-50 text-orange-600",
  Low: "bg-slate-100 text-slate-500",
};

const categoryColors: Record<string, string> = {
  Health: "#D7261E",
  Family: "#0E5AA7",
  Financial: "#d97706",
  Spiritual: "#7c3aed",
  Relationships: "#16a34a",
  Ministry: "#0E5AA7",
};

export default function PrayerRequests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selected, setSelected] = useState<typeof requests[0] | null>(requests[0]);
  const [showDetail, setShowDetail] = useState(false);
  const [response, setResponse] = useState("");

  const filtered = requests.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.request.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchCat = categoryFilter === "All" || r.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  return (
    <div className="flex h-full">
      {/* ── LIST PANEL ── */}
      <div className={`flex flex-col border-r border-[#e8eef6] bg-white ${showDetail && selected ? "hidden lg:flex lg:w-96 shrink-0" : "flex-1"}`}>
        <div className="p-5 border-b border-[#e8eef6]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-black text-[#0d1b2e]">Prayer Requests</h1>
              <p className="text-xs text-[#6b7897] mt-0.5">{requests.filter(r => r.status === "Open").length} open requests</p>
            </div>
            <button className="flex items-center gap-1.5 bg-[#D7261E] hover:bg-[#b81f19] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors">
              <Plus size={14} />New
            </button>
          </div>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7897]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests..." className="w-full pl-9 pr-4 py-2.5 bg-[#f0f4f9] rounded-xl text-sm placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
          </div>
          <div className="flex gap-1.5 flex-wrap mb-2">
            {statusOptions.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${statusFilter === s ? "bg-[#0E5AA7] text-white" : "bg-[#f0f4f9] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategoryFilter(c)} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${categoryFilter === c ? "bg-[#D7261E] text-white" : "bg-[#f0f4f9] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#e8eef6]">
          {filtered.map((r) => (
            <button key={r.id} onClick={() => { setSelected(r); setShowDetail(true); setResponse(""); }} className={`w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-[#f0f4f9] transition-colors ${selected?.id === r.id ? "bg-[#e8f0fb]" : ""}`}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-black mt-0.5" style={{ backgroundColor: categoryColors[r.category] || "#0E5AA7" }}>
                {r.initials === "AN" ? <Heart size={14} /> : r.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <span className="text-sm font-bold text-[#0d1b2e]">{r.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusColors[r.status]}`}>{r.status}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#f0f4f9] text-[#6b7897]">{r.category}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${urgencyColors[r.urgency]}`}>{r.urgency}</span>
                </div>
                <p className="text-xs text-[#6b7897] line-clamp-2">{r.request}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── DETAIL PANEL ── */}
      {selected && (
        <div className={`flex-1 flex flex-col bg-[#f0f4f9] overflow-y-auto ${!showDetail ? "hidden lg:flex" : "flex"}`}>
          <div className="lg:hidden bg-white border-b border-[#e8eef6] px-5 py-3">
            <button onClick={() => setShowDetail(false)} className="flex items-center gap-2 text-sm font-semibold text-[#0E5AA7]"><X size={16} />Back</button>
          </div>

          <div className="p-5 lg:p-7 space-y-5">
            {/* Header card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black shrink-0" style={{ backgroundColor: categoryColors[selected.category] || "#0E5AA7" }}>
                  {selected.initials === "AN" ? <Heart size={18} /> : selected.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-[#0d1b2e]">{selected.name}</h2>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
                  </div>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#f0f4f9] text-[#6b7897]">{selected.category}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${urgencyColors[selected.urgency]}`}>{selected.urgency} Priority</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#f0f4f9] text-[#6b7897]">{selected.date}</span>
                  </div>
                </div>
              </div>

              {/* Contact info if not anonymous */}
              {selected.email && (
                <div className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f4f9] rounded-xl"><User size={13} className="text-[#0E5AA7]" /><span className="text-xs font-medium text-[#0d1b2e]">{selected.email}</span></div>
                  {selected.phone && <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f4f9] rounded-xl"><Clock size={13} className="text-[#0E5AA7]" /><span className="text-xs font-medium text-[#0d1b2e]">{selected.phone}</span></div>}
                </div>
              )}
            </div>

            {/* Prayer request */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-[#0d1b2e]">Prayer Request</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#D7261E] font-bold">
                  <Heart size={13} className="fill-[#D7261E]" />{selected.prayerCount} praying
                </div>
              </div>
              <p className="text-sm text-[#0d1b2e] leading-relaxed bg-[#f0f4f9] rounded-xl p-4">{selected.request}</p>
            </div>

            {/* Pastoral response */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-[#0d1b2e] mb-3">Pastoral Response</h3>
              {selected.response ? (
                <p className="text-sm text-[#0d1b2e] leading-relaxed bg-green-50 border border-green-100 rounded-xl p-4 mb-3">{selected.response}</p>
              ) : (
                <p className="text-xs text-[#6b7897] mb-3">No response recorded yet.</p>
              )}
              <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Write a pastoral response or note..." rows={3} className="w-full bg-[#f0f4f9] rounded-xl px-4 py-3 text-sm text-[#0d1b2e] placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 resize-none transition-all mb-2" />
              <div className="flex gap-2">
                <button className="flex-1 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"><MessageSquare size={13} />Save Response</button>
                <button className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"><CheckCircle size={13} />Mark Answered</button>
              </div>
            </div>

            {/* Status buttons */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-[#0d1b2e] mb-3">Update Status</h3>
              <div className="flex gap-2 flex-wrap">
                {["Open", "Prayed", "Answered"].map((s) => (
                  <button key={s} className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors ${selected.status === s ? "bg-[#0E5AA7] text-white" : "bg-[#f0f4f9] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
