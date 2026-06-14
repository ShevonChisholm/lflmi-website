import { useState } from "react";
import { Users, Calendar, Edit2, Plus, Mail, Phone } from "lucide-react";

const ministries = [
  {
    id: 1, name: "Children's Ministry", icon: "👶", color: "#0E5AA7", status: "Active",
    leader: "Deaconess Grace Obi", leaderEmail: "grace.o@lflmi.org", leaderPhone: "+1 876 333 4444",
    members: 24, volunteers: 12, meetingDay: "Sundays during all services",
    description: "Safe, fun, and faith-filled environments for kids from birth through 5th grade. We believe every child matters to God.",
    programs: ["Sunday School", "Vacation Bible School", "Kids Worship", "Junior Ushers"],
  },
  {
    id: 2, name: "Youth & Young Adults", icon: "⚡", color: "#D7261E", status: "Active",
    leader: "Minister Kola Abiodun", leaderEmail: "kola.a@gmail.com", leaderPhone: "+1 876 555 6666",
    members: 87, volunteers: 8, meetingDay: "Fridays at 6:00 PM",
    description: "Empowering the next generation to live bold, Spirit-led lives with purpose and passion.",
    programs: ["Friday Youth Service", "Mentorship Program", "Annual Retreat", "Sports Ministry"],
  },
  {
    id: 3, name: "Women's Fellowship", icon: "💜", color: "#7c3aed", status: "Active",
    leader: "Deaconess Grace Obi", leaderEmail: "grace.o@lflmi.org", leaderPhone: "+1 876 333 4444",
    members: 142, volunteers: 18, meetingDay: "Second Saturday monthly at 9:00 AM",
    description: "A sisterhood built on prayer, authenticity, and the transforming Word of God.",
    programs: ["Monthly Meeting", "Annual Conference", "Prayer Chain", "Widows Ministry"],
  },
  {
    id: 4, name: "Men's Fellowship", icon: "💪", color: "#0E5AA7", status: "Active",
    leader: "Deacon Samuel Tunde", leaderEmail: "sam.t@lflmi.org", leaderPhone: "+1 876 444 5555",
    members: 98, volunteers: 10, meetingDay: "First Saturday monthly at 7:00 AM",
    description: "Building men of God through accountability, mentorship, and the Word.",
    programs: ["Monthly Breakfast Meeting", "Iron Sharpens Iron", "Fathers' Conference", "Community Outreach"],
  },
  {
    id: 5, name: "Worship Arts", icon: "🎵", color: "#d97706", status: "Active",
    leader: "Minister Esther Ike", leaderEmail: "esther.i@gmail.com", leaderPhone: "+1 876 666 7777",
    members: 45, volunteers: 5, meetingDay: "Thursdays at 6:00 PM (Rehearsal)",
    description: "Serving God and the congregation through music, media, and creative expression.",
    programs: ["Choir", "Band/Orchestra", "Media & Projection", "Creative Arts"],
  },
  {
    id: 6, name: "Global Missions", icon: "🌍", color: "#16a34a", status: "Active",
    leader: "Fatima Al-Hassan", leaderEmail: "fatima.ah@yahoo.com", leaderPhone: "+1 876 876 5432",
    members: 38, volunteers: 15, meetingDay: "Bi-weekly Tuesdays at 7:00 PM",
    description: "Carrying the love of Christ to communities near and far around the world.",
    programs: ["Local Outreach", "International Missions", "Missionary Support", "Community Development"],
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-slate-100 text-slate-500",
  "On Hold": "bg-orange-50 text-orange-600",
};

export default function Ministries() {
  const [selected, setSelected] = useState<typeof ministries[0] | null>(null);

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Ministries</h1>
          <p className="text-sm text-[#6b7897] mt-1">{ministries.filter(m => m.status === "Active").length} active ministries · {ministries.reduce((a, m) => a + m.members, 0)} total participants</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={16} />New Ministry
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ministries.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${m.color}15` }}>
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-black text-[#0d1b2e] leading-tight">{m.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusColors[m.status]}`}>{m.status}</span>
                </div>
                <p className="text-xs text-[#6b7897] mt-1 leading-relaxed line-clamp-2">{m.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#f0f4f9] rounded-xl p-3 text-center">
                <div className="text-xl font-black" style={{ color: m.color }}>{m.members}</div>
                <div className="text-[10px] text-[#6b7897] font-semibold">Members</div>
              </div>
              <div className="bg-[#f0f4f9] rounded-xl p-3 text-center">
                <div className="text-xl font-black text-[#0d1b2e]">{m.volunteers}</div>
                <div className="text-[10px] text-[#6b7897] font-semibold">Volunteers</div>
              </div>
            </div>

            {/* Leader */}
            <div className="flex items-center gap-2 mb-3 p-2.5 bg-[#f0f4f9] rounded-xl">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0" style={{ backgroundColor: m.color }}>
                {m.leader.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0d1b2e] truncate">{m.leader}</div>
                <div className="text-[10px] text-[#6b7897]">Ministry Leader</div>
              </div>
            </div>

            {/* Meeting */}
            <div className="flex items-start gap-2 mb-4 text-xs text-[#6b7897]">
              <Calendar size={12} className="text-[#0E5AA7] mt-0.5 shrink-0" />
              <span>{m.meetingDay}</span>
            </div>

            {/* Programs */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {m.programs.map((p) => (
                <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f0f4f9] text-[#6b7897]">{p}</span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-[#e8eef6]">
              <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-[#0E5AA7] bg-[#0E5AA7]/8 hover:bg-[#0E5AA7]/15 py-2 rounded-xl transition-colors">
                <Users size={13} />Members
              </button>
              <button className="flex items-center gap-1 text-xs font-bold text-[#6b7897] bg-[#f0f4f9] hover:bg-[#e8eef6] px-3 py-2 rounded-xl transition-colors">
                <Edit2 size={13} />Edit
              </button>
              <button className="flex items-center gap-1 text-xs font-bold text-[#6b7897] bg-[#f0f4f9] hover:bg-[#e8eef6] px-3 py-2 rounded-xl transition-colors">
                <Mail size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
