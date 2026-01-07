/**
 * App Layout - Main Application Layout
 * Wrapper for the main app shell structure
 */

import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
