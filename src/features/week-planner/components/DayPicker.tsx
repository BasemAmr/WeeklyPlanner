import { useRef, useEffect } from 'react'
import { Day } from '@/shared/types'
import { getDayName } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface DayPickerProps {
    days: Day[]
    selectedIndex: number
    onDaySelect: (index: number) => void
    className?: string
}

export function DayPicker({ days, selectedIndex, onDaySelect, className }: DayPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Auto-scroll the picker to keep selected day in view
    useEffect(() => {
        if (containerRef.current) {
            const selectedButton = containerRef.current.children[selectedIndex] as HTMLElement
            if (selectedButton) {
                selectedButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                })
            }
        }
    }, [selectedIndex])

    return (
        <div
            className={cn(
                "flex items-center gap-2 overflow-x-auto dreamy-scroll py-2 px-4 snap-x snap-mandatory scroll-px-4",
                // Mobile Styles: Larger touch targets, center focused
                "md:gap-3 md:justify-center", 
                className
            )}
            ref={containerRef}
            role="tablist"
            aria-label="اختر اليوم"
        >
            {days.map((day, index) => {
                const isSelected = index === selectedIndex
                const date = new Date(day.date)
                const dayName = getDayName(date)
                const dayNumber = date.getDate()

                return (
                    <button
                        key={day.date}
                        onClick={() => onDaySelect(index)}
                        className={cn(
                            // Base
                            "relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 snap-center group",
                            // Mobile Sizes (larger)
                            "min-w-[4rem] h-16 sm:min-w-[4.5rem] sm:h-20", 
                            // Desktop Sizes
                            "md:min-w-[3.5rem] md:h-16",
                            // States
                            isSelected 
                                ? "bg-neutral-900 text-white shadow-lg scale-105 z-10" 
                                : "bg-white border border-neutral-100 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                        )}
                        aria-selected={isSelected}
                        role="tab"
                    >
                        <span className={cn(
                            "text-xs font-medium transition-colors mb-1",
                            isSelected ? "text-neutral-300" : "text-neutral-400 group-hover:text-neutral-500"
                        )}>
                            {dayName}
                        </span>
                        <span className={cn(
                            "font-bold leading-none tracking-tight",
                            // Mobile Text
                            "text-xl sm:text-2xl",
                            // Desktop Text
                            "md:text-xl"
                        )}>
                            {dayNumber}
                        </span>
                        
                        {/* Active Indicator Dot */}
                        {isSelected && (
                            <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full opacity-50" />
                        )}
                    </button>
                )
            })}
        </div>
    )
}
