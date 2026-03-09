import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const categoria = searchParams.get('categoria')
    const fuente = searchParams.get('fuente')
    const search = searchParams.get('q')
    const maxPres = searchParams.get('maxPresupuesto')
    const soloNuevas = searchParams.get('nuevas') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const sort = searchParams.get('sort') || 'fecha' // fecha | presupuesto | plazo

    const where: any = { estado: 'ACTIVA' }

    if (categoria && categoria !== 'TODAS') where.categoria = categoria
    if (fuente) where.fuente = fuente
    if (soloNuevas) where.nuevo = true
    if (maxPres) where.presupuesto = { lte: parseFloat(maxPres) }
    if (search) {
        where.OR = [
            { titulo: { contains: search, mode: 'insensitive' } },
            { organismo: { contains: search, mode: 'insensitive' } }
        ]
    }

    const orderBy: any =
        sort === 'presupuesto' ? { presupuesto: 'desc' } :
            sort === 'plazo' ? { plazoOferta: 'asc' } :
                { fechaPublicacion: 'desc' }

    const [total, licitaciones] = await Promise.all([
        prisma.licitacion.count({ where }),
        prisma.licitacion.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit
        })
    ])

    return NextResponse.json({
        data: licitaciones,
        total,
        page,
        pages: Math.ceil(total / limit)
    })
}
