import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zrbjgfrmvuqumywavzax.supabase.co'; // paste from dashboard
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyYmpnZnJtdnVxdW15d2F2emF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNDkzNTYsImV4cCI6MjA3NzgyNTM1Nn0.rlOexLL9Ch8WTHndRkXpQJAhGYVOoIVO2HU6BmWZhsM'; // paste from dashboard

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
