import { ArrowRight, ArrowDown } from 'lucide-react'
import { Button } from '@/design-system/components'
import { SliderMode } from '@/shared/types'
import { cn } from '@/lib/utils'

interface SliderModeToggleProps {
    mode: SliderMode
    onModeChange: (mode: SliderMode) => void
    classname?: string
}

export function SliderModeToggle({ mode, onModeChange, classname }: SliderModeToggleProps) {
    return (
        <Button
            variant="default"
            size="icon"
            className={cn(
                "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 md:hidden transition-transform active:scale-95",
                "bg-neutral-900 text-white hover:bg-neutral-800",
                classname
            )}
            onClick={() => onModeChange(mode === 'horizontal' ? 'vertical' : 'horizontal')}
            aria-label={mode === 'horizontal' ? "Switch to vertical scroll" : "Switch to horizontal scroll"}
        >
            {mode === 'horizontal' ? (
                <ArrowDown className="h-6 w-6 animate-pulse" />
            ) : (
                <ArrowRight className="h-6 w-6 animate-pulse" />
            )}
        </Button>
    )
}
