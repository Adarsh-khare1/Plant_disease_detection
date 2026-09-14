import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { dashboardMockData } from '@/lib/mock/dashboard';

export default function AppHeader({ onToggleMobileNav }) {
  const { header } = dashboardMockData;

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-border/80 bg-surface flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Tablet/Mobile Toggle & Context Indicator */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 text-text-muted hover:text-text rounded-md hover:bg-surface-low focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Toggle navigation menu"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>
        )}
        <span className="font-body text-[13px] text-text-muted hidden sm:inline-block">
          {header.contextSubtitle}
        </span>
      </div>

      {/* Right: Primary Action & Profile Link */}
      <div className="flex items-center gap-3">
        <Link
          href={header.actionHref}
          className="h-9 px-3.5 sm:px-4 bg-primary text-white rounded flex items-center gap-2 text-[13px] font-medium active:bg-primary/90 transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="document_scanner" className="w-4 h-4" />
          <span>{header.actionText}</span>
        </Link>

        <Link
          href={header.profileHref}
          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-text-muted border border-border shrink-0 hover:text-text hover:bg-surface-low transition-colors focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="User profile"
        >
          <Icon name="person" className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
