import { obtenerClienteSupabase } from './supabase';
import { PostgrestResponse } from '@supabase/supabase-js';

// No definimos el tipo exacto de retorno de Supabase aquí porque es genérico,
// lo manejaremos en la capa de negocio
export async function consultarLotesDisponibles(): Promise<PostgrestResponse<any>> {
  const supabase = obtenerClienteSupabase();

  return supabase
    .from('lotes_excedentes')
    .select(
      '*, constructoras(nombre_empresa, telefono, contacto_responsable)',
    )
    .eq('estado', 'Disponible');
}
