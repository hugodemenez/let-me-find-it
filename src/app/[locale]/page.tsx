import { getI18n, getStaticParams } from '@/locales/server'
import { CachedComponent } from '@/components/CachedComponent'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { AIStreamDemo } from '@/components/AIStreamDemo'
import { setStaticParamsLocale } from 'next-international/server'

export function generateStaticParams() {
  return getStaticParams()
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setStaticParamsLocale(locale)
  
  const t = await getI18n()

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{t('welcome')}</h1>
          <p className="text-lg text-gray-700">{t('description')}</p>
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </header>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Next.js 16 App Router</li>
              <li>React 19 with Server Components</li>
              <li>Vercel AI SDK with streamObject</li>
              <li>next-international for EN/FR localization</li>
              <li>Cached components with React cache()</li>
              <li>Tailwind CSS for styling</li>
            </ul>
          </div>

          <CachedComponent />
          <AIStreamDemo />
        </section>

        <footer className="text-center text-gray-600 text-sm pt-8">
          <p>{t('currentLanguage')}</p>
        </footer>
      </div>
    </main>
  )
}
