'use client'
import { useState, useEffect, useCallback } from 'react'
import FilterSidebar from './FilterSidebar'
import StatsRow from './StatsRow'
import LicitacionCard from './LicitacionCard'
import RightPanel from './RightPanel'
import Ticker from './Ticker'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
    const [licitaciones, setLicitaciones] = useState([])
    const [stats, setStats] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [filters, setFilters] = useState<{
        categoria: string;
        fuente: string | null;
        search: string;
        maxPresupuesto: number;
        sort: string;
    }>({
        categoria: 'TODAS',
        fuente: null,
        search: '',
        maxPresupuesto: 100000000,
        sort: 'fecha'
    })
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            const params = new URLSearchParams()
            if (filters.categoria && filters.categoria !== 'TODAS') params.append('categoria', filters.categoria)
            if (filters.fuente) params.append('fuente', filters.fuente)
            if (filters.search) params.append('q', filters.search)
            if (filters.sort) params.append('sort', filters.sort)
            params.append('limit', '50')

            const [licRes, statsRes] = await Promise.all([
                fetch(`/api/licitaciones?${params.toString()}`),
                fetch('/api/stats')
            ])

            if (licRes.ok) {
                const _lic = await licRes.json()
                setLicitaciones(_lic.data || [])
            }
            if (statsRes.ok) setStats(await statsRes.json())

        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchData()
        // Polling cada 5 minutos
        const interval = setInterval(fetchData, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [fetchData])

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
            <Ticker licitaciones={licitaciones} />

            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center font-bold font-serif text-lg shadow-md shadow-[var(--accent)]/30">L</div>
                    <h1 className="font-serif text-lg tracking-tighter text-[var(--text)] font-bold">Licitator</h1>
                </Link>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-[var(--surface2)] rounded-xl text-[var(--text)] transition-colors"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className={`
                    fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
                `}>
                    <FilterSidebar filters={filters} onChange={setFilters} stats={stats} onClose={() => setSidebarOpen(false)} />
                </div>

                <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 sm:py-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text)] tracking-tight">Dashboard General</h1>
                                <p className="text-[var(--text2)] mt-1 text-sm sm:text-base">Sincronización automatizada de licitaciones públicas</p>
                            </div>
                            <div className="text-left sm:text-right hidden sm:block">
                                <p className="text-xs sm:text-sm font-mono text-[var(--text3)] uppercase tracking-widest">Última actualización</p>
                                <p className="text-lg sm:text-xl font-serif text-[var(--accent)]">{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </header>

                        <StatsRow stats={stats} />

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent)]"></div>
                            </div>
                        ) : licitaciones.length > 0 ? (
                            <div className="space-y-4">
                                {licitaciones.map((l: any) => <LicitacionCard key={l.id} licitacion={l} />)}
                            </div>
                        ) : (
                            <div className="text-center py-10 sm:py-20 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] shadow-sm">
                                <h2 className="text-[var(--text2)] font-serif text-lg sm:text-xl px-4">No hay resultados para estos filtros</h2>
                                <p className="text-[var(--text3)] text-xs sm:text-sm mt-2 px-4">Intenta cambiar la categoría o los términos de búsqueda.</p>
                            </div>
                        )}

                        <div className="xl:hidden border-t border-[var(--border)] pt-8 mt-8">
                            <RightPanel stats={stats} licitaciones={licitaciones} />
                        </div>
                    </div>
                </main>

                <div className="hidden xl:block h-screen sticky top-0 overflow-y-auto border-l border-[var(--border)]">
                    <RightPanel stats={stats} licitaciones={licitaciones} />
                </div>
            </div>
        </div>
    )
}
