import { NextResponse } from 'next/server'
import { runAllScrapers } from '@/lib/scrapers'

export const dynamic = 'force-dynamic'
// Vercel allows max 60s (hobby) or up to 5min (pro) for functions.
// If scraping takes longer, it might timeout on Vercel, but we will initiate it.

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization')

    // Verificación de seguridad de Vercel Cron (si está configurada)
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    try {
        console.log('Iniciando scraper remoto desde Vercel Cron...')
        // Vercel serverless function time limit might be an issue if scraping takes too long.
        // We await it here.
        await runAllScrapers()
        return NextResponse.json({ success: true, message: 'Scraping completado con éxito' })
    } catch (error) {
        console.error('Error ejecutando scraper en cron:', error)
        return NextResponse.json({ success: false, error: 'Error durante el scraping' }, { status: 500 })
    }
}
