// Clasifica licitaciones por categoría usando CPV y keywords

const CPV_COMUNICACION = ['79416000', '79416200', '79411100', '79342000']
const CPV_PUBLICIDAD = ['79341000', '79341100', '79341200', '79341400', '79342100']
const CPV_MEDIOS = ['79341400', '92200000', '92210000', '92220000']
const CPV_DIGITAL = ['72000000', '79342200', '79342300', '79970000', '72413000']
const CPV_EVENTOS = ['79952000', '79951000', '55120000', '79956000']

const KEYWORDS_COMUNICACION = ['comunicación institucional', 'relaciones con medios', 'gabinete de prensa', 'portavocía', 'notas de prensa', 'comunicación corporativa', 'asistencia técnica comunicación', 'periodismo']
const KEYWORDS_PUBLICIDAD = ['campaña publicitaria', 'spots', 'creatividad publicitaria', 'agencia de publicidad', 'branding', 'identidad visual', 'creatividad', 'diseño gráfico', 'audiovisual']
const KEYWORDS_MEDIOS = ['compra de medios', 'planificación de medios', 'espacios publicitarios', 'anuncios en prensa', 'televisión', 'radio', 'difusión', 'inserción publicitaria']
const KEYWORDS_DIGITAL = ['redes sociales', 'social media', 'contenidos digitales', 'community manager', 'marketing digital', 'SEO', 'SEM', 'web', 'app', 'online', 'influencer', 'digitalización']
const KEYWORDS_EVENTOS = ['eventos', 'organización de actos', 'congresos', 'ruedas de prensa', 'ferias', 'exposiciones', 'stands', 'montaje']

type Categoria = 'COMUNICACION' | 'PUBLICIDAD' | 'MEDIOS' | 'DIGITAL' | 'EVENTOS' | 'OTRO'

export function classifyLicitacion(titulo: string, descripcion: string = '', cpvs: string[] = []): Categoria {
    const text = `${titulo} ${descripcion}`.toLowerCase()

    // Primero intentar por CPV (más preciso)
    for (const cpv of cpvs) {
        const code = cpv.substring(0, 8)
        if (CPV_COMUNICACION.includes(code)) return 'COMUNICACION'
        if (CPV_PUBLICIDAD.includes(code)) return 'PUBLICIDAD'
        if (CPV_MEDIOS.includes(code)) return 'MEDIOS'
        if (CPV_DIGITAL.includes(code)) return 'DIGITAL'
        if (CPV_EVENTOS.includes(code)) return 'EVENTOS'
    }

    // Si no hay CPV, clasificar por keywords
    const score = {
        COMUNICACION: KEYWORDS_COMUNICACION.filter(k => text.includes(k)).length,
        PUBLICIDAD: KEYWORDS_PUBLICIDAD.filter(k => text.includes(k)).length,
        MEDIOS: KEYWORDS_MEDIOS.filter(k => text.includes(k)).length,
        DIGITAL: KEYWORDS_DIGITAL.filter(k => text.includes(k)).length,
        EVENTOS: KEYWORDS_EVENTOS.filter(k => text.includes(k)).length,
    }

    const maxScore = Math.max(...Object.values(score))
    if (maxScore === 0) return 'OTRO'

    return (Object.entries(score).find(([_, v]) => v === maxScore)?.[0] as Categoria) || 'OTRO'
}
