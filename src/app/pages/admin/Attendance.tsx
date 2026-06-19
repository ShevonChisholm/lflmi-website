import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Edit2,
  Loader2,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { AdminConfirmDialog } from "@/app/components/admin/AdminConfirmDialog";
import {
  createAttendanceRecord,
  deleteAttendanceRecord,
  getAttendanceRecords,
  getServiceTimes,
  updateAttendanceRecord,
  type AttendanceRecordInput,
} from "@/lib/data";
import type { AttendanceRecord, ServiceTime } from "@/types";

const fieldClass =
  "w-full rounded-xl border border-[#e8eef6] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E5AA7]";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-JM", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Jamaica",
  }).format(new Date(value));

const toDatetimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
};

const fromDatetimeLocal = (value: string) => new Date(value).toISOString();

export default function Attendance() {
  const [items, setItems] = useState<AttendanceRecord[]>([]);
  const [serviceTimes, setServiceTimes] = useState<ServiceTime[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AttendanceRecord | null | undefined>();
  const [deleting, setDeleting] = useState<AttendanceRecord | null>(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [attendanceRecords, services] = await Promise.all([
          getAttendanceRecords(),
          getServiceTimes(),
        ]);
        setItems(attendanceRecords);
        setServiceTimes(services.filter((service) => service.isActive));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load attendance.",
        );
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      [...items]
        .sort(
          (a, b) =>
            new Date(b.serviceDate).getTime() -
            new Date(a.serviceDate).getTime(),
        )
        .filter((item) =>
          `${item.serviceName} ${item.notes ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    [items, search],
  );

  const totals = useMemo(() => {
    const recent = [...items]
      .sort(
        (a, b) =>
          new Date(b.serviceDate).getTime() -
          new Date(a.serviceDate).getTime(),
      )
      .slice(0, 8);

    return {
      records: items.length,
      latestAttendance: recent[0]?.attendeeCount ?? 0,
      averageAttendance:
        recent.length > 0
          ? Math.round(
              recent.reduce((total, item) => total + item.attendeeCount, 0) /
                recent.length,
            )
          : 0,
      visitors: recent.reduce((total, item) => total + item.visitorCount, 0),
    };
  }, [items]);

  const save = async (input: AttendanceRecordInput) => {
    setSaving(true);
    setError("");

    try {
      const saved = editing
        ? await updateAttendanceRecord(editing.id, input)
        : await createAttendanceRecord(input);

      setItems((list) =>
        editing
          ? list.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...list],
      );
      setEditing(undefined);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save attendance.",
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleting) return;

    setSaving(true);
    setError("");

    try {
      await deleteAttendanceRecord(deleting.id);
      setItems((list) => list.filter((item) => item.id !== deleting.id));
      setDeleting(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete attendance.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 lg:p-7">
      <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Attendance</h1>
          <p className="mt-1 text-sm text-[#6b7897]">
            Record service attendance and visitor counts for dashboard reports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(null)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white sm:w-auto"
        >
          <Plus size={16} />
          Add Record
        </button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Records" value={totals.records} />
        <StatCard label="Latest Attendance" value={totals.latestAttendance} />
        <StatCard label="8-Service Average" value={totals.averageAttendance} />
        <StatCard label="Recent Visitors" value={totals.visitors} />
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="absolute left-3 top-3 text-[#6b7897]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search service name or notes..."
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
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="responsive-admin-table overflow-x-auto">
            <table className="w-full md:min-w-[760px]">
              <thead className="border-b border-[#e8eef6] bg-[#f8fafc] text-left text-xs font-black uppercase tracking-wide text-[#6b7897]">
                <tr>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Visitors</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8eef6]">
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Service" className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0E5AA7]/10 text-[#0E5AA7]">
                          <CalendarDays size={18} />
                        </div>
                        <b className="text-sm text-[#0d1b2e]">
                          {item.serviceName}
                        </b>
                      </div>
                    </td>
                    <td data-label="Date" className="p-4 text-sm text-[#526479]">
                      {formatDate(item.serviceDate)}
                    </td>
                    <td data-label="Attendance" className="p-4 text-sm font-black text-[#0d1b2e]">
                      {item.attendeeCount}
                    </td>
                    <td data-label="Visitors" className="p-4 text-sm font-black text-[#0E5AA7]">
                      {item.visitorCount}
                    </td>
                    <td data-label="Notes" className="max-w-xs p-4 text-sm text-[#6b7897]">
                      <span className="line-clamp-2">
                        {item.notes || "No notes"}
                      </span>
                    </td>
                    <td data-actions="true" className="p-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(item)}
                          className="rounded-lg p-2 text-[#6b7897] hover:bg-[#f0f4f9]"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(item)}
                          className="rounded-lg p-2 text-[#6b7897] hover:bg-red-50 hover:text-[#D7261E]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-sm text-[#6b7897]"
                    >
                      No attendance records match this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing !== undefined && (
        <AttendanceDialog
          value={editing}
          serviceTimes={serviceTimes}
          busy={saving}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      )}

      {deleting && (
        <AdminConfirmDialog
          title="Delete attendance record?"
          message={`This permanently removes the ${deleting.serviceName} record from ${formatDate(deleting.serviceDate)}.`}
          busy={saving}
          onCancel={() => setDeleting(null)}
          onConfirm={() => void remove()}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E5AA7]/10 text-[#0E5AA7]">
        <Users size={18} />
      </div>
      <div className="text-3xl font-black text-[#0d1b2e]">{value}</div>
      <div className="text-xs font-bold text-[#6b7897]">{label}</div>
    </div>
  );
}

function AttendanceDialog({
  value,
  serviceTimes,
  busy,
  onClose,
  onSave,
}: {
  value: AttendanceRecord | null;
  serviceTimes: ServiceTime[];
  busy: boolean;
  onClose: () => void;
  onSave: (input: AttendanceRecordInput) => Promise<void>;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const numberValue = (name: string) =>
      Math.max(0, Number(form.get(name) ?? 0));

    void onSave({
      serviceName: String(form.get("serviceName") ?? "").trim(),
      serviceDate: fromDatetimeLocal(String(form.get("serviceDate") ?? "")),
      attendeeCount: numberValue("attendeeCount"),
      visitorCount: numberValue("visitorCount"),
      notes: String(form.get("notes") ?? "").trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center overflow-y-auto bg-[#04183a]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        onSubmit={submit}
        className="max-h-[100dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl sm:max-h-[92vh] sm:rounded-3xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-[#0d1b2e] sm:text-xl">
              {value ? "Edit attendance" : "Add attendance"}
            </h2>
            <p className="mt-1 text-sm text-[#6b7897]">
              Times are saved in UTC and displayed for Jamaica.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl bg-[#f0f4f9] px-3 py-2 text-sm font-bold text-[#6b7897]"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-[#0d1b2e]">
            Service name
            <input
              name="serviceName"
              list="service-name-options"
              required
              defaultValue={value?.serviceName ?? serviceTimes[0]?.label ?? ""}
              className={`${fieldClass} mt-2`}
            />
            <datalist id="service-name-options">
              {serviceTimes.map((service) => (
                <option key={service.id} value={service.label} />
              ))}
            </datalist>
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Service date and time
            <input
              name="serviceDate"
              type="datetime-local"
              required
              defaultValue={toDatetimeLocal(value?.serviceDate)}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Total attendance
            <input
              name="attendeeCount"
              type="number"
              min={0}
              required
              defaultValue={value?.attendeeCount ?? 0}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Visitors
            <input
              name="visitorCount"
              type="number"
              min={0}
              required
              defaultValue={value?.visitorCount ?? 0}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="text-sm font-bold text-[#0d1b2e] sm:col-span-2">
            Notes
            <textarea
              name="notes"
              rows={4}
              defaultValue={value?.notes ?? ""}
              className={`${fieldClass} mt-2`}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#f0f4f9] px-4 py-2.5 text-center text-sm font-bold text-[#6b7897]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            Save attendance
          </button>
        </div>
      </form>
    </div>
  );
}
