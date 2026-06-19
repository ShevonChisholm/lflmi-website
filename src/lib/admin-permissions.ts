import type { AdminPermission, AdminProfile, AdminRole } from "@/types";

export const adminPermissionLabels: Record<AdminPermission, string> = {
  MANAGE_ADMINS: "Manage administrators",
  MANAGE_CMS: "Manage website content",
  MANAGE_CARE: "Manage care workflows",
  MANAGE_MEMBERS: "Manage members",
  MANAGE_GIVING: "Manage giving",
  VIEW_DASHBOARD: "View dashboard",
};

export const adminRoleLabels: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  PASTOR: "Pastor",
  EDITOR: "Editor",
  CARE_TEAM: "Care Team",
};

export const allAdminPermissions = Object.keys(
  adminPermissionLabels,
) as AdminPermission[];

export const roleDefaultPermissions: Record<
  AdminRole,
  AdminPermission[]
> = {
  SUPER_ADMIN: allAdminPermissions,
  ADMIN: [
    "VIEW_DASHBOARD",
    "MANAGE_CMS",
    "MANAGE_CARE",
    "MANAGE_MEMBERS",
    "MANAGE_GIVING",
  ],
  PASTOR: ["VIEW_DASHBOARD", "MANAGE_CARE", "MANAGE_CMS"],
  EDITOR: ["VIEW_DASHBOARD", "MANAGE_CMS"],
  CARE_TEAM: ["VIEW_DASHBOARD", "MANAGE_CARE", "MANAGE_MEMBERS"],
};

export const routePermissions: Record<string, AdminPermission> = {
  "/admin/dashboard": "VIEW_DASHBOARD",
  "/admin/visitors": "MANAGE_CARE",
  "/admin/prayer-requests": "MANAGE_CARE",
  "/admin/contact-messages": "MANAGE_CARE",
  "/admin/planned-visits": "MANAGE_CARE",
  "/admin/sermons": "MANAGE_CMS",
  "/admin/events": "MANAGE_CMS",
  "/admin/ministries": "MANAGE_CMS",
  "/admin/content-pages": "MANAGE_CMS",
  "/admin/about": "MANAGE_CMS",
  "/admin/members": "MANAGE_MEMBERS",
  "/admin/give": "MANAGE_GIVING",
  "/admin/admins": "MANAGE_ADMINS",
};

export const hasAdminPermission = (
  profile: AdminProfile | null | undefined,
  permission: AdminPermission,
): boolean => {
  if (!profile?.isActive) return false;
  if (profile.role === "SUPER_ADMIN") return true;
  return profile.permissions.includes(permission);
};

export const canAccessAdminPath = (
  profile: AdminProfile | null | undefined,
  path: string,
): boolean => {
  const requiredPermission = routePermissions[path];
  if (!requiredPermission) return true;
  return hasAdminPermission(profile, requiredPermission);
};

export const initialsForAdmin = (profile: AdminProfile | null | undefined) => {
  const source = profile?.fullName ?? profile?.email ?? "Admin";
  const parts = source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part[0]?.toUpperCase()).join("") || "AD";
};
