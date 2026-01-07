import { WeekData, DayData, FieldList } from './types';
import {
    getWeekId,
    getWeekStart,
    getWeekEnd,
    formatDate,
    getDayName,
    getWeekDays
} from './date-utils';

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create an empty week data structure for a given date
 */
export function createEmptyWeek(date: Date = new Date()): WeekData {
    const weekId = getWeekId(date);
    const startDate = getWeekStart(date);
    const endDate = getWeekEnd(date);
    const weekDays = getWeekDays(date);

    const days: DayData[] = weekDays.map(day => ({
        date: formatDate(day),
        dayOfWeek: getDayName(day),
        entries: []
    }));

    return {
        weekId,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        days,
        fieldLists: [],
        metadata: {
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Add an entry to a specific day
 */
export function addEntryToDay(
    weekData: WeekData,
    dayDate: string,
    text: string
): WeekData {
    const updatedDays = weekData.days.map(day => {
        if (day.date === dayDate) {
            return {
                ...day,
                entries: [
                    ...day.entries,
                    {
                        id: generateId(),
                        text,
                        completed: false
                    }
                ]
            };
        }
        return day;
    });

    return {
        ...weekData,
        days: updatedDays,
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Toggle entry completion status
 */
export function toggleEntry(
    weekData: WeekData,
    dayDate: string,
    entryId: string
): WeekData {
    const updatedDays = weekData.days.map(day => {
        if (day.date === dayDate) {
            return {
                ...day,
                entries: day.entries.map(entry =>
                    entry.id === entryId
                        ? { ...entry, completed: !entry.completed }
                        : entry
                )
            };
        }
        return day;
    });

    return {
        ...weekData,
        days: updatedDays,
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Update entry text
 */
export function updateEntry(
    weekData: WeekData,
    dayDate: string,
    entryId: string,
    newText: string
): WeekData {
    const updatedDays = weekData.days.map(day => {
        if (day.date === dayDate) {
            return {
                ...day,
                entries: day.entries.map(entry =>
                    entry.id === entryId
                        ? { ...entry, text: newText }
                        : entry
                )
            };
        }
        return day;
    });

    return {
        ...weekData,
        days: updatedDays,
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Delete an entry
 */
export function deleteEntry(
    weekData: WeekData,
    dayDate: string,
    entryId: string
): WeekData {
    const updatedDays = weekData.days.map(day => {
        if (day.date === dayDate) {
            return {
                ...day,
                entries: day.entries.filter(entry => entry.id !== entryId)
            };
        }
        return day;
    });

    return {
        ...weekData,
        days: updatedDays,
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Add a field list
 */
export function addFieldList(
    weekData: WeekData,
    title: string,
    relatedDay: string | null = null
): WeekData {
    const newFieldList: FieldList = {
        id: generateId(),
        title,
        relatedDay,
        entries: []
    };

    return {
        ...weekData,
        fieldLists: [...weekData.fieldLists, newFieldList],
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Add entry to field list
 */
export function addEntryToFieldList(
    weekData: WeekData,
    fieldListId: string,
    text: string
): WeekData {
    const updatedFieldLists = weekData.fieldLists.map(list => {
        if (list.id === fieldListId) {
            return {
                ...list,
                entries: [
                    ...list.entries,
                    {
                        id: generateId(),
                        text,
                        completed: false
                    }
                ]
            };
        }
        return list;
    });

    return {
        ...weekData,
        fieldLists: updatedFieldLists,
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Toggle field list entry
 */
export function toggleFieldListEntry(
    weekData: WeekData,
    fieldListId: string,
    entryId: string
): WeekData {
    const updatedFieldLists = weekData.fieldLists.map(list => {
        if (list.id === fieldListId) {
            return {
                ...list,
                entries: list.entries.map(entry =>
                    entry.id === entryId
                        ? { ...entry, completed: !entry.completed }
                        : entry
                )
            };
        }
        return list;
    });

    return {
        ...weekData,
        fieldLists: updatedFieldLists,
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Delete field list entry
 */
export function deleteFieldListEntry(
    weekData: WeekData,
    fieldListId: string,
    entryId: string
): WeekData {
    const updatedFieldLists = weekData.fieldLists.map(list => {
        if (list.id === fieldListId) {
            return {
                ...list,
                entries: list.entries.filter(entry => entry.id !== entryId)
            };
        }
        return list;
    });

    return {
        ...weekData,
        fieldLists: updatedFieldLists,
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}

/**
 * Delete a field list
 */
export function deleteFieldList(
    weekData: WeekData,
    fieldListId: string
): WeekData {
    return {
        ...weekData,
        fieldLists: weekData.fieldLists.filter(list => list.id !== fieldListId),
        metadata: {
            ...weekData.metadata,
            lastModified: new Date().toISOString()
        }
    };
}
