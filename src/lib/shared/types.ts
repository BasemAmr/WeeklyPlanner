// Core data types for the week planner

export interface Entry {
    id: string;
    text: string;
    completed: boolean;
}

export interface DayData {
    date: string; // ISO format: YYYY-MM-DD
    dayOfWeek: string; // Monday, Tuesday, etc.
    entries: Entry[];
}

export interface FieldList {
    id: string;
    title: string;
    relatedDay: string | null; // null = week-level, or ISO date for day-specific
    entries: Entry[];
}

export interface WeekData {
    weekId: string; // ISO week format: YYYY-WXX
    startDate: string; // ISO format: YYYY-MM-DD
    endDate: string; // ISO format: YYYY-MM-DD
    days: DayData[];
    fieldLists: FieldList[];
    metadata: {
        createdAt: string;
        lastModified: string;
    };
}

export interface MergeStrategy {
    type: 'merge' | 'replace';
}
