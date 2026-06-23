import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. Please check your .env file.');
} else {
  // Check if we are using the service role key to bypass RLS
  const isServiceKey = supabaseKey === process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log(`[Supabase] Initializing client. Service Role Key active: ${isServiceKey}`);
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
