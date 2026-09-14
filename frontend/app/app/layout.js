"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { useAuth } from "@/lib/auth/useAuth";

export default function AppLayout({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-stone-50 flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Verifying authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-stone-50 flex flex-col items-center justify-center space-y-3">
        <p className="text-xs text-stone-500 font-medium">Redirecting to login...</p>
      </div>
    );
  }

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
