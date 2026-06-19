import { useEffect, useMemo, useState } from "react";
import { Edit2, Loader2, Play, Plus, Search, Trash2 } from "lucide-react";
import { AdminCmsDialog } from "@/app/components/admin/AdminCmsDialog";
import { AdminConfirmDialog } from "@/app/components/admin/AdminConfirmDialog";
import { AdminSermonPreview } from "@/app/components/admin/AdminSermonPreview";
import {
  createSermon,
  deleteSermon,
  getSermons,
  updateSermon,
  type SermonInput,
} from "@/lib/data";
import type { Sermon } from "@/types";

const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-JM", {
        dateStyle: "medium",
        timeZone: "America/Jamaica",
      }).format(new Date(value))
    : "Not scheduled";

export default function Sermons() {
  const [items, setItems] = useState<Sermon[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [editing, setEditing] = useState<Sermon | null | undefined>();
  const [deleting, setDeleting] = useState<Sermon | null>(null);
  const [previewing, setPreviewing] = useState<Sermon | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setBusy(true);
    setError("");
    try {
      setItems(await getSermons());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load sermons.",
      );
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (status === "ALL" || item.publicationStatus === status) &&
          `${item.title} ${item.preacherName ?? ""} ${item.series ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [items, search, status],
  );

  const save = async (input: SermonInput) => {
    const saved = editing
      ? await updateSermon(editing.id, input)
      : await createSermon(input);
    setItems((list) =>
      editing
        ? list.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...list],
    );
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteSermon(deleting.id);
      setItems((list) => list.filter((item) => item.id !== deleting.id));
      setDeleting(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete sermon.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 lg:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Sermons</h1>
          <p className="mt-1 text-sm text-[#6b7897]">
            {
              items.filter((item) => item.publicationStatus === "PUBLISHED")
                .length
            }{" "}
            published ·{" "}
            {items.filter((item) => item.publicationStatus === "DRAFT").length}{" "}
            draft
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(null)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Upload Sermon
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-0 flex-1">
          <Search
            size={14}
            className="absolute left-3 top-3 text-[#6b7897]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sermons..."
            className="w-full rounded-xl border border-[#e8eef6] bg-white py-2.5 pl-9 pr-4 text-sm outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                status === item
                  ? "bg-[#0E5AA7] text-white"
                  : "bg-white text-[#6b7897]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {busy && items.length === 0 ? (
          <div className="flex justify-center p-16">
            <Loader2 className="animate-spin text-[#0E5AA7]" />
          </div>
        ) : (
          <div className="responsive-admin-table overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8eef6] text-left text-[10px] uppercase tracking-widest text-[#6b7897]">
                  <th className="px-5 py-4">Sermon</th>
                  <th className="px-4 py-4">Speaker</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8eef6]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8fafd]">
                    <td data-label="Sermon" className="px-5 py-4">
                      <div className="font-bold text-[#0d1b2e]">
                        {item.title}
                      </div>
                      <div className="mt-1 text-xs text-[#6b7897]">
                        {item.bibleText ?? "No Bible text"} ·{" "}
                        {item.durationMinutes
                          ? `${item.durationMinutes} min`
                          : "No duration"}
                      </div>
                    </td>
                    <td
                      data-label="Speaker"
                      className="px-4 py-4 text-sm text-[#6b7897]"
                    >
                      {item.preacherName ?? "Not assigned"}
                    </td>
                    <td
                      data-label="Date"
                      className="px-4 py-4 text-sm text-[#6b7897]"
                    >
                      {date(item.sermonDate)}
                    </td>
                    <td data-label="Status" className="px-4 py-4">
                      <span className="rounded-full bg-[#0E5AA7]/10 px-2.5 py-1 text-xs font-bold text-[#0E5AA7]">
                        {item.publicationStatus}
                      </span>
                    </td>
                    <td data-actions="true" className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        {(item.videoUrl || item.audioUrl || item.notesUrl) && (
                          <button
                            type="button"
                            onClick={() => setPreviewing(item)}
                            aria-label={`Preview ${item.title}`}
                            className="rounded-lg p-2 text-[#0E5AA7] hover:bg-[#0E5AA7]/10"
                          >
                            <Play size={14} />
                          </button>
                        )}
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
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-[#e8eef6] px-5 py-3 text-xs text-[#6b7897]">
          Showing {filtered.length} of {items.length} sermons
        </div>
      </div>

      {editing !== undefined && (
        <AdminCmsDialog
          kind="sermon"
          value={editing}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      )}
      {deleting && (
        <AdminConfirmDialog
          title="Delete sermon?"
          message={`This permanently removes "${deleting.title}".`}
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={() => void remove()}
        />
      )}
      {previewing && (
        <AdminSermonPreview
          sermon={previewing}
          onClose={() => setPreviewing(null)}
        />
      )}
    </div>
  );
}
