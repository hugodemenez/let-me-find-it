 "use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { z } from "zod"
import { csvParse } from "d3-dsv"
import { Upload, Sparkles, Loader2, Play, Square, CheckCircle2, AlertCircle, Download, PlusCircle } from "lucide-react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import Button from "@/components/franchizor/Button"

type Row = {
  id: string
  values: Record<string, string>
}

type CustomColumn = {
  id: string
  name: string
  description: string
  auto: boolean
}

type CellStatus = "idle" | "streaming" | "ready" | "error"

type CellState = {
  status: CellStatus
  error?: string
  notes?: string
}

type SavedState = {
  headers: string[]
  rows: Row[]
  companyColumn: string | null
  customColumns: CustomColumn[]
  cellStates: Record<string, Record<string, CellState>>
  fileName: string | null
  statusMessage: string | null
}

const columnHelper = createColumnHelper<Row>()

const responseSchema = z.object({
  rowId: z.string(),
  columnId: z.string(),
  fieldName: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]).nullable().optional(),
  notes: z.string().optional(),
})

const multiResponseSchema = z.object({
  rowId: z.string(),
  results: z.array(
    z.object({
      columnId: z.string(),
      fieldName: z.string(),
      value: z.union([z.string(), z.number(), z.boolean()]).nullable().optional(),
      notes: z.string().optional(),
    })
  ),
})

const responseUnionSchema = z.union([responseSchema, multiResponseSchema])

type ActiveRequest =
  | { rowId: string; columnId: string; columns?: undefined }
  | { rowId: string; columnId?: undefined; columns: string[] }
  | null

const MAX_ROWS = 200
const STORAGE_KEY = "data-finder-state"

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 9)}`

function formatValue(value: unknown) {
  if (value === null || value === undefined) return ""
  if (typeof value === "string") return value
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

export default function DataFinderPage() {
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [companyColumn, setCompanyColumn] = useState<string | null>(null)
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([])
  const [cellStates, setCellStates] = useState<Record<string, Record<string, CellState>>>({})
  const [newColumnName, setNewColumnName] = useState("")
  const [newColumnDescription, setNewColumnDescription] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [activeRequest, setActiveRequest] = useState<ActiveRequest>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const { submit, isLoading, stop, error, clear } = useObject({
    api: "/api/demo/data-finder",
    schema: responseUnionSchema,
    onFinish: (result) => {
      const payload = result.object
      if (!payload) {
        setActiveRequest(null)
        return
      }

      const fallbackRowId = activeRequest?.rowId
      const fallbackColumnId = activeRequest && "columnId" in activeRequest ? activeRequest.columnId : undefined

      if ("results" in payload && Array.isArray(payload.results)) {
        const multiPayload = payload as z.infer<typeof multiResponseSchema>
        const targetRowId =
          (multiPayload?.rowId && rows.find((r) => r.id === multiPayload.rowId)?.id) ||
          fallbackRowId ||
          multiPayload?.rowId
        if (!targetRowId) {
          setActiveRequest(null)
          return
        }

        setRows((prev) =>
          prev.map((row) => {
            if (row.id !== targetRowId) return row
            const updatedValues = { ...row.values }
            for (const res of multiPayload.results) {
              const columnId =
                (res?.columnId && customColumns.find((c) => c.id === res.columnId)?.id) || res?.columnId || ""
              if (!columnId) continue
              updatedValues[columnId] = formatValue(res?.value)
            }
            return { ...row, values: updatedValues }
          })
        )

        setCellStates((prev) => {
          const next = { ...prev }
          const rowState = { ...(next[targetRowId] || {}) }
          for (const res of multiPayload.results) {
            const columnId =
              (res?.columnId && customColumns.find((c) => c.id === res.columnId)?.id) || res?.columnId || ""
            if (!columnId) continue
            rowState[columnId] = { status: "ready", notes: res?.notes }
          }
          next[targetRowId] = rowState
          return next
        })
        setActiveRequest(null)
        return
      }

      const singlePayload = payload as z.infer<typeof responseSchema>
      const targetRowId =
        (singlePayload?.rowId && rows.find((r) => r.id === singlePayload.rowId)?.id) ||
        fallbackRowId ||
        singlePayload?.rowId
      const targetColumnId =
        (singlePayload?.columnId && customColumns.find((c) => c.id === singlePayload.columnId)?.id) ||
        fallbackColumnId ||
        singlePayload?.columnId

      if (!targetRowId || !targetColumnId) {
        setActiveRequest(null)
        return
      }

      const formattedValue = formatValue(singlePayload?.value)
      setRows((prev) =>
        prev.map((row) =>
          row.id === targetRowId
            ? { ...row, values: { ...row.values, [targetColumnId]: formattedValue } }
            : row
        )
      )
      setCellStates((prev) => ({
        ...prev,
        [targetRowId]: {
          ...(prev[targetRowId] || {}),
          [targetColumnId]: { status: "ready", notes: singlePayload?.notes },
        },
      }))
      setActiveRequest(null)
    },
  })

  const updateCellState = useCallback((rowId: string, columnId: string, next: Partial<CellState>) => {
    setCellStates((prev) => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [columnId]: { ...(prev[rowId]?.[columnId] || { status: "idle" }), ...next },
      },
    }))
  }, [])

  const updateCellValue = useCallback((rowId: string, columnId: string, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, values: { ...row.values, [columnId]: value } } : row
      )
    )
  }, [])

  const triggerEnrichment = useCallback(
    (rowId: string, columnId: string) => {
      if (isLoading) return
      const column = customColumns.find((c) => c.id === columnId)
      const row = rows.find((r) => r.id === rowId)
      if (!column || !row) return

      if (!companyColumn) {
        setStatusMessage("Select the company name column first.")
        return
      }

      const companyName = (row.values[companyColumn] || "").trim()
      if (!companyName) {
        updateCellState(rowId, columnId, { status: "error", error: "Missing company name" })
        return
      }

      if (!column.description.trim()) {
        updateCellState(rowId, columnId, { status: "error", error: "Add a description for this column" })
        return
      }

      setActiveRequest({ rowId, columnId })
      updateCellState(rowId, columnId, { status: "streaming", error: undefined, notes: undefined })

      submit({
        rowId,
        columnId,
        fieldName: column.name,
        description: column.description,
        companyName,
        rowData: row.values,
      })
    },
    [companyColumn, customColumns, isLoading, rows, submit, updateCellState]
  )

  const triggerEnrichmentAll = useCallback(
    (rowId: string) => {
      if (isLoading) return
      const row = rows.find((r) => r.id === rowId)
      if (!row) return

      if (!companyColumn) {
        setStatusMessage("Select the company name column first.")
        return
      }

      const companyName = (row.values[companyColumn] || "").trim()
      if (!companyName) {
        setStatusMessage("Missing company name in this row.")
        return
      }

      const targets = customColumns.filter((c) => c.description.trim())
      if (targets.length === 0) {
        setStatusMessage("Add descriptions to custom columns before running all.")
        return
      }

      setActiveRequest({ rowId, columns: targets.map((c) => c.id) })
      // mark all targeted columns as streaming
      setCellStates((prev) => {
        const next = { ...prev }
        const rowState = { ...(next[rowId] || {}) }
        for (const col of targets) {
          rowState[col.id] = { status: "streaming", error: undefined, notes: undefined }
        }
        next[rowId] = rowState
        return next
      })

      submit({
        rowId,
        companyName,
        rowData: row.values,
        columns: targets.map((c) => ({
          columnId: c.id,
          fieldName: c.name,
          description: c.description,
        })),
      })
    },
    [companyColumn, customColumns, isLoading, rows, submit]
  )

  const exportColumnValues = useCallback(
    (columnId: string, filename: string) => {
      if (rows.length === 0) return
      const lines = rows.map((row) => (row.values[columnId] ?? "").toString())
      const blob = new Blob([lines.join("\n")], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${filename || "column"}.txt`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    },
    [rows]
  )

  const columns = useMemo<ColumnDef<Row, any>[]>(() => {
    const baseColumns: ColumnDef<Row, any>[] = [
      columnHelper.display({
        id: "index",
        size: 56,
        minSize: 48,
        maxSize: 72,
        header: () => <span className="text-xs text-stone-500">#</span>,
        cell: (info) => <span className="text-stone-400 font-mono">{info.row.index + 1}</span>,
      }),
      ...headers.map((key) =>
        columnHelper.accessor((row) => row.values[key] ?? "", {
          id: key,
          size: 180,
          minSize: 140,
          maxSize: 260,
          header: () => (
            <button
              type="button"
              onClick={() => setCompanyColumn(key)}
              className={`flex items-center gap-2 text-left text-sm font-semibold ${companyColumn === key ? "text-indigo-600" : "text-stone-700"}`}
            >
              <span className="truncate">{key}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  companyColumn === key ? "bg-indigo-100 text-indigo-800" : "bg-stone-100 text-stone-500"
                }`}
              >
                {companyColumn === key ? "company" : "pick"}
              </span>
            </button>
          ),
          cell: (info) => <span className="text-sm text-stone-700 truncate">{info.getValue()}</span>,
        })
      ),
      ...customColumns.map((col) =>
        columnHelper.display({
          id: col.id,
          size: 220,
          minSize: 180,
          maxSize: 320,
          header: () => (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                <span className="truncate">{col.name}</span>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                  custom
                </span>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-2">{col.description}</p>
              <label className="flex items-center gap-2 text-[11px] text-stone-500">
                <input
                  type="checkbox"
                  checked={col.auto}
                  onChange={(e) => toggleAuto(col.id, e.target.checked)}
                  className="h-3 w-3 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Auto</span>
                <button
                  type="button"
                  className="ml-auto inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                  onClick={() => exportColumnValues(col.id, col.name)}
                  title={`Export ${col.name}`}
                >
                  <Download size={14} />
                  <span className="text-[11px]">Export</span>
                </button>
              </label>
            </div>
          ),
          cell: (info) => {
            const row = info.row.original
            const value = row.values[col.id] ?? ""
            const state = cellStates[row.id]?.[col.id]
            const isStreaming = state?.status === "streaming"
            const isReady = state?.status === "ready"
            const isError = state?.status === "error"

            return (
              <div className="flex flex-col gap-1">
                <input
                  value={value}
                  onChange={(e) => updateCellValue(row.id, col.id, e.target.value)}
                  placeholder="Pending"
                  className="h-9 w-full rounded-lg border border-stone-200 px-3 text-sm text-stone-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  {isStreaming && <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />}
                  {isReady && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                  {isError && <AlertCircle className="h-3 w-3 text-red-500" />}
                  <span className="capitalize">{state?.status ?? "idle"}</span>
                  {state?.error ? <span className="text-red-500">{state.error}</span> : null}
                  {state?.notes ? (
                    <span className="max-w-[180px] truncate" title={state.notes}>
                      {state.notes}
                    </span>
                  ) : null}
                </div>
              </div>
            )
          },
        })
      ),
    ]

    // Actions column
    if (customColumns.length > 0) {
      baseColumns.push(
        columnHelper.display({
          id: "actions",
          size: 220,
          minSize: 180,
          maxSize: 260,
          header: () => <span className="text-sm font-semibold text-stone-800">Actions</span>,
          cell: (info) => {
            const row = info.row.original
            return (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerEnrichmentAll(row.id)}
                  disabled={!companyColumn || isLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  Run all
                </button>
                {customColumns.map((col) => {
                  const state = cellStates[row.id]?.[col.id]
                  const isActive = activeRequest?.rowId === row.id && activeRequest?.columnId === col.id
                  return (
                    <button
                      key={`${row.id}-${col.id}`}
                      type="button"
                      onClick={() => triggerEnrichment(row.id, col.id)}
                      disabled={isLoading && !isActive}
                      className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-indigo-200 hover:text-indigo-700 disabled:opacity-50"
                    >
                      {state?.status === "streaming" ? (
                        <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                      {col.name}
                    </button>
                  )
                })}
              </div>
            )
          },
        })
      )
    }

    return baseColumns
  }, [activeRequest, cellStates, companyColumn, customColumns, exportColumnValues, isLoading, triggerEnrichment, triggerEnrichmentAll, updateCellValue])

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 140,
      size: 200,
      maxSize: 340,
    },
    columnResizeMode: "onChange",
  })

  const resetCellStates = useCallback(
    (nextRows: Row[], nextCustomColumns: CustomColumn[]) => {
      const nextState: Record<string, Record<string, CellState>> = {}
      for (const row of nextRows) {
        nextState[row.id] = {}
        for (const col of nextCustomColumns) {
          nextState[row.id][col.id] = { status: "idle" }
        }
      }
      setCellStates(nextState)
    },
    []
  )

  // Load persisted state on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed: SavedState = JSON.parse(raw)
      setHeaders(parsed.headers || [])
      setRows(parsed.rows || [])
      setCompanyColumn(parsed.companyColumn || null)
      setCustomColumns(parsed.customColumns || [])
      setCellStates(parsed.cellStates || {})
      setFileName(parsed.fileName || null)
      setStatusMessage(parsed.statusMessage || null)
    } catch (err) {
      console.warn("Failed to load saved state", err)
    }
  }, [])

  // Persist state on change
  useEffect(() => {
    if (typeof window === "undefined") return
    const payload: SavedState = {
      headers,
      rows,
      companyColumn,
      customColumns,
      cellStates,
      fileName,
      statusMessage,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (err) {
      console.warn("Failed to persist state", err)
    }
  }, [cellStates, companyColumn, customColumns, fileName, headers, rows, statusMessage])

  const handleFileChange = async (file?: File | null) => {
    if (!file) return
    const text = await file.text()
    const parsed = csvParse(text.trim())
    const parsedHeaders = parsed.columns ?? []

    const limitedRows = parsed.slice(0, MAX_ROWS).map((row, idx) => {
      const values: Record<string, string> = {}
      for (const header of parsedHeaders) {
        values[header] = formatValue(row[header])
      }
      for (const col of customColumns) {
        values[col.id] = ""
      }
      return { id: `row-${idx}`, values }
    })

    setFileName(file.name)
    setHeaders(parsedHeaders)
    setRows(limitedRows)
    setStatusMessage(parsed.length > MAX_ROWS ? `Showing first ${MAX_ROWS} rows` : null)
    resetCellStates(limitedRows, customColumns)
    clear()
    setActiveRequest(null)
  }

  const addCustomColumn = () => {
    const name = newColumnName.trim()
    const description = newColumnDescription.trim()
    if (!name) {
      setStatusMessage("Column name is required")
      return
    }
    if (!description) {
      setStatusMessage("Column description is required")
      return
    }

    const id = makeId()
    const newCol: CustomColumn = { id, name, description, auto: false }
    setCustomColumns((prev) => [...prev, newCol])
    setRows((prev) =>
      prev.map((row) => ({ ...row, values: { ...row.values, [id]: "" } }))
    )
    setCellStates((prev) => {
      const next = { ...prev }
      for (const row of rows) {
        next[row.id] = { ...(next[row.id] || {}), [id]: { status: "idle" } }
      }
      return next
    })
    setNewColumnName("")
    setNewColumnDescription("")
    setIsAddingColumn(false)
    setStatusMessage(null)
  }

  useEffect(() => {
    if (error && activeRequest) {
      const message = error instanceof Error ? error.message : "Failed to fetch data"
      if ("columns" in activeRequest && activeRequest.columns) {
        activeRequest.columns.forEach((colId) => {
          updateCellState(activeRequest.rowId, colId, {
            status: "error",
            error: message,
          })
        })
      } else if ("columnId" in activeRequest && activeRequest.columnId) {
        updateCellState(activeRequest.rowId, activeRequest.columnId, {
          status: "error",
          error: message,
        })
      }
      setActiveRequest(null)
    }
  }, [activeRequest, error, updateCellState])

  const stopProcessing = () => {
    stop()
    if (activeRequest) {
      if ("columns" in activeRequest && activeRequest.columns) {
        activeRequest.columns.forEach((colId) => {
          updateCellState(activeRequest.rowId, colId, { status: "idle", error: "Stopped" })
        })
      } else if ("columnId" in activeRequest && activeRequest.columnId) {
        updateCellState(activeRequest.rowId, activeRequest.columnId, { status: "idle", error: "Stopped" })
      }
      setActiveRequest(null)
    }
  }

  const toggleAuto = (columnId: string, next: boolean) => {
    setCustomColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, auto: next } : col)))
  }

  useEffect(() => {
    const autoColumn = customColumns.find((col) => col.auto)
    if (!autoColumn) return
    if (!companyColumn) return
    if (isLoading || activeRequest) return

    const nextRow = rows.find((row) => {
      const state = cellStates[row.id]?.[autoColumn.id]?.status || "idle"
      const currentValue = row.values[autoColumn.id]
      return state !== "streaming" && (!currentValue || state === "error")
    })

    if (nextRow) {
      triggerEnrichment(nextRow.id, autoColumn.id)
    }
  }, [activeRequest, cellStates, companyColumn, customColumns, isLoading, rows, triggerEnrichment])

  return (
    <div className="min-h-screen bg-cream text-stone-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-600">Workbench</p>
              <h1 className="text-3xl font-bold text-stone-900">Data Finder</h1>
              <p className="max-w-3xl text-sm text-stone-600">
                Upload a CSV of companies, mark the company column, then define custom columns to auto-fill (website, CEO email, industry, etc.)
                using your data + AI.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles size={14} /> AI-powered
            </span>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
              <Upload size={16} className="text-indigo-600" />
              Upload CSV (first {MAX_ROWS} rows shown)
            </div>
            <label className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 shadow-sm">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="w-full text-sm text-stone-700 file:mr-3 file:rounded-md file:border-none file:bg-indigo-600 file:px-3 file:py-1.5 file:text-white file:hover:bg-indigo-700 focus:outline-none"
              />
              {fileName ? (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{fileName}</span>
              ) : null}
            </label>
            {statusMessage ? <p className="text-sm text-stone-600">{statusMessage}</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white shadow-md">
          <div className="flex flex-col gap-2 border-b border-stone-200 px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-stone-900">Table</p>
                <p className="text-sm text-stone-600">Click a header to mark the company column. Add a custom column to describe what to fetch.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Auto column runs as you scroll
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-4">
              {isAddingColumn ? (
                <div className="grid gap-3 md:grid-cols-[1fr,2fr,auto] md:items-end">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Column title</label>
                    <input
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      className="h-10 w-full rounded-lg border border-stone-200 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="e.g. Industry"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Description</label>
                    <textarea
                      value={newColumnDescription}
                      onChange={(e) => setNewColumnDescription(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="What should AI fetch?"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" className="w-full md:w-auto" onClick={addCustomColumn}>
                      Add column
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full md:w-auto border border-stone-200 text-stone-700 hover:text-stone-900"
                      onClick={() => {
                        setIsAddingColumn(false)
                        setNewColumnName("")
                        setNewColumnDescription("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" className="border-dashed border-stone-300 text-stone-700" onClick={() => setIsAddingColumn(true)}>
                    <PlusCircle size={16} className="mr-2 text-indigo-600" />
                    Add custom column
                  </Button>
                  <p className="text-sm text-stone-600">Name and describe the enrichment you want to fill.</p>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto px-4 py-4">
            {headers.length === 0 || rows.length === 0 ? (
              <div className="rounded-lg border border-dashed border-stone-200 bg-stone-50 p-6 text-sm text-stone-600">
                Upload a CSV to preview rows and configure columns.
              </div>
            ) : (
              <table className="min-w-[680px] w-full table-fixed text-sm text-stone-800">
                <colgroup>
                  {table.getHeaderGroups()[0]?.headers.map((header) => (
                    <col key={header.id} style={{ width: `${header.getSize()}px` }} />
                  ))}
                </colgroup>
                <thead className="bg-stone-50 text-[12px] font-semibold text-stone-600 border-b border-stone-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="p-3 border-r border-stone-200 last:border-r-0 align-middle">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-stone-50/50"} border-b border-stone-100`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-3 border-r border-stone-100 last:border-r-0 align-top">
                          <div className="truncate">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                  {[...Array(3)].map((_, i) => (
                    <tr key={`empty-${i}`} className="bg-white opacity-50 border-b border-stone-100">
                      {table.getAllColumns().map((col) => (
                        <td key={`${col.id}-${i}`} className="p-3 border-r border-stone-100 last:border-r-0">
                          &nbsp;
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <input type="checkbox" checked={Boolean(customColumns.find((c) => c.auto))} readOnly className="h-4 w-4 rounded border-stone-300" />
              <span>Auto runs per custom column (toggle in header)</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="border-stone-300 text-stone-700"
                onClick={stopProcessing}
                disabled={!activeRequest}
              >
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (companyColumn && customColumns.length > 0) {
                    const firstCustom = customColumns[0]
                    const firstRow = rows[0]
                    if (firstRow) triggerEnrichment(firstRow.id, firstCustom.id)
                  }
                }}
                disabled={!companyColumn || customColumns.length === 0 || rows.length === 0}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Run first row
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
