/**
 * Pattern - BottomSheet
 * Mobile-first bottom sheet for pickers and actions
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/design-system/components';

interface BottomSheetProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  title?: string;
}

export function BottomSheet({
  children,
  open,
  onOpenChange,
  className,
  title,
}: BottomSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Mobile: Bottom sheet
          'fixed bottom-0 left-0 right-0 top-auto rounded-t-2xl max-h-[85vh]',
          // Desktop: Center modal
          'md:relative md:rounded-lg md:max-h-[90vh]',
          className
        )}
      >
        {title && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
