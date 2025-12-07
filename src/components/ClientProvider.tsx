'use client'

import { I18nProviderClient } from '@/locales/client'

export function ClientProvider({ children, locale }: { children: React.ReactNode, locale: string }) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
