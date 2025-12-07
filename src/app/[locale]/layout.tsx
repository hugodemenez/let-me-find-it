import type { Metadata } from 'next'
import '../globals.css'
import { ClientProvider } from '@/components/ClientProvider'

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
      <body className="font-sans antialiased">
        <ClientProvider locale={locale}>
          {children}
        </ClientProvider>
      </body>
    </html>
  )
}
