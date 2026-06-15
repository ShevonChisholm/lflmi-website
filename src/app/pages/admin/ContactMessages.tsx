import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle,
  Loader2,
  Mail,
  MailOpen,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import { AdminConfirmDialog } from "@/app/components/admin/AdminConfirmDialog";
import {
  deleteContactMessage,
  getContactMessages,
  updateContactMessage,
} from "@/lib/data";
import type { ContactMessage, ContactMessageStatus } from "@/types";

const statuses: Array<"ALL" | ContactMessageStatus> = [
  "ALL",
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "ARCHIVED",
];

const statusClasses: Record<ContactMessageStatus, string> = {
  NEW: "bg-red-50 text-[#D7261E]",
  IN_PROGRESS: "bg-blue-50 text-[#0E5AA7]",
  RESOLVED: "bg-green-50 text-green-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

export default function ContactMessages() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("ALL");
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const messages = await getContactMessages();
        setItems(messages);
        setSelected(messages[0] ?? null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load messages.");
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
          `${item.name} ${item.email} ${item.subject} ${item.message}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [items, search, status],
  );

  const replace = (saved: ContactMessage) => {
    setItems((list) => {
      const next = list.map((item) => (item.id === saved.id ? saved : item));
      window.dispatchEvent(
        new CustomEvent("contact-unread-count", {
          detail: next.filter((item) => item.status === "NEW").length,
        }),
      );
      return next;
    });
    setSelected(saved);
  };

  const updateStatus = async (nextStatus: ContactMessageStatus) => {
    if (!selected) return;
    setError("");
    try {
      replace(
        await updateContactMessage(selected.id, {
          status: nextStatus,
          resolvedAt: nextStatus === "RESOLVED" ? new Date().toISOString() : null,
        }),
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update message.");
    }
  };

  const reply = () => {
    if (!selected) return;
    window.location.href = `mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`;
    if (selected.status === "NEW") void updateStatus("IN_PROGRESS");
  };

  const remove = async () => {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await deleteContactMessage(selected.id);
      const remaining = items.filter((item) => item.id !== selected.id);
      setItems(remaining);
      window.dispatchEvent(
        new CustomEvent("contact-unread-count", {
          detail: remaining.filter((item) => item.status === "NEW").length,
        }),
      );
      setSelected(remaining[0] ?? null);
      setShowDetail(false);
      setDeleting(false);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete message.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full">
      <aside
        className={`${showDetail ? "hidden lg:flex" : "flex"} w-full flex-col border-r border-[#e8eef6] bg-white lg:w-96`}
      >
        <div className="border-b border-[#e8eef6] p-5">
          <h1 className="font-black text-[#0d1b2e]">Contact Inbox</h1>
          <p className="mb-4 text-xs text-[#6b7897]">
            {items.filter((item) => item.status === "NEW").length} unread messages
          </p>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-3 text-[#6b7897]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-xl bg-[#f0f4f9] py-2.5 pl-9 pr-3 text-sm outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {statuses.map((value) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  status === value ? "bg-[#0E5AA7] text-white" : "bg-[#f0f4f9] text-[#6b7897]"
                }`}
              >
                {value.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 divide-y divide-[#e8eef6] overflow-y-auto">
          {busy && !items.length ? (
            <Loader2 className="mx-auto mt-16 animate-spin text-[#0E5AA7]" />
          ) : filtered.length ? (
            filtered.map((message) => (
              <button
                key={message.id}
                onClick={() => {
                  setSelected(message);
                  setShowDetail(true);
                }}
                className={`w-full p-4 text-left ${
                  selected?.id === message.id ? "bg-[#e8f0fb]" : "hover:bg-[#f8fafc]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <b className={message.status === "NEW" ? "text-[#0d1b2e]" : "text-[#526479]"}>
                    {message.name}
                  </b>
                  <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${statusClasses[message.status]}`}>
                    {message.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#0d1b2e]">{message.subject}</p>
                <p className="mt-1 line-clamp-2 text-xs text-[#6b7897]">{message.message}</p>
                <p className="mt-2 text-[10px] text-[#8a98aa]">
                  {new Date(message.createdAt).toLocaleString("en-JM")}
                </p>
              </button>
            ))
          ) : (
            <p className="p-8 text-center text-sm text-[#6b7897]">No messages match this view.</p>
          )}
        </div>
      </aside>

      <main
        className={`${showDetail ? "block" : "hidden lg:block"} flex-1 overflow-y-auto bg-[#f0f4f9] p-5 lg:p-7`}
      >
        <button
          onClick={() => setShowDetail(false)}
          className="mb-4 rounded-xl bg-[#0E5AA7] px-4 py-2 text-sm font-bold text-white lg:hidden"
        >
          Back to inbox
        </button>
        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {selected ? (
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-sm lg:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[selected.status]}`}>
                    {selected.status.replace("_", " ")}
                  </span>
                  <h2 className="mt-3 text-xl font-black text-[#0d1b2e]">{selected.subject}</h2>
                  <p className="mt-1 text-xs text-[#6b7897]">
                    Received {new Date(selected.createdAt).toLocaleString("en-JM")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={reply}
                    className="flex items-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-xs font-bold text-white"
                  >
                    <Mail size={14} /> Reply
                  </button>
                  <button
                    onClick={() => void updateStatus("RESOLVED")}
                    className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-xs font-bold text-green-700"
                  >
                    <CheckCircle size={14} /> Resolve
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-black text-[#0d1b2e]">Sender</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#f0f4f9] p-3 text-sm font-bold">{selected.name}</div>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 rounded-xl bg-[#f0f4f9] p-3 text-sm text-[#0E5AA7]"
                >
                  <Mail size={14} /> {selected.email}
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex items-center gap-2 rounded-xl bg-[#f0f4f9] p-3 text-sm text-[#0E5AA7]"
                  >
                    <Phone size={14} /> {selected.phone}
                  </a>
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-black text-[#0d1b2e]">Message</h3>
              <p className="whitespace-pre-wrap rounded-xl bg-[#f0f4f9] p-4 text-sm leading-relaxed text-[#34465d]">
                {selected.message}
              </p>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-black text-[#0d1b2e]">Manage Message</h3>
              <div className="flex flex-wrap gap-2">
                {selected.status !== "NEW" && (
                  <button
                    onClick={() => void updateStatus("NEW")}
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-[#D7261E]"
                  >
                    <Mail size={14} /> Mark Unread
                  </button>
                )}
                <button
                  onClick={() => void updateStatus("IN_PROGRESS")}
                  className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-[#0E5AA7]"
                >
                  <MailOpen size={14} /> Mark In Progress
                </button>
                <button
                  onClick={() => void updateStatus("ARCHIVED")}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700"
                >
                  <Archive size={14} /> Archive
                </button>
                <button
                  onClick={() => setDeleting(true)}
                  className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-[#D7261E]"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="mt-20 text-center text-sm text-[#6b7897]">Select a contact message.</div>
        )}
      </main>

      {deleting && selected && (
        <AdminConfirmDialog
          title="Delete contact message?"
          message={`This permanently removes the message from ${selected.name}.`}
          busy={busy}
          onCancel={() => setDeleting(false)}
          onConfirm={() => void remove()}
        />
      )}
    </div>
  );
}
