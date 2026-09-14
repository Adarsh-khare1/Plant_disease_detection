'use client';

import Link from 'next/link';
import Icon from '@/components/ui/Icon';

/**
 * ResultActions Component
 *
 * Provides working workflow navigation actions:
 * - Analyze another leaf (/app/analyze)
 * - View history (/app/history)
 * - Back to dashboard (/app/dashboard)
 */
export default function ResultActions({ status = 'healthy' }) {
  const isFailed = status === 'analysis_failed';

  return (
    <div className="bg-surface border border-surface-variant rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
      {/* Primary Action Button */}
      <Link
        href="/app/analyze"
        className="w-full min-h-[44px] px-6 py-2.5 bg-primary hover:bg-primary-container active:bg-primary-container text-on-primary rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
      >
        <Icon name={isFailed ? 'refresh' : 'add_photo_alternate'} className="w-4 h-4" />
        <span>{isFailed ? 'Try again' : 'Analyze another leaf'}</span>
      </Link>

      {/* History & Dashboard Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-surface-variant/60">
        <Link
          href="/app/history"
          className="h-9 px-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-surface-variant"
        >
          <Icon name="history" className="w-3.5 h-3.5 text-outline" />
          <span>View history</span>
        </Link>

        <Link
          href="/app/dashboard"
          className="h-9 px-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-surface-variant"
        >
          <Icon name="grid_view" className="w-3.5 h-3.5 text-outline" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
