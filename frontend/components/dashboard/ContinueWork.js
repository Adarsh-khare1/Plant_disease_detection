import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { dashboardMockData } from '@/lib/mock/dashboard';

export default function ContinueWork() {
  const { continueWork } = dashboardMockData;

  return (
    <div className="bg-surface p-5 rounded-lg border border-border/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span>{continueWork.badge}</span>
        </div>
        <h4 className="font-body text-[15px] font-semibold text-text leading-tight">
          {continueWork.crop}
        </h4>
        <p className="font-body text-[12px] text-text-muted mt-1 leading-relaxed">
          {continueWork.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60">
        <Link
          href={continueWork.href}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-text hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded"
        >
          <span>{continueWork.actionText}</span>
          <Icon name="arrow_forward" className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
