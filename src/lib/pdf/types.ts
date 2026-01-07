
import jsPDF from 'jspdf';
import { WeekData } from '@/lib/shared/types';
import { PDFExportOptions } from '../../types/export';
export type { PDFExportOptions };

export interface PDFTemplate {
    render(doc: jsPDF, week: WeekData, options: PDFExportOptions): void;
}

export interface PDFDecoration {
    type: 'blob' | 'leaf' | 'flower';
    svgPath: string;
    position: { x: number; y: number; width: number; height: number };
    opacity: number;
    rotation?: number;
}
