'use client'
import { FileText, Clock, TrendingUp, ShieldCheck } from 'lucide-react'

type Props = {
    stats: any
}

export default function StatsRow({ stats }: Props) {
    if (!stats) return <div className="h-32 animate-pulse bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] mb-6"></div>

    const formatMoney = (val: number) => {
        if (val > 1000000) return `€${(val / 1000000).toFixed(1)}M`
        if (val > 1000) return `€${(val / 1000).toFixed(0)}K`
        return `€${val}`
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[var(--text3)] text-[10px] font-bold uppercase tracking-widest">Activas</p>
                    <div className="p-2 bg-indigo-50 rounded-xl">
                        <FileText className="w-4 h-4 text-indigo-500" />
                    </div>
                </div>
                <div>
                    <h4 className="text-3xl font-serif text-[var(--text)]">{stats.totalActivas || 0}</h4>
                    <p className="text-[10px] text-[var(--text3)] mt-1 font-mono uppercase tracking-tighter">Sincronizadas hoy</p>
                </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[var(--text3)] text-[10px] font-bold uppercase tracking-widest">Urgentes</p>
                    <div className="p-2 bg-rose-50 rounded-xl">
                        <Clock className="w-4 h-4 text-rose-500" />
                    </div>
                </div>
                <div>
                    <h4 className="text-3xl font-serif text-[var(--text)]">{stats.urgentes || 0}</h4>
                    <p className="text-[10px] text-[var(--text3)] mt-1 font-mono uppercase tracking-tighter">Cierre {"<"} 7 días</p>
                </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[var(--text3)] text-[10px] font-bold uppercase tracking-widest">Top Capital</p>
                    <div className="p-2 bg-emerald-50 rounded-xl">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                </div>
                <div>
                    <h4 className="text-3xl font-serif text-[var(--text)]">{formatMoney(stats.maxPresupuesto || 0)}</h4>
                    <p className="text-[10px] text-[var(--text3)] mt-1 font-mono uppercase tracking-tighter">Licitación mayor</p>
                </div>
            </div>

            <div className="bg-[var(--accent)] text-white rounded-[var(--radius)] p-6 flex flex-col justify-between shadow-lg shadow-[var(--accent)]/20 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Sistema</p>
                    <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="relative z-10">
                    <h4 className="text-lg font-bold">En Línea</h4>
                    <p className="text-xs text-white/70 mt-1 font-mono">{stats.porFuente?.length || 0} fuentes activas</p>
                </div>
            </div>

        </div>
    )
}
