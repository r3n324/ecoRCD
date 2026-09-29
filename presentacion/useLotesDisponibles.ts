'use client';

import { useEffect, useState } from 'react';
import { obtenerLotesDisponibles } from '../negocio/rcdService';
import { Lote } from '../negocio/types';

interface UseLotesDisponiblesResult {
  lotes: Lote[];
  cargando: boolean;
  error: string;
}

export function useLotesDisponibles(): UseLotesDisponiblesResult {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let activo = true;

    async function cargarLotes() {
      const resultado = await obtenerLotesDisponibles();
      if (!activo) return;

      if (resultado.success && resultado.data) {
        setLotes(resultado.data);
      } else {
        setError(resultado.error || 'No fue posible cargar los lotes disponibles.');
      }
      setCargando(false);
    }

    cargarLotes();
    return () => {
      activo = false;
    };
  }, []);

  return { lotes, cargando, error };
}
