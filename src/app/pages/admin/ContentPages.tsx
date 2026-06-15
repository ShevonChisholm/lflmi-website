import { useEffect, useMemo, useState } from "react";
import { Archive, Edit2, FileText, Globe2, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { AdminCmsDialog } from "@/app/components/admin/AdminCmsDialog";
import { AdminConfirmDialog } from "@/app/components/admin/AdminConfirmDialog";
import {
  createContentPage,
  deleteContentPage,
  getContentPages,
  updateContentPage,
  type ContentPageInput,
} from "@/lib/data";
import type { ContentPage, PublicationStatus } from "@/types";

const statuses: Array<"ALL" | PublicationStatus> = ["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"];
const statusClasses: Record<PublicationStatus, string> = {
  PUBLISHED: "bg-green-50 text-green-700",
  DRAFT: "bg-amber-50 text-amber-700",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

export default function ContentPages() {
  const [items, setItems] = useState<ContentPage[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("ALL");
  const [editing, setEditing] = useState<ContentPage | null | undefined>();
  const [deleting, setDeleting] = useState<ContentPage | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setItems(await getContentPages());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load content pages.");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (status === "ALL" || item.publicationStatus === status) &&
          `${item.title} ${item.slug} ${item.body ?? ""}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search, status],
  );

  const replace = (saved: ContentPage) => {
    setItems((list) => list.map((item) => (item.id === saved.id ? saved : item)));
  };

  const save = async (input: ContentPageInput) => {
    const saved = editing
      ? await updateContentPage(editing.id, input)
      : await createContentPage(input);
    setItems((list) =>
      editing ? list.map((item) => (item.id === saved.id ? saved : item)) : [...list, saved],
    );
  };

  const setPublication = async (item: ContentPage, publicationStatus: PublicationStatus) => {
    setError("");
    try {
      replace(await updateContentPage(item.id, { publicationStatus }));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update page status.");
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      await deleteContentPage(deleting.id);
      setItems((list) => list.filter((item) => item.id !== deleting.id));
      setDeleting(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete content page.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">Content Pages</h1>
          <p className="mt-1 text-sm text-[#6b7897]">
            {items.filter((item) => item.publicationStatus === "PUBLISHED").length} published |{" "}
            {items.filter((item) => item.publicationStatus === "DRAFT").length} drafts
          </p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="flex items-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus size={16} /> New Page
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search size={14} className="absolute left-3 top-3 text-[#6b7897]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search pages..."
            className="w-full rounded-xl bg-white py-2.5 pl-9 pr-4 text-sm outline-none"
          />
        </div>
        {statuses.map((value) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={`rounded-xl px-3 py-2 text-xs font-bold ${
              status === value ? "bg-[#0E5AA7] text-white" : "bg-white text-[#6b7897]"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {busy && !items.length ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-[#0E5AA7]" />
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0E5AA7]/10 text-[#0E5AA7]">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-black text-[#0d1b2e]">{item.title}</h2>
                    <p className="truncate text-xs text-[#6b7897]">/{item.slug}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusClasses[item.publicationStatus]}`}>
                  {item.publicationStatus}
                </span>
              </div>

              <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-[#6b7897]">
                {item.body || "No page body has been added yet."}
              </p>
              <div className="mb-4 rounded-xl bg-[#f0f4f9] p-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-[#6b7897]">SEO title</p>
                <p className="mt-1 truncate text-xs font-semibold text-[#0d1b2e]">
                  {item.seoTitle || "Not configured"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-[#e8eef6] pt-4">
                <button
                  onClick={() => setEditing(item)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#0E5AA7]/10 py-2 text-xs font-bold text-[#0E5AA7]"
                >
                  <Edit2 size={13} /> Edit
                </button>
                {item.publicationStatus !== "PUBLISHED" && (
                  <button
                    onClick={() => void setPublication(item, "PUBLISHED")}
                    aria-label={`Publish ${item.title}`}
                    className="rounded-xl bg-green-50 p-2 text-green-700"
                  >
                    <Globe2 size={14} />
                  </button>
                )}
                {item.publicationStatus !== "ARCHIVED" && (
                  <button
                    onClick={() => void setPublication(item, "ARCHIVED")}
                    aria-label={`Archive ${item.title}`}
                    className="rounded-xl bg-slate-100 p-2 text-slate-600"
                  >
                    <Archive size={14} />
                  </button>
                )}
                <button
                  onClick={() => setDeleting(item)}
                  aria-label={`Delete ${item.title}`}
                  className="rounded-xl bg-red-50 p-2 text-[#D7261E]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-12 text-center text-sm text-[#6b7897]">
          No content pages match this view.
        </div>
      )}

      {editing !== undefined && (
        <AdminCmsDialog
          kind="contentPage"
          value={editing}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      )}
      {deleting && (
        <AdminConfirmDialog
          title="Delete content page?"
          message={`This permanently removes "${deleting.title}" from the CMS.`}
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={() => void remove()}
        />
      )}
    </div>
  );
}
