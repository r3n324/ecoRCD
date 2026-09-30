import {
  iniciarSesionSupabase,
  registrarUsuarioSupabase,
  cerrarSesionSupabase,
  obtenerUsuarioActualSupabase,
} from '../datos/authRepository';
import { obtenerClienteSupabase } from '../datos/supabase';
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
  
  const rol = extraerRol(data.user);
  let constructora_id: number | undefined = undefined;
  
  if (rol === 'constructora') {
    const supabase = obtenerClienteSupabase();
    // Try to find the constructora that matches the user's email
    const { data: consData } = await supabase
      .from('constructoras')
      .select('id')
      .eq('email_corporativo', data.user.email)
      .single();
      
    if (consData) {
      constructora_id = consData.id;
    }
  }

  return {
    success: true,
    usuario: { id: data.user.id, email: data.user.email, rol, constructora_id },
    error: null,
  };
}
