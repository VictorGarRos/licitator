import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { prisma } from '../db'
import { classifyLicitacion } from '../classifier'

const PLACE_FEED_URL = 'https://contrataciondelestado.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3.atom'

export async function scrapePLACE(): Promise<number> {
    const response = await axios.get(PLACE_FEED_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0 LicitatorBot/1.0' },
        timeout: 30000
    })

    const parser = new XMLParser({ ignoreAttributes: false })
    const result = parser.parse(response.data)
    let entries = result.feed?.entry || result.entry || []
    if (!Array.isArray(entries) && entries) entries = [entries]

    console.log(`[PLACE] Entries found: ${entries.length}`)
    const entriesArray = entries as any[]

    let nuevas = 0

    for (const entry of entriesArray) {
        const licitacion = parsePLACEEntry(entry)
        if (!licitacion) continue

        // Upsert: insertar si no existe, ignorar si ya existe
        const existing = await prisma.licitacion.findUnique({
            where: { expediente: licitacion.expediente }
        })

        if (!existing) {
            await prisma.licitacion.create({ data: licitacion })
            nuevas++
        }
    }

    return nuevas
}

function parsePLACEEntry(entry: any) {
    const titulo = entry.title?.['#text'] || entry.title || ''
    const expediente = entry.id || entry['cbc:ID'] || ''

    const folderStatus = entry['cac-place-ext:ContractFolderStatus']
    const procurementProject = folderStatus?.['cac:ProcurementProject']
    const budgetAmount = procurementProject?.['cac:BudgetAmount']
    const totalAmount = budgetAmount?.['cbc:TaxExclusiveAmount'] || budgetAmount?.['cbc:TotalAmount']

    let presupuesto = 0
    if (totalAmount) {
        presupuesto = typeof totalAmount === 'object' ? parseFloat(totalAmount['#text']) : parseFloat(totalAmount)
    }

    let plazoOferta: Date | null = null
    const tenderingProcess = folderStatus?.['cac:TenderSubmissionDeadlinePeriod'] || folderStatus?.['cac:TenderingProcess']?.['cac:TenderSubmissionDeadlinePeriod']
    const endDate = tenderingProcess?.['cbc:EndDate']
    if (endDate) {
        const dateStr = typeof endDate === 'object' ? endDate['#text'] : endDate
        if (dateStr) plazoOferta = new Date(dateStr)
    }

    let content = entry.summary || entry.content || ''
    if (typeof content === 'object') content = content['#text'] || JSON.stringify(content)
    const categoria = classifyLicitacion(titulo, String(content))

    const organismoTag = folderStatus?.['cac:ContractingParty']?.['cac:Party']?.['cac:PartyName']?.['cbc:Name']
        || entry['cac:ContractingParty']?.['cac:Party']?.['cac:PartyName']?.['cbc:Name']
    const organismo = typeof organismoTag === 'string' ? organismoTag : (organismoTag?.['#text'] || 'Órgano de Contratación')

    return {
        expediente,
        titulo,
        organismo,
        categoria,
        presupuesto: isNaN(presupuesto) ? 0 : presupuesto,
        fechaPublicacion: new Date(entry.updated || entry.published || Date.now()),
        plazoOferta,
        fuente: 'PLACE' as const,
        urlOriginal: entry.link?.['@_href'] || '',
        cpv: [],
        nuevo: true
    }
}
