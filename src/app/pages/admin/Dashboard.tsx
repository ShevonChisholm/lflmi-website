import { Users, UserCheck, Heart, Calendar, TrendingUp, TrendingDown, ArrowRight, Mic2 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const attendanceData = [
  { week: "May 4", attendance: 1240 },
  { week: "May 11", attendance: 1385 },
  { week: "May 18", attendance: 1190 },
  { week: "May 25", attendance: 1450 },
  { week: "Jun 1", attendance: 1320 },
  { week: "Jun 8", attendance: 1510 },
  { week: "Jun 15", attendance: 1480 },
  { week: "Jun 22", attendance: 1622 },
];

const givingData = [
  { month: "Jan", amount: 145000 },
  { month: "Feb", amount: 162000 },
  { month: "Mar", amount: 158000 },
  { month: "Apr", amount: 178000 },
  { month: "May", amount: 195000 },
  { month: "Jun", amount: 212000 },
];

const recentVisitors = [
  { name: "Adaeze Okonkwo", date: "Jun 22", service: "10:30 AM", status: "New", initials: "AO" },
  { name: "Michael Osei", date: "Jun 22", service: "8:00 AM", status: "Follow-up", initials: "MO" },
  { name: "Fatima Al-Hassan", date: "Jun 15", service: "10:30 AM", status: "Returning", initials: "FA" },
  { name: "James Amaka", date: "Jun 15", service: "8:00 AM", status: "New", initials: "JA" },
  { name: "Grace Mensah", date: "Jun 8", service: "10:30 AM", status: "New", initials: "GM" },
];

const recentPrayers = [
  { name: "Anonymous", category: "Health", preview: "Please pray for my mother's recovery from surgery...", date: "Jun 22", status: "Open" },
  { name: "David Eze", category: "Family", preview: "Requesting prayer for reconciliation in my marriage...", date: "Jun 21", status: "Prayed" },
  { name: "Sarah K.", category: "Financial", preview: "Believing God for a breakthrough in my business...", date: "Jun 21", status: "Open" },
  { name: "Emmanuel O.", category: "Spiritual", preview: "I need prayer for clarity on God's purpose for my life.", date: "Jun 20", status: "Open" },
];

const upcomingEvents = [
  { title: "Family Faith Night", date: "Jun 22", time: "6:00 PM", rsvps: 87 },
  { title: "Baptism Sunday", date: "Jun 29", time: "10:30 AM", rsvps: 24 },
  { title: "Youth Summer Retreat", date: "Jul 5", time: "8:00 AM", rsvps: 42 },
];

const stats = [
  { label: "Total Members", value: "5,241", change: "+34 this month", up: true, icon: Users, color: "#0E5AA7", bg: "#0E5AA7" },
  { label: "New Visitors", value: "48", change: "+12 vs last month", up: true, icon: UserCheck, color: "#16a34a", bg: "#16a34a" },
  { label: "Prayer Requests", value: "23", change: "8 awaiting follow-up", up: false, icon: Heart, color: "#D7261E", bg: "#D7261E" },
  { label: "Upcoming Events", value: "6", change: "Next: Jun 22", up: true, icon: Calendar, color: "#d97706", bg: "#d97706" },
];

const statusColors: Record<string, string> = {
  New: "bg-[#0E5AA7]/10 text-[#0E5AA7]",
  "Follow-up": "bg-orange-50 text-orange-600",
  Returning: "bg-green-50 text-green-700",
  Open: "bg-[#D7261E]/10 text-[#D7261E]",
  Prayed: "bg-green-50 text-green-700",
};

const fmt = (n: number) =>
  n >= 1000 ? `₦${(n / 1000).toFixed(0)}K` : `₦${n}`;

export default function Dashboard() {
  return (
    <div className="p-5 lg:p-7 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-[#0d1b2e]">Good morning, Pastor Emmanuel 👋</h1>
        <p className="text-[#6b7897] text-sm mt-1">Here's what's happening at Liberty For Living this week.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.bg}15` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-green-600" : "text-[#D7261E]"}`}>
                {s.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              </div>
            </div>
            <div className="text-3xl font-black text-[#0d1b2e] leading-none mb-1.5">{s.value}</div>
            <div className="text-xs font-bold text-[#0d1b2e] mb-0.5">{s.label}</div>
            <div className="text-[11px] text-[#6b7897]">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Attendance */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-black text-[#0d1b2e]">Weekly Attendance</h2>
              <p className="text-xs text-[#6b7897] mt-0.5">Last 8 Sundays</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-[#0E5AA7]">1,622</div>
              <div className="text-xs text-green-600 font-semibold flex items-center gap-1 justify-end"><TrendingUp size={11} />+9.6%</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attendanceData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6b7897" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7897" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} cursor={{ fill: "#0E5AA7", opacity: 0.05 }} />
              <Bar dataKey="attendance" fill="#0E5AA7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Giving */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-black text-[#0d1b2e]">Monthly Giving</h2>
              <p className="text-xs text-[#6b7897] mt-0.5">Last 6 months</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-[#16a34a]">₦212K</div>
              <div className="text-xs text-green-600 font-semibold flex items-center gap-1 justify-end"><TrendingUp size={11} />+8.7%</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={givingData}>
              <defs>
                <linearGradient id="givingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7897" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7897" }} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => fmt(v)} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} formatter={(v: number) => [`₦${v.toLocaleString()}`, "Giving"]} />
              <Area type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2.5} fill="url(#givingGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Visitors */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#0d1b2e]">Recent Visitors</h2>
            <a href="/admin/visitors" className="text-xs font-bold text-[#0E5AA7] flex items-center gap-1 hover:gap-1.5 transition-all">View all <ArrowRight size={12} /></a>
          </div>
          <ul className="space-y-3">
            {recentVisitors.map((v) => (
              <li key={v.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0E5AA7]/10 text-[#0E5AA7] text-xs font-black flex items-center justify-center shrink-0">{v.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#0d1b2e] truncate">{v.name}</div>
                  <div className="text-[11px] text-[#6b7897]">{v.date} · {v.service}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[v.status]}`}>{v.status}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prayer Requests */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#0d1b2e]">Prayer Requests</h2>
            <a href="/admin/prayer-requests" className="text-xs font-bold text-[#0E5AA7] flex items-center gap-1 hover:gap-1.5 transition-all">View all <ArrowRight size={12} /></a>
          </div>
          <ul className="space-y-3">
            {recentPrayers.map((p, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-[#D7261E]/10 text-[#D7261E] flex items-center justify-center shrink-0"><Heart size={13} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-[#0d1b2e] truncate">{p.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${statusColors[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="text-[11px] text-[#6b7897] line-clamp-1">{p.preview}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#0d1b2e]">Upcoming Events</h2>
            <a href="/admin/events" className="text-xs font-bold text-[#0E5AA7] flex items-center gap-1 hover:gap-1.5 transition-all">View all <ArrowRight size={12} /></a>
          </div>
          <ul className="space-y-3">
            {upcomingEvents.map((ev) => (
              <li key={ev.title} className="flex items-center gap-3 p-3 bg-[#f0f4f9] rounded-xl">
                <div className="text-center shrink-0">
                  <div className="text-[10px] font-black text-[#0E5AA7] uppercase">{ev.date.split(" ")[0]}</div>
                  <div className="text-xl font-black text-[#0d1b2e] leading-none">{ev.date.split(" ")[1]}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#0d1b2e] truncate">{ev.title}</div>
                  <div className="text-[11px] text-[#6b7897]">{ev.time} · {ev.rsvps} RSVPs</div>
                </div>
              </li>
            ))}
          </ul>
          {/* Quick action */}
          <div className="mt-4 pt-4 border-t border-[#e8eef6]">
            <div className="flex items-center gap-3 p-3 bg-[#0E5AA7]/8 rounded-xl">
              <Mic2 size={16} className="text-[#0E5AA7] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#0d1b2e]">Latest Sermon</div>
                <div className="text-[11px] text-[#6b7897] truncate">"Unshackled: Living Free from Fear"</div>
              </div>
              <a href="/admin/sermons" className="text-[#0E5AA7]"><ArrowRight size={14} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
