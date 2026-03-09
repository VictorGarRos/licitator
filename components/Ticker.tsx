'use client'
import { Megaphone } from 'lucide-react'

export default function Ticker({ licitaciones }: { licitaciones: any[] }) {
    const nuevas = licitaciones.filter(l => l.nuevo).slice(0, 5)

    if (nuevas.length === 0) return null

    return (
        <div className="sticky top-0 z-50 bg-[var(--accent)] text-white text-[10px] sm:text-[11px] font-mono py-1.5 px-3 sm:px-4 overflow-hidden shadow-sm flex items-center">
            <div className="flex items-center gap-1.5 sm:gap-2 font-bold tracking-widest mr-4 sm:mr-6 shrink-0 z-10">
                <Megaphone className="w-3.5 h-3.5" />
                ÚLTIMA HORA
            </div>

            <div className="flex-1 overflow-hidden whitespace-nowrap mask-ticker">
                {/* Animación custom definida en globals.css */}
                <div className="inline-block animate-marquee whitespace-nowrap">
                    {nuevas.map((l, i) => (
                        <span key={l.id} className="mx-8">
                            <span className="font-bold opacity-60 mr-2">[{l.fuente}]</span>
                            {l.titulo}
                            <span className="opacity-50 ml-2 font-bold">€{(l.presupuesto / 1000).toFixed(0)}K</span>
                        </span>
                    ))}
                    {/* Duplicar para el efecto infinito */}
                    {nuevas.map((l, i) => (
                        <span key={`${l.id}-dup`} className="mx-8">
                            <span className="font-bold opacity-60 mr-2">[{l.fuente}]</span>
                            {l.titulo}
                            <span className="opacity-50 ml-2 font-bold">€{(l.presupuesto / 1000).toFixed(0)}K</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
