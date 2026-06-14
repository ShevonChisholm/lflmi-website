import { createClient } from "@supabase/supabase-js";

import { publicEnv } from "../env";
import type { Database } from "./database.types";

export const supabase = createClient<Database>(
  publicEnv.supabaseUrl,
  publicEnv.supabasePublishableKey,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  },
);
