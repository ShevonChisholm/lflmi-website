import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Edit2,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { AdminCareDialog } from "@/app/components/admin/AdminCareDialog";
import {
  createPlannedVisit,
  getPlannedVisits,
  updatePlannedVisit,
  type PlannedVisitInput,
} from "@/lib/data";
import type { PlannedVisit } from "@/types";

const statuses: Array<"ALL" | PlannedVisit["status"]> = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "ATTENDED",
  "NO_SHOW",
  "CANCELLED",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-JM", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Jamaica",
  }).format(new Date(value));

const statusClass = (status: PlannedVisit["status"]) => {
  if (status === "ATTENDED") return "bg-green-50 text-green-700";
  if (status === "CANCELLED" || status === "NO_SHOW") {
    return "bg-red-50 text-[#D7261E]";
  }
  if (status === "CONFIRMED") return "bg-blue-50 text-[#0E5AA7]";
  return "bg-amber-50 text-amber-700";
};

export default function PlannedVisits() {
  const [items, setItems] = useState<PlannedVisit[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("ALL");
  const [editing, setEditing] = useState<PlannedVisit | null | undefined>();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems(await getPlannedVisits());
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load visits.",
        );
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      items
        .filter(
          (item) =>
            (status === "ALL" || item.status === status) &&
            `${item.name} ${item.email ?? ""} ${item.phone ?? ""} ${
              item.serviceName
            } ${item.notes ?? ""}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        )
        .sort(
          (a, b) =>
            new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
        ),
    [items, search, status],
  );

  const save = async (input: PlannedVisitInput) => {
    const saved = editing
      ? await updatePlannedVisit(editing.id, input)
      : await createPlannedVisit(input);

    setItems((list) =>
      editing
        ? list.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...list],
    );
  };

  const mark = async (
    item: PlannedVisit,
    nextStatus: PlannedVisit["status"],
  ) => {
    const saved = await updatePlannedVisit(item.id, { status: nextStatus });
    setItems((list) =>
      list.map((current) => (current.id === saved.id ? saved : current)),
    );
  };

  return (
    <div className="p-4 lg:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">
            Planned Visits
          </h1>
          <p className="mt-1 text-sm text-[#6b7897]">
            {items.filter((item) => item.status === "PENDING").length} pending
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(null)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Add Visit
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7897]"
          />
          <input
            className="w-full rounded-2xl border border-[#e8eef6] bg-white py-3 pl-9 pr-4 text-sm outline-none focus:border-[#0E5AA7]"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search visits..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {statuses.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={`rounded-xl px-3 py-2 text-xs font-bold ${
                status === value
                  ? "bg-[#0E5AA7] text-white"
                  : "bg-white text-[#6b7897]"
              }`}
            >
              {value.replace("_", " ")}
            </button>
          ))}
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
        <div className="grid gap-3">
          {filtered.map((visit) => (
            <article
              key={visit.id}
              className="rounded-2xl bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black leading-tight text-[#0d1b2e]">
                      {visit.name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                        visit.status,
                      )}`}
                    >
                      {visit.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-[#6b7897]">
                    {visit.notes || "No notes added yet."}
                  </p>
                </div>

                <div className="flex shrink-0 justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => setEditing(visit)}
                    aria-label={`Edit visit for ${visit.name}`}
                    className="rounded-lg p-2 text-[#0d1b2e] hover:bg-[#f0f4f9]"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void mark(
                        visit,
                        visit.status === "ATTENDED" ? "CONFIRMED" : "ATTENDED",
                      )
                    }
                    aria-label={`Mark ${visit.name} as attended`}
                    className="rounded-lg p-2 text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-[#526479] sm:grid-cols-3">
                <a
                  href={visit.email ? `mailto:${visit.email}` : undefined}
                  className="flex min-w-0 items-start gap-2 rounded-xl bg-[#f0f4f9] p-3"
                >
                  <Mail size={15} className="mt-0.5 shrink-0 text-[#0E5AA7]" />
                  <span className="min-w-0 break-words">
                    {visit.email || "No email"}
                  </span>
                </a>
                <a
                  href={visit.phone ? `tel:${visit.phone}` : undefined}
                  className="flex min-w-0 items-start gap-2 rounded-xl bg-[#f0f4f9] p-3"
                >
                  <Phone size={15} className="mt-0.5 shrink-0 text-[#0E5AA7]" />
                  <span className="min-w-0 break-words">
                    {visit.phone || "No phone"}
                  </span>
                </a>
                <div className="rounded-xl bg-[#f0f4f9] p-3">
                  <div className="font-bold text-[#0d1b2e]">
                    {visit.serviceName}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-[#6b7897]">
                    {formatDate(visit.visitDate)}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#6b7897]">
              No planned visits match this view.
            </div>
          )}
        </div>
      )}

      {editing !== undefined && (
        <AdminCareDialog
          kind="plannedVisit"
          value={editing}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      )}
    </div>
  );
}
