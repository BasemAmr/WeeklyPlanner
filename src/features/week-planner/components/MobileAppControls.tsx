import { useRef, useEffect, useState } from 'react'
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
    const [isTablet, setIsTablet] = useState(false)

    // Detect tablet vs phone (breakpoint at 640px - sm)
    useEffect(() => {
        const checkTablet = () => setIsTablet(window.innerWidth >= 640)
        checkTablet()
        window.addEventListener('resize', checkTablet)
        return () => window.removeEventListener('resize', checkTablet)
    }, [])

    // Auto-scroll to selected item (for tablet list picker)
    useEffect(() => {
        if (scrollRef.current && isTablet) {
            const selectedElement = scrollRef.current.children[selectedIndex] as HTMLElement
            if (selectedElement) {
                const container = scrollRef.current
                const scrollLeft = selectedElement.offsetLeft - (container.clientWidth / 2) + (selectedElement.clientWidth / 2)
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
            }
        }
    }, [selectedIndex, viewMode, isTablet])

    // ===== PHONE: Side Rail (Vertical edge tabs) for BOTH week and lists =====
    if (!isTablet) {
        // Week view - show day numbers
        if (viewMode === 'week') {
            return (
                <div className={cn(
                    "fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-0.5 py-1.5 px-0.5",
                    "bg-white/95 backdrop-blur-md shadow-lg border-l border-neutral-200/60 rounded-l-lg",
                    className
                )}>
                    {days.map((day, index) => {
                        const date = new Date(day.date)
                        const dayName = date.toLocaleDateString('ar-EG', { weekday: 'narrow' })
                        const dayNum = date.getDate()
                        const isSelected = index === selectedIndex

                        return (
                            <button
                                key={day.date}
                                onClick={() => onSelect(index)}
                                className={cn(
                                    "flex flex-col items-center justify-center w-8 h-9 rounded-md transition-all",
                                    isSelected
                                        ? "bg-neutral-900 text-white shadow-md"
                                        : "text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200"
                                )}
                            >
                                <span className="text-[8px] leading-none opacity-70">{dayName}</span>
                                <span className="text-[11px] leading-tight font-bold">{dayNum}</span>
                            </button>
                        )
                    })}

                    {/* Slider mode toggle at bottom of rail */}
                    <div className="w-full h-px bg-neutral-200 my-0.5" />
                    <button
                        onClick={() => onSliderModeChange(sliderMode === 'vertical' ? 'horizontal' : 'vertical')}
                        className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center active:scale-95 transition-transform"
                    >
                        {sliderMode === 'vertical' ? (
                            <Columns className="h-3.5 w-3.5 text-neutral-600" />
                        ) : (
                            <AlignJustify className="h-3.5 w-3.5 text-neutral-600 rotate-90" />
                        )}
                    </button>
                </div>
            )
        }

        // Lists view - show list names (truncated for long names)
        return (
            <div className={cn(
                "fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-0.5 py-1.5 px-0.5",
                "bg-white/95 backdrop-blur-md shadow-lg border-l border-neutral-200/60 rounded-l-lg max-h-[70vh] overflow-y-auto slim-scrollbar",
                className
            )}>
                {fieldLists.length === 0 ? (
                    <div className="w-10 h-10 flex items-center justify-center">
                        <span className="text-[8px] text-neutral-400 [writing-mode:vertical-rl] rotate-180">لا قوائم</span>
                    </div>
                ) : (
                    fieldLists.map((list, index) => {
                        const isSelected = index === selectedIndex
                        // Get first 2 characters for compact display
                        const shortName = list.title.slice(0, 2)

                        return (
                            <button
                                key={list.id}
                                onClick={() => onSelect(index)}
                                title={list.title} // Full name on hover/long-press
                                className={cn(
                                    "flex items-center justify-center w-10 h-9 rounded-md transition-all",
                                    isSelected
                                        ? "bg-neutral-900 text-white shadow-md"
                                        : "text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200"
                                )}
                            >
                                <span className="text-[11px] font-bold truncate px-0.5">{shortName}</span>
                            </button>
                        )
                    })
                )}

                {/* Slider mode toggle at bottom of rail */}
                <div className="w-full h-px bg-neutral-200 my-0.5" />
                <button
                    onClick={() => onSliderModeChange(sliderMode === 'vertical' ? 'horizontal' : 'vertical')}
                    className="w-10 h-8 rounded-md bg-neutral-100 flex items-center justify-center active:scale-95 transition-transform"
                >
                    {sliderMode === 'vertical' ? (
                        <Columns className="h-3.5 w-3.5 text-neutral-600" />
                    ) : (
                        <AlignJustify className="h-3.5 w-3.5 text-neutral-600 rotate-90" />
                    )}
                </button>
            </div>
        )
    }

    // ===== TABLET: Floating Pill (both week and lists) =====
    return (
        <div className={cn("fixed bottom-24 left-4 right-4 h-10 flex items-center justify-center gap-2 z-[60] pointer-events-none", className)}>
            <div className="flex-1 max-w-md mx-auto h-full bg-white/95 backdrop-blur-md rounded-full shadow-md border border-neutral-200/60 flex items-center overflow-hidden pointer-events-auto px-1">

                {viewMode === 'week' ? (
                    /* Day Picker Pill for Tablets */
                    <div className="flex-1 flex items-center justify-between h-full px-2" dir="rtl">
                        {days.map((day, index) => {
                            const date = new Date(day.date)
                            const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' })
                            const dayNum = date.getDate()
                            const isSelected = index === selectedIndex

                            return (
                                <button
                                    key={day.date}
                                    onClick={() => onSelect(index)}
                                    className={cn(
                                        "flex flex-col items-center justify-center h-8 px-2 rounded-full transition-all flex-shrink-0",
                                        isSelected ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:bg-neutral-100"
                                    )}
                                >
                                    <span className="text-[10px] leading-none opacity-80">{dayName}</span>
                                    <span className="text-[11px] leading-none font-bold">{dayNum}</span>
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    /* List Picker for Tablets */
                    <div
                        ref={scrollRef}
                        className="flex-1 flex items-center gap-2 overflow-x-auto dreamy-scroll h-full px-2"
                        dir="rtl"
                    >
                        {fieldLists.length === 0 ? (
                            <span className="text-xs text-neutral-400 px-2 italic w-full text-center">لا توجد قوائم</span>
                        ) : (
                            fieldLists.map((list, index) => {
                                const isSelected = index === selectedIndex
                                return (
                                    <button
                                        key={list.id}
                                        onClick={() => onSelect(index)}
                                        className={cn(
                                            "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border max-w-[120px] truncate",
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
                    </div>
                )}
            </div>

            {/* Slider Toggle Button */}
            <button
                onClick={() => onSliderModeChange(sliderMode === 'vertical' ? 'horizontal' : 'vertical')}
                className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-neutral-200/60 flex items-center justify-center pointer-events-auto active:scale-95 transition-transform flex-shrink-0"
            >
                {sliderMode === 'vertical' ? (
                    <Columns className="h-4 w-4 text-neutral-700" />
                ) : (
                    <AlignJustify className="h-4 w-4 text-neutral-700 rotate-90" />
                )}
            </button>
        </div>
    )
}
