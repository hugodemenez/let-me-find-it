import { cache } from 'react'
import { getI18n } from '@/locales/server'

// Create a cached function that fetches data
const getCachedData = cache(async () => {
  // Simulate data fetching
  await new Promise(resolve => setTimeout(resolve, 100))
  return {
    timestamp: new Date().toISOString(),
    message: 'This data is cached and will be reused during the request',
  }
})

export async function CachedComponent() {
  const t = await getI18n()
  const data = await getCachedData()

  return (
    <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
      <h2 className="text-xl font-bold text-blue-900 mb-2">{t('cachedComponent')}</h2>
      <div className="text-sm text-blue-700">
        <p>Timestamp: {data.timestamp}</p>
        <p>{data.message}</p>
      </div>
    </div>
  )
}
