'use client'
import { Filter, Search, LayoutDashboard, Database, Settings, LogOut, X } from 'lucide-react'

// types
type Filters = {
    categoria: string
    fuente: string | null
    search: string
    maxPresupuesto: number
    sort: string
}

type Props = {
    filters: Filters
    onChange: (f: Filters) => void
    stats: any
    onClose?: () => void
}

const CATEGORIAS_MAP: Record<string, string> = {
    'TODAS': 'Todas',
    'COMUNICACION': 'Comunicación',
    'PUBLICIDAD': 'Publicidad',
    'MEDIOS': 'Medios',
    'DIGITAL': 'Digital',
    'EVENTOS': 'Eventos',
    'OTRO': 'Otros'
}

const CATEGORIAS = ['TODAS', 'COMUNICACION', 'PUBLICIDAD', 'MEDIOS', 'DIGITAL', 'EVENTOS', 'OTRO']

export default function FilterSidebar({ filters, onChange, stats, onClose }: Props) {
    const handleCategoryChange = (cat: string) => {
        onChange({ ...filters, categoria: cat })
        if (onClose && window.innerWidth < 1024) {
            onClose()
        }
    }

    return (
        <aside className="w-[280px] bg-[var(--surface)] border-r border-[var(--border)] p-6 sm:p-8 h-full flex flex-col gap-8 sm:gap-10 shadow-xl lg:shadow-none">
            {/* Brand & Close */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center font-bold font-serif text-xl shadow-lg shadow-[var(--accent)]/30">L</div>
                    <div>
                        <h1 className="font-serif text-xl tracking-tighter text-[var(--text)] font-bold">Licitator</h1>
                        <p className="text-[9px] font-mono text-[var(--text3)] uppercase tracking-[0.2em] leading-none">Management</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-[var(--surface2)] rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--text2)]" />
                    </button>
                )}
            </div>

            {/* Menu Sections */}
            <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                {/* Apps Section */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-widest px-2">Navegación</p>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[var(--surface2)] text-[var(--accent)] font-medium text-sm transition-all">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] text-sm transition-all group">
                            <Database className="w-4 h-4 group-hover:text-[var(--accent)]" />
                            Fuentes
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-widest px-2">Búsqueda</p>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full bg-[var(--surface2)] border-none rounded-2xl py-3 pl-10 pr-4 text-xs focus:ring-1 focus:ring-[var(--accent)] text-[var(--text)] placeholder-[var(--text3)] outline-none"
                            value={filters.search}
                            onChange={e => onChange({ ...filters, search: e.target.value })}
                        />
                    </div>
                </div>

                {/* Categorías */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-2">
                        <p className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-widest">Categorías</p>
                        <Filter className="w-3 h-3 text-[var(--text3)]" />
                    </div>
                    <div className="flex flex-col gap-1">
                        {CATEGORIAS.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`text-left px-4 py-2 text-xs rounded-xl transition-all flex justify-between items-center
                                    ${filters.categoria === cat
                                        ? 'bg-[var(--accent)] text-white font-bold shadow-md shadow-[var(--accent)]/20 translate-x-1'
                                        : 'text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]'
                                    }`}
                            >
                                <span>{CATEGORIAS_MAP[cat]}</span>
                                {stats?.porCategoria && cat !== 'TODAS' && (
                                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${filters.categoria === cat ? 'bg-white/20 text-white' : 'bg-[var(--surface2)] text-[var(--text3)]'}`}>
                                        {stats.porCategoria.find((c: any) => c.categoria === cat)?._count || 0}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Footer / Account */}
            <div className="pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-3 px-2 text-left">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <img src="https://ui-avatars.com/api/?name=Admin&bg=B30500&color=fff" alt="Avatar" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-[var(--text)] truncate">Administrador</p>
                        <p className="text-[10px] text-[var(--text3)] truncate">Agencia de Comunicación</p>
                    </div>
                    <button className="p-2 hover:bg-rose-50 rounded-xl transition-colors group">
                        <LogOut className="w-4 h-4 text-[var(--text3)] group-hover:text-rose-500" />
                    </button>
                </div>
            </div>
        </aside>
    )
}
