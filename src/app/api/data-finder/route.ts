import { gateway, streamObject } from "ai"
import { z } from "zod"

const singleFieldSchema = z.object({
  columnId: z.string(),
  fieldName: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]).nullable().optional(),
  notes: z.string().optional(),
})

const responseSchema = z.object({
  rowId: z.string(),
  columnId: z.string(),
  fieldName: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]).nullable().optional(),
  notes: z.string().optional(),
})

const multiResponseSchema = z.object({
  rowId: z.string(),
  results: z.array(singleFieldSchema),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rowId, columnId, fieldName, description, companyName, rowData, columns } = body || {}

    if (!rowId || !companyName) {
      return new Response(JSON.stringify({ error: "rowId and companyName are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const trimmedName = String(companyName).trim()
    if (!trimmedName) {
      return new Response(JSON.stringify({ error: "companyName is empty." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const fields: Array<z.infer<typeof singleFieldSchema> & { description: string }> = Array.isArray(columns)
      ? columns
          .map((col: any) => ({
            columnId: String(col?.columnId ?? ""),
            fieldName: String(col?.fieldName ?? ""),
            description: String(col?.description ?? ""),
          }))
          .filter((col) => col.columnId && col.fieldName && col.description)
      : []

    const isBatch = fields.length > 0

    if (!isBatch && (!columnId || !fieldName || !description)) {
      return new Response(
        JSON.stringify({ error: "columnId, fieldName, and description are required when columns are not provided." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const contextString = JSON.stringify(rowData ?? {}, null, 2)
    const truncatedContext = contextString.slice(0, 4000)

    if (isBatch) {
      const fieldsList = fields
        .map(
          (f, idx) =>
            `${idx + 1}. fieldName: ${f.fieldName}\n   columnId: ${f.columnId}\n   description: ${f.description}`
        )
        .join("\n\n")

      const prompt = `You are researching a company to fill multiple fields for a table.

Company: ${trimmedName}
Row context (may include other columns):
${truncatedContext}

For each field below, return one best value (or null if unsure). Use concise answers (e.g., a single URL or email).
Fields:
${fieldsList}

Echo identifiers exactly:
- rowId: ${rowId}
- Use each columnId and fieldName as provided above.

Rules:
- Return JSON following the schema: { rowId, results: [{ columnId, fieldName, value, notes? }] }.
- If confident, return the best value. If unsure, return null.
- Prefer precise, single values (e.g., a URL or one email) rather than verbose text.
- For emails, provide a single best contact; for URLs, prefer the official site.`

      const result = streamObject({
        model: gateway("perplexity/sonar"),
        schema: multiResponseSchema,
        prompt,
      })

      return result.toTextStreamResponse()
    }

    const prompt = `You are researching a company to fill a single field for a table.

Company: ${trimmedName}
Field to return: ${fieldName}
User description of the field:
${description}

Row context (may include other columns):
${truncatedContext}

Echo these identifiers exactly:
- rowId: ${rowId}
- columnId: ${columnId}
- fieldName: ${fieldName}

Rules:
- Return JSON following the schema: { rowId, columnId, fieldName, value, notes? }.
- If confident, return the best value. If unsure, return null.
- Prefer precise, single values (e.g., a URL or one email) rather than verbose text.
- For emails, provide a single best contact; for URLs, prefer the official site.`

    const result = streamObject({
      model: gateway("perplexity/sonar"),
      schema: responseSchema,
      prompt,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    console.error("Data finder API error:", err)
    return new Response(JSON.stringify({ error: "Failed to query data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
    },
  })
}
