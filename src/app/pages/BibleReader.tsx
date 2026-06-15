import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BookOpen, Search, Volume2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { fetchBibleReader, type BibleReaderResult } from "@/lib/bible";

const translations = [
  { value: "web-bible-eng-KJV", label: "KJV" },
  { value: "web-bible-eng-ESV", label: "ESV" },
  { value: "web-bible-eng-NIV", label: "NIV" },
];

const books = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

const bookChapterCounts: Record<string, number> = {
  Genesis: 50,
  Exodus: 40,
  Leviticus: 27,
  Numbers: 36,
  Deuteronomy: 34,
  Joshua: 24,
  Judges: 21,
  Ruth: 4,
  "1 Samuel": 31,
  "2 Samuel": 24,
  "1 Kings": 22,
  "2 Kings": 25,
  "1 Chronicles": 29,
  "2 Chronicles": 36,
  Ezra: 10,
  Nehemiah: 13,
  Esther: 10,
  Job: 42,
  Psalms: 150,
  Proverbs: 31,
  Ecclesiastes: 12,
  "Song of Solomon": 8,
  Isaiah: 66,
  Jeremiah: 52,
  Lamentations: 5,
  Ezekiel: 48,
  Daniel: 12,
  Hosea: 14,
  Joel: 3,
  Amos: 9,
  Obadiah: 1,
  Jonah: 4,
  Micah: 7,
  Nahum: 3,
  Habakkuk: 3,
  Zephaniah: 3,
  Haggai: 2,
  Zechariah: 14,
  Malachi: 4,
  Matthew: 28,
  Mark: 16,
  Luke: 24,
  John: 21,
  Acts: 28,
  Romans: 16,
  "1 Corinthians": 16,
  "2 Corinthians": 13,
  Galatians: 6,
  Ephesians: 6,
  Philippians: 4,
  Colossians: 4,
  "1 Thessalonians": 5,
  "2 Thessalonians": 3,
  "1 Timothy": 6,
  "2 Timothy": 4,
  Titus: 3,
  Philemon: 1,
  Hebrews: 13,
  James: 5,
  "1 Peter": 5,
  "2 Peter": 3,
  "1 John": 5,
  "2 John": 1,
  "3 John": 1,
  Jude: 1,
  Revelation: 22,
};

const defaultTranslation = translations[0].value;
const defaultBook = "John";
const defaultChapter = 3;

export default function BibleReader() {
  const [translation, setTranslation] = useState(defaultTranslation);
  const [book, setBook] = useState(defaultBook);
  const [chapter, setChapter] = useState(defaultChapter);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BibleReaderResult | null>(null);

  const currentChapterOptions = useMemo(() => {
    const maxChapters = bookChapterCounts[book] ?? 150;
    return Array.from({ length: maxChapters }, (_, index) => index + 1);
  }, [book]);

  useEffect(() => {
    const maxChapters = bookChapterCounts[book] ?? 150;
    if (chapter > maxChapters) {
      setChapter(maxChapters);
    }
  }, [book, chapter]);

  const displayReference = useMemo(() => {
    return `${book} ${chapter}`;
  }, [book, chapter]);

  const loadBible = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetchBibleReader({
        translation,
        book,
        chapter,
      });
      setResult(response);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load Bible text.",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBible();
  }, [translation, book, chapter]);

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0E5AA7]">Bible Reader</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-foreground">Read Scripture with translation, chapter, and search controls.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Select a translation, book, and chapter to explore the Bible. Use the verse search field to highlight matching passages and navigate quickly.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="translation">Translation</Label>
                <Select value={translation} onValueChange={setTranslation}>
                  <SelectTrigger id="translation">
                    <SelectValue placeholder="Select translation" />
                  </SelectTrigger>
                  <SelectContent>
                    {translations.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="book">Book</Label>
                <Select value={book} onValueChange={setBook}>
                  <SelectTrigger id="book">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="chapter">Chapter</Label>
                <Select value={String(chapter)} onValueChange={(value) => setChapter(Number(value))}>
                  <SelectTrigger id="chapter">
                    <SelectValue placeholder="Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentChapterOptions.map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] items-end">
            <div>
              <Label htmlFor="verseSearch">Search verses</Label>
              <div className="relative">
                <Input
                  id="verseSearch"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Find words or phrases in the chapter"
                  className="pr-12"
                />
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <Button onClick={loadBible} className="self-stretch lg:self-end" variant="secondary">
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="size-5 text-[#0E5AA7]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Now reading</p>
                <h2 className="text-xl font-black text-foreground">{displayReference}</h2>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} />
                  <div>{error}</div>
                </div>
              </div>
            ) : loading ? (
              <div className="rounded-3xl border border-border bg-[#f8fafc] p-10 text-center text-sm text-muted-foreground">Loading scripture…</div>
            ) : result ? (
              <article className="space-y-6" aria-live="polite">
                <div className="rounded-3xl border border-border bg-background p-5 text-sm leading-7 text-foreground" dangerouslySetInnerHTML={{ __html: result.html }} />

                {result?.verses && searchText.trim().length > 0 ? (
                  <div className="rounded-3xl border border-border bg-[#f8fafc] p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Matches</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {result.verses
                        .filter((verse) =>
                          verse.text
                            .toLowerCase()
                            .includes(searchText.toLowerCase()),
                        )
                        .map((verse) => (
                          <li key={verse.verse}>
                            <span className="font-semibold text-foreground">{result.reference}:{verse.verse}</span>
                            <p>{verse.text}</p>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            ) : (
              <div className="rounded-3xl border border-border bg-[#f8fafc] p-10 text-center text-sm text-muted-foreground">Select a book and chapter to begin reading.</div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="size-5 text-[#0E5AA7]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Reading preferences</p>
                  <h3 className="text-lg font-black text-foreground">Adjust your view</h3>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                This reader currently supports translation, book, chapter selection, and verse search. Audio support can be added later by wiring an audio Bible source.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Quick navigation</div>
              <div className="grid gap-3">
                <Button variant="outline" onClick={() => setBook("John")}>John</Button>
                <Button variant="outline" onClick={() => setBook("Psalms")}>Psalms</Button>
                <Button variant="outline" onClick={() => setBook("Romans")}>Romans</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
