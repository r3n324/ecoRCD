import { obtenerClienteSupabase } from './supabase';

export async function consultarLotesDisponibles() {
  const supabase = obtenerClienteSupabase();

  return supabase
    .from('lotes_excedentes')
    .select(
      '*, constructoras(nombre_empresa, telefono, contacto_responsable)',
    )
    .eq('estado', 'Disponible');
}