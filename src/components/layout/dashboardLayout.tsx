import { ReactNode } from 'react';
import { ModeToggle } from '../mode-toggle';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="mr-auto font-bold">Dashboard Financiero</div>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
