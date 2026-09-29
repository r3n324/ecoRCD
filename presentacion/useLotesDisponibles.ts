'use client';

import { useEffect, useState, useCallback } from 'react';
import { obtenerLotesDisponibles } from '../negocio/rcdService';
import { Lote } from '../negocio/types';

interface UseLotesDisponiblesResult {
  lotes: Lote[];
  cargando: boolean;
  error: string;
  recargar: () => void;
}

export function useLotesDisponibles(): UseLotesDisponiblesResult {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const cargarLotes = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerLotesDisponibles();

    if (resultado.success && resultado.data) {
      setLotes(resultado.data);
      setError('');
    } else {
      setError(resultado.error || 'No fue posible cargar los lotes disponibles.');
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarLotes();
  }, [cargarLotes]);

  return { lotes, cargando, error, recargar: cargarLotes };
}
