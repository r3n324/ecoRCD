'use client';

import { useEffect, useState, useCallback } from 'react';
import { obtenerConstructoras } from '../negocio/constructoraService';
import { Constructora } from '../negocio/types';

export function useConstructoras() {
  const [constructoras, setConstructoras] = useState<Constructora[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarConstructoras = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerConstructoras();
    if (resultado.success && resultado.data) {
      setConstructoras(resultado.data);
      setError('');
    } else {
      setError(resultado.error || 'No fue posible cargar las constructoras.');
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarConstructoras();
  }, [cargarConstructoras]);

  return { constructoras, cargando, error, recargar: cargarConstructoras };
}
