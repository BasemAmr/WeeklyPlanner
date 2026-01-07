import { useState } from 'react'
import { Settings, Trash2 } from 'lucide-react'
import { Button } from '@/design-system/components'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/design-system/components'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/design-system/components'
import { useSettings } from '@/contexts/SettingsContext'
import { cn } from '@/lib/utils'
import { clearAllData } from '@/lib/db'

interface SettingsModalProps {
    onDataCleared?: () => void
}

export function SettingsModal({ onDataCleared }: SettingsModalProps) {
    const { weekStartDay, setWeekStartDay, isSetupComplete, resetSetup } = useSettings()
    const [showClearConfirm, setShowClearConfirm] = useState(false)
    const [isClearing, setIsClearing] = useState(false)

    const handleClearData = async () => {
        setIsClearing(true)
        try {
            await clearAllData()
            resetSetup() // This creates the "fresh start"
            setShowClearConfirm(false)
            onDataCleared?.()
            window.location.reload()
        } catch (e) {
            console.error('Failed to clear data', e)
            alert('فشل حذف البيانات')
        } finally {
            setIsClearing(false)
        }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-neutral-900">
                        <Settings className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">الإعدادات</DialogTitle>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        {/* Week Start Day */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium leading-none text-neutral-900">بداية الأسبوع</h4>
                            <p className="text-sm text-neutral-500">اختر اليوم الذي يبدأ به أسبوعك</p>

                            <div className="grid grid-cols-3 gap-3 pt-2">
                                {[
                                    { label: 'السبت', value: 6 },
                                    { label: 'الأحد', value: 0 },
                                    { label: 'الإثنين', value: 1 },
                                ].map((day) => (
                                    <button
                                        key={day.value}
                                        onClick={() => !isSetupComplete && setWeekStartDay(day.value)}
                                        disabled={isSetupComplete}
                                        className={cn(
                                            "flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all",
                                            isSetupComplete ? "cursor-not-allowed opacity-80" : "cursor-pointer",
                                            weekStartDay === day.value
                                                ? "border-neutral-900 bg-neutral-900 text-white"
                                                : "border-neutral-100 bg-white text-neutral-600 hover:border-neutral-200"
                                        )}
                                    >
                                        <span className="font-bold">{day.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Data */}
                        <div className="border-t pt-4 space-y-3">
                            <h4 className="text-sm font-medium leading-none text-red-600">منطقة الخطر</h4>
                            <Button
                                variant="destructive"
                                className="w-full gap-2"
                                onClick={() => setShowClearConfirm(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                                حذف جميع البيانات
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Clear Confirmation */}
            <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                            سيتم حذف جميع الأسابيع والمهام. لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse gap-2">
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleClearData}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isClearing}
                        >
                            {isClearing ? 'جاري الحذف...' : 'حذف الكل'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
