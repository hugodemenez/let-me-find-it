'use client'

import { useChangeLocale, useCurrentLocale } from '@/locales/client'

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale()
  const currentLocale = useCurrentLocale()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLocale('en')}
        className={`px-4 py-2 rounded ${
          currentLocale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLocale('fr')}
        className={`px-4 py-2 rounded ${
          currentLocale === 'fr'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Français
      </button>
    </div>
  )
}
