'use client';

import { useEffect, useState } from 'react';
import { obtenerLotesDisponibles } from '../negocio/rcdService';

export function useLotesDisponibles() {
  const [lotes, setLotes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarLotes() {
      const resultado = await obtenerLotesDisponibles();
      if (!activo) return;

      if (resultado.success) {
        setLotes(resultado.data || []);
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