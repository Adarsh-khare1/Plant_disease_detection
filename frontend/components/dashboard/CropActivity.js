import { dashboardMockData } from "@/lib/mock/dashboard";

export default function CropActivity({ data }) {
  const cropActivity = data || dashboardMockData.cropActivity;
  const { title, subtitle, crops } = cropActivity;

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
          aria-label="Crop activity distribution"
        >
          {crops.map((crop) => (
            <div
              key={crop.name}
              style={{
                width: `${crop.percentage}%`,
                backgroundColor: crop.color,
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
              title={`${crop.name}: ${crop.percentage}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[12px] font-body">
          {crops.map((crop) => (
            <div key={crop.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: crop.color }}
                aria-hidden="true"
              />
              <span className="text-text font-medium">{crop.name}</span>
              <span className="text-text-muted">
                {crop.count} ({crop.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
