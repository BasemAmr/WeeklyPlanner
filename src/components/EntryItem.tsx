import { useState } from 'react'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { X, GripVertical } from 'lucide-react'
import { Entry, TaskColor, TASK_COLORS } from '@/types'
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
        "group flex items-end pb-2 gap-2 px-4 h-[3rem] transition-colors relative", // Aligned to bottom
        colorClass
      )}
      draggable={draggable}
    >
      {draggable && (
        <GripVertical className="h-4 w-4 mt-1 text-neutral-300 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
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
          className="flex-1 h-8"
          autoFocus
          dir="auto"
        />
      ) : (
        <div
          className={cn(
            "flex-1 text-sm cursor-text select-text",
            entry.completed && "line-through text-neutral-500"
          )}
          onClick={() => setIsEditing(true)}
          dir="auto"
        >
          {entry.text}
        </div>
      )}

      <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
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
          <div className="absolute left-0 top-8 z-10 bg-white rounded-lg shadow-xl p-2 flex gap-1 border border-neutral-100">
            {TASK_COLORS.map(color => (
              <button
                key={color.value}
                className={cn(
                  "h-6 w-6 rounded-full border transition-transform hover:scale-110",
                  entry.color === color.value ? "border-neutral-900" : "border-neutral-200",
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
          className="h-7 w-7 hover:bg-pink hover:text-neutral-900"
          onClick={() => onDelete(entry.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
