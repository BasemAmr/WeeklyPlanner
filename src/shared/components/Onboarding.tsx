import { useState } from 'react'
import { ArrowLeft, Calendar, CheckCircle, Settings, FileText, Check } from 'lucide-react'
import { Button } from '@/design-system/components'
import { cn } from '@/lib/utils'
import { useSettings } from '@/contexts/SettingsContext'

export function Onboarding() {
    const [slide, setSlide] = useState(0)
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const { completeSetup } = useSettings()

    const slides = [
        {
            id: 'welcome',
            title: 'مرحباً بك في مخطط الأسبوع',
            description: 'نظم أسبوعك بسهولة وببساطة. كل مهامك في مكان واحد، بدون تعقيد.',
            icon: <Calendar className="h-16 w-16 text-neutral-900" />,
        },
        {
            id: 'features',
            title: 'بسيط وقوي',
            description: 'إضافة مهام سريعة، طباعة جدولك كملف PDF، وحفظ كل شيء محلياً على جهازك.',
            icon: <FileText className="h-16 w-16 text-neutral-900" />,
        },
        {
            id: 'setup',
            title: 'إعداد بداية الأسبوع',
            description: 'اختر متى يبدأ أسبوعك. لن يمكنك تغيير هذا لاحقاً إلا بحذف جميع البيانات.',
            icon: <Settings className="h-16 w-16 text-neutral-900" />,
        }
    ]

    const nextSlide = () => {
        if (slide < slides.length - 1) {
            setSlide(s => s + 1)
        }
    }

    const prevSlide = () => {
        if (slide > 0) {
            setSlide(s => s - 1)
        }
    }

    const handleComplete = () => {
        if (selectedDay !== null) {
            completeSetup(selectedDay)
        }
    }

    const weekOptions = [
        { label: 'السبت', value: 6, sub: 'Saturday' },
        { label: 'الأحد', value: 0, sub: 'Sunday' },
        { label: 'الإثنين', value: 1, sub: 'Monday' },
    ]

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-50 text-neutral-900 overflow-hidden" dir="rtl">

            {/* Progress Dots */}
            <div className="flex-none pt-8 pb-2 flex justify-center gap-2 z-10 shrink-0">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                            i === slide ? "w-8 bg-neutral-900" : "w-1.5 bg-neutral-300"
                        )}
                    />
                ))}
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
                <div className="min-h-full w-full max-w-md mx-auto flex flex-col items-center justify-center p-6 py-8 md:py-12 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Icon Circle */}
                    <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-neutral-100 shrink-0">
                        <div className="scale-90 md:scale-100">
                            {slides[slide].icon}
                        </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-3 md:space-y-4 max-w-[280px] md:max-w-full">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-balance">
                            {slides[slide].title}
                        </h2>
                        <p className="text-base md:text-lg text-neutral-500 leading-relaxed text-balance">
                            {slides[slide].description}
                        </p>
                    </div>

                    {/* Configuration Slide Specific UI */}
                    {slide === 2 && (
                        <div className="w-full grid grid-cols-1 gap-3 pt-2">
                            {weekOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSelectedDay(opt.value)}
                                    className={cn(
                                        "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 outline-none w-full",
                                        selectedDay === opt.value
                                            ? "border-neutral-900 bg-neutral-900 text-white shadow-lg scale-[1.02]"
                                            : "border-neutral-100 bg-white text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50"
                                    )}
                                >
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="font-bold text-lg leading-none">{opt.label}</span>
                                        <span className={cn("text-xs font-medium", selectedDay === opt.value ? "text-neutral-400" : "text-neutral-400")}>
                                            {opt.sub}
                                        </span>
                                    </div>
                                    {selectedDay === opt.value && (
                                        <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center shrink-0">
                                            <Check className="h-3.5 w-3.5 text-neutral-900" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex-none p-6 pb-8 md:pb-6 bg-white/50 backdrop-blur-sm border-t border-neutral-100 w-full z-10">
                <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={prevSlide}
                        className={cn(
                            "text-neutral-400 hover:text-neutral-900 transition-opacity min-w-[80px]",
                            slide === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}
                    >
                        السابق
                    </Button>

                    {/* Next/Finish Button */}
                    {slide === slides.length - 1 ? (
                        <Button
                            size="lg"
                            className="flex-1 rounded-xl font-bold shadow-lg shadow-neutral-200/50"
                            onClick={handleComplete}
                            disabled={selectedDay === null}
                        >
                            <span className="mx-2">ابدأ التخطيط</span>
                            <CheckCircle className="h-5 w-5" />
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            variant="default"
                            className="rounded-xl px-8"
                            onClick={nextSlide}
                        >
                            <span className="mx-2">التالي</span>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
