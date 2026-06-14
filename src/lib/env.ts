const getRequiredPublicEnv = (
  key: "VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY",
): string => {
  const value = import.meta.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const publicEnv = {
  supabaseUrl: getRequiredPublicEnv("VITE_SUPABASE_URL"),
  supabasePublishableKey: getRequiredPublicEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
} as const;
