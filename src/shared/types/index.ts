export interface Entry {
  id: string
  text: string
  completed: boolean
  color?: 'yellow' | 'cyan' | 'pink' | 'green' | 'purple' | 'orange' | 'none'
}

export interface Day {
  date: string
  dayOfWeek: string
  entries: Entry[]
}

export interface FieldList {
  id: string
  title: string
  relatedDay: string | null
  entries: Entry[]
}

export interface WeekData {
  weekId: string
  startDate: string
  endDate: string
  days: Day[]
  fieldLists: FieldList[]
  metadata: {
    createdAt: string
    lastModified: string
  }
}

// Slider & Navigation types
export type SliderMode = 'horizontal' | 'vertical'

export interface SliderConfig {
  mode: SliderMode
  dragFree: boolean
  loop: boolean
}

// Design system types
export type TaskColor = 'yellow' | 'cyan' | 'pink' | 'green' | 'purple' | 'orange' | 'none'

export const TASK_COLORS: { value: TaskColor; label: string; class: string }[] = [
  { value: 'none', label: 'بدون لون', class: '' },
  { value: 'yellow', label: 'أصفر', class: 'task-highlight-yellow' },
  { value: 'cyan', label: 'سماوي', class: 'task-highlight-cyan' },
  { value: 'pink', label: 'وردي', class: 'task-highlight-pink' },
  { value: 'green', label: 'أخضر', class: 'task-highlight-green' },
  { value: 'purple', label: 'بنفسجي', class: 'task-highlight-purple' },
  { value: 'orange', label: 'برتقالي', class: 'task-highlight-orange' },
]
