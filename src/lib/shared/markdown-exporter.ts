import { WeekData } from './types';
import { parseDate, formatWeekRange } from './date-utils';

/**
 * Export WeekData to markdown format
 */
export function exportToMarkdown(weekData: WeekData): string {
    const startDate = parseDate(weekData.startDate);
    const endDate = parseDate(weekData.endDate);
    const weekRange = formatWeekRange(startDate, endDate);

    let markdown = `# Week of ${weekRange}\n\n`;

    // Export each day
    for (const day of weekData.days) {
        const date = parseDate(day.date);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[date.getMonth()];
        const dayNum = date.getDate();

        markdown += `## ${day.dayOfWeek}, ${monthName} ${dayNum}\n\n`;

        // Daily entries
        if (day.entries.length > 0) {
            markdown += `### Daily Entries\n`;
            for (const entry of day.entries) {
                const checkbox = entry.completed ? '[x]' : '[ ]';
                markdown += `- ${checkbox} ${entry.text}\n`;
            }
            markdown += '\n';
        }

        // Day-specific field lists
        const dayFieldLists = weekData.fieldLists.filter(
            list => list.relatedDay === day.date
        );

        for (const fieldList of dayFieldLists) {
            markdown += `### ${fieldList.title}\n`;
            for (const entry of fieldList.entries) {
                const checkbox = entry.completed ? '[x]' : '[ ]';
                markdown += `- ${checkbox} ${entry.text}\n`;
            }
            markdown += '\n';
        }
    }

    // Week-level field lists
    const weekFieldLists = weekData.fieldLists.filter(
        list => list.relatedDay === null
    );

    if (weekFieldLists.length > 0) {
        markdown += `## Week-Level Field Lists\n\n`;

        for (const fieldList of weekFieldLists) {
            markdown += `### ${fieldList.title}\n`;
            for (const entry of fieldList.entries) {
                const checkbox = entry.completed ? '[x]' : '[ ]';
                markdown += `- ${checkbox} ${entry.text}\n`;
            }
            markdown += '\n';
        }
    }

    return markdown;
}

/**
 * Append metadata to markdown content
 */
export function addMetadata(markdown: string, weekData: WeekData): string {
    const metadata = {
        weekId: weekData.weekId,
        startDate: weekData.startDate,
        endDate: weekData.endDate,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    return markdown + `\n<!-- METADATA: ${JSON.stringify(metadata)} -->`;
}

/**
 * Export WeekData to markdown format with metadata
 */
export function exportToMarkdownWithMetadata(weekData: WeekData): string {
    const markdown = exportToMarkdown(weekData);
    return addMetadata(markdown, weekData);
}


/**
 * Create a filename for the markdown export
 */
export function getMarkdownFilename(weekData: WeekData): string {
    return `week-${weekData.weekId}.md`;
}

/**
 * Export multiple weeks to a single markdown file with merged metadata
 */
export function exportMultipleWeeksToMarkdown(weeks: WeekData[]): string {
    if (weeks.length === 0) return '';

    // Sort weeks chronologically
    const sortedWeeks = [...weeks].sort((a, b) => a.weekId.localeCompare(b.weekId));

    // Export each week and join with separator
    const weekContents = sortedWeeks.map(week => exportToMarkdown(week));
    let markdown = weekContents.join('\n---\n\n');

    // Add merged metadata for all weeks
    const metadata = {
        weeks: sortedWeeks.map(w => ({
            weekId: w.weekId,
            startDate: w.startDate,
            endDate: w.endDate
        })),
        exportDate: new Date().toISOString(),
        version: '1.0',
        multiWeek: true
    };

    return markdown + `\n\n<!-- METADATA: ${JSON.stringify(metadata)} -->`;
}

/**
 * Get filename for multi-week export
 */
export function getMultiWeekFilename(weeks: WeekData[]): string {
    if (weeks.length === 0) return 'weeks-export.md';
    if (weeks.length === 1) return `week-${weeks[0].weekId}.md`;

    const sorted = [...weeks].sort((a, b) => a.startDate.localeCompare(b.startDate));
    const first = sorted[0].startDate;
    const last = sorted[sorted.length - 1].weekId;
    return `weeks-${first}-to-${last}.md`;
}
