import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { prisma } from '../db'
import { classifyLicitacion } from '../classifier'

const BOE_SEARCH_URL = 'https://www.boe.es/buscar/boe.php'

export async function scrapeBOE(): Promise<number> {
    const keywords = ['comunicación', 'publicidad', 'medios comunicacion', 'campaña publicitaria', 'gabinete prensa']
    let nuevas = 0

    for (const keyword of keywords) {
        try {
            const response = await axios.get(BOE_SEARCH_URL, {
                params: {
                    'campo[0]': 'OBJ',
                    'dato[0]': keyword,
                    'output': 'xml',
                    'page': 1
                },
                timeout: 20000
            })

            nuevas += await processBOEResults(response.data, keyword)

            // Respetar rate limiting
            await sleep(2000)
        } catch (error) {
            console.error(`Error scraping BOE for keyword ${keyword}:`, error)
        }
    }

    return nuevas
}

async function processBOEResults(xmlData: string, keyword: string): Promise<number> {
    const parser = new XMLParser({ ignoreAttributes: false })
    const result = parser.parse(xmlData)

    // Basic fallback if BOE structure isn't exactly matched
    const items = result?.resultado?.documento || []
    const itemsArray = Array.isArray(items) ? items : [items]

    let count = 0
    for (const item of itemsArray) {
        if (!item) continue

        const titulo = item.titulo || ''
        const expediente = item.identificador || item.id || `BOE-${Date.now()}-${Math.random()}`

        const existing = await prisma.licitacion.findUnique({
            where: { expediente }
        })

        if (!existing) {
            const categoria = classifyLicitacion(titulo, '')
            await prisma.licitacion.create({
                data: {
                    expediente,
                    titulo,
                    organismo: item.departamento || 'BOE',
                    categoria,
                    presupuesto: 0, // Not always easily parsed from search result list in BOE XML
                    fechaPublicacion: item.fecha_publicacion ? new Date(item.fecha_publicacion) : new Date(),
                    fuente: 'BOE',
                    urlOriginal: `https://www.boe.es/diario_boe/txt.php?id=${item.identificador}`,
                    cpv: [],
                    nuevo: true
                }
            })
            count++
        }
    }

    return count
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
