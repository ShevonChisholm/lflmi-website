import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, UserCheck, Heart, Mic2, Calendar,
  CalendarCheck, Users, HandCoins, Globe, Info,
  Settings, LogOut, Menu, X, Bell, Search, ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/PHOTO-2025-11-20-06-26-28-removebg-preview.png";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: UserCheck, label: "Visitors", path: "/admin/visitors" },
  { icon: Heart, label: "Prayer Requests", path: "/admin/prayer-requests" },
  { icon: Mic2, label: "Sermons", path: "/admin/sermons" },
  { icon: Calendar, label: "Events", path: "/admin/events" },
  { icon: CalendarCheck, label: "Planned Visits", path: "/admin/planned-visits" },
  { icon: Users, label: "Members", path: "/admin/members" },
  { icon: HandCoins, label: "Give Programs", path: "/admin/give" },
  { icon: Globe, label: "Ministries", path: "/admin/ministries" },
  { icon: Info, label: "About", path: "/admin/about" },
];

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/visitors": "Visitors",
  "/admin/prayer-requests": "Prayer Requests",
  "/admin/sermons": "Sermons",
  "/admin/events": "Events",
  "/admin/planned-visits": "Planned Visits",
  "/admin/members": "Members",
  "/admin/give": "Give Programs",
  "/admin/ministries": "Ministries",
  "/admin/about": "About & Settings",
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(5);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login");
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const pageTitle = pageTitles[location.pathname] ?? "Admin";
  const handleAdminSearch = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return;
    const match = navItems.find((item) =>
      item.label.toLowerCase().includes(normalized),
    );
    if (match) navigate(match.path);
  };

  return (
    <div className="flex h-screen bg-[#f0f4f9] overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white flex flex-col border-r border-[#e8eef6] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#e8eef6] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl border border-[#e8eef6] px-2.5 py-1.5 shadow-sm">
              <ImageWithFallback src={logoImg} alt="LFLMI" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <div className="text-[10px] font-black text-[#0E5AA7] tracking-widest uppercase leading-none">LFLMI</div>
              <div className="text-xs text-[#6b7897] font-semibold mt-0.5">Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="text-[9px] font-black text-[#6b7897]/60 tracking-widest uppercase px-3 mb-2">Main Menu</div>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                      isActive
                        ? "bg-[#0E5AA7]/10 text-[#0E5AA7] font-bold"
                        : "text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} className={isActive ? "text-[#0E5AA7]" : "text-[#6b7897] group-hover:text-[#0d1b2e]"} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#0E5AA7]" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#e8eef6] p-3 shrink-0 space-y-0.5">
          <button onClick={() => navigate("/admin/about")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-all w-full group">
            <Settings size={18} />Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#D7261E]/70 hover:bg-[#D7261E]/8 hover:text-[#D7261E] transition-all w-full">
            <LogOut size={18} />Sign Out
          </button>
          <div className="flex items-center gap-3 px-3 pt-3 mt-2 border-t border-[#e8eef6]">
            <div className="w-8 h-8 rounded-full bg-[#0E5AA7] flex items-center justify-center text-white text-xs font-black shrink-0">EA</div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0d1b2e] truncate">Emmanuel Adeyemi</div>
              <div className="text-[10px] text-[#6b7897] truncate">Senior Pastor</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-[#e8eef6] h-14 flex items-center gap-4 px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-colors">
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm min-w-0">
            <span className="text-[#6b7897] font-medium hidden sm:block">Admin</span>
            <ChevronRight size={14} className="text-[#6b7897]/50 hidden sm:block shrink-0" />
            <span className="font-bold text-[#0d1b2e] truncate">{pageTitle}</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7897]" />
              <input
                type="text"
                placeholder="Search..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAdminSearch(event.currentTarget.value);
                    event.currentTarget.value = "";
                  }
                }}
                className="w-full pl-9 pr-4 py-2 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] placeholder:text-[#6b7897]/60 outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* View public site */}
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#0E5AA7] hover:text-[#0a4a8a] bg-[#0E5AA7]/8 hover:bg-[#0E5AA7]/15 px-3 py-1.5 rounded-lg transition-colors">
              View Site
            </a>
            {/* Notifications */}
            <button onClick={() => navigate("/admin/prayer-requests")} aria-label="View notifications" className="relative p-2 rounded-xl text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-colors">
              <Bell size={18} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D7261E] text-white text-[9px] font-black rounded-full flex items-center justify-center">{notifications}</span>
              )}
            </button>
            {/* Avatar */}
            <button onClick={() => navigate("/admin/about")} aria-label="Open settings" className="w-8 h-8 rounded-full bg-[#0E5AA7] flex items-center justify-center text-white text-xs font-black cursor-pointer">EA</button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
