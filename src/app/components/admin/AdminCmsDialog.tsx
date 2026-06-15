import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Loader2, X } from "lucide-react";
import { MediaUploadField } from "@/app/components/admin/MediaUploadField";
import type { ContentPage, Event, GivingProgram, JsonValue, Ministry, Sermon } from "@/types";
import type {
  ContentPageInput,
  EventInput,
  GivingProgramInput,
  MinistryInput,
  SermonInput,
} from "@/lib/data";

type EditorKind = "sermon" | "event" | "ministry" | "giving" | "contentPage";
type EditorValue = Sermon | Event | Ministry | GivingProgram | ContentPage;
type EditorInput = SermonInput | EventInput | MinistryInput | GivingProgramInput | ContentPageInput;

interface AdminCmsDialogProps {
  kind: EditorKind;
  value?: EditorValue | null;
  onClose: () => void;
  onSave: (input: EditorInput) => Promise<void>;
}

const fieldClass =
  "w-full rounded-xl bg-[#f0f4f9] px-4 py-3 text-sm text-[#0d1b2e] outline-none transition focus:ring-2 focus:ring-[#0E5AA7]/20";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-[#0d1b2e]">
        {label}
      </span>
      {children}
    </label>
  );
}

const toLocalDateTime = (date?: string | null) =>
  date ? new Date(date).toISOString().slice(0, 16) : "";

export function AdminCmsDialog({
  kind,
  value,
  onClose,
  onSave,
}: AdminCmsDialogProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) || "") || null;
    const number = (name: string) => {
      const raw = String(data.get(name) || "");
      return raw ? Number(raw) : null;
    };

    let input: EditorInput;
    if (kind === "sermon") {
      input = {
        title: String(data.get("title")),
        preacherName: text("preacherName"),
        sermonDate: text("sermonDate") ? new Date(String(data.get("sermonDate"))).toISOString() : null,
        series: text("series"),
        bibleText: text("bibleText"),
        description: text("description"),
        videoUrl: text("videoUrl"),
        audioUrl: text("audioUrl"),
        notesUrl: text("notesUrl"),
        thumbnailUrl: text("thumbnailUrl"),
        durationMinutes: number("durationMinutes"),
        publicationStatus: String(data.get("publicationStatus")) as SermonInput["publicationStatus"],
      };
    } else if (kind === "event") {
      input = {
        title: String(data.get("title")),
        eventType: text("eventType"),
        description: text("description"),
        startDate: new Date(String(data.get("startDate"))).toISOString(),
        endDate: text("endDate") ? new Date(String(data.get("endDate"))).toISOString() : null,
        location: text("location"),
        organizerName: text("organizerName"),
        imageUrl: text("imageUrl"),
        isRegistrationRequired: data.get("isRegistrationRequired") === "on",
        maxAttendees: number("maxAttendees"),
        status: String(data.get("status")) as EventInput["status"],
        publicationStatus: String(data.get("publicationStatus")) as EventInput["publicationStatus"],
      };
    } else if (kind === "ministry") {
      input = {
        name: String(data.get("name")),
        description: text("description"),
        leaderName: text("leaderName"),
        contactEmail: text("contactEmail"),
        contactPhone: text("contactPhone"),
        imageUrl: text("imageUrl"),
        meetingSchedule: text("meetingSchedule"),
        programs: String(data.get("programs") || "").split(",").map((item) => item.trim()).filter(Boolean),
        memberCount: number("memberCount") ?? 0,
        volunteerCount: number("volunteerCount") ?? 0,
        color: text("color"),
        status: String(data.get("status")) as MinistryInput["status"],
      };
    } else if (kind === "giving") {
      input = {
        name: String(data.get("name")),
        description: text("description"),
        goalAmount: number("goalAmount"),
        amountRaised: number("amountRaised") ?? 0,
        currency: String(data.get("currency") || "JMD"),
        color: text("color"),
        icon: text("icon"),
        status: String(data.get("status")) as GivingProgramInput["status"],
      };
    } else {
      const sectionsText = String(data.get("sections") || "").trim();
      let sections: JsonValue | null = null;
      try {
        sections = sectionsText ? (JSON.parse(sectionsText) as JsonValue) : null;
      } catch {
        setSaving(false);
        setError("Structured sections must contain valid JSON.");
        return;
      }
      input = {
        slug: String(data.get("slug")).trim().toLowerCase().replace(/\s+/g, "-"),
        title: String(data.get("title")),
        body: text("body"),
        sections,
        seoTitle: text("seoTitle"),
        seoDescription: text("seoDescription"),
        publicationStatus: String(data.get("publicationStatus")) as ContentPageInput["publicationStatus"],
      };
    }

    try {
      await onSave(input);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const itemLabel = kind === "giving" ? "Giving Program" : kind === "contentPage" ? "Content Page" : kind[0].toUpperCase() + kind.slice(1);
  const title = `${value ? "Edit" : "Create"} ${itemLabel}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#04183a]/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e8eef6] bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#0E5AA7]">Admin CMS</div>
            <h2 className="text-xl font-black text-[#0d1b2e]">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl bg-[#f0f4f9] p-2.5 text-[#6b7897]"><X size={17} /></button>
        </header>
        <form onSubmit={submit} className="space-y-5 p-6">
          {kind === "sermon" && (() => {
            const sermon = value as Sermon | null;
            return <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title"><input className={fieldClass} name="title" required defaultValue={sermon?.title} /></Field>
                <Field label="Preacher"><input className={fieldClass} name="preacherName" defaultValue={sermon?.preacherName ?? ""} /></Field>
                <Field label="Date"><input className={fieldClass} type="datetime-local" name="sermonDate" defaultValue={toLocalDateTime(sermon?.sermonDate)} /></Field>
                <Field label="Series"><input className={fieldClass} name="series" defaultValue={sermon?.series ?? ""} /></Field>
                <Field label="Bible text"><input className={fieldClass} name="bibleText" defaultValue={sermon?.bibleText ?? ""} /></Field>
                <Field label="Duration minutes"><input className={fieldClass} type="number" min="0" name="durationMinutes" defaultValue={sermon?.durationMinutes ?? ""} /></Field>
              </div>
              <Field label="Description"><textarea className={fieldClass} rows={3} name="description" defaultValue={sermon?.description ?? ""} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <MediaUploadField label="Video" name="videoUrl" kind="video" folder="sermons/videos" initialValue={sermon?.videoUrl} />
                <MediaUploadField label="Audio" name="audioUrl" kind="audio" folder="sermons/audio" initialValue={sermon?.audioUrl} />
                <MediaUploadField label="Notes" name="notesUrl" kind="document" folder="sermons/notes" initialValue={sermon?.notesUrl} />
                <MediaUploadField label="Thumbnail" name="thumbnailUrl" kind="image" folder="sermons/thumbnails" initialValue={sermon?.thumbnailUrl} />
                <Field label="Publication"><select className={fieldClass} name="publicationStatus" defaultValue={sermon?.publicationStatus ?? "DRAFT"}>{["DRAFT", "PUBLISHED", "ARCHIVED"].map(s => <option key={s}>{s}</option>)}</select></Field>
              </div>
            </>;
          })()}
          {kind === "event" && (() => {
            const item = value as Event | null;
            return <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title"><input className={fieldClass} name="title" required defaultValue={item?.title} /></Field>
                <Field label="Type"><input className={fieldClass} name="eventType" defaultValue={item?.eventType ?? ""} /></Field>
                <Field label="Start"><input className={fieldClass} type="datetime-local" name="startDate" required defaultValue={toLocalDateTime(item?.startDate)} /></Field>
                <Field label="End"><input className={fieldClass} type="datetime-local" name="endDate" defaultValue={toLocalDateTime(item?.endDate)} /></Field>
                <Field label="Location"><input className={fieldClass} name="location" defaultValue={item?.location ?? ""} /></Field>
                <Field label="Organizer"><input className={fieldClass} name="organizerName" defaultValue={item?.organizerName ?? ""} /></Field>
                <Field label="Maximum attendees"><input className={fieldClass} type="number" min="1" name="maxAttendees" defaultValue={item?.maxAttendees ?? ""} /></Field>
                <Field label="Event status"><select className={fieldClass} name="status" defaultValue={item?.status ?? "UPCOMING"}>{["DRAFT", "UPCOMING", "PAST", "CANCELLED"].map(s => <option key={s}>{s}</option>)}</select></Field>
                <Field label="Publication"><select className={fieldClass} name="publicationStatus" defaultValue={item?.publicationStatus ?? "DRAFT"}>{["DRAFT", "PUBLISHED", "ARCHIVED"].map(s => <option key={s}>{s}</option>)}</select></Field>
              </div>
              <MediaUploadField label="Event image" name="imageUrl" kind="image" folder="events" initialValue={item?.imageUrl} />
              <Field label="Description"><textarea className={fieldClass} rows={3} name="description" defaultValue={item?.description ?? ""} /></Field>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#0d1b2e]"><input type="checkbox" name="isRegistrationRequired" defaultChecked={item?.isRegistrationRequired} />Registration required</label>
            </>;
          })()}
          {kind === "ministry" && (() => {
            const item = value as Ministry | null;
            return <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name"><input className={fieldClass} name="name" required defaultValue={item?.name} /></Field>
                <Field label="Leader"><input className={fieldClass} name="leaderName" defaultValue={item?.leaderName ?? ""} /></Field>
                <Field label="Contact email"><input className={fieldClass} type="email" name="contactEmail" defaultValue={item?.contactEmail ?? ""} /></Field>
                <Field label="Contact phone"><input className={fieldClass} name="contactPhone" defaultValue={item?.contactPhone ?? ""} /></Field>
                <Field label="Meeting schedule"><input className={fieldClass} name="meetingSchedule" defaultValue={item?.meetingSchedule ?? ""} /></Field>
                <Field label="Color"><input className={fieldClass} name="color" defaultValue={item?.color ?? "#0E5AA7"} /></Field>
                <Field label="Members"><input className={fieldClass} type="number" min="0" name="memberCount" defaultValue={item?.memberCount ?? 0} /></Field>
                <Field label="Volunteers"><input className={fieldClass} type="number" min="0" name="volunteerCount" defaultValue={item?.volunteerCount ?? 0} /></Field>
                <Field label="Status"><select className={fieldClass} name="status" defaultValue={item?.status ?? "ACTIVE"}>{["ACTIVE", "INACTIVE", "ON_HOLD"].map(s => <option key={s}>{s}</option>)}</select></Field>
              </div>
              <MediaUploadField label="Ministry image" name="imageUrl" kind="image" folder="ministries" initialValue={item?.imageUrl} />
              <Field label="Programs, comma separated"><input className={fieldClass} name="programs" defaultValue={item?.programs.join(", ")} /></Field>
              <Field label="Description"><textarea className={fieldClass} rows={3} name="description" defaultValue={item?.description ?? ""} /></Field>
            </>;
          })()}
          {kind === "giving" && (() => {
            const item = value as GivingProgram | null;
            return <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name"><input className={fieldClass} name="name" required defaultValue={item?.name} /></Field>
                <Field label="Currency"><input className={fieldClass} name="currency" required defaultValue={item?.currency ?? "JMD"} /></Field>
                <Field label="Goal amount"><input className={fieldClass} type="number" min="0" name="goalAmount" defaultValue={item?.goalAmount ?? ""} /></Field>
                <Field label="Amount raised"><input className={fieldClass} type="number" min="0" name="amountRaised" defaultValue={item?.amountRaised ?? 0} /></Field>
                <Field label="Color"><input className={fieldClass} name="color" defaultValue={item?.color ?? "#0E5AA7"} /></Field>
                <Field label="Icon label"><input className={fieldClass} name="icon" defaultValue={item?.icon ?? ""} /></Field>
                <Field label="Status"><select className={fieldClass} name="status" defaultValue={item?.status ?? "ACTIVE"}>{["ACTIVE", "INACTIVE", "ARCHIVED"].map(s => <option key={s}>{s}</option>)}</select></Field>
              </div>
              <Field label="Description"><textarea className={fieldClass} rows={3} name="description" defaultValue={item?.description ?? ""} /></Field>
            </>;
          })()}
          {kind === "contentPage" && (() => {
            const item = value as ContentPage | null;
            return <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title"><input className={fieldClass} name="title" required defaultValue={item?.title} /></Field>
                <Field label="Slug"><input className={fieldClass} name="slug" required pattern="[a-z0-9-]+" placeholder="about-us" defaultValue={item?.slug ?? ""} /></Field>
                <Field label="SEO title"><input className={fieldClass} name="seoTitle" maxLength={70} defaultValue={item?.seoTitle ?? ""} /></Field>
                <Field label="Publication"><select className={fieldClass} name="publicationStatus" defaultValue={item?.publicationStatus ?? "DRAFT"}>{["DRAFT", "PUBLISHED", "ARCHIVED"].map(s => <option key={s}>{s}</option>)}</select></Field>
              </div>
              <Field label="SEO description"><textarea className={fieldClass} rows={2} name="seoDescription" maxLength={170} defaultValue={item?.seoDescription ?? ""} /></Field>
              <Field label="Page body"><textarea className={fieldClass} rows={8} name="body" defaultValue={item?.body ?? ""} /></Field>
              <Field label="Structured sections (JSON)"><textarea className={`${fieldClass} font-mono text-xs`} rows={8} name="sections" placeholder='[{"heading":"Welcome","body":"..."}]' defaultValue={item?.sections ? JSON.stringify(item.sections, null, 2) : ""} /></Field>
            </>;
          })()}
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-3 border-t border-[#e8eef6] pt-5">
            <button type="button" onClick={onClose} className="rounded-xl bg-[#f0f4f9] px-5 py-2.5 text-sm font-bold text-[#6b7897]">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0E5AA7] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving && <Loader2 size={15} className="animate-spin" />}Save</button>
          </div>
        </form>
      </section>
    </div>
  );
}
