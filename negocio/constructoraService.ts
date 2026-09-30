import {
  consultarConstructoras,
  insertarConstructora,
  actualizarConstructoraBD,
  borrarConstructoraBD,
} from '../datos/constructoraRepository';
import { Constructora } from './types';

export interface ConstructorasResponse {
  success: boolean;
  data: Constructora[] | null;
  error: string | null;
}

export async function obtenerConstructoras(): Promise<ConstructorasResponse> {
  try {
    const { data, error } = await consultarConstructoras();
    if (error) {
      return { success: false, data: null, error: error.message };
    }
    return { success: true, data: data || [], error: null };
  } catch (error) {
    return { success: false, data: null, error: 'Error inesperado al consultar constructoras.' };
  }
}

export async function crearConstructora(constructora: Partial<Constructora>): Promise<{ success: boolean; error: string | null }> {
  try {
    if (!constructora.nombre_empresa) {
      return { success: false, error: 'El nombre de la empresa es obligatorio.' };
    }
    if (!constructora.telefono) {
      return { success: false, error: 'El número de teléfono/celular es obligatorio para contactar por WhatsApp.' };
    }
    const { error } = await insertarConstructora(constructora);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: 'Error inesperado al crear constructora.' };
  }
}

export async function actualizarConstructora(id: string | number, constructora: Partial<Constructora>): Promise<{ success: boolean; error: string | null }> {
  try {
    if (constructora.telefono !== undefined && !constructora.telefono) {
      return { success: false, error: 'El número de teléfono/celular es obligatorio.' };
    }
    const { error } = await actualizarConstructoraBD(id, constructora);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: 'Error inesperado al actualizar constructora.' };
  }
}

export async function eliminarConstructora(id: string | number): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await borrarConstructoraBD(id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: 'Error inesperado al eliminar constructora.' };
  }
}
