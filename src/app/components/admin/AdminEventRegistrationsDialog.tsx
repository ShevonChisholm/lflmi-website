import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ClipboardCheck,
  Loader2,
  Mail,
  Phone,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { Event, EventRegistration } from "@/types";
import type { EventRegistrationUpdateInput } from "@/lib/data";

const statuses: EventRegistration["status"][] = [
  "PENDING",
  "CONFIRMED",
  "ATTENDED",
  "CANCELLED",
];

const statusClasses: Record<EventRegistration["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-[#0E5AA7]",
  ATTENDED: "bg-green-50 text-green-700",
  CANCELLED: "bg-slate-100 text-slate-600",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-JM", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Jamaica",
  }).format(new Date(value));

export function AdminEventRegistrationsDialog({
  event,
  registrations,
  busy,
  onClose,
  onUpdate,
  onDelete,
}: {
  event: Event;
  registrations: EventRegistration[];
  busy: boolean;
  onClose: () => void;
  onUpdate: (
    registration: EventRegistration,
    changes: EventRegistrationUpdateInput,
  ) => Promise<void>;
  onDelete: (registration: EventRegistration) => Promise<void>;
}) {
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setNoteDrafts(
      Object.fromEntries(
        registrations.map((registration) => [
          registration.id,
          registration.notes ?? "",
        ]),
      ),
    );
  }, [registrations]);

  const activeRegistrations = useMemo(
    () =>
      registrations.filter(
        (registration) => registration.status !== "CANCELLED",
      ),
    [registrations],
  );

  const attendeeTotal = activeRegistrations.reduce(
    (total, registration) => total + registration.attendeeCount,
    0,
  );

  const capacityText = event.maxAttendees
    ? `${attendeeTotal} / ${event.maxAttendees} seats`
    : `${attendeeTotal} attendees`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#04183a]/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="border-b border-[#e8eef6] p-5 lg:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0E5AA7]/10 text-[#0E5AA7]">
                <ClipboardCheck size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6b7897]">
                Event registrations
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#0d1b2e]">
                {event.title}
              </h2>
              <p className="mt-1 text-sm text-[#6b7897]">
                {formatDate(event.startDate)}
                {event.location ? ` | ${event.location}` : ""}
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

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs font-bold text-[#6b7897]">Registrations</p>
              <p className="mt-1 text-2xl font-black text-[#0d1b2e]">
                {registrations.length}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs font-bold text-[#6b7897]">Capacity</p>
              <p className="mt-1 text-2xl font-black text-[#0d1b2e]">
                {capacityText}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs font-bold text-[#6b7897]">Pending</p>
              <p className="mt-1 text-2xl font-black text-[#0d1b2e]">
                {
                  registrations.filter(
                    (registration) => registration.status === "PENDING",
                  ).length
                }
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f0f4f9] p-4 lg:p-6">
          {registrations.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#6b7897]">
              No one has registered for this event yet.
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <article
                  key={registration.id}
                  className="rounded-3xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-[#0d1b2e]">
                          {registration.name}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[registration.status]}`}
                        >
                          {registration.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#6b7897]">
                        Registered {formatDate(registration.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={busy || registration.status === status}
                          onClick={() => onUpdate(registration, { status })}
                          className={`rounded-xl px-3 py-2 text-[11px] font-bold disabled:opacity-50 ${
                            registration.status === status
                              ? "bg-[#0E5AA7] text-white"
                              : "bg-[#f0f4f9] text-[#526479]"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-[#526479] md:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-2xl bg-[#f8fafc] p-3">
                      <Users size={14} className="text-[#0E5AA7]" />
                      {registration.attendeeCount} attending
                    </div>
                    {registration.email ? (
                      <a
                        href={`mailto:${registration.email}`}
                        className="flex items-center gap-2 rounded-2xl bg-[#f8fafc] p-3 text-[#0E5AA7]"
                      >
                        <Mail size={14} />
                        {registration.email}
                      </a>
                    ) : (
                      <div className="rounded-2xl bg-[#f8fafc] p-3">
                        No email provided
                      </div>
                    )}
                    {registration.phone ? (
                      <a
                        href={`tel:${registration.phone}`}
                        className="flex items-center gap-2 rounded-2xl bg-[#f8fafc] p-3 text-[#0E5AA7]"
                      >
                        <Phone size={14} />
                        {registration.phone}
                      </a>
                    ) : (
                      <div className="rounded-2xl bg-[#f8fafc] p-3">
                        No phone provided
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor={`registration-notes-${registration.id}`}
                      className="text-xs font-bold text-[#6b7897]"
                    >
                      Admin notes
                    </label>
                    <textarea
                      id={`registration-notes-${registration.id}`}
                      value={noteDrafts[registration.id] ?? ""}
                      onChange={(event) =>
                        setNoteDrafts((current) => ({
                          ...current,
                          [registration.id]: event.target.value,
                        }))
                      }
                      rows={2}
                      className="mt-2 w-full rounded-2xl border border-[#e8eef6] bg-white p-3 text-sm outline-none focus:border-[#0E5AA7]"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        onUpdate(registration, {
                          notes: noteDrafts[registration.id] ?? "",
                        })
                      }
                      className="flex items-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"
                    >
                      {busy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      Save notes
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onDelete(registration)}
                      className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-[#D7261E] disabled:opacity-60"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
