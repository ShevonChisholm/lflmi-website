import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  fetchBibleBooks,
  fetchBibleChapters,
  fetchBibleReader,
  fetchBibleTranslations,
  type BibleBookOption,
  type BibleChapterOption,
  type BibleReaderResult,
  type BibleTranslationOption,
} from "@/lib/bible";

const preferredBookName = "John";
const preferredChapterNumber = "3";

const normalize = (value: string | undefined | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const findPreferredBook = (books: BibleBookOption[]) => {
  const preferred = normalize(preferredBookName);

  return (
    books.find((book) => normalize(book.name) === preferred) ??
    books.find((book) => normalize(book.nameLong) === preferred) ??
    books.find((book) => normalize(book.name).includes(preferred)) ??
    books[0]
  );
};

const findPreferredChapter = (
  chapters: BibleChapterOption[],
  preferredNumber = "1",
) => {
  return (
    chapters.find((chapter) => String(chapter.number) === preferredNumber) ??
    chapters.find((chapter) =>
      normalize(chapter.reference).endsWith(` ${preferredNumber}`),
    ) ??
    chapters[0]
  );
};

export default function BibleReader() {
  const [translations, setTranslations] = useState<BibleTranslationOption[]>(
    [],
  );
  const [translation, setTranslation] = useState("");
  const [translationsLoading, setTranslationsLoading] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const [books, setBooks] = useState<BibleBookOption[]>([]);
  const [bookId, setBookId] = useState("");
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);

  const [chapters, setChapters] = useState<BibleChapterOption[]>([]);
  const [chapterId, setChapterId] = useState("");
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chaptersError, setChaptersError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [result, setResult] = useState<BibleReaderResult | null>(null);

  const selectedTranslation = useMemo(
    () => translations.find((item) => item.id === translation) ?? null,
    [translations, translation],
  );

  const selectedBook = useMemo(
    () => books.find((item) => item.id === bookId) ?? null,
    [books, bookId],
  );

  const selectedChapter = useMemo(
    () => chapters.find((item) => item.id === chapterId) ?? null,
    [chapters, chapterId],
  );

  const displayReference = useMemo(() => {
    return (
      result?.reference ??
      selectedChapter?.reference ??
      selectedBook?.name ??
      "Select a chapter"
    );
  }, [result?.reference, selectedBook?.name, selectedChapter?.reference]);

  const combinedSetupError =
    translationError ?? booksError ?? chaptersError ?? null;

  const translationsDisabled = translationsLoading || translations.length === 0;

  const booksDisabled = !translation || booksLoading || books.length === 0;

  const chaptersDisabled =
    !translation || !bookId || chaptersLoading || chapters.length === 0;

  const readerDisabled = !translation || !bookId || !chapterId || loading;

  useEffect(() => {
    let cancelled = false;

    const loadTranslations = async () => {
      setTranslationsLoading(true);
      setTranslationError(null);
      setTranslations([]);
      setTranslation("");

      try {
        const options = await fetchBibleTranslations();

        if (cancelled) return;

        setTranslations(options);

        if (options.length > 0) {
          setTranslation(options[0].id);
        } else {
          setTranslationError("No Bible translations were returned.");
        }
      } catch (fetchError) {
        if (cancelled) return;

        setTranslationError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load Bible translations.",
        );
      } finally {
        if (!cancelled) {
          setTranslationsLoading(false);
        }
      }
    };

    void loadTranslations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadBooks = async () => {
      if (!translation) {
        setBooks([]);
        setBookId("");
        setChapters([]);
        setChapterId("");
        setResult(null);
        return;
      }

      setBooksLoading(true);
      setBooksError(null);
      setBooks([]);
      setBookId("");
      setChapters([]);
      setChapterId("");
      setChaptersError(null);
      setReaderError(null);
      setResult(null);

      try {
        const options = await fetchBibleBooks(translation);

        if (cancelled) return;

        setBooks(options);

        if (options.length > 0) {
          const preferredBook = findPreferredBook(options);
          setBookId(preferredBook.id);
        } else {
          setBooksError("No books were returned for this Bible translation.");
        }
      } catch (fetchError) {
        if (cancelled) return;

        setBooksError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load Bible books.",
        );
      } finally {
        if (!cancelled) {
          setBooksLoading(false);
        }
      }
    };

    void loadBooks();

    return () => {
      cancelled = true;
    };
  }, [translation]);

  useEffect(() => {
    let cancelled = false;

    const loadChapters = async () => {
      if (!translation || !bookId) {
        setChapters([]);
        setChapterId("");
        setResult(null);
        return;
      }

      setChaptersLoading(true);
      setChaptersError(null);
      setChapters([]);
      setChapterId("");
      setReaderError(null);
      setResult(null);

      try {
        const options = await fetchBibleChapters(translation, bookId);

        if (cancelled) return;

        setChapters(options);

        if (options.length > 0) {
          const isPreferredBook =
            normalize(selectedBook?.name) === normalize(preferredBookName) ||
            normalize(selectedBook?.nameLong) === normalize(preferredBookName);

          const preferredChapter = findPreferredChapter(
            options,
            isPreferredBook ? preferredChapterNumber : "1",
          );

          setChapterId(preferredChapter.id);
        } else {
          setChaptersError("No chapters were returned for this book.");
        }
      } catch (fetchError) {
        if (cancelled) return;

        setChaptersError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load Bible chapters.",
        );
      } finally {
        if (!cancelled) {
          setChaptersLoading(false);
        }
      }
    };

    void loadChapters();

    return () => {
      cancelled = true;
    };
  }, [translation, bookId, selectedBook?.name, selectedBook?.nameLong]);

  const loadBible = useCallback(async () => {
    if (!translation || !chapterId) {
      setResult(null);
      return;
    }

    setReaderError(null);
    setLoading(true);

    try {
      const response = await fetchBibleReader({
        translation,
        chapterId,
        fallbackReference: selectedChapter?.reference,
      });

      setResult(response);
    } catch (fetchError) {
      setReaderError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load Bible text.",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [translation, chapterId, selectedChapter?.reference]);

  useEffect(() => {
    if (!translation || !chapterId) return;

    void loadBible();
  }, [translation, chapterId, loadBible]);

  const selectQuickBook = (bookName: string) => {
    const target = normalize(bookName);

    const matchingBook =
      books.find((book) => normalize(book.name) === target) ??
      books.find((book) => normalize(book.nameLong) === target) ??
      books.find((book) => normalize(book.name).includes(target));

    if (matchingBook) {
      setBookId(matchingBook.id);
    }
  };

  const matchingVerses =
    result?.verses?.filter((verse) =>
      verse.text.toLowerCase().includes(searchText.trim().toLowerCase()),
    ) ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0E5AA7]">
                Bible Reader
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-foreground">
                Read Scripture with translation, chapter, and search controls.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Select a translation, book, and chapter to explore the Bible.
                Books and chapters are loaded from the selected Bible version so
                the reader uses the exact chapter IDs supported by API.Bible.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="translation">Translation</Label>
                <Select
                  value={translation}
                  onValueChange={setTranslation}
                  disabled={translationsDisabled}
                >
                  <SelectTrigger id="translation">
                    <SelectValue
                      placeholder={
                        translationsLoading
                          ? "Loading translations..."
                          : "Select translation"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {translations.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="book">Book</Label>
                <Select
                  value={bookId}
                  onValueChange={setBookId}
                  disabled={booksDisabled}
                >
                  <SelectTrigger id="book">
                    <SelectValue
                      placeholder={
                        booksLoading ? "Loading books..." : "Select book"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.nameLong ?? book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="chapter">Chapter</Label>
                <Select
                  value={chapterId}
                  onValueChange={setChapterId}
                  disabled={chaptersDisabled}
                >
                  <SelectTrigger id="chapter">
                    <SelectValue
                      placeholder={
                        chaptersLoading ? "Loading chapters..." : "Chapter"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.number || chapter.reference}
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

            <Button
              onClick={loadBible}
              className="self-stretch lg:self-end"
              variant="secondary"
              disabled={readerDisabled}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="size-5 text-[#0E5AA7]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Now reading
                </p>
                <h2 className="text-xl font-black text-foreground">
                  {displayReference}
                </h2>
                {selectedTranslation ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedTranslation.label}
                  </p>
                ) : null}
              </div>
            </div>

            {combinedSetupError ? (
              <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} />
                  <div>{combinedSetupError}</div>
                </div>
              </div>
            ) : null}

            {readerError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} />
                  <div>{readerError}</div>
                </div>
              </div>
            ) : loading ||
              translationsLoading ||
              booksLoading ||
              chaptersLoading ? (
              <div className="rounded-3xl border border-border bg-[#f8fafc] p-10 text-center text-sm text-muted-foreground">
                Loading scripture…
              </div>
            ) : result ? (
              <article className="space-y-6" aria-live="polite">
                <div className="rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-sm">
                  <div
                    className="scripture-styles bible-scripture-content"
                    dangerouslySetInnerHTML={{ __html: result.html }}
                  />
                </div>

                {result.copyright ? (
                  <p className="text-xs leading-5 text-muted-foreground">
                    {result.copyright}
                  </p>
                ) : null}

                {result.verses?.length && searchText.trim().length > 0 ? (
                  <div className="rounded-3xl border border-border bg-[#f8fafc] p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Matches
                    </h3>

                    {matchingVerses.length > 0 ? (
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {matchingVerses.map((verse) => (
                          <li key={verse.verse}>
                            <span className="font-semibold text-foreground">
                              {result.reference}:{verse.verse}
                            </span>
                            <p>{verse.text}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No verse matches found.
                      </p>
                    )}
                  </div>
                ) : null}
              </article>
            ) : (
              <div className="rounded-3xl border border-border bg-[#f8fafc] p-10 text-center text-sm text-muted-foreground">
                Select a translation, book, and chapter to begin reading.
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="size-5 text-[#0E5AA7]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Reading preferences
                  </p>
                  <h3 className="text-lg font-black text-foreground">
                    Adjust your view
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                This reader loads translations, books, and chapters from
                API.Bible through Supabase Edge Functions. Audio support can be
                added later by wiring an audio Bible source.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Quick navigation
              </div>

              <div className="grid gap-3">
                <Button
                  variant="outline"
                  onClick={() => selectQuickBook("John")}
                  disabled={booksDisabled}
                >
                  John
                </Button>

                <Button
                  variant="outline"
                  onClick={() => selectQuickBook("Psalms")}
                  disabled={booksDisabled}
                >
                  Psalms
                </Button>

                <Button
                  variant="outline"
                  onClick={() => selectQuickBook("Romans")}
                  disabled={booksDisabled}
                >
                  Romans
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
