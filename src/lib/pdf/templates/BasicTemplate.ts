import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WeekData, Entry } from '@/lib/shared/types';
import { PDFExportOptions, PDFTemplate } from '../types';
import { addPageDecorations } from '../decorations';
import { ARABIC_DAYS_MONDAY_START, ARABIC_DAYS } from '../fonts';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

// Day of week mapping (0=Saturday based or 1=Monday based)
function getDayNames(weekStartDay: number): string[] {
    if (weekStartDay === 6) { // Saturday start
        return ARABIC_DAYS;
    }
    return ARABIC_DAYS_MONDAY_START;
}

// Create HTML content for a week (for html2canvas)
function createWeekHTML(week: WeekData): string {
    const startDate = parseISO(week.startDate);
    const endDate = parseISO(week.endDate);
    const dateRange = `${format(startDate, 'd MMMM', { locale: ar })} - ${format(endDate, 'd MMMM yyyy', { locale: ar })}`;

    const dayNames = getDayNames(6); // Default Saturday start, can be made dynamic

    let daysHTML = '';
    for (let i = 0; i < 7; i++) {
        const day = week.days[i];
        const dayDate = day ? parseISO(day.date) : null;
        const dayNum = dayDate ? format(dayDate, 'd') : '';
        const dayName = day?.dayOfWeek || dayNames[i];

        const entries = day?.entries || [];
        const entriesHTML = entries.map((e: Entry) => `
      <div class="entry">
        <span class="checkbox">${e.completed ? '☑' : '☐'}</span>
        <span class="text">${e.text}</span>
      </div>
    `).join('');

        // Add empty lines for printing
        const emptyLines = Math.max(0, 8 - entries.length);
        const emptyHTML = Array(emptyLines).fill('<div class="entry empty-line"></div>').join('');

        daysHTML += `
      <div class="day-column">
        <div class="day-header">
          <div class="day-name">${dayName}</div>
          <div class="day-num">${dayNum}</div>
        </div>
        <div class="entries">
          ${entriesHTML}
          ${emptyHTML}
        </div>
      </div>
    `;
    }

    // Field lists section
    let fieldListsHTML = '';
    if (week.fieldLists.length > 0) {
        const listsContent = week.fieldLists.map(list => `
      <div class="field-list">
        <div class="list-title">${list.title}</div>
        <div class="list-entries">
          ${list.entries.map((e: Entry) => `
            <div class="entry">
              <span class="checkbox">${e.completed ? '☑' : '☐'}</span>
              <span class="text">${e.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

        fieldListsHTML = `
      <div class="field-lists">
        <div class="section-title">ملاحظات</div>
        ${listsContent}
      </div>
    `;
    }

    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Tajawal', sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 20px;
          direction: rtl;
        }
        .container {
          width: 1100px;
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        }
        .header h1 {
          font-size: 22px;
          color: #1e293b;
          font-weight: 700;
        }
        .header .date-range {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }
        .week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }
        .day-column {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fafafa;
          min-height: 300px;
        }
        .day-header {
          background: #334155;
          color: white;
          padding: 8px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .day-name {
          font-weight: 700;
          font-size: 12px;
        }
        .day-num {
          font-size: 10px;
          opacity: 0.8;
        }
        .entries {
          padding: 8px;
        }
        .entry {
          display: flex;
          align-items: flex-start;
          gap: 4px;
          padding: 4px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 10px;
          min-height: 20px;
        }
        .checkbox {
          flex-shrink: 0;
          font-size: 11px;
        }
        .text {
          flex: 1;
          word-break: break-word;
        }
        .empty-line {
          border-bottom: 1px dashed #e2e8f0;
        }
        .field-lists {
          border-top: 2px solid #e2e8f0;
          padding-top: 16px;
        }
        .section-title {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 12px;
          color: #334155;
        }
        .field-list {
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .list-title {
          font-weight: 600;
          font-size: 12px;
          margin-bottom: 8px;
          color: #475569;
        }
        .list-entries {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        .leaf-decoration {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 60px;
          height: 60px;
          opacity: 0.15;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>مخطط الأسبوع</h1>
          <div class="date-range">${dateRange}</div>
        </div>
        <div class="week-grid">
          ${daysHTML}
        </div>
        ${fieldListsHTML}
      </div>
    </body>
    </html>
  `;
}

export class BasicTemplate implements PDFTemplate {
    async render(doc: jsPDF, week: WeekData, _options: PDFExportOptions) {
        // Create off-screen iframe
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:absolute;left:-9999px;width:1200px;height:900px;';
        document.body.appendChild(iframe);

        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) throw new Error('Could not access iframe');

            iframeDoc.open();
            iframeDoc.write(createWeekHTML(week));
            iframeDoc.close();

            // Wait for fonts and content to load
            await new Promise(resolve => setTimeout(resolve, 500));

            // Capture to canvas
            const container = iframeDoc.querySelector('.container') as HTMLElement;
            if (!container) throw new Error('Container not found');

            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            // Add decorations first
            await addPageDecorations(doc);

            // Calculate dimensions for landscape A4
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Center the image
            const x = 10;
            const y = (pageHeight - imgHeight) / 2;

            // Add the rendered content as image
            doc.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imgWidth, imgHeight);

        } finally {
            document.body.removeChild(iframe);
        }
    }
}
