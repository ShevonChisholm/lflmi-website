import { useState } from "react";
import { Search, Plus, Play, Eye, Edit2, Trash2, Filter } from "lucide-react";

const sermons = [
  { id: 1, title: "Unshackled: Living Free from Fear", series: "Walking In Freedom", speaker: "Pastor Emmanuel Adeyemi", date: "Jun 15, 2025", duration: "48 min", views: 1243, status: "Published", scripture: "1 John 4:18", thumb: "https://images.unsplash.com/photo-1610414961792-b7fffebddd14?w=120&h=80&fit=crop" },
  { id: 2, title: "The Power of a Surrendered Life", series: "Walking In Freedom", speaker: "Pastor Emmanuel Adeyemi", date: "Jun 8, 2025", duration: "52 min", views: 980, status: "Published", scripture: "Romans 12:1-2", thumb: "https://images.unsplash.com/photo-1557896279-080cb03b9ca6?w=120&h=80&fit=crop" },
  { id: 3, title: "Grace Greater Than Our Sin", series: "Walking In Freedom", speaker: "Pastor Yemi Adeyemi", date: "Jun 1, 2025", duration: "44 min", views: 1105, status: "Published", scripture: "Romans 5:20", thumb: "https://images.unsplash.com/photo-1610414961792-b7fffebddd14?w=120&h=80&fit=crop" },
  { id: 4, title: "Rooted and Built Up", series: "Deep Roots", speaker: "Pastor Emmanuel Adeyemi", date: "May 25, 2025", duration: "50 min", views: 876, status: "Published", scripture: "Colossians 2:6-7", thumb: "https://images.unsplash.com/photo-1557896279-080cb03b9ca6?w=120&h=80&fit=crop" },
  { id: 5, title: "When God Seems Silent", series: "Deep Roots", speaker: "Pastor Esther Ike", date: "May 18, 2025", duration: "39 min", views: 654, status: "Published", scripture: "Psalm 22:1-5", thumb: "https://images.unsplash.com/photo-1610414961792-b7fffebddd14?w=120&h=80&fit=crop" },
  { id: 6, title: "Holiness Is Not Optional", series: "Deep Roots", speaker: "Pastor Emmanuel Adeyemi", date: "May 11, 2025", duration: "55 min", views: 742, status: "Published", scripture: "1 Peter 1:15-16", thumb: "https://images.unsplash.com/photo-1557896279-080cb03b9ca6?w=120&h=80&fit=crop" },
  { id: 7, title: "Preaching for Baptism Sunday 2025", series: "Special Services", speaker: "Pastor Emmanuel Adeyemi", date: "Jun 29, 2025", duration: "—", views: 0, status: "Draft", scripture: "Acts 2:38", thumb: null },
];

const statusColors: Record<string, string> = {
  Published: "bg-green-50 text-green-700",
  Draft: "bg-slate-100 text-slate-500",
};

export default function Sermons() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = sermons.filter((s) => {
    const match = s.title.toLowerCase().includes(search.toLowerCase()) || s.speaker.toLowerCase().includes(search.toLowerCase()) || s.series.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return match && matchStatus;
  });

  return (
    <div className="p-5 lg:p-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Sermons</h1>
          <p className="text-sm text-[#6b7897] mt-1">{sermons.filter(s => s.status === "Published").length} published · {sermons.filter(s => s.status === "Draft").length} draft</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={16} />Upload Sermon
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7897]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sermons, series, speaker..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8eef6] rounded-xl text-sm text-[#0d1b2e] placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {["All", "Published", "Draft"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${statusFilter === s ? "bg-[#0E5AA7] text-white" : "bg-white border border-[#e8eef6] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{s}</button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-white border border-[#e8eef6] rounded-xl text-[#6b7897] hover:text-[#0d1b2e] transition-colors">
          <Filter size={13} />Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8eef6]">
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-5 py-3.5">Sermon</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden md:table-cell">Series</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden lg:table-cell">Speaker</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden sm:table-cell">Date</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden xl:table-cell">Views</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5">Status</th>
                <th className="text-right text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef6]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#f8fafd] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg bg-[#e8eef6] overflow-hidden shrink-0">
                        {s.thumb ? (
                          <img src={s.thumb} alt={s.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0E5AA7]/10"><Play size={14} className="text-[#0E5AA7]" /></div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0d1b2e] max-w-xs truncate">{s.title}</div>
                        <div className="text-xs text-[#6b7897] mt-0.5">{s.scripture} · {s.duration}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs font-semibold text-[#6b7897]">{s.series}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-sm font-medium text-[#0d1b2e]">{s.speaker.replace("Pastor ", "")}</span>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-sm text-[#6b7897]">{s.date}</span>
                  </td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-[#0d1b2e] font-semibold">
                      <Eye size={13} className="text-[#6b7897]" />{s.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="p-2 rounded-lg text-[#0E5AA7] hover:bg-[#0E5AA7]/10 transition-colors"><Play size={14} /></button>
                      <button className="p-2 rounded-lg text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-colors"><Edit2 size={14} /></button>
                      <button className="p-2 rounded-lg text-[#6b7897] hover:bg-red-50 hover:text-[#D7261E] transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-[#e8eef6] flex items-center justify-between">
          <span className="text-xs text-[#6b7897]">Showing {filtered.length} of {sermons.length} sermons</span>
          <div className="flex gap-1.5">
            <button className="text-xs font-semibold px-3 py-1.5 bg-[#f0f4f9] rounded-lg text-[#6b7897]">Previous</button>
            <button className="text-xs font-semibold px-3 py-1.5 bg-[#0E5AA7] rounded-lg text-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
