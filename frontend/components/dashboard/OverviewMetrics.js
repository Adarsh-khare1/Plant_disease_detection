import { dashboardMockData } from '@/lib/mock/dashboard';

export default function OverviewMetrics() {
  const { totalAnalyses, healthyResults, potentialDiseaseResults } =
    dashboardMockData.overview;

  const cards = [
    {
      label: totalAnalyses.label,
      count: totalAnalyses.count,
      meta: totalAnalyses.meta,
      countColor: 'text-text',
    },
    {
      label: healthyResults.label,
      count: healthyResults.count,
      meta: healthyResults.meta,
      countColor: 'text-success',
    },
    {
      label: potentialDiseaseResults.label,
      count: potentialDiseaseResults.count,
      meta: potentialDiseaseResults.meta,
      countColor: 'text-error',
    },
  ];

  return (
    <section aria-label="Overview Metrics" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-surface p-5 rounded-lg border border-border/80 shadow-xs flex flex-col justify-between"
        >
          <span className="font-body text-[12px] text-text-muted font-medium">
            {card.label}
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span
              className={`font-display text-[32px] sm:text-[36px] font-medium leading-none ${card.countColor}`}
            >
              {card.count}
            </span>
            <span className="font-body text-[12px] text-text-muted">
              {card.meta}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
