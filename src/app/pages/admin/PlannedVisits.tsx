import { useState } from "react";
import { Search, Plus, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle, Edit2 } from "lucide-react";

const plannedVisits = [
  { id: 1, name: "Ngozi Okafor", initials: "NO", email: "ngozi.o@gmail.com", phone: "+234 802 345 6789", service: "Sunday 10:30 AM", visitDate: "Jun 29, 2025", status: "Confirmed", source: "Website Form", notes: "Coming with husband. First-time visitor." },
  { id: 2, name: "Bello Ismaila", initials: "BI", email: "bello.i@outlook.com", phone: "+234 805 678 9012", service: "Sunday 8:00 AM", visitDate: "Jun 29, 2025", status: "Pending", source: "Social Media", notes: "Reached out on Instagram. Interested in Youth Ministry." },
  { id: 3, name: "Chioma Adesanya", initials: "CA", email: "chioma.a@gmail.com", phone: "+234 809 123 4567", service: "Sunday 10:30 AM", visitDate: "Jun 22, 2025", status: "Attended", source: "Friend Referral", notes: "Came with sister Ada. Stayed for connect lunch." },
  { id: 4, name: "Tunde Bakare", initials: "TB", email: "tunde.b@yahoo.com", phone: "+234 806 789 0123", service: "Sunday 10:30 AM", visitDate: "Jun 22, 2025", status: "No Show", source: "Website Form", notes: "Did not respond to confirmation email sent Friday." },
  { id: 5, name: "Halima Yusuf", initials: "HY", email: "halima.y@gmail.com", phone: "+234 811 234 5678", service: "Wednesday 7:00 PM", visitDate: "Jun 25, 2025", status: "Confirmed", source: "Phone Call", notes: "Interested specifically in midweek prayer service." },
  { id: 6, name: "Samuel Chukwudi", initials: "SC", email: "sam.c@gmail.com", phone: "+234 803 456 7890", service: "Sunday 8:00 AM", visitDate: "Jul 6, 2025", status: "Pending", source: "Website Form", notes: "Moving to Abuja from Port Harcourt next month." },
  { id: 7, name: "Amara Ekwueme", initials: "AE", email: "amara.e@gmail.com", phone: "+234 814 567 8901", service: "Sunday 10:30 AM", visitDate: "Jul 6, 2025", status: "Confirmed", source: "Event RSVP", notes: "RSVPed via Family Faith Night event form." },
  { id: 8, name: "Chibuzor Nnamdi", initials: "CN", email: "chibu.n@outlook.com", phone: "+234 808 901 2345", service: "Sunday 10:30 AM", visitDate: "Jun 15, 2025", status: "Attended", source: "Social Media", notes: "Became a member the following Sunday." },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  Confirmed: { color: "bg-[#0E5AA7]/10 text-[#0E5AA7]", icon: CheckCircle },
  Pending: { color: "bg-orange-50 text-orange-600", icon: AlertCircle },
  Attended: { color: "bg-green-50 text-green-700", icon: CheckCircle },
  "No Show": { color: "bg-red-50 text-red-600", icon: XCircle },
};

export default function PlannedVisits() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = plannedVisits.filter((v) => {
    const match = v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || v.status === statusFilter;
    return match && matchStatus;
  });

  const counts = {
    All: plannedVisits.length,
    Confirmed: plannedVisits.filter(v => v.status === "Confirmed").length,
    Pending: plannedVisits.filter(v => v.status === "Pending").length,
    Attended: plannedVisits.filter(v => v.status === "Attended").length,
    "No Show": plannedVisits.filter(v => v.status === "No Show").length,
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Planned Visits</h1>
          <p className="text-sm text-[#6b7897] mt-1">People who've scheduled their first visit</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={16} />Add Visit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {(["Confirmed", "Pending", "Attended", "No Show"] as const).map((s) => (
          <div key={s} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-black text-[#0d1b2e]">{counts[s]}</div>
            <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${statusConfig[s].color}`}>{s}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7897]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search visitors..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8eef6] rounded-xl text-sm placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["All", "Confirmed", "Pending", "Attended", "No Show"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${statusFilter === s ? "bg-[#0E5AA7] text-white" : "bg-white border border-[#e8eef6] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8eef6]">
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-5 py-3.5">Visitor</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden sm:table-cell">Contact</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden md:table-cell">Service</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden lg:table-cell">Visit Date</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden xl:table-cell">Source</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5">Status</th>
                <th className="text-right text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef6]">
              {filtered.map((v) => {
                const cfg = statusConfig[v.status];
                const Icon = cfg.icon;
                return (
                  <tr key={v.id} className="hover:bg-[#f8fafd] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0E5AA7]/10 text-[#0E5AA7] text-xs font-black flex items-center justify-center shrink-0">{v.initials}</div>
                        <div>
                          <div className="text-sm font-bold text-[#0d1b2e]">{v.name}</div>
                          <div className="text-xs text-[#6b7897] mt-0.5 line-clamp-1 max-w-[160px]">{v.notes}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#6b7897]"><Mail size={11} className="text-[#0E5AA7]" />{v.email}</div>
                        <div className="flex items-center gap-1.5 text-xs text-[#6b7897]"><Phone size={11} className="text-[#0E5AA7]" />{v.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-[#0d1b2e]"><Clock size={13} className="text-[#0E5AA7]" />{v.service}</div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-[#6b7897]">{v.visitDate}</span>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <span className="text-xs text-[#6b7897]">{v.source}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
                        <Icon size={11} />{v.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="p-1.5 rounded-lg text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-colors"><Edit2 size={14} /></button>
                        <button className="p-1.5 rounded-lg text-[#6b7897] hover:bg-green-50 hover:text-green-700 transition-colors"><CheckCircle size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
