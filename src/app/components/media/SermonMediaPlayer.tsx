import { ExternalLink, FileText, Headphones, Video } from "lucide-react";
import { isNativeAudioUrl, resolveVideoSource } from "@/lib/media-player";
import type { Sermon } from "@/types";

interface SermonMediaPlayerProps {
  sermon: Sermon;
  compact?: boolean;
}

export function SermonMediaPlayer({ sermon, compact = false }: SermonMediaPlayerProps) {
  const video = sermon.videoUrl ? resolveVideoSource(sermon.videoUrl) : null;
  const nativeAudio = sermon.audioUrl ? isNativeAudioUrl(sermon.audioUrl) : false;

  return (
    <div className="space-y-4">
      {video?.type === "native" && (
        <div className="space-y-2">
          <video
            key={video.url}
            controls
            playsInline
            preload="metadata"
            poster={sermon.thumbnailUrl ?? undefined}
            className="aspect-video w-full rounded-2xl bg-black"
          >
            <source src={video.url} />
            Your browser does not support video playback.
          </video>
          <a href={video.url} target="_blank" rel="noreferrer" className="flex items-center justify-end gap-1 text-xs font-bold text-[#0E5AA7]">
            Open video separately <ExternalLink size={12} />
          </a>
        </div>
      )}
      {(video?.type === "youtube" || video?.type === "vimeo") && (
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe
            src={video.embedUrl}
            title={`${sermon.title} video`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
      {video?.type === "external" && (
        <div className="rounded-2xl bg-[#eef4fc] p-4">
          <p className="mb-3 text-xs text-[#526479]">This video host cannot be embedded securely. Open it in a new tab to watch.</p>
          <a href={video.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-3 text-sm font-bold text-white">
            <Video size={15} /> Open Video <ExternalLink size={13} />
          </a>
        </div>
      )}

      {sermon.audioUrl && (
        <div className="rounded-2xl bg-[#eef4fc] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#0d1b2e]">
            <Headphones size={16} className="text-[#0E5AA7]" /> Listen to Sermon Audio
          </div>
          {nativeAudio ? (
            <div className="space-y-2">
              <audio key={sermon.audioUrl} controls preload="metadata" className="w-full">
                <source src={sermon.audioUrl} />
                Your browser does not support audio playback.
              </audio>
              <a href={sermon.audioUrl} target="_blank" rel="noreferrer" className="flex items-center justify-end gap-1 text-xs font-bold text-[#0E5AA7]">
                Open audio separately <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <a href={sermon.audioUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#0E5AA7]">
              Open Audio <ExternalLink size={13} />
            </a>
          )}
        </div>
      )}

      {!compact && sermon.notesUrl && (
        <a href={sermon.notesUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border-2 border-border px-5 py-3 text-sm font-black text-foreground">
          <FileText size={15} /> Open Sermon Notes <ExternalLink size={13} />
        </a>
      )}

      {!sermon.videoUrl && !sermon.audioUrl && !sermon.notesUrl && (
        <p className="rounded-2xl bg-[#eef4fc] p-4 text-sm text-muted-foreground">
          Media for this message will be available soon.
        </p>
      )}
    </div>
  );
}
