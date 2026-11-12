import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'your-key';

export const isSupabaseConnected = Boolean(
  process.env.SUPABASE_URL && 
  process.env.SUPABASE_URL !== 'https://your-project.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseKey);

