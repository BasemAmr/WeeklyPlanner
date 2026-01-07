/**
 * Onboarding Layout - Onboarding Flow Layout
 * Layout wrapper for onboarding screens
 */

import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      {children}
    </div>
  );
}
