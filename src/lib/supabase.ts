import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://fbogcjvivaehpsgabtqv.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Server-side admin client — full access, never exposed to browser
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      "X-Client-Info": "udaan-care-server",
      "User-Agent": "udaan-care-nextjs-server",
    },
  },
});
