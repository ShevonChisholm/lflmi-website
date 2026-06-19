import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Edit2,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { AdminCmsDialog } from "@/app/components/admin/AdminCmsDialog";
import { AdminConfirmDialog } from "@/app/components/admin/AdminConfirmDialog";
import { AdminEventRegistrationsDialog } from "@/app/components/admin/AdminEventRegistrationsDialog";
import {
  createEvent,
  deleteEvent,
  deleteEventRegistration,
  getEventRegistrations,
  getEvents,
  updateEvent,
  updateEventRegistration,
  type EventInput,
  type EventRegistrationUpdateInput,
} from "@/lib/data";
import type { Event, EventRegistration, EventStatus } from "@/types";

const eventStatuses: Array<"ALL" | EventStatus> = [
  "ALL",
  "DRAFT",
  "UPCOMING",
  "PAST",
  "CANCELLED",
];

const date = (value: string) =>
  new Intl.DateTimeFormat("en-JM", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Jamaica",
  }).format(new Date(value));

export default function Events() {
  const [items, setItems] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof eventStatuses)[number]>("ALL");
  const [editing, setEditing] = useState<Event | null | undefined>();
  const [deleting, setDeleting] = useState<Event | null>(null);
  const [registrationEvent, setRegistrationEvent] = useState<Event | null>(
    null,
  );
  const [busy, setBusy] = useState(true);
  const [registrationBusy, setRegistrationBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [events, eventRegistrations] = await Promise.all([
          getEvents(),
          getEventRegistrations(),
        ]);

        setItems(events);
        setRegistrations(eventRegistrations);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load events.",
        );
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (status === "ALL" || item.status === status) &&
          `${item.title} ${item.eventType ?? ""} ${item.location ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [items, search, status],
  );

  const selectedRegistrations = useMemo(
    () =>
      registrationEvent
        ? registrations.filter(
            (registration) => registration.eventId === registrationEvent.id,
          )
        : [],
    [registrationEvent, registrations],
  );

  const registrationsForEvent = (eventId: string) =>
    registrations.filter((registration) => registration.eventId === eventId);

  const registrationStats = (event: Event) => {
    const eventRegistrations = registrationsForEvent(event.id);
    const activeRegistrations = eventRegistrations.filter(
      (registration) => registration.status !== "CANCELLED",
    );
    const attendeeCount = activeRegistrations.reduce(
      (total, registration) => total + registration.attendeeCount,
      0,
    );

    return {
      registrationCount: eventRegistrations.length,
      attendeeCount,
      capacityText: event.maxAttendees
        ? `${attendeeCount}/${event.maxAttendees}`
        : `${attendeeCount}`,
    };
  };

  const save = async (input: EventInput) => {
    const saved = editing
      ? await updateEvent(editing.id, input)
      : await createEvent(input);

    setItems((list) =>
      editing
        ? list.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...list],
    );
  };

  const remove = async () => {
    if (!deleting) return;

    setBusy(true);
    setError("");

    try {
      await deleteEvent(deleting.id);
      setItems((list) => list.filter((item) => item.id !== deleting.id));
      setRegistrations((list) =>
        list.filter((registration) => registration.eventId !== deleting.id),
      );
      if (registrationEvent?.id === deleting.id) {
        setRegistrationEvent(null);
      }
      setDeleting(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete event.",
      );
    } finally {
      setBusy(false);
    }
  };

  const updateRegistration = async (
    registration: EventRegistration,
    changes: EventRegistrationUpdateInput,
  ) => {
    setRegistrationBusy(true);
    setError("");

    try {
      const saved = await updateEventRegistration(registration.id, changes);
      setRegistrations((list) =>
        list.map((item) => (item.id === saved.id ? saved : item)),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update registration.",
      );
    } finally {
      setRegistrationBusy(false);
    }
  };

  const removeRegistration = async (registration: EventRegistration) => {
    const confirmed = window.confirm(
      `Delete the registration for ${registration.name}?`,
    );

    if (!confirmed) return;

    setRegistrationBusy(true);
    setError("");

    try {
      await deleteEventRegistration(registration.id);
      setRegistrations((list) =>
        list.filter((item) => item.id !== registration.id),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete registration.",
      );
    } finally {
      setRegistrationBusy(false);
    }
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Events</h1>
          <p className="mt-1 text-sm text-[#6b7897]">
            {items.filter((item) => item.status === "UPCOMING").length}{" "}
            upcoming | {registrations.length} registrations
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(null)}
          className="flex items-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Create Event
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
            placeholder="Search events..."
            className="w-full rounded-xl border border-[#e8eef6] bg-white py-2.5 pl-9 pr-4 text-sm outline-none"
          />
        </div>

        {eventStatuses.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${
              status === value
                ? "bg-[#0E5AA7] text-white"
                : "bg-white text-[#6b7897]"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {busy && items.length === 0 ? (
        <div className="flex justify-center p-16">
          <Loader2 className="animate-spin text-[#0E5AA7]" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const stats = registrationStats(item);

            return (
              <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-[#0d1b2e]">
                        {item.title}
                      </h3>
                      <span className="rounded-full bg-[#0E5AA7]/10 px-2 py-1 text-[10px] font-bold text-[#0E5AA7]">
                        {item.status}
                      </span>
                      <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                        {item.publicationStatus}
                      </span>
                      {item.isRegistrationRequired && (
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                          Registration required
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="mb-3 max-w-3xl text-xs leading-relaxed text-[#6b7897]">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs text-[#6b7897]">
                      <span className="flex gap-1.5">
                        <Clock size={12} />
                        {date(item.startDate)}
                      </span>
                      {item.location && (
                        <span className="flex gap-1.5">
                          <MapPin size={12} />
                          {item.location}
                        </span>
                      )}
                      {item.organizerName && (
                        <span className="flex gap-1.5">
                          <Users size={12} />
                          {item.organizerName}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-[#526479]">
                      <span className="rounded-xl bg-[#f0f4f9] px-3 py-2">
                        {stats.registrationCount} registrations
                      </span>
                      <span className="rounded-xl bg-[#f0f4f9] px-3 py-2">
                        {stats.capacityText} attending
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setRegistrationEvent(item)}
                      className="rounded-lg px-3 py-2 text-xs font-bold text-[#0E5AA7] hover:bg-[#e8f0fb]"
                    >
                      Registrations
                    </button>
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
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#6b7897]">
              No events match this view.
            </div>
          )}
        </div>
      )}

      {editing !== undefined && (
        <AdminCmsDialog
          kind="event"
          value={editing}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      )}

      {deleting && (
        <AdminConfirmDialog
          title="Delete event?"
          message={`This permanently removes "${deleting.title}" and its registrations.`}
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={() => void remove()}
        />
      )}

      {registrationEvent && (
        <AdminEventRegistrationsDialog
          event={registrationEvent}
          registrations={selectedRegistrations}
          busy={registrationBusy}
          onClose={() => setRegistrationEvent(null)}
          onUpdate={updateRegistration}
          onDelete={removeRegistration}
        />
      )}
    </div>
  );
}
