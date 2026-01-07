import { useState, useRef, useEffect } from 'react'
import { Plus, Trash2, MoreVertical } from 'lucide-react'
import { FieldList, TaskColor } from '@/types'
import { EntryItem } from './EntryItem'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FieldListViewProps {
  list: FieldList
  onUpdateTitle: (id: string, title: string) => void
  onDeleteList: (id: string) => void
  onAddEntry: (listId: string, text: string) => void
  onToggleEntry: (listId: string, entryId: string) => void
  onUpdateEntry: (listId: string, entryId: string, text: string) => void
  onDeleteEntry: (listId: string, entryId: string) => void
  onColorChange: (listId: string, entryId: string, color: TaskColor) => void
}

export function FieldListView({
  list,
  onUpdateTitle,
  onDeleteList,
  onAddEntry,
  onToggleEntry,
  onUpdateEntry,
  onDeleteEntry,
  onColorChange
}: FieldListViewProps) {
  const [newEntryText, setNewEntryText] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleText, setTitleText] = useState(list.title)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleEmptySpaceClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('empty-line')) {
      inputRef.current?.focus()
    }
  }

  // Sync titleText state when list.title prop changes (fixes title editing bug)
  useEffect(() => {
    setTitleText(list.title)
  }, [list.title])

  const handleAddEntry = () => {
    if (newEntryText.trim()) {
      onAddEntry(list.id, newEntryText.trim())
      setNewEntryText('')
    }
  }

  const handleTitleSave = () => {
    if (titleText.trim()) {
      onUpdateTitle(list.id, titleText.trim())
      setIsEditingTitle(false)
    }
  }

  return (
    <div className="w-full sm:w-[300px] sm:min-w-[300px] md:min-w-[320px] flex-shrink-0 sm:flex-shrink flex flex-col h-full border-b sm:border-b-0 sm:border-l border-neutral-100 last:border-l-0 px-0 pt-6 snap-center bg-white/50 backdrop-blur-sm group/list">
      <div className="flex items-start justify-between mb-4 border-b-2 border-neutral-900 pb-2 px-4 mx-4">
        {isEditingTitle ? (
          <input
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave()
            }}
            className="text-xl font-bold text-neutral-900 bg-transparent border-none outline-none w-full"
            autoFocus
            dir="auto"
          />
        ) : (
          <div
            className="text-xl font-bold text-neutral-900 cursor-text flex-1"
            onClick={() => setIsEditingTitle(true)}
          >
            {list.title}
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover/list:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              تعديل العنوان
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteList(list.id)} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              حذف القائمة
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className="flex-1 space-y-0 ruled-paper flex flex-col cursor-text"
        onClick={handleEmptySpaceClick}
      >
        {list.entries.map(entry => (
          <EntryItem
            key={entry.id}
            entry={entry}
            onToggle={() => onToggleEntry(list.id, entry.id)}
            onUpdate={(id, text) => onUpdateEntry(list.id, id, text)}
            onDelete={(id) => onDeleteEntry(list.id, id)}
            onColorChange={(id, color) => onColorChange(list.id, id, color)}
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
