import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import { EntryItem } from './EntryItem'
import { Day, TaskColor } from '@/shared/types'
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
  className?: string
}

export function DayColumn({
  day,
  onAddEntry,
  onToggleEntry,
  onUpdateEntry,
  onDeleteEntry,
  onColorChange,
  onSelect,
  className,
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
        // Base layout
        "flex flex-col h-full min-h-full bg-white/50 backdrop-blur-sm transition-transform duration-300 embla__slide cursor-pointer",
        // Borders
        "border-b md:border-b-0 md:border-l border-neutral-100 last:border-l-0",
        // Spacing
        "px-0 pt-6 snap-center",
        // Responsive Widths - Force single column on mobile/tablet portrait (<768px)
        "w-full h-full md:w-[320px] md:min-w-[320px] flex-shrink-0 relative",
        // Highlight state
        isHighlighted ? "bg-white/80 md:bg-white shadow-[0_0_30px_-10px_rgba(0,0,0,0.1)] z-10 md:scale-[1.02] md:border-l-2 md:border-neutral-200" : "",
        className
      )}>
      <div className="flex items-baseline gap-3 mb-6 px-4 border-b-2 border-neutral-900 pb-2 mx-4">
        <span className="text-3xl font-black text-neutral-900">{dayNumber}</span>
        <span className="text-lg font-medium text-neutral-500">{dayName}</span>
      </div>

      <div
        className="flex-1 space-y-0 ruled-paper flex flex-col cursor-text overflow-y-auto dreamy-scroll"
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

        <div className="flex items-end gap-2 px-4 group h-[3rem] pb-1">
          <input
            ref={inputRef}
            value={newEntryText}
            onChange={(e) => setNewEntryText(e.target.value)}
            onBlur={handleAddEntry}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddEntry()
            }}
            placeholder="أضف مهمة..."
            className="flex-1 bg-transparent border-none outline-none text-sm md:text-base placeholder:text-neutral-400/50"
            dir="auto"
          />
          <Plus className="h-5 w-5 mb-0.5 text-neutral-300 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Infinite empty lines filler */}
        <div className="flex-1 empty-line" />
      </div>
    </div>
  )
}
