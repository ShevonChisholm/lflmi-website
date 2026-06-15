import { useEffect, useMemo, useState } from "react";
import { Edit2, Eye, Loader2, Play, Plus, Search, Trash2 } from "lucide-react";
import { AdminCmsDialog } from "@/app/components/admin/AdminCmsDialog";
import { AdminConfirmDialog } from "@/app/components/admin/AdminConfirmDialog";
import { createSermon, deleteSermon, getSermons, updateSermon, type SermonInput } from "@/lib/data";
import type { Sermon } from "@/types";

const date = (value: string | null) => value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "America/Jamaica" }).format(new Date(value)) : "Not scheduled";

export default function Sermons() {
  const [items, setItems] = useState<Sermon[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [editing, setEditing] = useState<Sermon | null | undefined>();
  const [deleting, setDeleting] = useState<Sermon | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const load = async () => { setBusy(true); setError(""); try { setItems(await getSermons()); } catch (e) { setError(e instanceof Error ? e.message : "Unable to load sermons."); } finally { setBusy(false); } };
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => items.filter(item => (status === "ALL" || item.publicationStatus === status) && `${item.title} ${item.preacherName} ${item.series}`.toLowerCase().includes(search.toLowerCase())), [items, search, status]);
  const save = async (input: SermonInput) => { const saved = editing ? await updateSermon(editing.id, input) : await createSermon(input); setItems(list => editing ? list.map(item => item.id === saved.id ? saved : item) : [saved, ...list]); };
  const remove = async () => { if (!deleting) return; setBusy(true); try { await deleteSermon(deleting.id); setItems(list => list.filter(item => item.id !== deleting.id)); setDeleting(null); } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete sermon."); } finally { setBusy(false); } };
  return <div className="p-5 lg:p-7">
    <div className="mb-6 flex items-start justify-between"><div><h1 className="text-2xl font-black text-[#0d1b2e]">Sermons</h1><p className="mt-1 text-sm text-[#6b7897]">{items.filter(i => i.publicationStatus === "PUBLISHED").length} published · {items.filter(i => i.publicationStatus === "DRAFT").length} draft</p></div><button onClick={() => setEditing(null)} className="flex items-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white"><Plus size={16}/>Upload Sermon</button></div>
    <div className="mb-5 flex flex-wrap gap-3"><div className="relative min-w-52 flex-1"><Search size={14} className="absolute left-3 top-3 text-[#6b7897]"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search sermons..." className="w-full rounded-xl border border-[#e8eef6] bg-white py-2.5 pl-9 pr-4 text-sm outline-none"/></div>{["ALL","PUBLISHED","DRAFT","ARCHIVED"].map(s=><button key={s} onClick={()=>setStatus(s)} className={`rounded-xl px-3 py-2 text-xs font-semibold ${status===s?"bg-[#0E5AA7] text-white":"bg-white text-[#6b7897]"}`}>{s}</button>)}</div>
    {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">{busy && items.length===0 ? <div className="flex justify-center p-16"><Loader2 className="animate-spin text-[#0E5AA7]"/></div> : <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-[#e8eef6] text-left text-[10px] uppercase tracking-widest text-[#6b7897]"><th className="px-5 py-4">Sermon</th><th className="px-4 py-4">Speaker</th><th className="px-4 py-4">Date</th><th className="px-4 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#e8eef6]">{filtered.map(item=><tr key={item.id} className="hover:bg-[#f8fafd]"><td className="px-5 py-4"><div className="font-bold text-[#0d1b2e]">{item.title}</div><div className="mt-1 text-xs text-[#6b7897]">{item.bibleText} · {item.durationMinutes ? `${item.durationMinutes} min` : "No duration"}</div></td><td className="px-4 py-4 text-sm text-[#6b7897]">{item.preacherName}</td><td className="px-4 py-4 text-sm text-[#6b7897]">{date(item.sermonDate)}</td><td className="px-4 py-4"><span className="rounded-full bg-[#0E5AA7]/10 px-2.5 py-1 text-xs font-bold text-[#0E5AA7]">{item.publicationStatus}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-1">{item.videoUrl&&<a href={item.videoUrl} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-[#0E5AA7] hover:bg-[#0E5AA7]/10"><Play size={14}/></a>}<button onClick={()=>setEditing(item)} className="rounded-lg p-2 text-[#6b7897] hover:bg-[#f0f4f9]"><Edit2 size={14}/></button><button onClick={()=>setDeleting(item)} className="rounded-lg p-2 text-[#6b7897] hover:bg-red-50 hover:text-[#D7261E]"><Trash2 size={14}/></button></div></td></tr>)}</tbody></table></div>}<div className="border-t border-[#e8eef6] px-5 py-3 text-xs text-[#6b7897]">Showing {filtered.length} of {items.length} sermons</div></div>
    {editing !== undefined && <AdminCmsDialog kind="sermon" value={editing} onClose={()=>setEditing(undefined)} onSave={save}/>}
    {deleting && <AdminConfirmDialog title="Delete sermon?" message={`This permanently removes "${deleting.title}".`} busy={busy} onCancel={()=>setDeleting(null)} onConfirm={()=>void remove()}/>}
  </div>;
}
