import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { SliderMode } from '@/shared/types'

export function useWeekSlider(
    initialIndex: number = 0,
    mode: SliderMode = 'horizontal',
    onSlideChange?: (index: number) => void
) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        startIndex: initialIndex,
        axis: mode === 'vertical' ? 'y' : 'x',
        align: 'center', // Center alignment so the selected day is in the middle
        containScroll: false,
        direction: 'rtl', // Important for Arabic RTL
        skipSnaps: true, // Allow scrolling multiple slides with momentum
        dragFree: false, // Ensure we always snap to a slide
    })

    // We need to track the selected index ourselves to drive external UI like the DayPicker
    const [selectedIndex, setSelectedIndex] = useState(initialIndex)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        const newIndex = emblaApi.selectedScrollSnap()
        setSelectedIndex(newIndex)
        if (onSlideChange) onSlideChange(newIndex)
    }, [emblaApi, onSlideChange])

    // Initial setup and event listeners
    useEffect(() => {
        if (!emblaApi) return

        onSelect() // Initial sync
        emblaApi.on('select', onSelect)

        // Cleanup
        return () => {
            emblaApi.off('select', onSelect)
        }
    }, [emblaApi, onSelect])

    // Handle external mode changes (re-initialization is handled by useEmblaCarousel keying internally usually, 
    // but if we change options we might need to rely on the hook re-running. 
    // The 'axis' option changing will trigger a re-init.)

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index)
    }, [emblaApi])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    return {
        emblaRef,
        emblaApi,
        selectedIndex,
        scrollTo,
        scrollPrev,
        scrollNext
    }
}
