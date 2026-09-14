import Icon from '@/components/ui/Icon';

export default function CropCoverage() {
  return (
    <section className="w-full bg-surface-low p-4 rounded-lg mb-10 flex flex-col gap-2 border border-surface-high">
      <div className="flex items-center justify-between">
        <span className="font-body text-[12px] leading-[1.3] uppercase tracking-wider text-text font-semibold">
          Initial crop coverage
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface p-2 rounded border border-surface-container flex items-center gap-2 shadow-xs">
          <Icon name="eco" className="w-[18px] h-[18px] text-primary" />
          <span className="font-body text-[14px] leading-[1.2] font-medium text-text">Tomato</span>
        </div>
        <div className="bg-surface p-2 rounded border border-surface-container flex items-center gap-2 shadow-xs">
          <Icon name="yard" className="w-[18px] h-[18px] text-primary" />
          <span className="font-body text-[14px] leading-[1.2] font-medium text-text">Potato</span>
        </div>
      </div>
      <p className="font-body text-[13px] leading-[1.5] text-text-muted">
        PlantDx currently focuses on Tomato and Potato leaf analysis.
      </p>
    </section>
  );
}
