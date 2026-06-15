import { useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, UploadCloud, X } from "lucide-react";
import { formatFileSize, mediaRules, uploadMedia, validateMediaFile, type MediaKind } from "@/lib/media";

interface MediaUploadFieldProps {
  label: string;
  name: string;
  kind: MediaKind;
  folder: string;
  initialValue?: string | null;
  onValueChange?: (url: string | null) => void;
}

export function MediaUploadField({ label, name, kind, folder, initialValue, onValueChange }: MediaUploadFieldProps) {
  const [url, setUrl] = useState(initialValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const rule = mediaRules[kind];

  const changeUrl = (nextUrl: string) => {
    setUrl(nextUrl);
    onValueChange?.(nextUrl || null);
  };

  const upload = async (file?: File) => {
    if (!file) return;
    setError("");
    setNotice("");
    const validationError = validateMediaFile(file, kind);
    if (validationError) {
      setError(validationError);
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      changeUrl(await uploadMedia(file, kind, folder, setProgress));
      setNotice(`${file.name} uploaded successfully.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-wide text-[#0d1b2e]">{label}</span>
        <span className="text-[10px] font-bold text-[#6b7897]">Max {formatFileSize(rule.maxBytes)}</span>
      </div>
      <input type="hidden" name={name} value={url} />
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#b8c8da] bg-[#f8fafc] px-4 py-4 text-sm font-bold text-[#0E5AA7] transition hover:border-[#0E5AA7] hover:bg-[#0E5AA7]/5">
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
        {uploading ? "Uploading..." : `Upload ${kind}`}
        <input
          type="file"
          className="hidden"
          accept={rule.accept}
          disabled={uploading}
          onChange={(event) => {
            void upload(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </label>
      {uploading && (
        <div>
          <div className="mb-1 flex justify-between text-[10px] font-bold text-[#6b7897]">
            <span>Uploading securely</span><span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e8eef6]">
            <div className="h-full rounded-full bg-[#0E5AA7] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      <p className="flex gap-1.5 text-[10px] leading-relaxed text-[#6b7897]">
        <AlertCircle size={12} className="mt-0.5 shrink-0" /> {rule.recommendation}
      </p>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(event) => changeUrl(event.target.value)}
          placeholder="Or paste an external URL"
          className="min-w-0 flex-1 rounded-xl bg-[#f0f4f9] px-4 py-3 text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20"
        />
        {url && (
          <>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${label}`}
              className="rounded-xl bg-[#0E5AA7]/10 p-3 text-[#0E5AA7]"
            >
              <ExternalLink size={15} />
            </a>
            <button
              type="button"
              onClick={() => {
                changeUrl("");
                setNotice("The media reference will be cleared when you save.");
              }}
              aria-label={`Clear ${label}`}
              className="rounded-xl bg-red-50 p-3 text-[#D7261E]"
            >
              <X size={15} />
            </button>
          </>
        )}
      </div>
      {kind === "image" && url && (
        <img src={url} alt={`${label} preview`} className="h-28 w-full rounded-xl bg-[#f0f4f9] object-contain p-2" />
      )}
      {notice && <p className="flex gap-1.5 text-xs font-semibold text-green-700"><CheckCircle2 size={14} />{notice}</p>}
      {error && <p className="rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
