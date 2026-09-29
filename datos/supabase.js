import { createClient } from '@supabase/supabase-js';

let clienteSupabase;

export function obtenerClienteSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para conectar con Supabase.',
    );
  }

  try {
    const url = new URL(supabaseUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL debe ser una URL HTTP o HTTPS válida.');
  }

  clienteSupabase ??= createClient(supabaseUrl, supabaseAnonKey);
  return clienteSupabase;
}