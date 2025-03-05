import React from 'react';
import Dashboard from './pages/dashboard';
import { ThemeProvider } from '@/components/theme-provider';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
};

export default App;
