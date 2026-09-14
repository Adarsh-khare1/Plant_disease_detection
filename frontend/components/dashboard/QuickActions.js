import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { dashboardMockData } from '@/lib/mock/dashboard';

export default function QuickActions() {
  const { quickActions } = dashboardMockData;

  return (
    <div className="flex flex-col">
      <h3 className="font-body text-[13px] font-semibold text-text mb-3">
        Quick actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="bg-surface p-4 rounded-lg border border-border/80 hover:border-primary/40 hover:bg-surface-low transition-all shadow-xs flex flex-col justify-between group focus-visible:outline-2 focus-visible:outline-primary"
          >
            <div className="mb-3">
              <Icon
                name={action.icon}
                className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors"
              />
            </div>
            <div>
              <span className="font-body text-[13px] font-semibold text-text block leading-tight">
                {action.title}
              </span>
              <span className="font-body text-[11px] text-text-muted mt-0.5 block">
                {action.subtitle}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
