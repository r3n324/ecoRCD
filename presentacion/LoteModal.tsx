'use client';

import { useState } from 'react';
import { obtenerClienteSupabase } from '../datos/supabase';

interface LoteModalProps {
  lote?: any;
  onClose: () => void;
  onSaved: () => void;
  constructoraId?: number;
}

export default function LoteModal({ lote, onClose, onSaved, constructoraId }: LoteModalProps) {
  const [cargandoGPS, setCargandoGPS] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    tipo_material: lote?.tipo_material || 'Tierra limpia',
    volumen_m3: lote?.volumen_m3 || '',
    direccion_texto: lote?.direccion_texto || '',
    zona_ciudad: lote?.zona_ciudad || '',
    fecha_limite: lote?.fecha_limite || '',
    observaciones: lote?.observaciones || '',
    latitud: lote?.latitud || null,
    longitud: lote?.longitud || null,
  });
  const [coordenadas, setCoordenadas] = useState<string>(lote?.ubicacion || 'POINT(0 0)');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const usarUbicacionGPS = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta GPS.");
      return;
    }

    setCargandoGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCoordenadas(`POINT(${lon} ${lat})`);
        
        // Guardar latitud y longitud exactas
        setFormData((prev) => ({
          ...prev,
          latitud: lat,
          longitud: lon,
        }));

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
            headers: { 'Accept-Language': 'es' }
          });
          const data = await res.json();

          if (data && data.address) {
            const zona = data.address.suburb || data.address.neighbourhood || data.address.city || data.address.town || "Zona no identificada";
            setFormData((prev) => ({
              ...prev,
              direccion_texto: data.display_name,
              zona_ciudad: zona,
            }));
          }
        } catch (error) {
          console.error(error);
          alert("GPS obtenido, pero falló la traducción a texto de la dirección.");
        } finally {
          setCargandoGPS(false);
        }
      },
      (error) => {
        console.error("Error GPS:", error);
        alert(`No se pudo obtener la ubicación: ${error.message}. Asegúrate de tener el GPS encendido y haber dado permisos al navegador.`);
        setCargandoGPS(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const supabase = obtenerClienteSupabase();

    const payload = {
      constructora_id: constructoraId || 1, // Usa el id pasado o 1 por defecto (admin)
      tipo_material: formData.tipo_material,
      volumen_m3: Number(formData.volumen_m3),
      volumen_disponible_m3: Number(formData.volumen_m3),
      ubicacion: coordenadas,
      direccion_texto: formData.direccion_texto,
      zona_ciudad: formData.zona_ciudad,
      fecha_limite: formData.fecha_limite,
      observaciones: formData.observaciones,
      latitud: formData.latitud,
      longitud: formData.longitud,
      estado: 'Disponible',
    };

    if (lote?.id) {
      await supabase.from('lotes_excedentes').update(payload).eq('id', lote.id);
    } else {
      await supabase.from('lotes_excedentes').insert([payload]);
    }

    setGuardando(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm transition-all">
      <div className="w-full max-w-xl rounded-[2rem] bg-slate-900 border border-slate-700/60 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-emerald-400 transition-colors bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">{lote ? 'Editar Lote' : 'Nuevo Lote'}</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Material</label>
            <select name="tipo_material" value={formData.tipo_material} onChange={handleChange} className="w-full rounded-xl bg-slate-800/80 p-3.5 text-slate-100 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all">
              <option>Tierra limpia</option>
              <option>Cascote de ladrillo</option>
              <option>Hormigón fragmentado</option>
              <option>Restos de excavación mixta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Volumen (m³)</label>
            <input type="number" name="volumen_m3" value={formData.volumen_m3} onChange={handleChange} required className="w-full rounded-xl bg-slate-800/80 p-3.5 text-slate-100 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">Dirección Exacta</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={usarUbicacionGPS} disabled={cargandoGPS} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-5 py-3 rounded-xl hover:bg-emerald-500/20 font-semibold text-sm whitespace-nowrap transition-all flex items-center justify-center gap-2">
                {cargandoGPS ? (
                  <span className="animate-pulse">Buscando...</span>
                ) : (
                  <>📍 Usar mi GPS</>
                )}
              </button>
              <input type="text" name="direccion_texto" value={formData.direccion_texto} onChange={handleChange} required className="w-full rounded-xl bg-slate-800/80 p-3.5 text-slate-100 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Zona / Barrio</label>
            <input type="text" name="zona_ciudad" value={formData.zona_ciudad} onChange={handleChange} required className="w-full rounded-xl bg-slate-800/80 p-3.5 text-slate-100 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Fecha Límite</label>
            <input type="date" name="fecha_limite" value={formData.fecha_limite} onChange={handleChange} required className="w-full rounded-xl bg-slate-800/80 p-3.5 text-slate-100 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all [color-scheme:dark]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">Observaciones</label>
            <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="w-full rounded-xl bg-slate-800/80 p-3.5 text-slate-100 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none" rows={3}></textarea>
          </div>
          <div className="md:col-span-2 flex justify-end gap-4 mt-6 pt-6 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Cancelar</button>
            <button type="submit" disabled={guardando} className="bg-emerald-500 text-slate-950 font-bold px-8 py-2.5 rounded-xl hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
              {guardando ? 'Guardando...' : 'Guardar Lote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
