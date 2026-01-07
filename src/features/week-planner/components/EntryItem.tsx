import { useState } from 'react'
import { Checkbox } from '@/design-system/components'
import { Input } from '@/design-system/components'
import { Button } from '@/design-system/components'
import { X, GripVertical } from 'lucide-react'
import { Entry, TaskColor, TASK_COLORS } from '@/shared/types'
import { cn } from '@/lib/utils'

interface EntryItemProps {
  entry: Entry
  onToggle: (id: string) => void
  onUpdate: (id: string, text: string) => void
  onDelete: (id: string) => void
  onColorChange: (id: string, color: TaskColor) => void
  draggable?: boolean
}

export function EntryItem({
  entry,
  onToggle,
  onUpdate,
  onDelete,
  onColorChange,
  draggable = true
}: EntryItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(entry.text)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(entry.id, editText.trim())
      setIsEditing(false)
    }
  }

  const colorClass = entry.color && entry.color !== 'none'
    ? TASK_COLORS.find(c => c.value === entry.color)?.class
    : ''

  return (
    <div
      className={cn(
        "group flex items-end pb-1 gap-2 px-4 min-h-[3rem] transition-colors relative",
        colorClass
      )}
      draggable={draggable}
    >
      {draggable && (
        <GripVertical className="h-5 w-5 mb-0.5 text-neutral-300 cursor-move md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
      )}

      <Checkbox
        checked={entry.completed}
        onCheckedChange={() => onToggle(entry.id)}
        className="shrink-0 mb-1"
      />

      {isEditing ? (
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') {
              setEditText(entry.text)
              setIsEditing(false)
            }
          }}
          className="flex-1 h-8 text-base"
          autoFocus
          dir="auto"
        />
      ) : (
        <div
          className={cn(
            "flex-1 text-sm md:text-base cursor-text select-text leading-normal break-words",
            entry.completed && "line-through text-neutral-500"
          )}
          onClick={() => setIsEditing(true)}
          dir="auto"
        >
          {entry.text}
        </div>
      )}

      <div className="relative shrink-0 flex gap-1 items-center pb-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <div className={cn(
            "h-4 w-4 rounded-full border border-neutral-300",
            entry.color === 'yellow' && 'bg-amber-300',
            entry.color === 'cyan' && 'bg-cyan-300',
            entry.color === 'pink' && 'bg-pink-300',
            entry.color === 'green' && 'bg-green-300',
            entry.color === 'purple' && 'bg-purple-300',
            entry.color === 'orange' && 'bg-orange-300',
            (!entry.color || entry.color === 'none') && 'bg-white'
          )} />
        </Button>

        {showColorPicker && (
          <div className="absolute left-0 bottom-10 z-50 bg-white rounded-lg shadow-xl p-2 flex gap-1 border border-neutral-100 flex-wrap w-[160px]">
            {TASK_COLORS.map(color => (
              <button
                key={color.value}
                className={cn(
                  "h-8 w-8 rounded-full border transition-transform active:scale-95",
                  entry.color === color.value ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-1" : "border-neutral-200",
                  color.value === 'yellow' && 'bg-amber-300',
                  color.value === 'cyan' && 'bg-cyan-300',
                  color.value === 'pink' && 'bg-pink-300',
                  color.value === 'green' && 'bg-green-300',
                  color.value === 'purple' && 'bg-purple-300',
                  color.value === 'orange' && 'bg-orange-300',
                  color.value === 'none' && 'bg-white'
                )}
                onClick={() => {
                  onColorChange(entry.id, color.value)
                  setShowColorPicker(false)
                }}
                title={color.label}
              />
            ))}
          </div>
        )}

        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 hover:bg-red-50 hover:text-red-600 text-neutral-400"
          onClick={() => onDelete(entry.id)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
