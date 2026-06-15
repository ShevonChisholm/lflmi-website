import { Loader2, Trash2, X } from "lucide-react";

export function AdminConfirmDialog({
  title,
  message,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#04183a]/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-2xl bg-red-50 p-3 text-[#D7261E]"><Trash2 size={20} /></div>
          <button type="button" onClick={onCancel} className="rounded-xl bg-[#f0f4f9] p-2 text-[#6b7897]"><X size={16} /></button>
        </div>
        <h2 className="text-xl font-black text-[#0d1b2e]">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7897]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-xl bg-[#f0f4f9] px-4 py-2.5 text-sm font-bold text-[#6b7897]">Cancel</button>
          <button type="button" disabled={busy} onClick={onConfirm} className="flex items-center gap-2 rounded-xl bg-[#D7261E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{busy && <Loader2 size={14} className="animate-spin" />}Delete</button>
        </div>
      </div>
    </div>
  );
}
