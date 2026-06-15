export type VideoSource =
  | { type: "youtube"; embedUrl: string }
  | { type: "vimeo"; embedUrl: string }
  | { type: "native"; url: string }
  | { type: "external"; url: string };

const getUrl = (value: string) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const safeVideoId = (value?: string | null) =>
  value && /^[a-zA-Z0-9_-]+$/.test(value) ? value : null;

export const resolveVideoSource = (value: string): VideoSource => {
  const url = getUrl(value);
  if (!url) return { type: "external", url: value };

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host === "youtu.be") {
    const id = safeVideoId(url.pathname.split("/").filter(Boolean)[0]);
    if (id) return { type: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const parts = url.pathname.split("/").filter(Boolean);
    const id = safeVideoId(url.searchParams.get("v") || (["embed", "shorts", "live"].includes(parts[0]) ? parts[1] : null));
    if (id) return { type: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
    const id = url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
    if (id) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}` };
  }
  if (/\.(mp4|webm|mov)(?:$|\?)/i.test(url.href) || url.pathname.includes("/storage/v1/object/public/videos/")) {
    return { type: "native", url: url.href };
  }
  return { type: "external", url: url.href };
};

export const isNativeAudioUrl = (value: string) => {
  const url = getUrl(value);
  return Boolean(url && (/\.(mp3|m4a|mp4|ogg|wav|webm)(?:$|\?)/i.test(url.href) || url.pathname.includes("/storage/v1/object/public/audio/")));
};
