import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; // 🔹 Your Project URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; // 🔹 Your Public Anon Key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };


"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydW12dmt5c2VsaHpqZnZ0Y3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTc2OTgsImV4cCI6MjA1MzEzMzY5OH0.YgtTYbHd3pUtJAyVuIeUuKIbE2zvV-_1ldLgcCixZcE"
