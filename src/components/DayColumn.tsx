import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import { EntryItem } from './EntryItem'
import { Day, TaskColor } from '@/types'
import { getDayName } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface DayColumnProps {
  day: Day
  onAddEntry: (dayDate: string, text: string) => void
  onToggleEntry: (dayDate: string, entryId: string) => void
  onUpdateEntry: (dayDate: string, entryId: string, text: string) => void
  onDeleteEntry: (dayDate: string, entryId: string) => void
  onColorChange: (dayDate: string, entryId: string, color: TaskColor) => void
  onSelect?: () => void
}

export function DayColumn({
  day,
  onAddEntry,
  onToggleEntry,
  onUpdateEntry,
  onDeleteEntry,
  onColorChange,
  onSelect,
  isHighlighted = false
}: DayColumnProps & { isHighlighted?: boolean }) {
  const [newEntryText, setNewEntryText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleEmptySpaceClick = (e: React.MouseEvent) => {
    // Only focus if clicking directly on the container or empty lines
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('empty-line')) {
      inputRef.current?.focus()
    }
  }

  const handleAddEntry = () => {
    if (newEntryText.trim()) {
      onAddEntry(day.date, newEntryText.trim())
      setNewEntryText('')
    }
  }

  const date = new Date(day.date)
  const dayName = getDayName(date)
  const dayNumber = date.getDate()

  return (
    <div
      onClick={() => onSelect?.()}
      className={cn(
        "w-full sm:w-[300px] sm:min-w-[300px] md:min-w-[320px] flex-shrink-0 sm:flex-shrink flex flex-col h-full border-b sm:border-b-0 sm:border-l border-neutral-100 last:border-l-0 px-0 pt-6 snap-center bg-white/50 backdrop-blur-sm transition-all duration-300 embla__slide cursor-pointer",
        isHighlighted ? "bg-white/80 md:bg-white shadow-[0_0_30px_-10px_rgba(0,0,0,0.1)] z-10 scale-[1.02] md:border-l-2 md:border-neutral-200" : ""
      )}>
      <div className="flex items-baseline gap-3 mb-6 px-4 border-b-2 border-neutral-900 pb-2 mx-4">
        <span className="text-3xl font-black text-neutral-900">{dayNumber}</span>
        <span className="text-lg font-medium text-neutral-500">{dayName}</span>
      </div>

      <div
        className="flex-1 space-y-0 ruled-paper flex flex-col cursor-text"
        onClick={handleEmptySpaceClick}
      >
        {day.entries.map(entry => (
          <EntryItem
            key={entry.id}
            entry={entry}
            onToggle={() => onToggleEntry(day.date, entry.id)}
            onUpdate={(id, text) => onUpdateEntry(day.date, id, text)}
            onDelete={(id) => onDeleteEntry(day.date, id)}
            onColorChange={(id, color) => onColorChange(day.date, id, color)}
          />
        ))}

        <div className="flex items-center gap-2 px-4 group h-[3rem]">
          <input
            ref={inputRef}
            value={newEntryText}
            onChange={(e) => setNewEntryText(e.target.value)}
            onBlur={handleAddEntry}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddEntry()
            }}
            placeholder="أضف مهمة..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-neutral-400/50 h-full"
            dir="auto"
          />
          <Plus className="h-4 w-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Infinite empty lines filler */}
        <div className="flex-1 empty-line" />
      </div>
    </div>
  )
}
