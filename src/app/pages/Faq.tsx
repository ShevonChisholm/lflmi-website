import { useEffect, useMemo, useState } from "react";
import { HelpCircle, Loader2 } from "lucide-react";
import { getPublishedPageBySlug } from "@/lib/data";
import type { ContentPage } from "@/types";

interface FaqItem {
  question: string;
  answer: string;
}

const fallbackFaqs: FaqItem[] = [
  {
    question: "What should I expect when I visit?",
    answer:
      "You can expect warm hospitality, Christ-centered worship, practical teaching, and people ready to help you find your way.",
  },
  {
    question: "Do I need to register before visiting?",
    answer:
      "Registration is not required for Sunday services, but planning your visit helps our welcome team prepare for you and your family.",
  },
  {
    question: "Is there ministry for children?",
    answer:
      "Yes. Children's ministry is available during services with caring volunteers and age-appropriate teaching.",
  },
];

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const getText = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
};

const parseFaqSections = (page: ContentPage | null): FaqItem[] => {
  if (!Array.isArray(page?.sections)) return fallbackFaqs;

  const items = page.sections
    .map((section) => {
      const record = asRecord(section);
      if (!record) return null;

      const question = getText(record, ["question", "heading", "title"]);
      const answer = getText(record, ["answer", "body", "content"]);

      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is FaqItem => Boolean(item));

  return items.length ? items : fallbackFaqs;
};

export default function Faq() {
  const [page, setPage] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setPage(await getPublishedPageBySlug("faq"));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load frequently asked questions.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const faqs = useMemo(() => parseFaqSections(page), [page]);

  return (
    <div className="bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 rounded-3xl bg-[#04183a] p-8 text-white shadow-2xl shadow-slate-900/10 sm:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/75">
            <HelpCircle size={15} />
            Frequently Asked Questions
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {page?.title ?? "Frequently Asked Questions"}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
            {page?.body ??
              "Answers to common questions about visiting, getting connected, and participating in church life at Liberty For Living Ministries International."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            {error} Showing trusted fallback FAQ content for now.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center rounded-3xl bg-card p-16">
            <Loader2 className="animate-spin text-[#0E5AA7]" />
          </div>
        ) : (
          <div className="grid gap-4">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7"
              >
                <h2 className="text-xl font-black leading-tight text-card-foreground">
                  {item.question}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
