'use client'
import { ExternalLink, Calendar, Building2, Tag, ChevronRight } from 'lucide-react'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

const CATEGORIAS_MAP: Record<string, string> = {
    'COMUNICACION': 'Comunicación',
    'PUBLICIDAD': 'Publicidad',
    'MEDIOS': 'Medios',
    'DIGITAL': 'Digital',
    'EVENTOS': 'Eventos',
    'OTRO': 'Otro'
}

export default function LicitacionCard({ licitacion }: { licitacion: any }) {

    // Categoría colors - Updated for light theme and salmon accent
    const catColors: Record<string, string> = {
        COMUNICACION: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        PUBLICIDAD: 'bg-rose-50 text-rose-600 border-rose-100',
        MEDIOS: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        DIGITAL: 'bg-sky-50 text-sky-600 border-sky-100',
        EVENTOS: 'bg-amber-50 text-amber-600 border-amber-100',
        OTRO: 'bg-slate-50 text-slate-600 border-slate-100',
    }

    const daysLeft = licitacion.plazoOferta
        ? differenceInDays(new Date(licitacion.plazoOferta), new Date())
        : null

    let daysColor = 'text-[var(--text2)]'
    let daysBg = 'bg-[var(--surface2)]'
    if (daysLeft !== null && daysLeft < 7) {
        daysColor = 'text-white'
        daysBg = 'bg-[var(--accent)]'
    }

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val)
    }

    return (
        <a
            href={licitacion.urlOriginal}
            target="_blank"
            rel="noreferrer"
            className="group block bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-6 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 relative overflow-hidden"
        >
            {licitacion.nuevo && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--accent)]"></div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${catColors[licitacion.categoria] || catColors.OTRO}`}>
                        {CATEGORIAS_MAP[licitacion.categoria] || licitacion.categoria}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-widest bg-[var(--surface2)] px-3 py-1 rounded-full">
                        {licitacion.fuente}
                    </span>
                    {licitacion.nuevo && (
                        <span className="px-2 py-0.5 bg-[var(--accent)] text-white text-[9px] font-bold rounded-full uppercase tracking-tighter">NUEVO</span>
                    )}
                </div>

                {licitacion.plazoOferta && (
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${daysBg} ${daysColor} whitespace-nowrap`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                            {daysLeft !== null && daysLeft > 0
                                ? `${daysLeft} días restantes`
                                : 'Cerrada / Hoy'}
                        </span>
                    </div>
                )}
            </div>

            <h3 className="text-[var(--text)] font-serif text-lg sm:text-xl leading-snug mb-4 group-hover:text-[var(--accent)] transition-colors pr-0 sm:pr-8 min-h-0 sm:min-h-[3rem]">
                {licitacion.titulo}
            </h3>

            <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-[var(--text2)]">
                    <Building2 className="w-4 h-4 text-[var(--text3)] shrink-0" />
                    <span className="line-clamp-1 font-medium italic">{licitacion.organismo}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--text3)] font-mono">
                    <Tag className="w-3.5 h-3.5 text-[var(--text3)] shrink-0" />
                    <span>Exp: {licitacion.expediente}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-5 border-t border-[var(--border)]">
                <div>
                    <p className="text-[var(--text3)] text-[10px] font-bold uppercase tracking-widest mb-1">Presupuesto Base</p>
                    <p className="text-xl sm:text-2xl font-serif text-[var(--text)]">
                        {licitacion.presupuesto > 0 ? formatMoney(licitacion.presupuesto) : 'A consultar'}
                    </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <p className="text-[10px] font-mono text-[var(--text3)]">
                        Publicado {formatDistanceToNow(new Date(licitacion.fechaPublicacion), { addSuffix: true, locale: es })}
                    </p>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--surface2)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0">
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                </div>
            </div>
        </a>
    )
}
