'use client';

import { crearMensajeSolicitudRetiro } from '../negocio/rcdService';

function valorVisible(valor, alternativa = 'No especificado') {
  return valor === null || valor === undefined || valor === ''
    ? alternativa
    : valor;
}

function formatoVolumen(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero)
    ? new Intl.NumberFormat('es-BO', { maximumFractionDigits: 1 }).format(numero)
    : valorVisible(valor, '—');
}

export default function LoteCard({ lote, indice, onAviso }) {
  const contacto = lote.constructoras || lote.constructora || {};
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
      key={lote.id || `${lote.tipo_material}-${lote.direccion}-${indice}`}
      className="flex min-h-80 flex-col border border-slate-800 bg-slate-900/80 p-5 transition-colors hover:border-emerald-700/70"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex max-w-[75%] items-center truncate border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
          {valorVisible(lote.tipo_material)}
        </span>
        <span className="shrink-0 text-xs text-slate-500">Disponible</span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <p className="text-3xl font-semibold tabular-nums text-white">
          {formatoVolumen(lote.volumen_m3)}
        </p>
        <span className="text-sm text-slate-500">m³</span>
      </div>

      <dl className="mt-5 grid gap-3 border-t border-slate-800 pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Zona</dt>
          <dd className="text-right text-slate-200">{valorVisible(lote.zona)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-slate-500">Dirección</dt>
          <dd className="text-right text-slate-200">{valorVisible(lote.direccion)}</dd>
        </div>
      </dl>

      <div className="mt-auto border-t border-slate-800 pt-4">
        <p className="truncate text-sm font-medium text-slate-200">{nombreEmpresa}</p>
        <p className="mt-1 truncate text-xs text-slate-500">
          {valorVisible(contacto.contacto_responsable, 'Contacto no indicado')}
          {contacto.telefono ? ` · ${contacto.telefono}` : ''}
        </p>
        <button
          type="button"
          onClick={solicitarRetiro}
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          Solicitar retiro de material
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  );
}