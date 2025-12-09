import type { Metadata } from 'next'
import '../globals.css'
import { ClientProvider } from '@/components/ClientProvider'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Let Me Find It',
  description: 'A Next.js 16 app with AI SDK and internationalization',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased bg-cream text-stone-800 selection:bg-indigo-100 selection:text-indigo-900`}>
        <ClientProvider locale={locale}>
          {children}
        </ClientProvider>
      </body>
    </html>
  )
}
