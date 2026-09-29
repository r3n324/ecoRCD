'use client';

import { useState } from 'react';
import { useLotesDisponibles } from './useLotesDisponibles';
import LoteCard from './LoteCard';

function formatoVolumen(valor) {
  return new Intl.NumberFormat('es-BO', { maximumFractionDigits: 1 }).format(valor);
}

export default function EcoRcdDashboard() {
  const { lotes, cargando, error } = useLotesDisponibles();
  const [aviso, setAviso] = useState('');
  const volumenTotal = lotes.reduce(
    (total, lote) => total + (Number(lote.volumen_m3) || 0),
    0,
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-16 pt-7 sm:px-8 lg:px-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 pb-6">
        <a href="#inicio" className="flex items-center gap-3 text-slate-100 no-underline">
          <span className="grid size-10 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-lg font-bold text-emerald-300">
            E
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide">EcoRCD</span>
            <span className="block text-xs text-slate-500">Cochabamba</span>
          </span>
        </a>
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
          Economía circular en construcción
        </div>
      </header>

      <section id="inicio" className="py-10 sm:py-14">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Plataforma de aprovechamiento de materiales
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Materiales con una segunda vida.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Explora excedentes de obra disponibles en Cochabamba y coordina su retiro directamente con la empresa oferente.
            </p>
          </div>

          <div className="flex gap-8 border-l border-slate-800 pl-5">
            <div>
              <p className="text-xs text-slate-500">Lotes disponibles</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
                {cargando ? '—' : lotes.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Volumen publicado</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
                {cargando ? '—' : formatoVolumen(volumenTotal)}{' '}
                <span className="text-xs font-medium text-slate-500">m³</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="lotes-titulo">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Mercado de excedentes
            </p>
            <h2 id="lotes-titulo" className="mt-1 text-xl font-semibold text-slate-100">
              Lotes disponibles
            </h2>
          </div>
          {!cargando && !error && (
            <span className="text-sm text-slate-500">
              {lotes.length} {lotes.length === 1 ? 'resultado' : 'resultados'}
            </span>
          )}
        </div>

        {aviso && (
          <p role="status" className="mb-5 border-l-2 border-emerald-400 pl-3 text-sm text-emerald-200">
            {aviso}
          </p>
        )}

        {cargando ? (
          <div role="status" className="flex min-h-52 items-center justify-center gap-3 text-sm text-slate-400">
            <span className="size-5 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
            Consultando materiales disponibles...
          </div>
        ) : error ? (
          <div role="alert" className="border border-rose-900/60 bg-rose-950/30 px-5 py-4 text-sm text-rose-200">
            <p className="font-semibold">No se pudieron cargar los lotes</p>
            <p className="mt-1 text-rose-200/75">{error}</p>
          </div>
        ) : lotes.length === 0 ? (
          <div className="border border-dashed border-slate-800 px-5 py-14 text-center">
            <p className="text-base font-medium text-slate-200">Aún no hay lotes publicados</p>
            <p className="mt-2 text-sm text-slate-500">Los nuevos materiales disponibles aparecerán aquí.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {lotes.map((lote, indice) => (
              <LoteCard
                key={lote.id || `${lote.tipo_material}-${lote.direccion}-${indice}`}
                lote={lote}
                indice={indice}
                onAviso={setAviso}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-16 border-t border-slate-800/90 pt-5 text-xs text-slate-600">
        EcoRCD Cochabamba · Reutilizar materiales, reducir residuos.
      </footer>
    </main>
  );
}