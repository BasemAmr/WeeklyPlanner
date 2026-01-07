/**
 * Pattern - AppShell
 * Main application shell layout structure
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

export function AppShell({ children, className, dir = 'rtl' }: AppShellProps) {
  return (
    <div className={cn('layout-container', className)} dir={dir}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-transparent to-transparent" />
      
      {children}
    </div>
  );
}

interface AppShellHeaderProps {
  children: ReactNode;
  className?: string;
}

export function AppShellHeader({ children, className }: AppShellHeaderProps) {
  return (
    <header className={cn('layout-header', className)}>
      <div className="max-w-[1920px] mx-auto">
        {children}
      </div>
    </header>
  );
}

interface AppShellMainProps {
  children: ReactNode;
  className?: string;
}

export function AppShellMain({ children, className }: AppShellMainProps) {
  return (
    <main className={cn('layout-main', className)}>
      {children}
    </main>
  );
}

// Export compound component
AppShell.Header = AppShellHeader;
AppShell.Main = AppShellMain;
