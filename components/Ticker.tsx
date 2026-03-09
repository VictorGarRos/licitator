'use client'
import { Megaphone } from 'lucide-react'

export default function Ticker({ licitaciones }: { licitaciones: any[] }) {
    const nuevas = licitaciones.filter(l => l.nuevo).slice(0, 5)

    if (nuevas.length === 0) return null

    return (
        <div className="bg-[var(--accent)] text-white text-[10px] sm:text-[11px] font-mono py-1.5 px-3 sm:px-4 overflow-hidden shadow-sm flex items-center shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 font-bold tracking-widest mr-4 sm:mr-6 shrink-0 z-10">
                <Megaphone className="w-3.5 h-3.5" />
                ÚLTIMA HORA
            </div>

            <div className="flex-1 overflow-hidden mask-ticker">
                {/* Animación custom definida en globals.css */}
                <div className="flex w-max animate-marquee">
                    {[...Array(10)].map((_, groupIdx) => (
                        <div key={groupIdx} className="flex shrink-0">
                            {nuevas.map((l, i) => (
                                <span key={`${l.id}-${groupIdx}`} className="mx-6 sm:mx-8 whitespace-nowrap">
                                    <span className="font-bold opacity-60 mr-1.5 sm:mr-2">[{l.fuente}]</span>
                                    {l.titulo}
                                    <span className="opacity-50 ml-1.5 sm:ml-2 font-bold">€{(l.presupuesto / 1000).toFixed(0)}K</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
