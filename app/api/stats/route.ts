import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
    const [
        totalActivas,
        porCategoria,
        porFuente,
        urgentes,
        maxPresupuestoResult,
        ultimosLogs
    ] = await Promise.all([
        prisma.licitacion.count({ where: { estado: 'ACTIVA' } }),
        prisma.licitacion.groupBy({ by: ['categoria'], _count: true }),
        prisma.licitacion.groupBy({ by: ['fuente'], _count: true }),
        prisma.licitacion.count({
            where: {
                estado: 'ACTIVA',
                plazoOferta: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
            }
        }),
        prisma.licitacion.aggregate({
            _max: { presupuesto: true },
            where: { estado: 'ACTIVA' }
        }),
        prisma.scraperLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 })
    ])

    return NextResponse.json({
        totalActivas,
        porCategoria,
        porFuente,
        urgentes,
        maxPresupuesto: maxPresupuestoResult._max.presupuesto || 0,
        ultimosLogs
    })
}
