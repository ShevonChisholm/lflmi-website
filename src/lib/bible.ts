import { publicEnv } from "./env";

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleReaderResult {
  reference: string;
  html: string;
  verses?: BibleVerse[];
}

export interface BibleReaderRequest {
  translation: string;
  book: string;
  chapter: number;
}

const getBibleReaderApiUrl = (): string => {
  const url = publicEnv.bibleReaderApiUrl?.trim();

  if (!url) {
    throw new Error(
      "Missing required environment variable: VITE_BIBLE_READER_API_URL",
    );
  }

  return url;
};

export const fetchBibleReader = async (
  request: BibleReaderRequest,
): Promise<BibleReaderResult> => {
  const url = new URL(getBibleReaderApiUrl());

  url.searchParams.set("translation", request.translation);
  url.searchParams.set("book", request.book);
  url.searchParams.set("chapter", String(request.chapter));

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Bible reader API request failed (${response.status}): ${errorBody}`,
    );
  }

  const body = await response.json();
  const data = body?.data ?? body;

  return {
    reference: data?.reference ?? `${request.book} ${request.chapter}`,
    html: data?.content ?? JSON.stringify(body),
    verses: Array.isArray(data?.verses)
      ? data.verses.map((verse: any) => ({
          verse: Number(verse.verse),
          text: String(verse.text ?? verse.content ?? ""),
        }))
      : undefined,
  };
};
