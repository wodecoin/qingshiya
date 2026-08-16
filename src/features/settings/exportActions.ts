import { entriesRepository } from '../../storage/entriesRepository'

type ExportFormat = 'json' | 'csv'
interface ExportRepository { export: (format: ExportFormat) => Promise<string> }

const mimeTypes: Record<ExportFormat, string> = {
  json: 'application/json;charset=utf-8',
  csv: 'text/csv;charset=utf-8',
}

export async function exportEntries(format: ExportFormat, repository: ExportRepository = entriesRepository): Promise<void> {
  const content = await repository.export(format)
  const blob = new Blob([content], { type: mimeTypes[format] })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `轻释压记录-${new Date().toISOString().slice(0, 10)}.${format}`
  link.click()
  URL.revokeObjectURL(url)
}
