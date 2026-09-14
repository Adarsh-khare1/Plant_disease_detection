'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { dashboardMockData } from '@/lib/mock/dashboard';

export default function AppSidebar({ className = '', onNavClick }) {
  const pathname = usePathname();
  const { userProfile } = dashboardMockData;

  const mainNavItems = [
    { name: 'Dashboard', href: '/app/dashboard', icon: 'grid_view' },
    { name: 'Analyze', href: '/app/analyze', icon: 'document_scanner' },
    { name: 'History', href: '/app/history', icon: 'history' },
    { name: 'Reports', href: '/app/reports', icon: 'description' },
    { name: 'Disease Library', href: '/diseases', icon: 'menu_book' },
  ];

  const utilityNavItems = [
    { name: 'Help', href: '/how-it-works', icon: 'help_outline' },
    { name: 'Settings', href: '/app/settings', icon: 'settings' },
  ];

  const handleLinkClick = () => {
    if (onNavClick) {
      onNavClick();
    }
  };

  return (
    <aside
      className={`w-60 h-screen bg-surface border-r border-border/80 flex flex-col justify-between shrink-0 select-none ${className}`}
      aria-label="Application Sidebar"
    >
      {/* Top Section: Brand + Main Nav */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center border-b border-border/60">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-primary rounded"
            aria-label="PlantDx Home"
          >
            <Image
              src="/images/logo.svg"
              alt="PlantDx"
              width={116}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="p-3 flex flex-col gap-1" aria-label="Main App Navigation">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/app/dashboard' && pathname === '/app');

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-[13px] font-medium leading-none transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-muted hover:text-text hover:bg-surface-low'
                } focus-visible:outline-2 focus-visible:outline-primary`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  name={item.icon}
                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Utilities & Profile */}
      <div className="flex flex-col">
        {/* Utilities Nav */}
        <nav
          className="p-3 border-t border-border/60 flex flex-col gap-1"
          aria-label="Secondary Utilities Navigation"
        >
          {utilityNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-2 rounded text-[13px] font-medium leading-none transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:text-text hover:bg-surface-low'
                } focus-visible:outline-2 focus-visible:outline-primary`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  name={item.icon}
                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="p-3 border-t border-border/60 bg-surface">
          <Link
            href={userProfile.href}
            onClick={handleLinkClick}
            className="flex items-center justify-between p-2 rounded hover:bg-surface-low transition-colors group focus-visible:outline-2 focus-visible:outline-primary"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-body text-[11px] font-semibold text-text border border-border shrink-0"
                aria-hidden="true"
              >
                {userProfile.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body text-[13px] font-medium text-text truncate leading-tight group-hover:text-primary transition-colors">
                  {userProfile.name}
                </span>
                <span className="font-body text-[11px] text-text-muted leading-tight">
                  {userProfile.role}
                </span>
              </div>
            </div>
            <div className="text-text-muted group-hover:text-text p-1">
              <Icon name="more_vert" className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}
