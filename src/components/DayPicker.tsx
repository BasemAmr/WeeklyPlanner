import { useRef, useEffect } from 'react'
import { Day } from '@/types'
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
                "flex items-center gap-3 overflow-x-auto dreamy-scroll py-2 px-4 snap-x snap-mandatory scroll-px-4",
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
                            "flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px] h-[56px] md:h-[64px] rounded-xl border-2 transition-all duration-300 snap-center outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900",
                            isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white scale-105 shadow-md"
                                : "border-neutral-100 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 hover:bg-neutral-50"
                        )}
                        role="tab"
                        aria-selected={isSelected}
                        aria-label={`${dayName} ${dayNumber}`}
                    >
                        <span className={cn("text-xs font-medium", isSelected ? "text-neutral-300" : "")}>
                            {dayName}
                        </span>
                        <span className={cn("text-xl md:text-2xl font-black leading-none", isSelected ? "text-white" : "text-neutral-900")}>
                            {dayNumber}
                        </span>

                        {/* Dot indicator for existing entries */}
                        {day.entries.length > 0 && (
                            <div className={cn(
                                "w-1 h-1 rounded-full mt-1",
                                isSelected ? "bg-white" : "bg-neutral-300"
                            )} />
                        )}
                    </button>
                )
            })}
        </div>
    )
}
