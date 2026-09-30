import { obtenerClienteSupabase } from './supabase';
import { Constructora } from '../negocio/types';

export async function consultarConstructoras() {
  const supabase = obtenerClienteSupabase();
  return supabase.from('constructoras').select('*').order('created_at', { ascending: false });
}

export async function insertarConstructora(constructora: Partial<Constructora>) {
  const supabase = obtenerClienteSupabase();
  return supabase.from('constructoras').insert([constructora]).select();
}

export async function actualizarConstructoraBD(id: string | number, constructora: Partial<Constructora>) {
  const supabase = obtenerClienteSupabase();
  return supabase.from('constructoras').update(constructora).eq('id', id).select();
}

export async function borrarConstructoraBD(id: string | number) {
  const supabase = obtenerClienteSupabase();
  return supabase.from('constructoras').delete().eq('id', id);
}
