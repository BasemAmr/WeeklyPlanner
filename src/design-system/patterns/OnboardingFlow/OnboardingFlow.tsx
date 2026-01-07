/**
 * Pattern - OnboardingFlow
 * Multi-step onboarding pattern with progress indicator
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
  children: ReactNode;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

export function OnboardingFlow({ children, className, dir = 'rtl' }: OnboardingFlowProps) {
  return (
    <div className={cn('layout-container items-center justify-center p-6 overflow-y-auto', className)} dir={dir}>
      {children}
    </div>
  );
}

interface OnboardingProgressProps {
  steps: number;
  currentStep: number;
  className?: string;
}

export function OnboardingProgress({ steps, currentStep, className }: OnboardingProgressProps) {
  return (
    <div className={cn('fixed top-6 left-0 right-0 flex justify-center gap-2 z-10', className)}>
      {Array.from({ length: steps }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 rounded-full transition-all duration-300 shadow-sm',
            i === currentStep ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-200'
          )}
        />
      ))}
    </div>
  );
}

interface OnboardingStepProps {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function OnboardingStep({ children, icon, title, description, className }: OnboardingStepProps) {
  return (
    <div className={cn('w-full max-w-md flex flex-col items-center text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-16 md:py-0', className)}>
      {icon && (
        <div className="h-24 w-24 md:h-32 md:w-32 bg-neutral-50 rounded-3xl flex items-center justify-center shadow-sm border border-neutral-100 shrink-0">
          <div className="scale-75 md:scale-100">
            {icon}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{title}</h2>
        {description && (
          <p className="text-neutral-500 text-base md:text-lg leading-relaxed">{description}</p>
        )}
      </div>
      
      {children}
    </div>
  );
}

interface OnboardingActionsProps {
  children: ReactNode;
  className?: string;
}

export function OnboardingActions({ children, className }: OnboardingActionsProps) {
  return (
    <div className={cn('fixed bottom-6 left-0 right-0 px-6 flex justify-center gap-3 z-10', className)}>
      {children}
    </div>
  );
}

// Export compound component
OnboardingFlow.Progress = OnboardingProgress;
OnboardingFlow.Step = OnboardingStep;
OnboardingFlow.Actions = OnboardingActions;
