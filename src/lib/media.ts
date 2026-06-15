import { supabase } from "./supabase/client";
import { publicEnv } from "./env";

export type MediaKind = "image" | "audio" | "video" | "document";
export type MediaBucket = "images" | "audio" | "videos" | "documents";

export interface MediaRule {
  bucket: MediaBucket;
  accept: string;
  allowedTypes: string[];
  maxBytes: number;
  recommendation: string;
}

const MB = 1024 * 1024;

export const mediaRules: Record<MediaKind, MediaRule> = {
  image: {
    bucket: "images",
    accept: "image/jpeg,image/png,image/webp,image/gif",
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxBytes: 5 * MB,
    recommendation: "Use WebP or compressed JPEG images for faster page loads.",
  },
  audio: {
    bucket: "audio",
    accept: "audio/mpeg,audio/mp4,audio/ogg,audio/wav,audio/webm",
    allowedTypes: ["audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav", "audio/webm"],
    maxBytes: 25 * MB,
    recommendation: "Use compressed MP3 or M4A audio. Long recordings may need an external host.",
  },
  video: {
    bucket: "videos",
    accept: "video/mp4,video/webm,video/quicktime",
    allowedTypes: ["video/mp4", "video/webm", "video/quicktime"],
    maxBytes: 50 * MB,
    recommendation: "Supabase Free allows at most 50 MB per file. Use YouTube or Vimeo for full sermons.",
  },
  document: {
    bucket: "documents",
    accept: "application/pdf",
    allowedTypes: ["application/pdf"],
    maxBytes: 10 * MB,
    recommendation: "Upload PDF sermon notes only.",
  },
};

export const formatFileSize = (bytes: number) =>
  bytes >= MB ? `${(bytes / MB).toFixed(bytes >= 10 * MB ? 0 : 1)} MB` : `${Math.ceil(bytes / 1024)} KB`;

const safeFileName = (name: string) => {
  const extension = name.includes(".") ? `.${name.split(".").pop()?.toLowerCase()}` : "";
  const stem = name
    .replace(/\.[^/.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${stem || "media"}${extension}`;
};

export const validateMediaFile = (file: File, kind: MediaKind): string | null => {
  const rule = mediaRules[kind];
  if (!rule.allowedTypes.includes(file.type)) {
    return `Unsupported ${kind} format. Choose one of the listed file types.`;
  }
  if (file.size > rule.maxBytes) {
    return `${file.name} is ${formatFileSize(file.size)}. The ${kind} upload limit is ${formatFileSize(rule.maxBytes)}.`;
  }
  return null;
};

export const uploadMedia = async (
  file: File,
  kind: MediaKind,
  folder: string,
  onProgress?: (percentage: number) => void,
): Promise<string> => {
  const validationError = validateMediaFile(file, kind);
  if (validationError) throw new Error(validationError);

  const rule = mediaRules[kind];
  const path = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("Your admin session expired. Sign in again before uploading.");

  await new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    request.open("POST", `${publicEnv.supabaseUrl}/storage/v1/object/${rule.bucket}/${encodedPath}`);
    request.setRequestHeader("Authorization", `Bearer ${data.session.access_token}`);
    request.setRequestHeader("apikey", publicEnv.supabasePublishableKey);
    request.setRequestHeader("Content-Type", file.type);
    request.setRequestHeader("Cache-Control", "3600");
    request.setRequestHeader("x-upsert", "false");
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }
      try {
        const response = JSON.parse(request.responseText) as { message?: string; error?: string };
        reject(new Error(response.message || response.error || "Unable to upload file."));
      } catch {
        reject(new Error("Unable to upload file."));
      }
    });
    request.addEventListener("error", () => reject(new Error("The upload was interrupted. Check your connection and try again.")));
    request.send(file);
  });

  return supabase.storage.from(rule.bucket).getPublicUrl(path).data.publicUrl;
};
