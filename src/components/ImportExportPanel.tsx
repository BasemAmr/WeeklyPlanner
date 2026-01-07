
import React, { useState, useRef } from 'react'
import { Download, Upload, FileText, File } from 'lucide-react'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import { WeekData } from '@/types'
import { parseMarkdownWithMetadata } from '@/lib/shared/markdown-parser'
import { getAllWeeks, saveWeek } from '@/lib/db'
import { WeekSelectionModal } from './WeekSelectionModal'
import { ImportPreviewModal } from './ImportPreviewModal'
import { getWeeksWithContent, detectConflicts } from '@/lib/week-analyzer'
import { mergeWeekData } from '@/lib/merge-strategy'
import { WeekSummary, ImportPreview, ExportFormat } from '@/types/export'
import { exportWeeksToPDF } from '@/lib/pdf/exporter'

interface ImportExportPanelProps {
    currentWeek: WeekData
    onImportComplete: () => void
}

export function ImportExportPanel({ currentWeek, onImportComplete }: ImportExportPanelProps) {
    // @ts-ignore
    const _keep = currentWeek; // Suppress unused warning
    const [isOpen, setIsOpen] = useState(false)
    const [showWeekSelection, setShowWeekSelection] = useState(false)
    const [showImportPreview, setShowImportPreview] = useState(false)
    const [exportFormat, setExportFormat] = useState<ExportFormat>('markdown')
    const [availableWeeks, setAvailableWeeks] = useState<WeekSummary[]>([])
    const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExportClick = async (format: ExportFormat) => {
        setExportFormat(format)
        try {
            const weeks = await getWeeksWithContent()
            setAvailableWeeks(weeks)
            setIsOpen(false) // Close main dialog
            setShowWeekSelection(true)
        } catch (e) {
            console.error('Failed to load weeks', e)
            alert('فشل تحميل الأسابيع')
        }
    }

    const handleWeekSelectionConfirm = async (selectedWeekIds: string[]) => {
        try {
            // Fetch full data for selected weeks
            const allWeeks = await getAllWeeks()
            const selectedWeeksData = allWeeks.filter(w => selectedWeekIds.includes(w.weekId))

            if (exportFormat === 'markdown') {
                // Export all selected weeks in ONE file
                const { exportMultipleWeeksToMarkdown, getMultiWeekFilename } = await import('@/lib/shared/markdown-exporter')
                const markdown = exportMultipleWeeksToMarkdown(selectedWeeksData)
                const filename = getMultiWeekFilename(selectedWeeksData)
                downloadFile(markdown, filename, 'text/markdown')
            } else {
                // PDF Export
                await exportWeeksToPDF(selectedWeekIds, {
                    weekIds: selectedWeekIds,
                    templateId: 'basic',
                    includeFieldLists: true
                })
            }
            setShowWeekSelection(false)
        } catch (e) {
            console.error('Export failed', e)
            alert('فشل التصدير')
        }
    }

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 100)
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const content = await file.text()

            if (file.name.endsWith('.md')) {
                const { weekData, metadata } = parseMarkdownWithMetadata(content)

                if (weekData.length > 0) {
                    // Check for conflicts
                    const existingWeeks = await getAllWeeks()
                    const conflicts = detectConflicts(weekData, existingWeeks)

                    setImportPreview({
                        weekData,
                        conflicts,
                        metadata
                    })
                    setIsOpen(false)
                    setShowImportPreview(true)
                } else {
                    alert('لم يتم العثور على بيانات أسبوع صالحة')
                }
            } else {
                alert('الرجاء اختيار ملف ماركداون (.md)')
            }
        } catch (error) {
            console.error('Import error', error)
            alert('حدث خطأ أثناء الاستيراد')
        }

        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleImportConfirm = async () => {
        if (!importPreview) return

        try {
            const existingWeeks = await getAllWeeks()

            for (const importedWeek of importPreview.weekData) {
                const existing = existingWeeks.find(w => w.weekId === importedWeek.weekId)
                if (existing) {
                    const merged = mergeWeekData(existing, importedWeek)
                    await saveWeek(merged)
                } else {
                    await saveWeek(importedWeek)
                }
            }

            onImportComplete()
            setShowImportPreview(false)
            alert('تم الاستيراد بنجاح')
        } catch (e) {
            console.error('Merge failed', e)
            alert('فشل دمج البيانات')
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="استيراد/تصدير">
                        <Download className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>تصدير واستيراد</DialogTitle>
                        <DialogDescription>
                            تصدير بتنسيقات متعددة أو استيراد بيانات
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="flex flex-col gap-2 h-auto py-4 hover:bg-neutral-50"
                                onClick={() => handleExportClick('markdown')}
                            >
                                <FileText className="h-6 w-6 text-neutral-600" />
                                <span className="text-xs">MARKDOWN</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="flex flex-col gap-2 h-auto py-4 hover:bg-neutral-50"
                                onClick={() => handleExportClick('pdf')}
                            >
                                <File className="h-6 w-6 text-neutral-600" />
                                <span className="text-xs">PDF طباعة</span>
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">أو</span>
                            </div>
                        </div>

                        <Button
                            className="w-full gap-2"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="h-4 w-4" />
                            استيراد ملف (.md)
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".md"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <WeekSelectionModal
                open={showWeekSelection}
                onClose={() => setShowWeekSelection(false)}
                onConfirm={handleWeekSelectionConfirm}
                weeks={availableWeeks}
                exportFormat={exportFormat}
            />

            <ImportPreviewModal
                open={showImportPreview}
                onClose={() => setShowImportPreview(false)}
                onConfirm={handleImportConfirm}
                preview={importPreview}
            />
        </>
    )
}
