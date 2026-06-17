type ApiBibleResponse = {
  reference?: string;
  content?: string;
  copyright?: string;
};

type OutputShape = {
  data: {
    reference: string;
    content: string;
    verses: any[];
    copyright: string;
    fumsToken: string | null;
  };
};

const bookIdMap = new Map<string, string>([
  ["Genesis", "GEN"],
  ["Exodus", "EXO"],
  ["Leviticus", "LEV"],
  ["Numbers", "NUM"],
  ["Deuteronomy", "DEU"],
  ["Joshua", "JOS"],
  ["Judges", "JDG"],
  ["Ruth", "RUT"],
  ["1 Samuel", "1SA"],
  ["2 Samuel", "2SA"],
  ["1 Kings", "1KI"],
  ["2 Kings", "2KI"],
  ["1 Chronicles", "1CH"],
  ["2 Chronicles", "2CH"],
  ["Ezra", "EZR"],
  ["Nehemiah", "NEH"],
  ["Esther", "EST"],
  ["Job", "JOB"],
  ["Psalms", "PSA"],
  ["Proverbs", "PRO"],
  ["Ecclesiastes", "ECC"],
  ["Song of Solomon", "SNG"],
  ["Isaiah", "ISA"],
  ["Jeremiah", "JER"],
  ["Lamentations", "LAM"],
  ["Ezekiel", "EZK"],
  ["Daniel", "DAN"],
  ["Hosea", "HOS"],
  ["Joel", "JOL"],
  ["Amos", "AMO"],
  ["Obadiah", "OBA"],
  ["Jonah", "JON"],
  ["Micah", "MIC"],
  ["Nahum", "NAM"],
  ["Habakkuk", "HAB"],
  ["Zephaniah", "ZEP"],
  ["Haggai", "HAG"],
  ["Zechariah", "ZEC"],
  ["Malachi", "MAL"],
  ["Matthew", "MAT"],
  ["Mark", "MRK"],
  ["Luke", "LUK"],
  ["John", "JHN"],
  ["Acts", "ACT"],
  ["Romans", "ROM"],
  ["1 Corinthians", "1CO"],
  ["2 Corinthians", "2CO"],
  ["Galatians", "GAL"],
  ["Ephesians", "EPH"],
  ["Philippians", "PHP"],
  ["Colossians", "COL"],
  ["1 Thessalonians", "1TH"],
  ["2 Thessalonians", "2TH"],
  ["1 Timothy", "1TI"],
  ["2 Timothy", "2TI"],
  ["Titus", "TIT"],
  ["Philemon", "PHM"],
  ["Hebrews", "HEB"],
  ["James", "JAS"],
  ["1 Peter", "1PE"],
  ["2 Peter", "2PE"],
  ["1 John", "1JN"],
  ["2 John", "2JN"],
  ["3 John", "3JN"],
  ["Jude", "JUD"],
  ["Revelation", "REV"],
]);

function jsonResponse(body: unknown, status = 200, extraHeaders?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(extraHeaders ?? {}),
    },
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

function getRequiredParam(params: URLSearchParams, name: string): string | null {
  const value = params.get(name);
  if (!value) return null;
  return value.trim();
}

function isValidPositiveIntegerString(v: string): boolean {
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const params = url.searchParams;

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders());
  }

  const apiKey = Deno.env.get("API_BIBLE_KEY");
  if (!apiKey) {
    return jsonResponse({ error: "Missing API_BIBLE_KEY secret" }, 500, corsHeaders());
  }

  const translation = getRequiredParam(params, "translation");
  const book = getRequiredParam(params, "book");
  const chapterRaw = getRequiredParam(params, "chapter");

  if (!translation) return jsonResponse({ error: "Missing translation" }, 400, corsHeaders());
  if (!book) return jsonResponse({ error: "Missing book" }, 400, corsHeaders());
  if (!chapterRaw || !isValidPositiveIntegerString(chapterRaw)) {
    return jsonResponse({ error: "Missing or invalid chapter" }, 400, corsHeaders());
  }

  const chapter = Number(chapterRaw);

  const bookId = bookIdMap.get(book);
  if (!bookId) {
    return jsonResponse(
      { error: "Invalid book. Provide an exact supported book name.", supportedBooks: Array.from(bookIdMap.keys()) },
      400,
      corsHeaders(),
    );
  }

  const chapterId = `${bookId}.${chapter}`;

  const apiUrl = new URL(
    `https://rest.api.bible/v1/bibles/${encodeURIComponent(translation)}/chapters/${encodeURIComponent(chapterId)}`,
  );

  apiUrl.searchParams.set("content-type", "html");
  apiUrl.searchParams.set("include-notes", "false");
  apiUrl.searchParams.set("include-titles", "true");
  apiUrl.searchParams.set("include-chapter-numbers", "false");
  apiUrl.searchParams.set("include-verse-numbers", "true");
  apiUrl.searchParams.set("include-verse-spans", "true");
  apiUrl.searchParams.set("fums-version", "3");

  const upstream = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      "api-key": apiKey,
      "Accept": "application/json, text/plain, */*",
    },
  });

  const text = await upstream.text();

  // API.Bible generally returns JSON error bodies; attempt to parse.
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!upstream.ok) {
    return jsonResponse(
      {
        error: "API.Bible request failed",
        status: upstream.status,
        details: parsed ?? text,
      },
      upstream.status,
      corsHeaders(),
    );
  }

  const body: any = parsed;
  const data: ApiBibleResponse = body?.data ?? {};

  const out: OutputShape = {
    data: {
      reference: data.reference ?? `${book} ${chapter}`,
      content: data.content ?? "",
      verses: [],
      copyright: data.copyright ?? "",
      fumsToken: body?.meta?.fumsToken ?? null,
    },
  };

  return jsonResponse(out, 200, corsHeaders());
});
