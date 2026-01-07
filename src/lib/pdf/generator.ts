import jsPDF from 'jspdf';
import { WeekData } from '@/lib/shared/types';
import { PDFExportOptions, PDFTemplate } from './types';
import { BasicTemplate } from './templates/BasicTemplate';

// Template Registry
const templates: Record<string, PDFTemplate> = {
    'basic': new BasicTemplate(),
};

export async function generateWeekPDF(weekData: WeekData, options: PDFExportOptions): Promise<jsPDF> {
    // Use landscape for 7-column grid
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: options.paperSize || 'a4',
    });

    const template = templates[options.templateId] || templates['basic'];
    await template.render(doc, weekData, options);

    return doc;
}

export async function generateMultiWeekPDF(weeks: WeekData[], options: PDFExportOptions): Promise<jsPDF> {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: options.paperSize || 'a4',
    });

    const template = templates[options.templateId] || templates['basic'];

    for (let i = 0; i < weeks.length; i++) {
        if (i > 0) doc.addPage();
        await template.render(doc, weeks[i], options);
    }

    return doc;
}
