"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Inicializamos cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LotesCRUD() {
  const [lotes, setLotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [coordenadas, setCoordenadas] = useState<string>("POINT(0 0)"); // Default para DB

  const [formData, setFormData] = useState({
    tipo_material: "Tierra limpia",
    volumen_m3: "",
    direccion_texto: "",
    zona_ciudad: "",
    fecha_limite: "",
    observaciones: "",
  });

  const fetchLotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lotes_excedentes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLotes(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  // 📍 Función principal del GPS
  const usarUbicacionGPS = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta GPS.");
      return;
    }

    alert("Solicitando permiso de ubicación...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Guardamos para la BD (Longitud, Latitud)
        setCoordenadas(`POINT(${lon} ${lat})`);

        try {
          // Usamos Nominatim (OpenStreetMap) que es GRATIS y no requiere tarjeta
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();

          if (data && data.address) {
            const zonaEncontrada = data.address.suburb || data.address.neighbourhood || data.address.city || "Zona desconocida";
            
            setFormData((prev) => ({
              ...prev,
              direccion_texto: data.display_name,
              zona_ciudad: zonaEncontrada,
            }));
          }
        } catch (error) {
          console.error("Error al decodificar dirección:", error);
          alert("GPS obtenido, pero falló la traducción a texto.");
        }
      },
      (error) => {
        console.error(error);
        alert("Permiso de ubicación denegado o no disponible.");
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // NOTA: 'constructora_id' debería venir del usuario logueado. 
    // Por simplicidad para que lo veas funcionar, pongo '1' u otro ID válido en tu BD.
    // Si falla por foreign key, asegúrate de tener una constructora con ID 1.
    const payload = {
      constructora_id: 1, 
      tipo_material: formData.tipo_material,
      volumen_m3: Number(formData.volumen_m3),
      volumen_disponible_m3: Number(formData.volumen_m3),
      ubicacion: coordenadas, 
      direccion_texto: formData.direccion_texto,
      zona_ciudad: formData.zona_ciudad,
      fecha_limite: formData.fecha_limite,
      observaciones: formData.observaciones,
      estado: "Disponible",
    };

    if (editingId) {
      const { error } = await supabase.from("lotes_excedentes").update(payload).eq("id", editingId);
      if (error) alert("Error al editar: " + error.message);
    } else {
      const { error } = await supabase.from("lotes_excedentes").insert([payload]);
      if (error) alert("Error al crear: " + error.message);
    }

    setFormVisible(false);
    setEditingId(null);
    fetchLotes();
  };

  const editarLote = (lote: any) => {
    setFormData({
      tipo_material: lote.tipo_material,
      volumen_m3: lote.volumen_m3.toString(),
      direccion_texto: lote.direccion_texto,
      zona_ciudad: lote.zona_ciudad,
      fecha_limite: lote.fecha_limite,
      observaciones: lote.observaciones || "",
    });
    setCoordenadas(lote.ubicacion);
    setEditingId(lote.id);
    setFormVisible(true);
  };

  // 🟢 / 🔴 Switch de Disponible a No Disponible (Soft Delete)
  const toggleDisponibilidad = async (id: number, currentEstado: string) => {
    const nuevoEstado = currentEstado === "Disponible" ? "Cancelado" : "Disponible";
    
    const { error } = await supabase
      .from("lotes_excedentes")
      .update({ estado: nuevoEstado })
      .eq("id", id);
      
    if (error) alert("Error al cambiar estado");
    else fetchLotes();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-white bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Lotes</h1>
        <button 
          onClick={() => {
            setFormVisible(true);
            setEditingId(null);
            setFormData({
              tipo_material: "Tierra limpia", volumen_m3: "", direccion_texto: "",
              zona_ciudad: "", fecha_limite: "", observaciones: ""
            });
          }}
          className="bg-emerald-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-emerald-400 transition"
        >
          + Agregar Lote
        </button>
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-slate-400">Tipo de Material</label>
            <select name="tipo_material" value={formData.tipo_material} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-700 text-white border-none outline-none">
              <option>Tierra limpia</option>
              <option>Cascote de ladrillo</option>
              <option>Hormigón fragmentado</option>
              <option>Restos de excavación mixta</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-400">Volumen (m³)</label>
            <input type="number" name="volumen_m3" value={formData.volumen_m3} onChange={handleInputChange} required className="w-full p-2 rounded bg-slate-700 text-white border-none outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm text-slate-400">Dirección y Zona</label>
            <div className="flex gap-2">
              <button type="button" onClick={usarUbicacionGPS} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white text-sm font-semibold whitespace-nowrap">
                📍 Usar GPS Actual
              </button>
              <input type="text" name="direccion_texto" placeholder="Dirección exacta..." value={formData.direccion_texto} onChange={handleInputChange} required className="w-full p-2 rounded bg-slate-700 text-white border-none outline-none" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-400">Zona</label>
            <input type="text" name="zona_ciudad" value={formData.zona_ciudad} onChange={handleInputChange} required className="w-full p-2 rounded bg-slate-700 text-white border-none outline-none" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-400">Fecha Límite</label>
            <input type="date" name="fecha_limite" value={formData.fecha_limite} onChange={handleInputChange} required className="w-full p-2 rounded bg-slate-700 text-white border-none outline-none [color-scheme:dark]" />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setFormVisible(false)} className="px-4 py-2 rounded text-slate-300 hover:bg-slate-700 transition">Cancelar</button>
            <button type="submit" className="bg-emerald-500 text-slate-900 px-4 py-2 rounded font-bold hover:bg-emerald-400 transition">Guardar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-slate-400">Cargando lotes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotes.map((lote) => (
            <div key={lote.id} className={`p-6 rounded-lg border border-slate-700 transition ${lote.estado === 'Disponible' ? 'bg-[#0f172a]' : 'bg-slate-800 opacity-60'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="border border-emerald-500/30 text-emerald-400 px-2 py-1 text-xs rounded uppercase font-semibold tracking-wide">
                  {lote.tipo_material}
                </span>
                
                {/* Switch de Disponibilidad */}
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={lote.estado === "Disponible"} onChange={() => toggleDisponibilidad(lote.id, lote.estado)} />
                    <div className={`block w-10 h-6 rounded-full transition ${lote.estado === 'Disponible' ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${lote.estado === 'Disponible' ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-sm text-slate-300 font-medium">
                    {lote.estado === "Disponible" ? "Disponible" : "No disponible"}
                  </div>
                </label>
              </div>

              <div className="text-4xl font-bold text-white mb-6">
                {lote.volumen_m3} <span className="text-xl text-slate-500 font-normal">m³</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Zona</span>
                  <span className="text-white text-right font-medium">{lote.zona_ciudad}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Dirección</span>
                  <span className="text-white text-right font-medium line-clamp-1" title={lote.direccion_texto}>{lote.direccion_texto}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => editarLote(lote)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-semibold transition">
                  Editar
                </button>
              </div>
            </div>
          ))}
          {lotes.length === 0 && !loading && (
            <p className="text-slate-400 col-span-full">No hay lotes registrados.</p>
          )}
        </div>
      </div>
    );
  }
