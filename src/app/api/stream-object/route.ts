import { streamObject } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Input validation schema
const requestSchema = z.object({
  prompt: z.string().min(1).max(1000).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedInput = requestSchema.parse(body)
    
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
      prompt: validatedInput.prompt || 'Generate a list of important Next.js 16 features with their descriptions',
    })

    return result.toTextStreamResponse()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid request body', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
