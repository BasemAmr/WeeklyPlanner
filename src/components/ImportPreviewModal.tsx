
import React, { useState } from 'react';
import { ImportPreview, ConflictInfo } from '../types/export';
import { WeekData } from '@/lib/shared/types';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ChevronDown, AlertTriangle, List } from 'lucide-react';

interface ImportPreviewModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    preview: ImportPreview | null;
    className?: string;
}

export const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
    open,
    onClose,
    onConfirm,
    preview,
    className
}) => {
    if (!preview) return null;

    const totalWeeks = preview.weekData.length;
    const conflictCount = preview.conflicts.length;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-[700px] ${className}`} dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right text-xl font-bold font-tajawal">
                        معاينة الاستيراد
                    </DialogTitle>
                </DialogHeader>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 text-right">
                    <div className="flex items-center gap-2 text-yellow-700 font-medium mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span>سيتم دمج البيانات</span>
                    </div>
                    <p className="text-sm text-yellow-600 pr-6">
                        سيتم إضافة المهام الجديدة إلى الأسابيع الموجودة. لن يتم حذف أي بيانات موجودة.
                    </p>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <Badge variant="outline" className="text-sm">
                        {totalWeeks} أسابيع
                    </Badge>
                    {conflictCount > 0 && (
                        <Badge variant="destructive" className="text-sm">
                            {conflictCount} تعارض (تحديث)
                        </Badge>
                    )}
                </div>

                <ScrollArea className="h-[400px] rounded-md border p-4 bg-muted/20">
                    <div className="space-y-3">
                        {preview.weekData.map((week) => (
                            <WeekPreviewCard
                                key={week.weekId}
                                week={week}
                                conflict={preview.conflicts.find(c => c.weekId === week.weekId)}
                            />
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex-row-reverse justify-start gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        إلغاء
                    </Button>
                    <Button onClick={onConfirm}>
                        استيراد ودمج
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const WeekPreviewCard: React.FC<{ week: WeekData, conflict?: ConflictInfo }> = ({ week, conflict }) => {
    const [isOpen, setIsOpen] = useState(false);

    const startDate = parseISO(week.startDate);
    const endDate = parseISO(week.endDate);
    const dateRange = `${format(startDate, 'd MMMM', { locale: ar })} - ${format(endDate, 'd MMMM', { locale: ar })}`;

    const entryCount = week.days.reduce((acc, day) => acc + day.entries.length, 0);
    const fieldListCount = week.fieldLists.length;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg bg-card">
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-3 hover:bg-accent/50 transition-colors">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    <div className="flex items-center gap-3">
                        {conflict && <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">موجود مسبقاً</Badge>}
                        <div className="text-left">
                            <div className="font-bold text-sm font-tajawal">{dateRange}</div>
                            <div className="text-xs text-muted-foreground">
                                {entryCount} مهمة • {fieldListCount} قائمة
                            </div>
                        </div>
                    </div>
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3 pt-0 border-t">
                <div className="space-y-4 mt-3">
                    {week.days.filter(d => d.entries.length > 0).map(day => (
                        <div key={day.date} className="text-right">
                            <h4 className="text-xs font-bold text-muted-foreground mb-1">
                                {day.dayOfWeek}
                            </h4>
                            <ul className="space-y-1">
                                {day.entries.map(entry => (
                                    <li key={entry.id} className="text-sm flex items-start gap-2">
                                        <span className="text-xs mt-1">{entry.completed ? '✅' : '⬜'}</span>
                                        <span>{entry.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {week.fieldLists.length > 0 && (
                        <div className="pt-2 border-t">
                            <h4 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1 justify-end">
                                <List className="h-3 w-3" />
                                القوائم الإضافية
                            </h4>
                            {week.fieldLists.map(fl => (
                                <div key={fl.id} className="mb-2 text-right">
                                    <div className="text-sm font-semibold">{fl.title}</div>
                                    <ul className="space-y-1 mr-2">
                                        {fl.entries.map(entry => (
                                            <li key={entry.id} className="text-sm text-gray-600">
                                                - {entry.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
