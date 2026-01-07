import { WeekData, Entry } from './types';
import { generateId } from './data-model';
import { getWeekId, getWeekStart, getWeekEnd, formatDate, getWeekDays } from './date-utils';

/**
 * Parse markdown content into WeekData structure
 */
export function parseMarkdown(content: string): WeekData | null {
    try {
        const lines = content.split('\n');
        let weekData: Partial<WeekData> = {
            days: [],
            fieldLists: [],
            metadata: {
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            }
        };

        let currentDay: any = null;
        let currentFieldList: any = null;
        let isWeekLevelSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Parse week header: # Week of January 5-11, 2026
            if (line.startsWith('# Week of ')) {
                // Extract dates from header (we'll calculate weekId from first day)
                continue;
            }

            // Parse day header: ## Monday, January 5
            if (line.startsWith('## ') && !line.includes('Week-Level')) {
                const dayMatch = line.match(/## (\w+),\s+(\w+)\s+(\d+)(?:,\s+(\d+))?/);
                if (dayMatch) {
                    // Save previous day if exists
                    if (currentDay) {
                        weekData.days!.push(currentDay);
                    }

                    const [, dayName] = dayMatch;
                    // We'll need to construct the full date - for now use a simple approach
                    currentDay = {
                        dayOfWeek: dayName,
                        date: '', // Will be set later
                        entries: []
                    };
                    currentFieldList = null;
                    isWeekLevelSection = false;
                }
                continue;
            }

            // Parse week-level section header
            if (line.startsWith('## Week-Level')) {
                if (currentDay) {
                    weekData.days!.push(currentDay);
                    currentDay = null;
                }
                isWeekLevelSection = true;
                currentFieldList = null;
                continue;
            }

            // Parse field list header: ### Shopping or ### Daily Entries
            if (line.startsWith('### ')) {
                const title = line.substring(4).trim();

                if (title === 'Daily Entries') {
                    // This is the main entries section for the day
                    currentFieldList = null;
                } else {
                    // This is a custom field list
                    if (currentFieldList) {
                        // Save previous field list
                        if (isWeekLevelSection) {
                            weekData.fieldLists!.push({ ...currentFieldList, relatedDay: null });
                        } else if (currentDay) {
                            weekData.fieldLists!.push({ ...currentFieldList, relatedDay: currentDay.date });
                        }
                    }

                    currentFieldList = {
                        id: generateId(),
                        title,
                        entries: []
                    };
                }
                continue;
            }

            // Parse entry: - [ ] Task or - [x] Task
            const entryMatch = line.match(/^-\s+\[([ x])\]\s+(.+)$/);
            if (entryMatch) {
                const [, checked, text] = entryMatch;
                const entry: Entry = {
                    id: generateId(),
                    text: text.trim(),
                    completed: checked === 'x'
                };

                if (currentFieldList) {
                    currentFieldList.entries.push(entry);
                } else if (currentDay) {
                    currentDay.entries.push(entry);
                }
            }
        }

        // Save last day and field list
        if (currentDay) {
            weekData.days!.push(currentDay);
        }
        if (currentFieldList) {
            if (isWeekLevelSection) {
                weekData.fieldLists!.push({ ...currentFieldList, relatedDay: null });
            } else if (currentDay) {
                weekData.fieldLists!.push({ ...currentFieldList, relatedDay: currentDay.date });
            }
        }

        // Calculate weekId and dates from first day if we have days
        if (weekData.days && weekData.days.length > 0) {
            // For now, we'll need the user to provide proper dates
            // This is a simplified parser - in production you'd want better date parsing
            return null; // Incomplete - needs date resolution
        }

        return null; // Needs more work for full implementation
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return null;
    }
}


/**
 * Extract metadata from markdown content
 */
export function extractMetadata(content: string): any | null {
    const match = content.match(/<!-- METADATA: (.+) -->/);
    if (match) {
        try {
            return JSON.parse(match[1]);
        } catch (e) {
            console.error('Error parsing metadata:', e);
            return null;
        }
    }
    return null;
}

/**
 * Parse markdown content with metadata support (multi-week capable)
 */
export function parseMarkdownWithMetadata(content: string): { weekData: WeekData[], metadata: any | null } {
    const metadata = extractMetadata(content);
    const weeks: WeekData[] = [];

    // Normalize line endings
    const normalizedContent = content.replace(/\r\n/g, '\n');

    // Check if this is a multi-week file
    if (metadata?.multiWeek && metadata?.weeks) {
        // Split by "# Week of" header (more reliable than ---)
        // Match: # Week of ... at the start of a line
        const weekHeaderRegex = /(?=^# Week of )/gm;
        const weekSections = normalizedContent
            .split(weekHeaderRegex)
            .map(s => s.trim())
            .filter(s => s && s.startsWith('# Week of'));

        console.log('Multi-week import: found', weekSections.length, 'sections for', metadata.weeks.length, 'weeks');

        for (let i = 0; i < weekSections.length && i < metadata.weeks.length; i++) {
            const sectionMeta = metadata.weeks[i];
            const parsedWeek = parseMarkdownSimple(weekSections[i], sectionMeta);
            if (parsedWeek) {
                weeks.push(parsedWeek);
            }
        }
    } else {
        // Single week format (legacy or single export)
        const parsedWeek = parseMarkdownSimple(normalizedContent, metadata);
        if (parsedWeek) {
            weeks.push(parsedWeek);
        }
    }

    return {
        weekData: weeks,
        metadata
    };
}

/**
 * Simplified markdown parser that works with our exact format
 */
export function parseMarkdownSimple(content: string, metadata?: any): WeekData | null {
    try {
        const lines = content.split('\n');

        // Determine week info from metadata or default to current week
        let weekId, weekStart, weekEnd, weekDays;

        if (metadata && metadata.weekId) {
            weekId = metadata.weekId;
            // specific dates from metadata or calculate from weekId if needed?
            // Metadata includes startDate/endDate so use them
            weekStart = new Date(metadata.startDate);
            weekEnd = new Date(metadata.endDate);
            // We need to regenerate weekDays based on start date
            weekDays = [];
            const current = new Date(weekStart);
            for (let i = 0; i < 7; i++) {
                weekDays.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
        } else {
            // Fallback to current week (Legacy behavior)
            const now = new Date();
            weekId = getWeekId(now);
            weekStart = getWeekStart(now);
            weekEnd = getWeekEnd(now);
            weekDays = getWeekDays(now);
        }

        const result: any = {
            weekId,
            startDate: formatDate(weekStart),
            endDate: formatDate(weekEnd),
            days: weekDays.map((day, index) => ({
                date: formatDate(day),
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index],
                entries: []
            })),
            fieldLists: [],
            metadata: {
                createdAt: metadata?.exportDate || new Date().toISOString(),
                lastModified: new Date().toISOString()
            }
        };

        let currentSection: 'day' | 'week-level' | null = null;
        let currentDayIndex = -1;
        let currentFieldList: any = null;
        let inDailyEntries = false;

        for (const line of lines) {
            const trimmed = line.trim();

            // Skip empty lines and week header
            if (!trimmed || trimmed.startsWith('# Week of')) continue;
            if (trimmed.startsWith('<!-- METADATA')) continue;

            // Day header: ## Monday, January 5
            if (trimmed.startsWith('## ') && !trimmed.includes('Week-Level')) {
                currentSection = 'day';
                currentDayIndex++;
                // Security check for index bounds
                if (currentDayIndex >= 7) currentDayIndex = 6;

                currentFieldList = null;
                inDailyEntries = false;
                continue;
            }

            // Week-level section
            if (trimmed.startsWith('## Week-Level')) {
                currentSection = 'week-level';
                currentDayIndex = -1;
                currentFieldList = null;
                continue;
            }

            // Field list header: ### Title
            if (trimmed.startsWith('### ')) {
                const title = trimmed.substring(4);

                if (title === 'Daily Entries') {
                    inDailyEntries = true;
                    currentFieldList = null;
                } else {
                    inDailyEntries = false;
                    currentFieldList = {
                        id: generateId(),
                        title,
                        entries: [],
                        relatedDay: currentSection === 'day' && currentDayIndex >= 0 && currentDayIndex < result.days.length
                            ? result.days[currentDayIndex].date
                            : null
                    };
                    result.fieldLists.push(currentFieldList);
                }
                continue;
            }

            // Entry: - [ ] or - [x]
            const entryMatch = trimmed.match(/^-\s+\[([ x])\]\s+(.+)$/);
            if (entryMatch) {
                const entry: Entry = {
                    id: generateId(),
                    text: entryMatch[2],
                    completed: entryMatch[1] === 'x'
                };

                if (inDailyEntries && currentDayIndex >= 0 && currentDayIndex < result.days.length) {
                    result.days[currentDayIndex].entries.push(entry);
                } else if (currentFieldList) {
                    currentFieldList.entries.push(entry);
                }
            }
        }

        return result as WeekData;
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return null;
    }
}

