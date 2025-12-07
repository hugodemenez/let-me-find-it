'use client'

import { experimental_useObject as useObject } from '@ai-sdk/react'
import { z } from 'zod'
import { useI18n } from '@/locales/client'

const schema = z.object({
  title: z.string().describe('The title of the content'),
  summary: z.string().describe('A brief summary'),
  items: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      importance: z.enum(['low', 'medium', 'high']),
    })
  ).describe('List of items'),
})

export function AIStreamDemo() {
  const t = useI18n()
  const { object, submit, isLoading } = useObject({
    api: '/api/stream-object',
    schema,
  })

  return (
    <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
      <h2 className="text-xl font-bold text-green-900 mb-4">{t('aiDemo')}</h2>
      
      <button
        onClick={() => submit({ prompt: 'Generate a list of important Next.js 16 features' })}
        disabled={isLoading}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
      >
        {isLoading ? t('loading') : t('generateObject')}
      </button>

      {object && (
        <div className="mt-4 space-y-4">
          {object.title && (
            <div>
              <h3 className="text-lg font-semibold text-green-900">{object.title}</h3>
            </div>
          )}
          
          {object.summary && (
            <p className="text-green-700">{object.summary}</p>
          )}

          {object.items && object.items.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-green-900">Items:</h4>
              {object.items.map((item, index) => item && (
                <div key={index} className="p-3 bg-white rounded border border-green-300">
                  <div className="flex justify-between items-start">
                    <h5 className="font-semibold text-green-900">{item.name}</h5>
                    {item.importance && (
                      <span className={`px-2 py-1 text-xs rounded ${
                        item.importance === 'high' ? 'bg-red-200 text-red-800' :
                        item.importance === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {item.importance}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
