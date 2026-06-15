const API_BIBLE_BASE = "https://api.api.bible/v1";
const API_BIBLE_TRANSLATIONS = {
  KJV: "06125adad2d5898a-01",
  ESV: "9879d0d0d9e0eb72-01",
  NIV: "de4e12af7f28f599-01",
};

const mapTranslation = (translation: string) => {
  const normalized = translation.toUpperCase();
  if (normalized.includes("KJV")) return API_BIBLE_TRANSLATIONS.KJV;
  if (normalized.includes("ESV")) return API_BIBLE_TRANSLATIONS.ESV;
  if (normalized.includes("NIV")) return API_BIBLE_TRANSLATIONS.NIV;
  return API_BIBLE_TRANSLATIONS.KJV;
};

const normalizeBookId = (book: string) =>
  book.replace(/\s+/g, "").replace(/\./g, "");

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const translation = url.searchParams.get("translation") ?? "KJV";
  const book = url.searchParams.get("book") ?? "John";
  const chapter = Number(url.searchParams.get("chapter") ?? "3");
  const apiKey = process.env.API_BIBLE_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing API_BIBLE_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const translationId = mapTranslation(translation);
  const chapterId = `${normalizeBookId(book)}.${chapter}`;
  const biblePath = `${API_BIBLE_BASE}/bibles/${translationId}/chapters/${chapterId}`;

  const response = await fetch(biblePath, {
    headers: {
      "api-key": apiKey,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const payload = await response.text();
    return new Response(payload, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = await response.json();
  const content = payload.data?.content ?? "";

  return new Response(
    JSON.stringify({
      data: {
        reference: `${book} ${chapter}`,
        content,
        verses: payload.data?.verses ?? [],
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
