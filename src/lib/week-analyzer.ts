
import { WeekData } from '@/lib/shared/types';
import { WeekSummary, ConflictInfo } from '../types/export';

export function hasWeekContent(week: WeekData): boolean {
    const hasEntries = week.days.some(day => day.entries.length > 0);
    const hasFieldLists = week.fieldLists.some(fl => fl.entries.length > 0);
    return hasEntries || hasFieldLists;
}

export function getWeekSummary(week: WeekData): WeekSummary {
    const entryCount = week.days.reduce((acc, day) => acc + day.entries.length, 0);
    const fieldListEntries = week.fieldLists.reduce((acc, fl) => acc + fl.entries.length, 0);

    return {
        weekId: week.weekId,
        startDate: week.startDate,
        endDate: week.endDate,
        entryCount: entryCount + fieldListEntries,
        fieldListCount: week.fieldLists.length,
        hasContent: hasWeekContent(week)
    };
}

export function detectConflicts(importedWeeks: WeekData[], existingWeeks: WeekData[]): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];

    for (const imported of importedWeeks) {
        const existing = existingWeeks.find(w => w.weekId === imported.weekId);
        if (existing) {
            if (hasWeekContent(existing)) {
                // Calculate a simple difference metric (logic can be enhanced)
                const diffCount = Math.abs(
                    getWeekSummary(imported).entryCount - getWeekSummary(existing).entryCount
                );

                conflicts.push({
                    weekId: imported.weekId,
                    existingWeek: existing,
                    importedWeek: imported,
                    differenceCount: diffCount
                });
            }
        }
    }

    return conflicts;
}
import { getAllWeeks } from './db';

export async function getWeeksWithContent(): Promise<WeekSummary[]> {
    const allWeeks = await getAllWeeks();
    const weeksWithContent = allWeeks.filter(hasWeekContent);
    return weeksWithContent.map(getWeekSummary).sort((a, b) => b.weekId.localeCompare(a.weekId));
}
