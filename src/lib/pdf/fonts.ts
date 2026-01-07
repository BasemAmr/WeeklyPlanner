import jsPDF from 'jspdf';

// Arabic font note: jsPDF doesn't natively support Arabic RTL.
// For proper Arabic support, we use a workaround:
// 1. Use html2canvas to render Arabic text to an image
// 2. Embed that image in the PDF
// This is the most reliable method for complex RTL scripts.

// Arabic day names
export const ARABIC_DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
export const ARABIC_DAYS_MONDAY_START = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

export async function loadFonts(doc: jsPDF) {
    // Use Helvetica as fallback - Arabic text will be rendered via html2canvas
    doc.setFont('helvetica');
}

// Reverse text for RTL display in PDF (simple workaround)
export function reverseArabicText(text: string): string {
    // This is a simplified approach - for full Arabic support use html2canvas
    return text.split('').reverse().join('');
}

export function formatArabicText(text: string): string {
    return text;
}
