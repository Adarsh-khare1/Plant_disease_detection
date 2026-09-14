import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import OverviewMetrics from '@/components/dashboard/OverviewMetrics';
import CropActivity from '@/components/dashboard/CropActivity';
import HealthOverview from '@/components/dashboard/HealthOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import ContinueWork from '@/components/dashboard/ContinueWork';
import RecentAnalyses from '@/components/dashboard/RecentAnalyses';
import { dashboardMockData } from '@/lib/mock/dashboard';

export const metadata = {
  title: 'Dashboard — PlantDx',
  description: 'Agricultural leaf analysis overview and recent results.',
};

export default function DashboardPage() {
  const { greeting, header } = dashboardMockData;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Page Header / Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] sm:text-[32px] text-text font-medium leading-tight">
            Dashboard
          </h1>
          <p className="font-body text-[14px] text-text-muted mt-1">
            {greeting.subtitle}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border/80 text-[12px] font-body text-text-muted shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{greeting.chipText}</span>
          </div>

          {/* Contextual Action Button */}
          <Link
            href={header.actionHref}
            className="h-9 px-4 bg-primary text-white rounded inline-flex items-center gap-2 text-[13px] font-medium active:bg-primary/90 transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-primary shrink-0"
          >
            <Icon name="document_scanner" className="w-4 h-4" />
            <span>{header.actionText}</span>
          </Link>
        </div>
      </div>

      {/* 1. Overview Metrics */}
      <OverviewMetrics />

      {/* 2. Crop Activity & Health Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CropActivity />
        <HealthOverview />
      </div>

      {/* 3. Quick Actions & Continue Work Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <ContinueWork />
        </div>
      </div>

      {/* 4. Recent Analyses Table */}
      <RecentAnalyses />
    </div>
  );
}
