import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { WeekData } from '@/types'

interface WeekPlannerDB extends DBSchema {
  weeks: {
    key: string
    value: WeekData
    indexes: { 'by-date': string }
  }
  backup: {
    key: string
    value: {
      timestamp: string
      data: WeekData[]
    }
  }
}

let dbPromise: Promise<IDBPDatabase<WeekPlannerDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<WeekPlannerDB>('week-planner-db', 1, {
      upgrade(db) {
        // Create weeks store
        const weekStore = db.createObjectStore('weeks', { keyPath: 'weekId' })
        weekStore.createIndex('by-date', 'startDate')

        // Create backup store
        db.createObjectStore('backup', { keyPath: 'timestamp' })
      },
    })
  }
  return dbPromise
}

export async function saveWeek(weekData: WeekData): Promise<void> {
  const db = await getDB()
  await db.put('weeks', weekData)
}

export async function saveWeeks(weeks: WeekData[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('weeks', 'readwrite')
  const store = tx.objectStore('weeks')
  await Promise.all(weeks.map(week => store.put(week)))
  await tx.done
}

export async function getWeek(weekId: string): Promise<WeekData | undefined> {
  const db = await getDB()
  return db.get('weeks', weekId)
}

export async function getAllWeeks(): Promise<WeekData[]> {
  const db = await getDB()
  return db.getAll('weeks')
}

export async function deleteWeek(weekId: string): Promise<void> {
  const db = await getDB()
  await db.delete('weeks', weekId)
}

export async function createBackup(): Promise<void> {
  const db = await getDB()
  const allWeeks = await getAllWeeks()

  await db.put('backup', {
    timestamp: new Date().toISOString(),
    data: allWeeks
  })

  // Keep only last 5 backups
  const allBackups = await db.getAllKeys('backup')
  if (allBackups.length > 5) {
    const oldestBackups = allBackups.slice(0, allBackups.length - 5)
    for (const key of oldestBackups) {
      await db.delete('backup', key)
    }
  }
}

/**
 * Clear all week data from the database
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB()
  await db.clear('weeks')
  await db.clear('backup')
}

/**
 * Find weeks that contain any of the given dates
 * Returns weeks where startDate <= date <= endDate for any date in the list
 */
export async function findWeeksContainingDates(dates: string[]): Promise<WeekData[]> {
  const allWeeks = await getAllWeeks()

  return allWeeks.filter(week => {
    const weekStart = new Date(week.startDate)
    const weekEnd = new Date(week.endDate)

    return dates.some(dateStr => {
      const date = new Date(dateStr)
      return date >= weekStart && date <= weekEnd
    })
  })
}

/**
 * Get entries for specific dates from all matching weeks
 * Merges entries from overlapping weeks
 */
export async function getEntriesForDates(dates: string[]): Promise<Map<string, WeekData['days'][0]>> {
  const matchingWeeks = await findWeeksContainingDates(dates)
  const dayMap = new Map<string, WeekData['days'][0]>()

  // Merge entries from all matching weeks
  for (const week of matchingWeeks) {
    for (const day of week.days) {
      if (dates.includes(day.date)) {
        const existing = dayMap.get(day.date)
        if (existing) {
          // Merge entries, avoiding duplicates by ID
          const existingIds = new Set(existing.entries.map(e => e.id))
          const newEntries = day.entries.filter(e => !existingIds.has(e.id))
          existing.entries = [...existing.entries, ...newEntries]
        } else {
          dayMap.set(day.date, { ...day })
        }
      }
    }
  }

  return dayMap
}
