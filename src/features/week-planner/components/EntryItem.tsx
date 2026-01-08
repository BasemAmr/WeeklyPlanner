import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Checkbox } from '@/design-system/components'
import { Input } from '@/design-system/components'
import { Button } from '@/design-system/components'
import { X, GripVertical, Pencil, Check } from 'lucide-react'
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

interface ActionMenuProps {
  entry: Entry
  position: { top: number, left: number, width: number }
  onClose: () => void
  onUpdate: (text: string) => void
  onToggle: () => void
  onDelete: () => void
  onColorChange: (color: TaskColor) => void
  onEditStart: () => void
}

function ActionMenu({ entry, position, onClose, onToggle, onDelete, onColorChange, onEditStart }: ActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return
      }
      onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const style: React.CSSProperties = {
    top: position.top,
    left: position.left,
  }

  return createPortal(
    <div
      ref={menuRef}
      style={style}
      className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-neutral-200 p-3 flex flex-col gap-3 min-w-[280px] w-full max-w-[320px] animate-in fade-in zoom-in-95 duration-150 origin-top-left"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with close button */}
      <div className="flex items-start justify-between gap-2">
        <div className="text-base text-neutral-900 break-words leading-relaxed max-h-[100px] overflow-y-auto pr-1 flex-1">
          {entry.text}
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <X className="h-4 w-4 text-neutral-500" />
        </button>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Delete confirmation overlay */}
      {showDeleteConfirm ? (
        <div className="flex flex-col gap-2 py-2">
          <p className="text-sm text-neutral-600 text-center">حذف هذه المهمة؟</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 h-10"
            >
              إلغاء
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                onDelete()
                onClose()
              }}
              className="flex-1 h-10"
            >
              حذف
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-1.5 flex-wrap justify-start">
            {TASK_COLORS.map(color => (
              <button
                key={color.value}
                className={cn(
                  "h-8 w-8 rounded-full border transition-all hover:scale-110 active:scale-95",
                  entry.color === color.value ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2" : "border-neutral-200",
                  color.value === 'yellow' && 'bg-amber-300',
                  color.value === 'cyan' && 'bg-cyan-300',
                  color.value === 'pink' && 'bg-pink-300',
                  color.value === 'green' && 'bg-green-300',
                  color.value === 'purple' && 'bg-purple-300',
                  color.value === 'orange' && 'bg-orange-300',
                  color.value === 'none' && 'bg-white'
                )}
                onClick={() => onColorChange(color.value)}
                title={color.label}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-2 flex-1">
              <Button
                size="sm"
                variant={entry.completed ? "outline" : "default"}
                onClick={onToggle}
                className="h-9 flex-1"
              >
                {entry.completed ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : (
                  "Mark Complete"
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={onEditStart}
                className="h-9 px-2"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number, width: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout>()
  const openTimeoutRef = useRef<NodeJS.Timeout>()

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    if (!isMenuOpen) {
      openTimeoutRef.current = setTimeout(() => {
        updatePosition()
        setIsMenuOpen(true)
      }, 500)
    }
  }

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false)
    }, 150)
  }

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(entry.id, editText.trim())
      setIsEditing(false)
      setIsMenuOpen(false)
    }
  }

  const textSizeClass = "text-xl md:text-base leading-[2rem] md:leading-[1.75rem]"
  const colorClass = entry.color && entry.color !== 'none'
    ? TASK_COLORS.find(c => c.value === entry.color)?.class
    : ''

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "group flex items-end pb-1 gap-2 px-4 h-[3rem] min-h-[3rem] transition-colors relative",
          colorClass
        )}
        draggable={draggable}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={(e) => e.stopPropagation()} // Prevent document click from closing menu immediately
        onClick={(e) => {
          e.stopPropagation()
          if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
          updatePosition()
          setIsMenuOpen(prev => !prev) // Toggle state instead of just setting true
        }}
      >
        {draggable && (
          <GripVertical className="h-5 w-5 mb-1.5 text-neutral-300 cursor-move md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
        )}

        <Checkbox
          checked={entry.completed}
          onCheckedChange={() => onToggle(entry.id)}
          className="shrink-0 mb-1.5"
          onClick={(e) => e.stopPropagation()}
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
            className={cn(
              "flex-1 h-full bg-transparent border-none px-0 focus-visible:ring-0 rounded-none shadow-none focus:bg-transparent -mb-[1px]",
              textSizeClass
            )}
            autoFocus
            dir="auto"
          />
        ) : (
          <div
            className={cn(
              "flex-1 cursor-pointer truncate pb-0.5",
              textSizeClass,
              entry.completed && "line-through text-neutral-500"
            )}
            dir="auto"
          >
            {entry.text}
          </div>
        )}
      </div>

      {isMenuOpen && !isEditing && menuPosition && (
        <ActionMenuPortalWrapper
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ActionMenu
            entry={entry}
            position={menuPosition}
            onClose={() => setIsMenuOpen(false)}
            onToggle={() => onToggle(entry.id)}
            onDelete={() => onDelete(entry.id)}
            onColorChange={(c) => onColorChange(entry.id, c)}
            onEditStart={() => {
              setIsEditing(true)
              setIsMenuOpen(false)
            }}
            onUpdate={(t) => onUpdate(entry.id, t)}
          />
        </ActionMenuPortalWrapper>
      )}
    </>
  )
}

function ActionMenuPortalWrapper({ children, onMouseEnter, onMouseLeave }: { children: React.ReactNode, onMouseEnter: () => void, onMouseLeave: () => void }) {
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  )
}
