import { streamObject } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await streamObject({
    model: 'openai:gpt-4-turbo',
    schema: z.object({
      title: z.string().describe('The title of the content'),
      summary: z.string().describe('A brief summary'),
      items: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          importance: z.enum(['low', 'medium', 'high']),
        })
      ).describe('List of items'),
    }),
    prompt: prompt || 'Generate a list of important Next.js 16 features with their descriptions',
  })

  return result.toTextStreamResponse()
}
