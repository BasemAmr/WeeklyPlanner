
import { WeekData, Entry } from '@/lib/shared/types';

// Helper to merge entries deduplicating by text
function mergeEntries(existing: Entry[], imported: Entry[]): Entry[] {
    const merged = [...existing];

    for (const impEntry of imported) {
        const isDuplicate = existing.some(ext =>
            ext.text.trim().toLowerCase() === impEntry.text.trim().toLowerCase()
        );

        if (!isDuplicate) {
            // Regenerate ID to avoid collision if needed, but for now assuming potential ID clashes are managed or purely text-based
            // Better to give new ID if it's new
            merged.push({ ...impEntry, id: `merged-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
        }
    }

    return merged;
}

export function mergeWeekData(existing: WeekData, imported: WeekData): WeekData {
    // Merge Days
    const mergedDays = existing.days.map(day => {
        const importedDay = imported.days.find(d => d.date === day.date);
        if (importedDay) {
            return {
                ...day,
                entries: mergeEntries(day.entries, importedDay.entries)
            };
        }
        return day;
    });

    // Merge Field Lists
    const mergedFieldLists = [...existing.fieldLists];

    for (const impList of imported.fieldLists) {
        const existingListIndex = mergedFieldLists.findIndex(fl =>
            fl.title.trim().toLowerCase() === impList.title.trim().toLowerCase()
        );

        if (existingListIndex >= 0) {
            // Merge entries of existing list
            mergedFieldLists[existingListIndex] = {
                ...mergedFieldLists[existingListIndex],
                entries: mergeEntries(mergedFieldLists[existingListIndex].entries, impList.entries)
            };
        } else {
            // Add new list
            mergedFieldLists.push({ ...impList, id: `merged-fl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
        }
    }

    return {
        ...existing,
        days: mergedDays,
        fieldLists: mergedFieldLists,
        metadata: {
            createdAt: existing.metadata.createdAt < imported.metadata.createdAt ? existing.metadata.createdAt : imported.metadata.createdAt,
            lastModified: new Date().toISOString()
        }
    };
}
