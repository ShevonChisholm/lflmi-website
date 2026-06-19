/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_BIBLE_BIBLES_API_URL?: string;
  readonly VITE_BIBLE_BOOKS_API_URL?: string;
  readonly VITE_BIBLE_CHAPTERS_API_URL?: string;
  readonly VITE_BIBLE_READER_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
