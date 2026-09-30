import {
  iniciarSesionSupabase,
  registrarUsuarioSupabase,
  cerrarSesionSupabase,
  obtenerUsuarioActualSupabase,
} from '../datos/authRepository';
import { AuthResponse, Usuario } from './types';

// Función auxiliar para extraer el rol
function extraerRol(user: any): string {
  return user?.user_metadata?.rol || 'usuario_normal';
}

export async function iniciarSesion(email: string, password: string): Promise<AuthResponse> {
  if (!email || !password) {
    return { success: false, usuario: null, error: 'Ingresa correo y contraseña.' };
  }

  const { data, error } = await iniciarSesionSupabase(email, password);

  if (error || !data.user) {
    return { success: false, usuario: null, error: error?.message || 'Error al iniciar sesión.' };
  }

  return {
    success: true,
    usuario: { id: data.user.id, email: data.user.email, rol: extraerRol(data.user) },
    error: null,
  };
}

export async function registrarUsuario(email: string, password: string, rol: string): Promise<AuthResponse> {
  if (!email || !password || !rol) {
    return { success: false, usuario: null, error: 'Ingresa correo, contraseña y rol.' };
  }

  const { data, error } = await registrarUsuarioSupabase(email, password, rol);

  if (error || !data.user) {
    return { success: false, usuario: null, error: error?.message || 'Error al registrar.' };
  }

  return {
    success: true,
    usuario: { id: data.user.id, email: data.user.email, rol: extraerRol(data.user) },
    error: null,
  };
}

export async function cerrarSesion(): Promise<void> {
  await cerrarSesionSupabase();
}

export async function obtenerUsuarioActual(): Promise<AuthResponse> {
  const { data, error } = await obtenerUsuarioActualSupabase();

  if (error || !data.user) {
    return { success: false, usuario: null, error: error?.message || 'No hay sesión activa.' };
  }

  return {
    success: true,
    usuario: { id: data.user.id, email: data.user.email, rol: extraerRol(data.user) },
    error: null,
  };
}
