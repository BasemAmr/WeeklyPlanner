import { useState, useEffect } from 'react'
import { WeekData, Day, Entry, TaskColor } from '@/shared/types'
import { getWeek, saveWeek, getEntriesForDates } from '@/lib/db'
import { getWeekStart, formatWeekRange, getDayName, toLocalISOString } from '@/lib/utils'
import { useSettings } from '@/contexts/SettingsContext'

export function useWeekData() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekData, setWeekData] = useState<WeekData | null>(null)
  const [loading, setLoading] = useState(true)
  const { weekStartDay } = useSettings()

  /* Calculate week boundaries based on current config */
  const weekStart = getWeekStart(currentDate, weekStartDay)
  const weekId = toLocalISOString(weekStart)

  // Generate the 7 dates for this week
  const weekDates: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    weekDates.push(toLocalISOString(date))
  }

  // Load week data from IndexedDB
  const loadWeek = async () => {
    setLoading(true)

    // First try to load existing week by ID
    let existing = await getWeek(weekId)

    if (!existing) {
      // No exact match - look for data in overlapping weeks
      const dayMap = await getEntriesForDates(weekDates)

      // Create new week structure, populating with any found data
      const days: Day[] = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        const dateStr = toLocalISOString(date)

        const existingDay = dayMap.get(dateStr)
        days.push({
          date: dateStr,
          dayOfWeek: getDayName(date),
          entries: existingDay?.entries || []
        })
      }

      const newWeek: WeekData = {
        weekId,
        startDate: toLocalISOString(weekStart),
        endDate: toLocalISOString(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)),
        days,
        fieldLists: [],
        metadata: {
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      }

      setWeekData(newWeek)
      await saveWeek(newWeek)
    } else {
      setWeekData(existing)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadWeek()
  }, [weekId])

  // Save week data
  const updateWeek = async (updater: (week: WeekData) => WeekData) => {
    if (!weekData) return

    const updated = updater(weekData)
    updated.metadata.lastModified = new Date().toISOString()

    setWeekData(updated)
    await saveWeek(updated)
  }

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Entry operations
  const addEntry = async (dayDate: string, text: string) => {
    await updateWeek(week => {
      const day = week.days.find((d: Day) => d.date === dayDate)
      if (!day) return week

      const newEntry: Entry = {
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        completed: false,
        color: 'none'
      }

      return {
        ...week,
        days: week.days.map((d: Day) =>
          d.date === dayDate
            ? { ...d, entries: [...d.entries, newEntry] }
            : d
        )
      }
    })
  }

  const toggleEntry = async (dayDate: string, entryId: string) => {
    await updateWeek(week => ({
      ...week,
      days: week.days.map((d: Day) =>
        d.date === dayDate
          ? {
            ...d,
            entries: d.entries.map((e: Entry) =>
              e.id === entryId ? { ...e, completed: !e.completed } : e
            )
          }
          : d
      )
    }))
  }

  const updateEntry = async (dayDate: string, entryId: string, text: string) => {
    await updateWeek(week => ({
      ...week,
      days: week.days.map((d: Day) =>
        d.date === dayDate
          ? {
            ...d,
            entries: d.entries.map((e: Entry) =>
              e.id === entryId ? { ...e, text } : e
            )
          }
          : d
      )
    }))
  }

  const deleteEntry = async (dayDate: string, entryId: string) => {
    await updateWeek(week => ({
      ...week,
      days: week.days.map((d: Day) =>
        d.date === dayDate
          ? {
            ...d,
            entries: d.entries.filter((e: Entry) => e.id !== entryId)
          }
          : d
      )
    }))
  }

  const changeEntryColor = async (dayDate: string, entryId: string, color: TaskColor) => {
    await updateWeek(week => ({
      ...week,
      days: week.days.map((d: Day) =>
        d.date === dayDate
          ? {
            ...d,
            entries: d.entries.map((e: Entry) =>
              e.id === entryId ? { ...e, color } : e
            )
          }
          : d
      )
    }))
  }

  // Field List Operations
  const addFieldList = async (title: string) => {
    await updateWeek(week => ({
      ...week,
      fieldLists: [
        ...(week.fieldLists || []),
        {
          id: `list-${Date.now()}`,
          title,
          relatedDay: null,
          entries: []
        }
      ]
    }))
  }

  const deleteFieldList = async (listId: string) => {
    await updateWeek(week => ({
      ...week,
      fieldLists: (week.fieldLists || []).filter(l => l.id !== listId)
    }))
  }

  const updateFieldListTitle = async (listId: string, title: string) => {
    await updateWeek(week => ({
      ...week,
      fieldLists: (week.fieldLists || []).map(l => l.id === listId ? { ...l, title } : l)
    }))
  }

  const addFieldListEntry = async (listId: string, text: string) => {
    await updateWeek(week => ({
      ...week,
      fieldLists: (week.fieldLists || []).map(l =>
        l.id === listId
          ? {
            ...l,
            entries: [...l.entries, {
              id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text,
              completed: false,
              color: 'none'
            }]
          }
          : l
      )
    }))
  }

  const toggleFieldListEntry = async (listId: string, entryId: string) => {
    await updateWeek(week => ({
      ...week,
      fieldLists: (week.fieldLists || []).map(l =>
        l.id === listId
          ? {
            ...l,
            entries: l.entries.map(e => e.id === entryId ? { ...e, completed: !e.completed } : e)
          }
          : l
      )
    }))
  }

  const updateFieldListEntry = async (listId: string, entryId: string, text: string) => {
    await updateWeek(week => ({
      ...week,
      fieldLists: (week.fieldLists || []).map(l =>
        l.id === listId
          ? {
            ...l,
            entries: l.entries.map(e => e.id === entryId ? { ...e, text } : e)
          }
          : l
      )
    }))
  }

  const deleteFieldListEntry = async (listId: string, entryId: string) => {
    await updateWeek(week => ({
      ...week,
      fieldLists: (week.fieldLists || []).map(l =>
        l.id === listId
          ? {
            ...l,
            entries: l.entries.filter(e => e.id !== entryId)
          }
          : l
      )
    }))
  }

  const changeFieldListEntryColor = async (listId: string, entryId: string, color: TaskColor) => {
    await updateWeek(week => ({
      ...week,
      fieldLists: (week.fieldLists || []).map(l =>
        l.id === listId
          ? {
            ...l,
            entries: l.entries.map(e => e.id === entryId ? { ...e, color } : e)
          }
          : l
      )
    }))
  }

  return {
    weekData,
    loading,
    weekStart,
    weekId,
    weekRange: formatWeekRange(weekStart),
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    addEntry,
    toggleEntry,
    updateEntry,
    deleteEntry,
    changeEntryColor,
    refresh: loadWeek,
    // Field List exports
    addFieldList,
    deleteFieldList,
    updateFieldListTitle,
    addFieldListEntry,
    toggleFieldListEntry,
    updateFieldListEntry,
    deleteFieldListEntry,
    changeFieldListEntryColor
  }
}
