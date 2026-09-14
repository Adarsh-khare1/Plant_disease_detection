import { dashboardMockData } from '@/lib/mock/dashboard';

export default function HealthOverview() {
  const { title, subtitle, categories } = dashboardMockData.healthOverview;

  return (
    <div className="bg-surface p-5 rounded-lg border border-border/80 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="font-body text-[14px] font-semibold text-text leading-tight">
          {title}
        </h3>
        <p className="font-body text-[12px] text-text-muted mt-0.5">
          {subtitle}
        </p>
      </div>

      <div className="my-5 flex flex-col gap-3">
        {/* Proportional Split Bar */}
        <div
          className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden flex"
          role="progressbar"
          aria-label="Health result distribution"
        >
          {categories.map((cat) => (
            <div
              key={cat.name}
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: cat.color,
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
              title={`${cat.name}: ${cat.percentage}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[12px] font-body">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
                aria-hidden="true"
              />
              <span className="text-text font-medium">{cat.name}</span>
              <span className="text-text-muted">
                {cat.count} ({cat.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
