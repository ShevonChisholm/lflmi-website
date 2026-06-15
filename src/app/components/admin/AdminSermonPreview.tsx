import { useEffect } from "react";
import { X } from "lucide-react";
import { SermonMediaPlayer } from "@/app/components/media/SermonMediaPlayer";
import type { Sermon } from "@/types";

export function AdminSermonPreview({ sermon, onClose }: { sermon: Sermon; onClose: () => void }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-[#04183a]/70 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#0E5AA7]">Sermon Preview</div>
            <h2 className="text-xl font-black text-[#0d1b2e]">{sermon.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close sermon preview" className="rounded-xl bg-[#f0f4f9] p-2 text-[#6b7897]"><X size={17} /></button>
        </header>
        <SermonMediaPlayer sermon={sermon} />
      </section>
    </div>
  );
}
