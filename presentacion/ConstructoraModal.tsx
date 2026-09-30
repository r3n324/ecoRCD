'use client';

import { useState } from 'react';
import { Constructora } from '../negocio/types';
import { crearConstructora, actualizarConstructora } from '../negocio/constructoraService';

interface ConstructoraModalProps {
  constructora: Constructora | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ConstructoraModal({ constructora, onClose, onSaved }: ConstructoraModalProps) {
  const [formData, setFormData] = useState<Partial<Constructora>>({
    nombre_empresa: constructora?.nombre_empresa || '',
    nit: constructora?.nit || '',
    tipo_perfil: constructora?.tipo_perfil || 'Proveedor',
    contacto_responsable: constructora?.contacto_responsable || '',
    telefono: constructora?.telefono || '',
    email_corporativo: constructora?.email_corporativo || '',
    direccion_oficina: constructora?.direccion_oficina || '',
    verificado: constructora?.verificado || false,
  });
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    let success = false;
    let msg = null;

    if (constructora?.id) {
      const res = await actualizarConstructora(constructora.id, formData);
      success = res.success;
      msg = res.error;
    } else {
      const res = await crearConstructora(formData);
      success = res.success;
      msg = res.error;
    }

    if (success) {
      onSaved();
    } else {
      setError(msg || 'Error al guardar.');
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {constructora ? 'Editar Constructora' : 'Registrar Nueva Constructora'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Nombre de la Empresa *</label>
              <input
                type="text"
                name="nombre_empresa"
                required
                value={formData.nombre_empresa}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">NIT</label>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Tipo de Perfil</label>
              <select
                name="tipo_perfil"
                value={formData.tipo_perfil}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Proveedor">Proveedor</option>
                <option value="Receptor">Receptor</option>
                <option value="Mixto">Mixto</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Contacto Responsable</label>
              <input
                type="text"
                name="contacto_responsable"
                value={formData.contacto_responsable}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Teléfono (WhatsApp) *</label>
              <input
                type="text"
                name="telefono"
                required
                value={formData.telefono}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Email Corporativo</label>
              <input
                type="email"
                name="email_corporativo"
                value={formData.email_corporativo}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-300">Dirección de Oficina</label>
              <input
                type="text"
                name="direccion_oficina"
                value={formData.direccion_oficina}
                onChange={handleChange}
                className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                id="verificado"
                name="verificado"
                checked={formData.verificado}
                onChange={handleChange}
                className="mr-2 h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-800"
              />
              <label htmlFor="verificado" className="text-sm font-medium text-slate-300">
                Constructora Verificada (Cuenta oficial)
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-bold text-slate-900 transition-colors hover:bg-emerald-400 disabled:opacity-50"
            >
              {cargando ? 'Guardando...' : 'Guardar Constructora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
