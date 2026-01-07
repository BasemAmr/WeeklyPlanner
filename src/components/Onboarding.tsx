import { useState } from 'react'
import { ArrowLeft, Calendar, CheckCircle, Settings, FileText, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 h-screen w-screen overflow-hidden" dir="rtl">

            {/* Progress Dots */}
            <div className="absolute top-12 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            i === slide ? "w-8 bg-neutral-900" : "w-2 bg-neutral-200"
                        )}
                    />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-md flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Icon Circle */}
                <div className="h-32 w-32 bg-neutral-50 rounded-3xl flex items-center justify-center shadow-sm border border-neutral-100">
                    {slides[slide].icon}
                </div>

                {/* Text */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                        {slides[slide].title}
                    </h2>
                    <p className="text-lg text-neutral-500 leading-relaxed px-4">
                        {slides[slide].description}
                    </p>
                </div>

                {/* Configuration Slide Specific UI */}
                {slide === 2 && (
                    <div className="w-full grid grid-cols-1 gap-3 px-4 pt-4">
                        {weekOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setSelectedDay(opt.value)}
                                className={cn(
                                    "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 outline-none",
                                    selectedDay === opt.value
                                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg scale-[1.02]"
                                        : "border-neutral-100 bg-white text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50"
                                )}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-lg">{opt.label}</span>
                                    <span className={cn("text-xs", selectedDay === opt.value ? "text-neutral-400" : "text-neutral-400")}>
                                        {opt.sub}
                                    </span>
                                </div>
                                {selectedDay === opt.value && (
                                    <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                                        <Check className="h-3.5 w-3.5 text-neutral-900" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="absolute bottom-10 left-0 right-0 px-6 max-w-md mx-auto w-full flex items-center justify-between">

                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={prevSlide}
                    className={cn(
                        "text-neutral-400 hover:text-neutral-900 transition-opacity",
                        slide === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                >
                    السابق
                </Button>

                {/* Next/Finish Button */}
                {slide === slides.length - 1 ? (
                    <Button
                        size="lg"
                        className="px-8 rounded-full font-bold shadow-lg shadow-neutral-200"
                        onClick={handleComplete}
                        disabled={selectedDay === null}
                    >
                        ابدأ التخطيط
                        <CheckCircle className="mr-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        variant="default"
                        className="rounded-full px-6"
                        onClick={nextSlide}
                    >
                        التالي
                        <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
