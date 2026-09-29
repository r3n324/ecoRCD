'use client';

import { crearMensajeSolicitudRetiro } from '../negocio/rcdService';
import { Lote, Constructora } from '../negocio/types';

function valorVisible(valor: string | number | null | undefined, alternativa: string = 'No especificado'): string | number {
  return valor === null || valor === undefined || valor === ''
    ? alternativa
    : valor;
}

function formatoVolumen(valor: string | number | null | undefined): string | number {
  const numero = Number(valor);
  return Number.isFinite(numero)
    ? new Intl.NumberFormat('es-BO', { maximumFractionDigits: 1 }).format(numero)
    : valorVisible(valor, '—');
}

interface LoteCardProps {
  lote: Lote;
  indice: number;
  onAviso: (mensaje: string) => void;
  onEdit?: (lote: Lote) => void;
  onDelete?: (lote: Lote) => void;
  onChangeEstado?: (lote: Lote, nuevoEstado: string) => void;
}

export default function LoteCard({ lote, indice, onAviso, onEdit, onDelete, onChangeEstado }: LoteCardProps) {
  // Manejo defensivo en caso de que venga como array o como un solo objeto
  const constructorasObj = Array.isArray(lote.constructoras) ? lote.constructoras[0] : lote.constructoras;
  const contacto: Constructora = constructorasObj || lote.constructora || {};
  
  const nombreEmpresa = valorVisible(
    contacto.nombre_empresa || contacto.nombre,
    'Empresa oferente',
  );

  function solicitarRetiro() {
    const telefono = String(contacto.telefono || '').replace(/\D/g, '');

    if (!telefono) {
      onAviso('La empresa oferente no registró un teléfono de contacto.');
      return;
    }

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(crearMensajeSolicitudRetiro(lote))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onAviso('Se abrió WhatsApp con los datos del lote para coordinar el retiro.');
  }

  return (
    <article
      key={lote.id || `${lote.tipo_material}-${(lote as any).direccion_texto || (lote as any).direccion}-${indice}`}
      className="flex min-h-80 flex-col rounded-3xl border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-emerald-900/10"
    >
      {/* 1. CONTACTO Y ESTADO (ARRIBA) */}
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-800/60 pb-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-400">
            {nombreEmpresa.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold text-slate-200">{nombreEmpresa}</p>
            <p className="truncate text-xs text-slate-500">
              {valorVisible(contacto.contacto_responsable, 'Contacto no indicado')}
              {contacto.telefono ? ` · ${contacto.telefono}` : ''}
            </p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => onChangeEstado && onChangeEstado(lote, (lote as any).estado === 'Disponible' ? 'Reservado' : 'Disponible')}
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer ${
            (lote as any).estado === 'Reservado' 
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20' 
              : 'bg-slate-800/80 text-slate-400 border border-transparent hover:border-slate-600 hover:bg-slate-700 hover:text-white'
          }`}
          title="Click para cambiar estado"
        >
          {(lote as any).estado || 'Disponible'}
        </button>
      </div>

      {/* 2. DETALLES DEL MATERIAL */}
      <div>
        <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-300">
          {valorVisible(lote.tipo_material)}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <p className="text-4xl font-bold tracking-tight tabular-nums text-white">
          {formatoVolumen(lote.volumen_m3)}
        </p>
        <span className="text-sm font-medium text-slate-500">m³</span>
      </div>

      <dl className="mt-6 grid gap-3 border-t border-slate-800/60 pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Zona</dt>
          <dd className="text-right font-medium text-slate-200">{valorVisible((lote as any).zona_ciudad || (lote as any).zona)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-slate-500">Dirección</dt>
          <dd className="text-right font-medium">
            {valorVisible((lote as any).direccion_texto || (lote as any).direccion) !== 'No especificado' ? (
              <a 
                href={(lote as any).latitud && (lote as any).longitud 
                  ? `https://www.google.com/maps/search/?api=1&query=${(lote as any).latitud},${(lote as any).longitud}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((lote as any).direccion_texto || (lote as any).direccion)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end gap-1 text-emerald-400 decoration-emerald-500/30 underline-offset-4 transition-all hover:text-emerald-300 hover:underline hover:decoration-emerald-400"
                title={(lote as any).latitud ? "Abrir ubicación exacta GPS en el mapa" : "Abrir dirección en el mapa"}
              >
                {(lote as any).direccion_texto || (lote as any).direccion} ↗
              </a>
            ) : (
              <span className="text-slate-400">No especificado</span>
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-auto border-t border-slate-800/60 pt-5">
        {(lote as any).latitud && (lote as any).longitud && (
          <div className="group relative mb-5 h-48 w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-inner">
            <div className="pointer-events-none absolute inset-0 z-10 bg-emerald-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <iframe 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number((lote as any).longitud) - 0.005},${Number((lote as any).latitud) - 0.005},${Number((lote as any).longitud) + 0.005},${Number((lote as any).latitud) + 0.005}&layer=mapnik&marker=${(lote as any).latitud},${(lote as any).longitud}`}
              className="absolute -top-12 left-0 h-[calc(100%+6rem)] w-full opacity-70 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
            ></iframe>
          </div>
        )}

        <button
          type="button"
          onClick={solicitarRetiro}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 active:scale-[0.98]"
        >
          Solicitar retiro de material
          <span aria-hidden="true" className="text-lg leading-none">↗</span>
        </button>

        {(onEdit || onDelete) && (
          <div className="mt-3 flex gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(lote)}
                className="flex-1 rounded-xl border border-transparent bg-slate-800/80 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(lote)}
                className="flex-1 rounded-xl border border-transparent bg-rose-500/10 py-2.5 text-sm font-semibold text-rose-400 transition-all hover:border-rose-900/50 hover:bg-rose-500/20 hover:text-rose-300 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] active:scale-[0.98]"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
