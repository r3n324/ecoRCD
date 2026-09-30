'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';
import { useConstructoras } from './useConstructoras';
import ConstructoraModal from './ConstructoraModal';
import { eliminarConstructora } from '../negocio/constructoraService';
import { Constructora } from '../negocio/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminConstructorasDashboard() {
  const { usuario, cargando: authCargando, logout } = useAuth();
  const { constructoras, cargando, error, recargar } = useConstructoras();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [constructoraEditando, setConstructoraEditando] = useState<Constructora | null>(null);
  const [aviso, setAviso] = useState('');

  if (authCargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-emerald-400">
        <span className="animate-pulse">Verificando sesión...</span>
      </div>
    );
  }

  // Protección de ruta: Solo admins
  if (!usuario || usuario.rol !== 'admin') {
    if (!authCargando && usuario) {
      router.push('/');
    }
    return null;
  }

  const handleCrear = () => {
    setConstructoraEditando(null);
    setModalVisible(true);
  };

  const handleEditar = (c: Constructora) => {
    setConstructoraEditando(c);
    setModalVisible(true);
  };

  const handleEliminar = async (c: Constructora) => {
    if (confirm(`¿Estás seguro de eliminar a la constructora ${c.nombre_empresa}? Esto podría afectar los lotes asociados.`)) {
      if (!c.id) return;
      const { success, error } = await eliminarConstructora(c.id);
      if (success) {
        setAviso(`Constructora ${c.nombre_empresa} eliminada correctamente.`);
        recargar();
      } else {
        setAviso(`Error: ${error}`);
      }
    }
  };

  const handleModalGuardado = () => {
    setModalVisible(false);
    recargar();
    setAviso('Constructora guardada correctamente.');
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-16 pt-7 sm:px-8 lg:px-12 relative bg-slate-950 text-slate-200">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 pb-6 mb-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 text-slate-100 no-underline">
            <span className="grid size-10 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-lg font-bold text-emerald-300">
              E
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-wide">EcoRCD</span>
              <span className="block text-xs text-slate-500">Cochabamba</span>
            </span>
          </Link>
          <div className="h-6 w-px bg-slate-800"></div>
          <span className="text-sm font-medium text-emerald-400 uppercase tracking-widest">
            Panel Admin
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            Volver a Lotes
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
            <span className="size-2 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e]" />
            {usuario.email} (Admin)
          </div>
          <button onClick={logout} className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Gestión de Constructoras</h1>
          <p className="text-sm text-slate-400">Administra las empresas que publican materiales.</p>
        </div>
        <button
          onClick={handleCrear}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2 px-5 rounded-lg transition-colors shadow-lg"
        >
          + Agregar Constructora
        </button>
      </div>

      {aviso && (
        <div className="mb-6 rounded bg-emerald-500/10 p-4 text-sm text-emerald-400 border border-emerald-500/20">
          {aviso}
        </div>
      )}
      
      {error && (
        <div className="mb-6 rounded bg-rose-500/10 p-4 text-sm text-rose-400 border border-rose-500/20">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="py-12 text-center text-slate-400">Cargando constructoras...</div>
      ) : constructoras.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-300">No hay constructoras registradas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-800/50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Empresa</th>
                <th className="px-6 py-4 font-medium">NIT</th>
                <th className="px-6 py-4 font-medium">Contacto</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {constructoras.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-medium text-white">
                    {c.nombre_empresa}
                    <div className="text-xs text-slate-500 font-normal mt-0.5">{c.tipo_perfil}</div>
                  </td>
                  <td className="px-6 py-4">{c.nit || '-'}</td>
                  <td className="px-6 py-4">
                    {c.contacto_responsable || '-'}
                    <div className="text-xs text-slate-500 mt-0.5">{c.telefono}</div>
                  </td>
                  <td className="px-6 py-4">
                    {c.verificado ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Verificada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2 py-1 text-xs font-medium text-slate-400 border border-slate-500/20">
                        No verificada
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditar(c)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium mr-4 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(c)}
                      className="text-rose-400 hover:text-rose-300 font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalVisible && (
        <ConstructoraModal
          constructora={constructoraEditando}
          onClose={() => setModalVisible(false)}
          onSaved={handleModalGuardado}
        />
      )}
    </main>
  );
}
