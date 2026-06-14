import { useState } from "react";
import { Search, Plus, Filter, Edit2, Mail, Phone } from "lucide-react";

const members = [
  { id: 1, name: "Emmanuel Adeyemi", initials: "EA", email: "pastor@lflmi.org", phone: "+1 876 111 2222", ministry: "Leadership", joinDate: "Jan 15, 2005", status: "Active", role: "Senior Pastor" },
  { id: 2, name: "Yemi Adeyemi", initials: "YA", email: "yemi@lflmi.org", phone: "+1 876 222 3333", ministry: "Leadership", joinDate: "Jan 15, 2005", status: "Active", role: "Associate Pastor" },
  { id: 3, name: "Grace Obi", initials: "GO", email: "grace.o@lflmi.org", phone: "+1 876 333 4444", ministry: "Women's Fellowship", joinDate: "Mar 3, 2008", status: "Active", role: "Deaconess" },
  { id: 4, name: "Samuel Tunde", initials: "ST", email: "sam.t@lflmi.org", phone: "+1 876 444 5555", ministry: "Administration", joinDate: "Jun 7, 2010", status: "Active", role: "Deacon" },
  { id: 5, name: "Kola Abiodun", initials: "KA", email: "kola.a@gmail.com", phone: "+1 876 555 6666", ministry: "Youth Ministry", joinDate: "Sep 20, 2013", status: "Active", role: "Youth Leader" },
  { id: 6, name: "Esther Ike", initials: "EI", email: "esther.i@gmail.com", phone: "+1 876 666 7777", ministry: "Worship Arts", joinDate: "Feb 12, 2015", status: "Active", role: "Minister" },
  { id: 7, name: "Adaeze Okonkwo", initials: "AO", email: "adaeze.o@gmail.com", phone: "+1 876 456 7890", ministry: "Children's Ministry", joinDate: "Apr 5, 2018", status: "Active", role: "Volunteer" },
  { id: 8, name: "Chidi Nwosu", initials: "CN", email: "chidi.n@gmail.com", phone: "+1 876 789 0123", ministry: "Life Groups", joinDate: "Nov 14, 2019", status: "Active", role: "Life Group Leader" },
  { id: 9, name: "Fatima Al-Hassan", initials: "FA", email: "fatima.ah@yahoo.com", phone: "+1 876 876 5432", ministry: "Global Missions", joinDate: "Jan 19, 2020", status: "Active", role: "Missions Coordinator" },
  { id: 10, name: "Peter Oluwaseun", initials: "PO", email: "peter.o@yahoo.com", phone: "+1 876 654 3210", ministry: "Worship Arts", joinDate: "Mar 8, 2021", status: "Active", role: "Volunteer" },
  { id: 11, name: "Mary Johnson", initials: "MJ", email: "mary.j@gmail.com", phone: "+1 876 234 5678", ministry: "Women's Fellowship", joinDate: "Jul 25, 2021", status: "Active", role: "Member" },
  { id: 12, name: "Amina Bello", initials: "AB", email: "amina.b@gmail.com", phone: "+1 876 432 1098", ministry: "Children's Ministry", joinDate: "Oct 3, 2022", status: "Inactive", role: "Volunteer" },
  { id: 13, name: "David Eze", initials: "DE", email: "david.eze@gmail.com", phone: "+1 876 123 4567", ministry: "Men's Fellowship", joinDate: "Feb 2, 2023", status: "Active", role: "Member" },
  { id: 14, name: "James Amaka", initials: "JA", email: "james.amaka@gmail.com", phone: "+1 876 701 2345", ministry: "None", joinDate: "Jun 15, 2025", status: "New", role: "New Member" },
  { id: 15, name: "Chibuzor Nnamdi", initials: "CN2", email: "chibu.n@outlook.com", phone: "+1 876 901 2345", ministry: "None", joinDate: "Jun 22, 2025", status: "New", role: "New Member" },
];

const ministries = ["All", "Leadership", "Women's Fellowship", "Youth Ministry", "Worship Arts", "Children's Ministry", "Life Groups", "Global Missions", "Men's Fellowship", "Administration", "None"];

const statusColors: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-slate-100 text-slate-500",
  New: "bg-[#0E5AA7]/10 text-[#0E5AA7]",
};

const avatarColors = ["#0E5AA7", "#D7261E", "#16a34a", "#7c3aed", "#d97706", "#0891b2"];

export default function Members() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ministryFilter, setMinistryFilter] = useState("All");

  const filtered = members.filter((m) => {
    const match = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    const matchMinistry = ministryFilter === "All" || m.ministry === ministryFilter;
    return match && matchStatus && matchMinistry;
  });

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Members</h1>
          <p className="text-sm text-[#6b7897] mt-1">{members.filter(m => m.status === "Active").length} active · {members.filter(m => m.status === "New").length} new this month</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={16} />Add Member
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7897]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8eef6] rounded-xl text-sm placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {["All", "Active", "New", "Inactive"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${statusFilter === s ? "bg-[#0E5AA7] text-white" : "bg-white border border-[#e8eef6] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#6b7897] mr-1"><Filter size={12} />Ministry:</div>
        {ministries.slice(0, 7).map((m) => (
          <button key={m} onClick={() => setMinistryFilter(m)} className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${ministryFilter === m ? "bg-[#D7261E] text-white" : "bg-white border border-[#e8eef6] text-[#6b7897] hover:text-[#0d1b2e]"}`}>{m}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8eef6]">
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-5 py-3.5">Member</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden md:table-cell">Contact</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden lg:table-cell">Ministry</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden xl:table-cell">Role</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5 hidden sm:table-cell">Joined</th>
                <th className="text-left text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-4 py-3.5">Status</th>
                <th className="text-right text-[10px] font-black text-[#6b7897] tracking-widest uppercase px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eef6]">
              {filtered.map((m, i) => (
                <tr key={m.id} className="hover:bg-[#f8fafd] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ backgroundColor: avatarColors[i % avatarColors.length] }}>{m.initials.slice(0, 2)}</div>
                      <div>
                        <div className="text-sm font-bold text-[#0d1b2e]">{m.name}</div>
                        <div className="text-xs text-[#6b7897] md:hidden">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#6b7897]"><Mail size={11} className="text-[#0E5AA7]" />{m.email}</div>
                      <div className="flex items-center gap-1.5 text-xs text-[#6b7897]"><Phone size={11} className="text-[#0E5AA7]" />{m.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-[#0d1b2e]">{m.ministry}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden xl:table-cell">
                    <span className="text-xs font-semibold text-[#6b7897]">{m.role}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-[#6b7897]">{m.joinDate}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[m.status]}`}>{m.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="p-1.5 rounded-lg text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-colors"><Mail size={14} /></button>
                      <button className="p-1.5 rounded-lg text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-colors"><Edit2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-[#e8eef6] flex items-center justify-between">
          <span className="text-xs text-[#6b7897]">Showing {filtered.length} of {members.length} members</span>
          <div className="flex gap-1.5">
            <button className="text-xs font-semibold px-3 py-1.5 bg-[#f0f4f9] rounded-lg text-[#6b7897]">Previous</button>
            <button className="text-xs font-semibold px-3 py-1.5 bg-[#0E5AA7] rounded-lg text-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
