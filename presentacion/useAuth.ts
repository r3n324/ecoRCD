'use client';

import { useEffect, useState } from 'react';
import { obtenerUsuarioActual, cerrarSesion } from '../negocio/authService';
import { escucharCambiosSesion } from '../datos/authRepository';
import { Usuario } from '../negocio/types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let activo = true;

    async function cargarUsuario() {
      const { success, usuario: usu } = await obtenerUsuarioActual();
      if (activo) {
        if (success && usu) {
          setUsuario(usu);
        } else {
          setUsuario(null);
          router.push('/login');
        }
        setCargando(false);
      }
    }

    cargarUsuario();

    const subscription = escucharCambiosSesion(async (event) => {
      if (event === 'SIGNED_OUT') {
        setUsuario(null);
        router.push('/login');
      } else if (event === 'SIGNED_IN') {
        cargarUsuario();
      }
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    await cerrarSesion();
    setUsuario(null);
    router.push('/login');
  };

  return { usuario, cargando, logout };
}
