import { createClient } from '@supabase/supabase-js';

// PERBAIKAN DI SINI:
// Kita panggil NAMA VARIABELNYA (sama persis dengan yang di .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cek apakah url/key terbaca (Debugging)
// Kalau ini masih error, berarti file .env.local belum terbaca
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL atau Key belum disetting di .env.local!");
}

// Buat client dengan tanda seru (!) untuk memberi tahu TypeScript ini aman
export const supabase = createClient(supabaseUrl!, supabaseKey!);