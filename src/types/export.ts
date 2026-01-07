
import { WeekData } from '@/lib/shared/types';

export interface WeekSummary {
    weekId: string;
    startDate: string;
    endDate: string;
    entryCount: number;
    fieldListCount: number;
    hasContent: boolean;
}

export type ExportFormat = 'markdown' | 'pdf';

export interface ImportPreview {
    weekData: WeekData[];
    conflicts: ConflictInfo[];
    metadata?: {
        exportDate?: string;
        weeksIncluded?: string[];
    };
}

export interface ConflictInfo {
    weekId: string;
    existingWeek: WeekData;
    importedWeek: WeekData;
    differenceCount: number;
}

export interface PDFExportOptions {
    weekIds: string[];
    templateId: string;
    includeFieldLists: boolean;
    paperSize?: 'a4' | 'letter';
}
