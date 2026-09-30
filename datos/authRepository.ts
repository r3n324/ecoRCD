import { obtenerClienteSupabase } from './supabase';

export async function iniciarSesionSupabase(email: string, password: string) {
  const supabase = obtenerClienteSupabase();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function registrarUsuarioSupabase(email: string, password: string, rol: string) {
  const supabase = obtenerClienteSupabase();
  return supabase.auth.signUp({ 
    email, 
    password, 
    options: {
      data: {
        rol: rol
      }
    }
  });
}

export async function cerrarSesionSupabase() {
  const supabase = obtenerClienteSupabase();
  return supabase.auth.signOut();
}

export async function obtenerUsuarioActualSupabase() {
  const supabase = obtenerClienteSupabase();
  return supabase.auth.getUser();
}

export function escucharCambiosSesion(callback: (event: string, session: any) => void) {
  const supabase = obtenerClienteSupabase();
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}
