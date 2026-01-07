
import React, { useState } from 'react';
import { WeekSummary, ExportFormat } from '../types/export';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

interface WeekSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (selectedWeeks: string[]) => void;
    weeks: WeekSummary[];
    exportFormat: ExportFormat;
}

export const WeekSelectionModal: React.FC<WeekSelectionModalProps> = ({
    open,
    onClose,
    onConfirm,
    weeks,
    exportFormat
}) => {
    const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);

    const toggleWeek = (weekId: string) => {
        setSelectedWeeks(prev =>
            prev.includes(weekId)
                ? prev.filter(id => id !== weekId)
                : [...prev, weekId]
        );
    };

    const selectAll = () => {
        setSelectedWeeks(weeks.map(w => w.weekId));
    };

    const deselectAll = () => {
        setSelectedWeeks([]);
    };

    const handleConfirm = () => {
        onConfirm(selectedWeeks);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right text-xl font-bold font-tajawal">
                        {exportFormat === 'pdf' ? 'تصدير كـ PDF' : 'تصدير Markdown'}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                        {selectedWeeks.length} تم التحديد
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={deselectAll}>
                            إلغاء التحديد
                        </Button>
                        <Button variant="outline" size="sm" onClick={selectAll}>
                            تحديد الكل
                        </Button>
                    </div>
                </div>

                <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {weeks.map((week) => {
                            // Format date range in Arabic
                            const start = parseISO(week.startDate);
                            const end = parseISO(week.endDate);
                            const dateRange = `${format(start, 'd MMM', { locale: ar })} - ${format(end, 'd MMM', { locale: ar })}`;

                            return (
                                <div
                                    key={week.weekId}
                                    className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${selectedWeeks.includes(week.weekId) ? 'bg-primary/5 border-primary' : 'bg-card hover:bg-accent'
                                        }`}
                                    onClick={() => toggleWeek(week.weekId)}
                                >
                                    <Checkbox
                                        checked={selectedWeeks.includes(week.weekId)}
                                        onCheckedChange={() => toggleWeek(week.weekId)}
                                        className="mt-1 ml-3"
                                    />
                                    <div className="flex-1 text-right">
                                        <div className="font-bold text-sm mb-1">{dateRange}</div>
                                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                            <Badge variant="secondary" className="text-xs">
                                                {week.entryCount} مهمة
                                            </Badge>
                                            {week.fieldListCount > 0 && (
                                                <Badge variant="outline" className="text-xs">
                                                    {week.fieldListCount} قائمة
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex-row-reverse justify-start gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        إلغاء
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedWeeks.length === 0}>
                        تصدير ({selectedWeeks.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
