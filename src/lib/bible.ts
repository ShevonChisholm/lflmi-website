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

type BibleApiEnvelope<T> = {
  data?: T;
};

type BibleReaderApiData = {
  reference?: unknown;
  content?: unknown;
  verses?: unknown;
  copyright?: unknown;
  fumsToken?: unknown;
};

type BibleVerseApiData = {
  verse?: unknown;
  text?: unknown;
  content?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapData = <T>(body: unknown): T | unknown => {
  if (isRecord(body) && "data" in body) {
    return (body as BibleApiEnvelope<T>).data;
  }

  return body;
};

const toVerse = (value: unknown): BibleVerse | null => {
  if (!isRecord(value)) return null;

  const verse = value as BibleVerseApiData;
  const verseNumber = Number(verse.verse);

  if (!Number.isFinite(verseNumber)) return null;

  return {
    verse: verseNumber,
    text: String(verse.text ?? verse.content ?? ""),
  };
};

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
  const data = unwrapData<BibleTranslationOption[]>(body);

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
  const data = unwrapData<BibleBookOption[]>(body);

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
  const data = unwrapData<BibleChapterOption[]>(body);

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
  const data = unwrapData<BibleReaderApiData>(body);
  const readerData = isRecord(data) ? (data as BibleReaderApiData) : {};
  const verses = Array.isArray(readerData.verses)
    ? readerData.verses.map(toVerse).filter((verse) => verse !== null)
    : undefined;

  return {
    reference:
      typeof readerData.reference === "string"
        ? readerData.reference
        : request.fallbackReference ?? request.chapterId,
    html:
      typeof readerData.content === "string"
        ? readerData.content
        : JSON.stringify(body),
    verses,
    copyright:
      typeof readerData.copyright === "string" &&
      readerData.copyright.trim().length > 0
        ? readerData.copyright
        : undefined,
    fumsToken:
      typeof readerData.fumsToken === "string" ? readerData.fumsToken : null,
  };
};
