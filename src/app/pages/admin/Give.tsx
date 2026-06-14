import { TrendingUp, Plus, ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const programs = [
  { id: 1, name: "General Tithe & Offering", description: "Weekly tithes and general offerings from the congregation.", goal: 1000000, raised: 742000, color: "#0E5AA7", icon: "🙏", trend: [60, 72, 65, 80, 78, 88, 85, 92] },
  { id: 2, name: "Building Fund", description: "Raising funds for the new sanctuary construction project.", goal: 5000000, raised: 1850000, color: "#D7261E", icon: "🏛️", trend: [30, 38, 42, 50, 48, 55, 62, 67] },
  { id: 3, name: "Global Missions Fund", description: "Supporting missionaries and outreach in 8 nations.", goal: 600000, raised: 480000, color: "#16a34a", icon: "🌍", trend: [55, 60, 58, 65, 72, 70, 75, 80] },
  { id: 4, name: "Youth Ministry Fund", description: "Funding youth programs, retreats, and discipleship materials.", goal: 200000, raised: 142000, color: "#d97706", icon: "⚡", trend: [45, 50, 48, 55, 60, 65, 68, 71] },
];

const transactions = [
  { id: 1, name: "Emmanuel A.", type: "Tithe", program: "General Tithe & Offering", amount: 25000, date: "Jun 22, 2025", method: "Bank Transfer" },
  { id: 2, name: "Grace O.", type: "Offering", program: "Building Fund", amount: 10000, date: "Jun 22, 2025", method: "Card" },
  { id: 3, name: "Anonymous", type: "Donation", program: "Global Missions Fund", amount: 50000, date: "Jun 21, 2025", method: "Bank Transfer" },
  { id: 4, name: "David E.", type: "Tithe", program: "General Tithe & Offering", amount: 15000, date: "Jun 21, 2025", method: "Cash" },
  { id: 5, name: "Fatima A.", type: "Donation", program: "Youth Ministry Fund", amount: 5000, date: "Jun 20, 2025", method: "Card" },
  { id: 6, name: "Samuel T.", type: "Tithe", program: "General Tithe & Offering", amount: 30000, date: "Jun 20, 2025", method: "Bank Transfer" },
  { id: 7, name: "Mary J.", type: "Offering", program: "Building Fund", amount: 20000, date: "Jun 19, 2025", method: "Card" },
  { id: 8, name: "Peter O.", type: "Donation", program: "Global Missions Fund", amount: 8000, date: "Jun 18, 2025", method: "Cash" },
];

const methodColors: Record<string, string> = {
  "Bank Transfer": "bg-[#0E5AA7]/10 text-[#0E5AA7]",
  Card: "bg-green-50 text-green-700",
  Cash: "bg-orange-50 text-orange-600",
};

const fmt = (n: number) => `₦${n.toLocaleString()}`;
const pct = (raised: number, goal: number) => Math.round((raised / goal) * 100);

export default function Give() {
  return (
    <div className="p-5 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Give Programs</h1>
          <p className="text-sm text-[#6b7897] mt-1">Track giving programs, goals, and transactions</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={16} />New Program
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Received (Jun)", value: "₦212,000", change: "+8.7%", up: true, icon: ArrowDownLeft, color: "#16a34a" },
          { label: "Total Programs", value: "4", change: "All active", up: true, icon: DollarSign, color: "#0E5AA7" },
          { label: "Online Giving", value: "68%", change: "of all transactions", up: true, icon: ArrowUpRight, color: "#7c3aed" },
          { label: "Avg. Gift Size", value: "₦20,375", change: "+12% vs May", up: true, icon: TrendingUp, color: "#d97706" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span className="text-xs font-bold text-green-600 flex items-center gap-0.5"><TrendingUp size={11} />{s.change}</span>
            </div>
            <div className="text-2xl font-black text-[#0d1b2e] leading-none mb-1">{s.value}</div>
            <div className="text-xs text-[#6b7897]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Programs */}
      <div>
        <h2 className="text-base font-black text-[#0d1b2e] mb-4">Giving Programs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {programs.map((p) => {
            const progress = pct(p.raised, p.goal);
            const trendData = p.trend.map((v, i) => ({ i, v }));
            return (
              <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-base font-black text-[#0d1b2e] leading-tight">{p.name}</h3>
                    <p className="text-xs text-[#6b7897] mt-0.5">{p.description}</p>
                  </div>
                  <div className="h-10 w-20 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id={`g${p.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={p.color} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={p.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={p.color} strokeWidth={2} fill={`url(#g${p.id})`} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <div className="text-xl font-black" style={{ color: p.color }}>{fmt(p.raised)}</div>
                    <div className="text-xs text-[#6b7897]">raised of {fmt(p.goal)} goal</div>
                  </div>
                  <div className="text-2xl font-black text-[#0d1b2e]">{progress}%</div>
                </div>
                <div className="h-2.5 bg-[#e8eef6] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: p.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-[#0d1b2e]">Recent Transactions</h2>
          <button className="text-xs font-bold text-[#0E5AA7] hover:text-[#0a4a8a] transition-colors">Export CSV</button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8eef6]">
                  <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-5 py-3.5">Giver</th>
                  <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden sm:table-cell">Program</th>
                  <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden md:table-cell">Type</th>
                  <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden lg:table-cell">Method</th>
                  <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden sm:table-cell">Date</th>
                  <th className="text-right text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-5 py-3.5">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8eef6]">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f8fafd] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0E5AA7]/10 text-[#0E5AA7] text-xs font-black flex items-center justify-center">{t.name.slice(0, 2).toUpperCase()}</div>
                        <span className="text-sm font-semibold text-[#0d1b2e]">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className="text-xs text-[#6b7897]">{t.program}</span></td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-xs font-semibold text-[#0d1b2e]">{t.type}</span></td>
                    <td className="px-4 py-3.5 hidden lg:table-cell"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${methodColors[t.method]}`}>{t.method}</span></td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className="text-xs text-[#6b7897]">{t.date}</span></td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm font-black text-green-700">{fmt(t.amount)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
