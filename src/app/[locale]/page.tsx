import Landing from '@/components/franchizor/Landing'
import { getStaticParams } from '@/locales/server'
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

  return <Landing />
}
