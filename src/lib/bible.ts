import { publicEnv } from "./env";

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleReaderResult {
  reference: string;
  html: string;
  verses?: BibleVerse[];
  copyright?: string;
  fumsToken?: string | null;
}

export interface BibleReaderRequest {
  translation: string;
  chapterId: string;
  fallbackReference?: string;
}

export interface BibleTranslationOption {
  id: string;
  label: string;
  name: string;
  abbreviation: string;
  language?: string;
  copyright?: string;
}

export interface BibleBookOption {
  id: string;
  name: string;
  nameLong?: string;
  abbreviation?: string;
}

export interface BibleChapterOption {
  id: string;
  number: string;
  reference: string;
}

const getBibleReaderApiUrl = (): string | undefined =>
  publicEnv.bibleReaderApiUrl?.trim();

const getBibleBiblesApiUrl = (): string | undefined =>
  publicEnv.bibleBiblesApiUrl?.trim();

const getBibleBooksApiUrl = (): string | undefined =>
  publicEnv.bibleBooksApiUrl?.trim();

const getBibleChaptersApiUrl = (): string | undefined =>
  publicEnv.bibleChaptersApiUrl?.trim();

export const fetchBibleTranslations = async (): Promise<
  BibleTranslationOption[]
> => {
  const apiUrl = getBibleBiblesApiUrl();

  if (!apiUrl) {
    throw new Error(
      "Bible translations are not configured. Please provide VITE_BIBLE_BIBLES_API_URL.",
    );
  }

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Bible translations API request failed (${response.status}): ${errorBody}`,
    );
  }

  const body = await response.json();
  const data = body?.data ?? body;

  return Array.isArray(data) ? data : [];
};

export const fetchBibleBooks = async (
  translation: string,
): Promise<BibleBookOption[]> => {
  const apiUrl = getBibleBooksApiUrl();

  if (!apiUrl) {
    throw new Error(
      "Bible books are not configured. Please provide VITE_BIBLE_BOOKS_API_URL.",
    );
  }

  const url = new URL(apiUrl);
  url.searchParams.set("translation", translation);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Bible books API request failed (${response.status}): ${errorBody}`,
    );
  }

  const body = await response.json();
  const data = body?.data ?? body;

  return Array.isArray(data) ? data : [];
};

export const fetchBibleChapters = async (
  translation: string,
  bookId: string,
): Promise<BibleChapterOption[]> => {
  const apiUrl = getBibleChaptersApiUrl();

  if (!apiUrl) {
    throw new Error(
      "Bible chapters are not configured. Please provide VITE_BIBLE_CHAPTERS_API_URL.",
    );
  }

  const url = new URL(apiUrl);
  url.searchParams.set("translation", translation);
  url.searchParams.set("bookId", bookId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Bible chapters API request failed (${response.status}): ${errorBody}`,
    );
  }

  const body = await response.json();
  const data = body?.data ?? body;

  return Array.isArray(data) ? data : [];
};

export const fetchBibleReader = async (
  request: BibleReaderRequest,
): Promise<BibleReaderResult> => {
  const apiUrl = getBibleReaderApiUrl();

  if (!apiUrl) {
    throw new Error(
      "Bible Reader is not configured. Please provide VITE_BIBLE_READER_API_URL.",
    );
  }

  const url = new URL(apiUrl);

  url.searchParams.set("translation", request.translation);
  url.searchParams.set("chapterId", request.chapterId);

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
    reference: data?.reference ?? request.fallbackReference ?? request.chapterId,
    html: data?.content ?? JSON.stringify(body),
    verses: Array.isArray(data?.verses)
      ? data.verses.map((verse: any) => ({
          verse: Number(verse.verse),
          text: String(verse.text ?? verse.content ?? ""),
        }))
      : undefined,
    copyright:
      typeof data?.copyright === "string" && data.copyright.trim().length > 0
        ? data.copyright
        : undefined,
    fumsToken: data?.fumsToken ?? null,
  };
};