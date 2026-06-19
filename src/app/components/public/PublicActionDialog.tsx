import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Users,
  X,
} from "lucide-react";
import { getGoogleCalendarUrl, getCalendarIcsUrl } from "@/lib/calendar";

import {
  registerForEvent,
  submitContactMessage,
  submitPlannedVisit,
  submitPrayerRequest,
} from "@/lib/data";
import type {
  ChurchSettings,
  Event,
  Ministry,
  Sermon,
  ServiceTime,
} from "@/types";
import { SermonMediaPlayer } from "@/app/components/media/SermonMediaPlayer";

export type PublicDialogMode =
  | "visit"
  | "prayer"
  | "contact"
  | "event"
  | "events"
  | "ministry"
  | "sermon"
  | "give";

interface PublicActionDialogProps {
  mode: PublicDialogMode;
  onClose: () => void;
  churchSettings: ChurchSettings;
  serviceTimes: ServiceTime[];
  events: Event[];
  event?: Event | null;
  ministry?: Ministry | null;
  sermon?: Sermon | null;
  onSelectEvent: (event: Event) => void;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[#0E5AA7] focus:ring-2 focus:ring-[#0E5AA7]/10";

const formatTime = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, Number(hours), Number(minutes)));
};

const formatEventDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Jamaica",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function SubmitButton({
  state,
  children,
}: {
  state: SubmitState;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={state === "submitting"}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0E5AA7] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#0a4a8a] disabled:cursor-wait disabled:opacity-70"
    >
      {state === "submitting" && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

function Feedback({
  state,
  error,
  success,
}: {
  state: SubmitState;
  error: string;
  success: string;
}) {
  if (state === "success") {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        {success}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return null;
}

export function PublicActionDialog({
  mode,
  onClose,
  churchSettings,
  serviceTimes,
  events,
  event,
  ministry,
  sermon,
  onSelectEvent,
}: PublicActionDialogProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const closeOnEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const runSubmission = async (submission: () => Promise<unknown>) => {
    setSubmitState("submitting");
    setError("");
    try {
      await submission();
      setSubmitState("success");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
      setSubmitState("error");
    }
  };

  const submitVisit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const data = new FormData(formEvent.currentTarget);
    void runSubmission(() =>
      submitPlannedVisit({
        name: String(data.get("name")),
        email: String(data.get("email") || "") || null,
        phone: String(data.get("phone") || "") || null,
        serviceName: String(data.get("serviceName")),
        visitDate: String(data.get("visitDate")),
        source: "Public Website",
        notes: String(data.get("notes") || "") || null,
      }),
    );
  };

  const submitPrayer = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const data = new FormData(formEvent.currentTarget);
    const isAnonymous = data.get("isAnonymous") === "on";
    void runSubmission(() =>
      submitPrayerRequest({
        name: String(data.get("name") || "") || null,
        email: String(data.get("email") || "") || null,
        isAnonymous,
        category: String(data.get("category") || "") || null,
        urgency: "MEDIUM",
        requestText: String(data.get("requestText")),
      }),
    );
  };

  const submitContact = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const data = new FormData(formEvent.currentTarget);
    void runSubmission(() =>
      submitContactMessage({
        name: String(data.get("name")),
        email: String(data.get("email")),
        phone: String(data.get("phone") || "") || null,
        subject: String(data.get("subject")),
        message: String(data.get("message")),
      }),
    );
  };

  const submitRegistration = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!event) return;
    const data = new FormData(formEvent.currentTarget);
    void runSubmission(() =>
      registerForEvent({
        eventId: event.id,
        name: String(data.get("name")),
        email: String(data.get("email") || "") || null,
        phone: String(data.get("phone") || "") || null,
        attendeeCount: Number(data.get("attendeeCount") || 1),
        notes: String(data.get("notes") || "") || null,
      }),
    );
  };

  const title = {
    visit: "Plan Your Visit",
    prayer: "Submit a Prayer Request",
    contact: "Connect With Us",
    event: event?.title ?? "Event Details",
    events: "Upcoming Events",
    ministry: ministry?.name ?? "Ministry Details",
    sermon: sermon?.title ?? "Latest Sermon",
    give: "Support the Ministry",
  }[mode];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-[#04183a]/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="public-dialog-title"
        className={`max-h-[100dvh] w-full overflow-y-auto rounded-t-3xl bg-card shadow-2xl sm:max-h-[92vh] sm:rounded-3xl ${mode === "sermon" ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card/95 px-4 py-4 backdrop-blur-md sm:px-8 sm:py-5">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#D7261E]">
              Liberty For Living
            </p>
            <h2 id="public-dialog-title" className="text-xl font-black leading-tight text-card-foreground sm:text-2xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-full bg-muted p-2.5 text-muted-foreground transition hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-8">
          {mode === "visit" && (
            <form onSubmit={submitVisit} className="space-y-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Tell us when you are coming and our welcome team will be ready to greet you.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name"><input className={inputClass} name="name" required /></Field>
                <Field label="Email"><input className={inputClass} name="email" type="email" required /></Field>
                <Field label="Phone"><input className={inputClass} name="phone" type="tel" /></Field>
                <Field label="Visit date"><input className={inputClass} name="visitDate" type="date" required /></Field>
              </div>
              <Field label="Service">
                <select className={inputClass} name="serviceName" required defaultValue="">
                  <option value="" disabled>Select a service</option>
                  {serviceTimes.map((service) => (
                    <option key={service.id} value={`${service.dayOfWeek} ${service.label}`}>
                      {service.dayOfWeek} {formatTime(service.time)} - {service.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Anything we should know?">
                <textarea className={inputClass} name="notes" rows={3} />
              </Field>
              <Feedback state={submitState} error={error} success="Your visit is planned. Our welcome team looks forward to meeting you." />
              {submitState !== "success" && <SubmitButton state={submitState}>Plan My Visit</SubmitButton>}
            </form>
          )}

          {mode === "prayer" && (
            <form onSubmit={submitPrayer} className="space-y-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Share what is on your heart. Requests are handled with care and discretion.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name"><input className={inputClass} name="name" /></Field>
                <Field label="Email"><input className={inputClass} name="email" type="email" /></Field>
              </div>
              <Field label="Category">
                <select className={inputClass} name="category" defaultValue="General">
                  {["General", "Family", "Health", "Spiritual", "Ministry", "Other"].map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>
              <Field label="Prayer request">
                <textarea className={inputClass} name="requestText" rows={5} required />
              </Field>
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <input name="isAnonymous" type="checkbox" className="h-4 w-4 accent-[#0E5AA7]" />
                Submit anonymously
              </label>
              <Feedback state={submitState} error={error} success="Your request has been received. Our prayer team will be praying with you." />
              {submitState !== "success" && <SubmitButton state={submitState}>Submit Prayer Request</SubmitButton>}
            </form>
          )}

          {mode === "contact" && (
            <form onSubmit={submitContact} className="space-y-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Send us a message and the appropriate ministry team will respond.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name"><input className={inputClass} name="name" required /></Field>
                <Field label="Email"><input className={inputClass} name="email" type="email" required /></Field>
                <Field label="Phone"><input className={inputClass} name="phone" type="tel" /></Field>
                <Field label="Subject"><input className={inputClass} name="subject" required /></Field>
              </div>
              <Field label="Message"><textarea className={inputClass} name="message" rows={5} required /></Field>
              <Feedback state={submitState} error={error} success="Your message has been sent. We will be in touch soon." />
              {submitState !== "success" && <SubmitButton state={submitState}>Send Message</SubmitButton>}
            </form>
          )}

          {mode === "event" && event && (
            <div className="space-y-6">
              <div className="grid gap-3 rounded-2xl bg-[#eef4fc] p-5 text-sm text-[#0d1b2e] sm:grid-cols-2">
                <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#0E5AA7]" />{formatEventDate(event.startDate)}</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-[#0E5AA7]" />{event.location ?? "Location to be announced"}</div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={getGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border bg-[#f6fbff] px-5 py-3 text-center text-sm font-bold text-[#0E5AA7] transition-colors hover:border-[#0E5AA7] hover:bg-[#eef4fc]"
                >
                  <CalendarPlus size={16} />Add to Google Calendar
                </a>
                <a
                  href={getCalendarIcsUrl(event)}
                  download={`${event.title.replace(/[^a-zA-Z0-9-_ ]/g, "") || "event"}.ics`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border bg-white px-5 py-3 text-center text-sm font-bold text-foreground transition-colors hover:border-[#0E5AA7] hover:text-[#0E5AA7]"
                >
                  <CalendarPlus size={16} />Download .ics
                </a>
              </div>
              <p className="leading-relaxed text-muted-foreground">{event.description}</p>
              {event.isRegistrationRequired && !event.id.startsWith("fallback-") ? (
                <form onSubmit={submitRegistration} className="space-y-4 border-t border-border pt-6">
                  <h3 className="font-black text-card-foreground">Register for this event</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name"><input className={inputClass} name="name" required /></Field>
                    <Field label="Email"><input className={inputClass} name="email" type="email" required /></Field>
                    <Field label="Phone"><input className={inputClass} name="phone" type="tel" /></Field>
                    <Field label="Attendees"><input className={inputClass} name="attendeeCount" type="number" min="1" defaultValue="1" required /></Field>
                  </div>
                  <Field label="Notes"><textarea className={inputClass} name="notes" rows={3} /></Field>
                  <Feedback state={submitState} error={error} success="Registration received. We look forward to seeing you there." />
                  {submitState !== "success" && <SubmitButton state={submitState}>Register Now</SubmitButton>}
                </form>
              ) : event.isRegistrationRequired ? (
                <a
                  href={`mailto:${churchSettings.email ?? "hello@lflmi.org"}?subject=${encodeURIComponent(`Register for ${event.title}`)}`}
                  className="block rounded-2xl bg-[#eef4fc] p-4 text-center text-sm font-bold text-[#0E5AA7]"
                >
                  Online registration is temporarily unavailable. Contact us to register.
                </a>
              ) : (
                <p className="rounded-2xl bg-green-50 p-4 text-sm text-green-800">
                  No registration is required. Come and join us.
                </p>
              )}
            </div>
          )}

          {mode === "events" && (
            <div className="space-y-4">
              {events.map((eventItem) => (
                <button
                  key={eventItem.id}
                  type="button"
                  onClick={() => onSelectEvent(eventItem)}
                  className="w-full rounded-2xl border border-border p-5 text-left transition hover:border-[#0E5AA7] hover:bg-[#eef4fc]"
                >
                  <div className="mb-2 font-black text-card-foreground">{eventItem.title}</div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock size={12} />{formatEventDate(eventItem.startDate)}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} />{eventItem.location}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {mode === "ministry" && ministry && (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">{ministry.description}</p>
              <div className="grid gap-4 rounded-2xl bg-[#eef4fc] p-5 text-sm text-[#0d1b2e] sm:grid-cols-2">
                <div className="flex items-center gap-2"><Users size={16} className="text-[#0E5AA7]" />{ministry.leaderName ?? "Ministry leadership team"}</div>
                <div className="flex items-center gap-2"><Clock size={16} className="text-[#0E5AA7]" />{ministry.meetingSchedule ?? "Contact us for meeting times"}</div>
              </div>
              <button type="button" onClick={() => {
                const email = ministry.contactEmail ?? churchSettings.email;
                if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Interested in ${ministry.name}`)}`;
              }} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0E5AA7] px-6 py-3.5 text-sm font-black text-white">
                <Mail size={16} />Contact This Ministry
              </button>
            </div>
          )}

          {mode === "sermon" && sermon && (
            <div className="space-y-6">
              <SermonMediaPlayer sermon={sermon} />
              <p className="text-lg leading-relaxed text-muted-foreground">{sermon.description}</p>
              <div className="rounded-2xl bg-[#eef4fc] p-5 text-sm text-[#0d1b2e]">
                <div className="font-black">{sermon.preacherName ?? "LFLMI Teaching Team"}</div>
                <div className="mt-1 text-muted-foreground">{sermon.bibleText ?? sermon.series}</div>
              </div>
            </div>
          )}

          {mode === "give" && (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Your generosity supports ministry, outreach, and care for families across our community.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <a href={`mailto:${churchSettings.email ?? "hello@lflmi.org"}?subject=${encodeURIComponent("Giving enquiry")}`} className="rounded-2xl bg-[#eef4fc] p-5 text-[#0d1b2e] transition hover:bg-[#dfeafb]">
                  <Mail size={20} className="mb-3 text-[#0E5AA7]" />
                  <div className="font-black">Giving Enquiry</div>
                  <div className="mt-1 text-xs text-muted-foreground">Request current giving instructions.</div>
                </a>
                <a href={`tel:${churchSettings.phone ?? "+18765550100"}`} className="rounded-2xl bg-[#eef4fc] p-5 text-[#0d1b2e] transition hover:bg-[#dfeafb]">
                  <Phone size={20} className="mb-3 text-[#D7261E]" />
                  <div className="font-black">Speak With Our Team</div>
                  <div className="mt-1 text-xs text-muted-foreground">{churchSettings.phone ?? "+1 876 555 0100"}</div>
                </a>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
                <Heart size={18} className="mt-0.5 shrink-0" />
                Secure online payment details will appear here once the church confirms its giving provider.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
