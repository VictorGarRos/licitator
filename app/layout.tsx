import type { Metadata } from 'next'
import { Inter, Outfit, Roboto_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LICITATOR | Monitorización de Licitaciones',
  description: 'Sistema profesional de monitorización de licitaciones públicas de España en tiempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} ${robotoMono.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --accent: #0ea5e9 !important;
            --color-accent-primary: #0ea5e9 !important;
            --red: #0ea5e9 !important;
          }
        `}} />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
