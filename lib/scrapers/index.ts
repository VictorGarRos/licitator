import { scrapePLACE } from './place'
import { scrapeBOE } from './boe'
import { scrapeDOGC } from './dogc'
import { scrapeBOCM } from './bocm'
import { scrapeBOJA } from './boja'
import { prisma } from '../db'

export async function runAllScrapers() {
    const scrapers = [
        { name: 'PLACE', fn: scrapePLACE },
        { name: 'BOE', fn: scrapeBOE },
        { name: 'DOGC', fn: scrapeDOGC },
        { name: 'BOCM', fn: scrapeBOCM },
        { name: 'BOJA', fn: scrapeBOJA },
    ]

    const results = []

    for (const scraper of scrapers) {
        const start = Date.now()
        try {
            const nuevas = await scraper.fn()
            const duration = Date.now() - start

            await prisma.scraperLog.create({
                data: { fuente: scraper.name as any, status: 'SUCCESS', nuevas, duration, total: nuevas }
            })

            results.push({ fuente: scraper.name, status: 'ok', nuevas })
            console.log(`✅ ${scraper.name}: ${nuevas} nuevas licitaciones (${duration}ms)`)

        } catch (error: any) {
            await prisma.scraperLog.create({
                data: { fuente: scraper.name as any, status: 'ERROR', error: error.message }
            })
            console.error(`❌ ${scraper.name}: ${error.message}`)
        }

        // Esperar entre scrapers para no sobrecargar
        await sleep(3000)
    }

    // Marcar como "no nuevo" las licitaciones de más de 24h
    await prisma.licitacion.updateMany({
        where: {
            nuevo: true,
            createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        },
        data: { nuevo: false }
    })

    return results
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
