import cron from 'node-cron'
import { runAllScrapers } from './lib/scrapers'

console.log('🚀 LICITATOR Worker iniciado')

// Ejecutar cada 15 minutos
cron.schedule('*/15 * * * *', async () => {
    console.log(`\n[${new Date().toISOString()}] Iniciando ciclo de scraping...`)
    await runAllScrapers()
})

// Primera ejecución inmediata al arrancar
runAllScrapers()
