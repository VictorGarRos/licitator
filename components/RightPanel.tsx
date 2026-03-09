'use client'
import { Activity, Database, AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function RightPanel({ stats, licitaciones }: { stats: any, licitaciones: any[] }) {

    const ultimosLogs = stats?.ultimosLogs || []

    return (
        <aside className="w-full xl:w-[320px] bg-[var(--bg)] p-6 sm:p-8 flex flex-col gap-10">

            <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h3 className="font-serif text-lg text-[var(--text)] font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[var(--accent)]" />
                        Actividad
                    </h3>
                    <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">En vivo</span>
                </div>

                <div className="space-y-4">
                    {ultimosLogs.map((log: any) => (
                        <div key={log.id} className="relative pl-6 pb-4 border-l border-[var(--border)] last:border-0">
                            <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-[var(--surface2)] border-2 border-[var(--border)] group-hover:bg-[var(--accent)] transition-colors"></div>

                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-[11px] text-[var(--text)] uppercase tracking-tight">{log.fuente}</span>
                                <span className="text-[9px] text-[var(--text3)] font-mono">
                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: es })}
                                </span>
                            </div>

                            {log.status === 'SUCCESS' ? (
                                <div className="flex items-center gap-1.5 py-2 px-3 bg-white rounded-2xl border border-[var(--border)] shadow-sm">
                                    <CheckCircle2 className="w-3 h-3 text-[var(--green)]" />
                                    <p className="text-[10px] text-[var(--text2)] font-medium">
                                        <span className="text-[var(--text)] font-bold">{log.nuevas}</span> nuevas detectadas
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 py-2 px-3 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm">
                                    <AlertCircle className="w-3 h-3 text-rose-500" />
                                    <p className="text-[10px] text-rose-600 font-bold">Error de conexión</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="font-serif text-lg text-[var(--text)] font-bold flex items-center gap-2 px-1">
                    <Database className="w-5 h-5 text-[var(--accent2)]" />
                    Organismos
                </h3>

                <div className="space-y-5 bg-[var(--surface)] p-5 rounded-[var(--radius)] border border-[var(--border)] shadow-sm">
                    {(() => {
                        const orgs = licitaciones.reduce((acc, l) => {
                            acc[l.organismo] = (acc[l.organismo] || 0) + 1
                            return acc
                        }, {} as Record<string, number>)

                        return Object.entries(orgs)
                            .sort((a: any, b: any) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([org, count]: any, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] text-[var(--text2)] font-bold line-clamp-2 leading-tight uppercase tracking-tight w-4/5">{org}</span>
                                        <span className="text-[10px] font-bold text-[var(--text)] font-mono">{count}</span>
                                    </div>
                                    <div className="h-1.5 bg-[var(--surface2)] rounded-full flex-1 overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((count / licitaciones.length) * 100 * 5, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                    })()}
                </div>
            </div>

        </aside>
    )
}
