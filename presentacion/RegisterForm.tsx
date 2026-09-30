'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registrarUsuario } from '../negocio/authService';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('usuario_normal');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    const { success, error: msg } = await registrarUsuario(email, password, rol);

    if (success) {
      router.push('/');
    } else {
      setError(msg || 'Error al registrarse.');
    }
    setCargando(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-5">
      <div className="w-full max-w-md border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-2xl font-bold text-emerald-300">
            E
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">Registro</h1>
          <p className="text-sm text-slate-500">Crea tu cuenta en EcoRCD</p>
        </div>

        {error && (
          <div className="mb-4 border-l-2 border-rose-500 bg-rose-500/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="w-full border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="rol">
              ¿Qué tipo de usuario eres?
            </label>
            <select
              id="rol"
              className="w-full border border-slate-700 bg-slate-800 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="usuario_normal">Busco materiales (Usuario normal)</option>
              <option value="constructora">Ofrezco materiales (Constructora)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-6 flex w-full justify-center bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 disabled:opacity-50"
          >
            {cargando ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-emerald-400 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}
