import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase (configured in .env or fallback for local dev)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

