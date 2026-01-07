/**
 * Auth Layout - Authentication Pages Layout
 * Future: Layout for login/signup pages
 */

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md p-6">
        {children}
      </div>
    </div>
  );
}
