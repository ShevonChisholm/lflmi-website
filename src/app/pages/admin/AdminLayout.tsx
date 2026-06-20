import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, UserCheck, Heart, Mic2, Calendar,
  CalendarCheck, Users, HandCoins, Globe, Info,
  Settings, LogOut, Menu, Bell, Search, ChevronRight, MessagesSquare, Files,
  ShieldCheck, Loader2, Lock, ClipboardList,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/PHOTO-2025-11-20-06-26-28-removebg-preview.png";
import { supabase } from "@/lib/supabase/client";
import { getContactMessages, getCurrentAdminProfile } from "@/lib/data";
import {
  adminRoleLabels,
  canAccessAdminPath,
  hasAdminPermission,
  initialsForAdmin,
} from "@/lib/admin-permissions";
import type { AdminPermission, AdminProfile } from "@/types";
import { ScrollToTopButton } from "@/app/components/public/ScrollToTopButton";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard", permission: "VIEW_DASHBOARD" },
  { icon: UserCheck, label: "Visitors", path: "/admin/visitors", permission: "MANAGE_CARE" },
  { icon: Heart, label: "Prayer Requests", path: "/admin/prayer-requests", permission: "MANAGE_CARE" },
  { icon: MessagesSquare, label: "Contact Inbox", path: "/admin/contact-messages", permission: "MANAGE_CARE" },
  { icon: Mic2, label: "Sermons", path: "/admin/sermons", permission: "MANAGE_CMS" },
  { icon: Calendar, label: "Events", path: "/admin/events", permission: "MANAGE_CMS" },
  { icon: CalendarCheck, label: "Planned Visits", path: "/admin/planned-visits", permission: "MANAGE_CARE" },
  { icon: ClipboardList, label: "Attendance", path: "/admin/attendance", permission: "MANAGE_CARE" },
  { icon: Users, label: "Members", path: "/admin/members", permission: "MANAGE_MEMBERS" },
  { icon: HandCoins, label: "Give Programs", path: "/admin/give", permission: "MANAGE_GIVING" },
  { icon: Globe, label: "Ministries", path: "/admin/ministries", permission: "MANAGE_CMS" },
  { icon: Files, label: "Content Pages", path: "/admin/content-pages", permission: "MANAGE_CMS" },
  { icon: Info, label: "About", path: "/admin/about", permission: "MANAGE_CMS" },
  { icon: ShieldCheck, label: "Administrators", path: "/admin/admins", permission: "MANAGE_ADMINS" },
];

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/visitors": "Visitors",
  "/admin/prayer-requests": "Prayer Requests",
  "/admin/contact-messages": "Contact Inbox",
  "/admin/admins": "Administrators",
  "/admin/sermons": "Sermons",
  "/admin/events": "Events",
  "/admin/planned-visits": "Planned Visits",
  "/admin/attendance": "Attendance",
  "/admin/members": "Members",
  "/admin/give": "Give Programs",
  "/admin/ministries": "Ministries",
  "/admin/content-pages": "Content Pages",
  "/admin/about": "About & Settings",
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const loadAdminProfile = async () => {
      setProfileLoading(true);
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login");
        return;
      }

      try {
        const profile = await getCurrentAdminProfile();

        if (!profile?.isActive) {
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        setCurrentAdmin(profile);
      } catch {
        setCurrentAdmin(null);
      } finally {
        setProfileLoading(false);
      }
    };

    void loadAdminProfile();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setCurrentAdmin(null);
        navigate("/admin/login");
        return;
      }

      void loadAdminProfile();
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!hasAdminPermission(currentAdmin, "MANAGE_CARE")) {
      setNotifications(0);
      return;
    }

    const refreshNotifications = async () => {
      try {
        const messages = await getContactMessages();
        setNotifications(messages.filter((message) => message.status === "NEW").length);
      } catch {
        setNotifications(0);
      }
    };
    const handleCount = (event: Event) => {
      setNotifications((event as CustomEvent<number>).detail);
    };
    void refreshNotifications();
    window.addEventListener("contact-unread-count", handleCount);
    window.addEventListener("focus", refreshNotifications);
    const refreshInterval = window.setInterval(refreshNotifications, 30000);
    const channel = supabase
      .channel("admin-contact-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => void refreshNotifications(),
      )
      .subscribe();
    return () => {
      window.removeEventListener("contact-unread-count", handleCount);
      window.removeEventListener("focus", refreshNotifications);
      window.clearInterval(refreshInterval);
      void supabase.removeChannel(channel);
    };
  }, [currentAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const pageTitle = pageTitles[location.pathname] ?? "Admin";
  const availableNavItems = navItems.filter((item) =>
    hasAdminPermission(currentAdmin, item.permission as AdminPermission),
  );
  const canAccessCurrentPage =
    !profileLoading && canAccessAdminPath(currentAdmin, location.pathname);
  const adminInitials = initialsForAdmin(currentAdmin);

  const handleAdminSearch = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return;
    const match = availableNavItems.find((item) =>
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
            {availableNavItems.map((item) => (
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
          {hasAdminPermission(currentAdmin, "MANAGE_CMS") && (
            <button onClick={() => navigate("/admin/about")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-all w-full group">
              <Settings size={18} />Settings
            </button>
          )}
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#D7261E]/70 hover:bg-[#D7261E]/8 hover:text-[#D7261E] transition-all w-full">
            <LogOut size={18} />Sign Out
          </button>
          <div className="flex items-center gap-3 px-3 pt-3 mt-2 border-t border-[#e8eef6]">
            <div className="w-8 h-8 rounded-full bg-[#0E5AA7] flex items-center justify-center text-white text-xs font-black shrink-0">{adminInitials}</div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0d1b2e] truncate">{currentAdmin?.fullName ?? currentAdmin?.email ?? "Administrator"}</div>
              <div className="text-[10px] text-[#6b7897] truncate">{currentAdmin ? adminRoleLabels[currentAdmin.role] : "LFLMI Admin"}</div>
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
            {hasAdminPermission(currentAdmin, "MANAGE_CARE") && (
              <button onClick={() => navigate("/admin/contact-messages")} aria-label="View unread contact messages" className="relative p-2 rounded-xl text-[#6b7897] hover:bg-[#f0f4f9] hover:text-[#0d1b2e] transition-colors">
                <Bell size={18} />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D7261E] text-white text-[9px] font-black rounded-full flex items-center justify-center">{notifications}</span>
                )}
              </button>
            )}
            {/* Avatar */}
            <button onClick={() => navigate(hasAdminPermission(currentAdmin, "MANAGE_ADMINS") ? "/admin/admins" : "/admin/dashboard")} aria-label="Open admin profile" className="w-8 h-8 rounded-full bg-[#0E5AA7] flex items-center justify-center text-white text-xs font-black cursor-pointer">{adminInitials}</button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {profileLoading ? (
            <div className="flex min-h-full items-center justify-center">
              <Loader2 className="animate-spin text-[#0E5AA7]" />
            </div>
          ) : canAccessCurrentPage ? (
            <Outlet />
          ) : (
            <AccessDenied />
          )}
          <ScrollToTopButton />
        </main>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex min-h-full items-center justify-center p-8">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#D7261E]">
          <Lock size={24} />
        </div>
        <h2 className="text-xl font-black text-[#0d1b2e]">Access denied</h2>
        <p className="mt-2 text-sm leading-6 text-[#6b7897]">
          Your administrator role does not have permission to open this section.
          Ask a super admin to update your permissions if this looks wrong.
        </p>
      </div>
    </div>
  );
}
