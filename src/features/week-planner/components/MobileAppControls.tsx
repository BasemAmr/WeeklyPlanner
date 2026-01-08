import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Day, FieldList, SliderMode } from '@/shared/types'
import { AlignJustify, Columns } from 'lucide-react'

interface MobileAppControlsProps {
    viewMode: 'week' | 'lists'
    days: Day[]
    fieldLists: FieldList[]
    selectedIndex: number
    onSelect: (index: number) => void
    sliderMode: SliderMode
    onSliderModeChange: (mode: SliderMode) => void
    className?: string
}

export function MobileAppControls({
    viewMode,
    days,
    fieldLists,
    selectedIndex,
    onSelect,
    sliderMode,
    onSliderModeChange,
    className
}: MobileAppControlsProps) {

    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to selected item
    useEffect(() => {
        if (scrollRef.current) {
            const selectedElement = scrollRef.current.children[selectedIndex] as HTMLElement
            if (selectedElement) {
                const container = scrollRef.current
                const scrollLeft = selectedElement.offsetLeft - (container.clientWidth / 2) + (selectedElement.clientWidth / 2)
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
            }
        }
    }, [selectedIndex, viewMode])

    return (
        <div className={cn("fixed bottom-28 left-4 right-4 h-12 flex items-center gap-3 z-[60] pointer-events-none", className)}>
            {/* Control Strip Container */}
            <div className="flex-1 h-full bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-neutral-200/50 flex items-center overflow-hidden pointer-events-auto pl-1 pr-1">

                {viewMode === 'week' ? (
                    /* Day Picker Strip */
                    <div className="flex-1 flex items-center justify-between h-full px-1" dir="rtl">
                        {days.map((day, index) => {
                            const date = new Date(day.date)
                            const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' }) // e.g., "Mon"
                            const dayNum = date.getDate()
                            const isSelected = index === selectedIndex

                            return (
                                <button
                                    key={day.date}
                                    onClick={() => onSelect(index)}
                                    className={cn(
                                        "flex flex-col items-center justify-center h-9 w-9 rounded-full transition-all",
                                        isSelected ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:bg-neutral-100"
                                    )}
                                >
                                    <span className="text-[10px] leading-tight font-medium">{dayName}</span>
                                    <span className="text-[10px] leading-tight font-bold">{dayNum}</span>
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    /* List Picker Strip */
                    <div
                        ref={scrollRef}
                        className="flex-1 flex items-center gap-2 overflow-x-auto dreamy-scroll h-full px-2"
                        dir="rtl"
                    >
                        {fieldLists.length === 0 ? (
                            <span className="text-xs text-neutral-400 px-2 italic">لا توجد قوائم</span>
                        ) : (
                            fieldLists.map((list, index) => {
                                const isSelected = index === selectedIndex
                                return (
                                    <button
                                        key={list.id}
                                        onClick={() => onSelect(index)}
                                        className={cn(
                                            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
                                            isSelected
                                                ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                                        )}
                                    >
                                        {list.title}
                                    </button>
                                )
                            })
                        )}
                        {/* Spacer for right padding */}
                        <div className="w-1" />
                    </div>
                )}
            </div>

            {/* Slider Toggle Button (Floating outside strip) */}
            <button
                onClick={() => onSliderModeChange(sliderMode === 'vertical' ? 'horizontal' : 'vertical')}
                className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-neutral-200/50 flex items-center justify-center pointer-events-auto active:scale-95 transition-transform"
            >
                {sliderMode === 'vertical' ? (
                    <Columns className="h-5 w-5 text-neutral-700" />
                ) : (
                    <AlignJustify className="h-5 w-5 text-neutral-700 rotate-90" />
                )}
            </button>
        </div>
    )
}
