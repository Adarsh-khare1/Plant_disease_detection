'use client';

import { useEffect } from 'react';
import AppSidebar from './AppSidebar';
import Icon from '@/components/ui/Icon';

export default function MobileNavigation({ isOpen, onClose }) {
  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-surface shadow-xl z-10">
        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text rounded-md focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Close navigation menu"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>
        <AppSidebar className="w-full h-full border-r-0" onNavClick={onClose} />
      </div>
    </div>
  );
}
