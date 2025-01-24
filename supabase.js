import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; // 🔹 Your Project URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; // 🔹 Your Public Anon Key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };



