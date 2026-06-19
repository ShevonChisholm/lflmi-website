import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Loader2,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  adminPermissionLabels,
  adminRoleLabels,
  allAdminPermissions,
  roleDefaultPermissions,
} from "@/lib/admin-permissions";
import {
  createAdminProfile,
  getAdminProfiles,
  updateAdminProfile,
  type AdminProfileCreateInput,
  type AdminProfileUpdateInput,
} from "@/lib/data";
import type { AdminPermission, AdminProfile, AdminRole } from "@/types";

const roles = Object.keys(adminRoleLabels) as AdminRole[];

const fieldClass =
  "w-full rounded-xl border border-[#e8eef6] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E5AA7]";

const statusClass = (profile: AdminProfile) =>
  profile.isActive
    ? "bg-green-50 text-green-700"
    : "bg-slate-100 text-slate-600";

export default function Admins() {
  const [items, setItems] = useState<AdminProfile[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminProfile | null | undefined>();
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems(await getAdminProfiles());
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load administrators.",
        );
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        `${item.fullName ?? ""} ${item.email ?? ""} ${item.role}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const save = async (
    input: AdminProfileCreateInput | AdminProfileUpdateInput,
  ) => {
    setSaving(true);
    setError("");

    try {
      const saved =
        editing === null
          ? await createAdminProfile(input as AdminProfileCreateInput)
          : await updateAdminProfile(
              editing!.id,
              input as AdminProfileUpdateInput,
            );

      setItems((list) =>
        editing === null
          ? [saved, ...list]
          : list.map((item) => (item.id === saved.id ? saved : item)),
      );
      setEditing(undefined);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save administrator.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (profile: AdminProfile) => {
    setSaving(true);
    setError("");

    try {
      const saved = await updateAdminProfile(profile.id, {
        isActive: !profile.isActive,
      });
      setItems((list) =>
        list.map((item) => (item.id === saved.id ? saved : item)),
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update administrator.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">
            Administrators
          </h1>
          <p className="mt-1 text-sm text-[#6b7897]">
            Manage admin roles, permissions, and portal access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(null)}
          className="flex items-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Create Admin
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search
            size={14}
            className="absolute left-3 top-3 text-[#6b7897]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search administrators..."
            className="w-full rounded-xl border border-[#e8eef6] bg-white py-2.5 pl-9 pr-4 text-sm outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {busy ? (
        <div className="flex justify-center p-16">
          <Loader2 className="animate-spin text-[#0E5AA7]" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((profile) => (
            <article key={profile.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0E5AA7]/10 text-[#0E5AA7]">
                    {profile.role === "SUPER_ADMIN" ? (
                      <ShieldCheck size={20} />
                    ) : (
                      <Shield size={20} />
                    )}
                  </div>
                  <h3 className="text-lg font-black text-[#0d1b2e]">
                    {profile.fullName || "Unnamed admin"}
                  </h3>
                  <p className="text-sm text-[#6b7897]">
                    {profile.email || "No email recorded"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass(profile)}`}
                >
                  {profile.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-xl bg-[#f0f4f9] px-3 py-2 text-xs font-bold text-[#0d1b2e]">
                  {adminRoleLabels[profile.role]}
                </span>
                {(profile.role === "SUPER_ADMIN"
                  ? allAdminPermissions
                  : profile.permissions
                ).map((permission) => (
                  <span
                    key={permission}
                    className="rounded-xl bg-[#0E5AA7]/8 px-3 py-2 text-xs font-bold text-[#0E5AA7]"
                  >
                    {adminPermissionLabels[permission]}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(profile)}
                  className="rounded-xl bg-[#f0f4f9] px-4 py-2.5 text-xs font-bold text-[#526479]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void toggleActive(profile)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
                    profile.isActive
                      ? "bg-red-50 text-[#D7261E]"
                      : "bg-green-50 text-green-700"
                  } disabled:opacity-60`}
                >
                  {profile.isActive ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#6b7897] xl:col-span-2">
              No administrators match this view.
            </div>
          )}
        </div>
      )}

      {editing !== undefined && (
        <AdminProfileDialog
          value={editing}
          busy={saving}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      )}
    </div>
  );
}

function AdminProfileDialog({
  value,
  busy,
  onClose,
  onSave,
}: {
  value: AdminProfile | null;
  busy: boolean;
  onClose: () => void;
  onSave: (
    input: AdminProfileCreateInput | AdminProfileUpdateInput,
  ) => Promise<void>;
}) {
  const isCreate = value === null;
  const [role, setRole] = useState<AdminRole>(value?.role ?? "ADMIN");
  const [permissions, setPermissions] = useState<AdminPermission[]>(
    value?.permissions ?? roleDefaultPermissions.ADMIN,
  );

  const effectivePermissions =
    role === "SUPER_ADMIN" ? allAdminPermissions : permissions;

  const togglePermission = (permission: AdminPermission) => {
    setPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission],
    );
  };

  const handleRoleChange = (nextRole: AdminRole) => {
    setRole(nextRole);
    setPermissions(roleDefaultPermissions[nextRole]);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const input = {
      fullName: String(form.get("fullName") ?? "").trim() || null,
      email: String(form.get("email") ?? "").trim() || null,
      role,
      permissions: effectivePermissions,
      isActive: form.get("isActive") === "on",
    };

    if (isCreate) {
      void onSave({
        ...input,
        email: input.email ?? "",
        password: String(form.get("password") ?? ""),
      });
      return;
    }

    void onSave(input);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#04183a]/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#0d1b2e]">
              {isCreate ? "Create administrator" : "Edit administrator"}
            </h2>
            <p className="mt-1 text-sm text-[#6b7897]">
              Super admins automatically receive every permission.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#f0f4f9] p-2 text-[#6b7897]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-[#0d1b2e]">
            Full name
            <input
              name="fullName"
              defaultValue={value?.fullName ?? ""}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Email
            <input
              name="email"
              type="email"
              required
              defaultValue={value?.email ?? ""}
              className={`${fieldClass} mt-2`}
            />
          </label>

          {isCreate && (
            <label className="text-sm font-bold text-[#0d1b2e] sm:col-span-2">
              Temporary password
              <input
                name="password"
                type="password"
                minLength={8}
                required
                className={`${fieldClass} mt-2`}
              />
              <span className="mt-1 block text-xs font-normal text-[#6b7897]">
                The new admin can change this after their first login.
              </span>
            </label>
          )}

          <label className="text-sm font-bold text-[#0d1b2e]">
            Role
            <select
              value={role}
              onChange={(event) =>
                handleRoleChange(event.target.value as AdminRole)
              }
              className={`${fieldClass} mt-2`}
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {adminRoleLabels[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-[#e8eef6] p-4 text-sm font-bold text-[#0d1b2e]">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={value?.isActive ?? true}
              className="h-4 w-4"
            />
            Active account
          </label>
        </div>

        <section className="mt-5 rounded-3xl bg-[#f8fafc] p-4">
          <h3 className="mb-3 text-sm font-black text-[#0d1b2e]">
            Permissions
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {allAdminPermissions.map((permission) => (
              <button
                key={permission}
                type="button"
                disabled={role === "SUPER_ADMIN"}
                onClick={() => togglePermission(permission)}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm font-bold disabled:cursor-not-allowed ${
                  effectivePermissions.includes(permission)
                    ? "border-[#0E5AA7] bg-[#0E5AA7]/10 text-[#0E5AA7]"
                    : "border-[#e8eef6] bg-white text-[#526479]"
                }`}
              >
                <CheckCircle size={16} />
                {adminPermissionLabels[permission]}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#f0f4f9] px-4 py-2.5 text-sm font-bold text-[#6b7897]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            Save administrator
          </button>
        </div>
      </form>
    </div>
  );
}
