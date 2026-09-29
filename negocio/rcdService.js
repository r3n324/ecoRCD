import { consultarLotesDisponibles } from '../datos/loteRepository';

export async function obtenerLotesDisponibles() {
  try {
    const { data, error } = await consultarLotesDisponibles();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    const lotes = (data || []).map((lote) => ({
      ...lote,
      constructoras: Array.isArray(lote.constructoras)
        ? lote.constructoras[0] || null
        : lote.constructoras,
    }));

    return { success: true, data: lotes, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado al consultar los lotes.',
    };
  }
}

export function crearMensajeSolicitudRetiro(lote) {
  const volumen = Number(lote.volumen_m3);
  const volumenVisible = Number.isFinite(volumen)
    ? new Intl.NumberFormat('es-BO', { maximumFractionDigits: 1 }).format(volumen)
    : lote.volumen_m3 || '—';
  const material = lote.tipo_material || 'material disponible';

  return `Hola, deseo solicitar el retiro del lote de ${material} (${volumenVisible} m³) publicado en EcoRCD Cochabamba.`;
}