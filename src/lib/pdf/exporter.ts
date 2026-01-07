
import { getAllWeeks } from '../db'; // Correct path to db
import { PDFExportOptions } from '../../types/export';
import { generateMultiWeekPDF } from './generator';

export async function exportWeeksToPDF(weekIds: string[], options: PDFExportOptions): Promise<void> {
    // Fetch full data
    const allWeeks = await getAllWeeks();
    const selectedWeeks = allWeeks
        .filter(w => weekIds.includes(w.weekId))
        // Sort chronologically
        .sort((a, b) => a.weekId.localeCompare(b.weekId));

    if (selectedWeeks.length === 0) {
        throw new Error('No weeks selected or found');
    }

    const doc = await generateMultiWeekPDF(selectedWeeks, options);

    // Filename logic
    let filename = 'week-export.pdf';
    if (selectedWeeks.length === 1) {
        filename = `week-${selectedWeeks[0].weekId}.pdf`;
    } else {
        const first = selectedWeeks[0].weekId;
        const last = selectedWeeks[selectedWeeks.length - 1].weekId;
        filename = `weeks-${first}-to-${last}.pdf`;
    }

    doc.save(filename);
}
