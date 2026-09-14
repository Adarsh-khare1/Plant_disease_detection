'use client';

import { useState } from 'react';
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import MobileNavigation from '@/components/layout/MobileNavigation';

export default function AppLayout({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-text">
      {/* Desktop Persistent Sidebar (>= 1024px / lg) */}
      <div className="hidden lg:block shrink-0">
        <AppSidebar className="sticky top-0 h-screen" />
      </div>

      {/* Tablet & Mobile Drawer Navigation (< 1024px / lg) */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onToggleMobileNav={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
