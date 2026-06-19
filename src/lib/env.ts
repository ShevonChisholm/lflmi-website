const getRequiredPublicEnv = (
  key: "VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY",
): string => {
  const value = import.meta.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const getOptionalPublicEnv = (
  key:
    | "VITE_BIBLE_READER_API_URL"
    | "VITE_BIBLE_BIBLES_API_URL"
    | "VITE_BIBLE_BOOKS_API_URL"
    | "VITE_BIBLE_CHAPTERS_API_URL"
    | "VITE_ADMIN_CREATE_USER_API_URL",
): string | undefined => import.meta.env[key]?.trim();

export const publicEnv = {
  supabaseUrl: getRequiredPublicEnv("VITE_SUPABASE_URL"),
  supabasePublishableKey: getRequiredPublicEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
  bibleReaderApiUrl: getOptionalPublicEnv("VITE_BIBLE_READER_API_URL"),
  bibleBiblesApiUrl: getOptionalPublicEnv("VITE_BIBLE_BIBLES_API_URL"),
  bibleBooksApiUrl: getOptionalPublicEnv("VITE_BIBLE_BOOKS_API_URL"),
  bibleChaptersApiUrl: getOptionalPublicEnv("VITE_BIBLE_CHAPTERS_API_URL"),
  adminCreateUserApiUrl: getOptionalPublicEnv("VITE_ADMIN_CREATE_USER_API_URL"),
} as const;
