'use client';

import Icon from '@/components/ui/Icon';

/**
 * NotLeafResult Component
 *
 * Early-stop result component when Model 1 determines image is non_leaf.
 *
 * IMPORTANT CONTRACT:
 * Model 2 and disease models did NOT run.
 * Does NOT render crop, disease, or confidence scores.
 */
export default function NotLeafResult({ result, renderImage, renderActions, renderLimitations }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Primary Column (Left 7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Image Assessment Card */}
        <div className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm flex flex-col p-5 sm:p-6 gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase text-outline font-semibold">
              Image details
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-[#F5EEDC] text-[#6E4E10] border border-[#D8C7A0] font-mono text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6418]" />
              Leaf not detected
            </span>
          </div>

          <div className="flex flex-col gap-1.5 border-b border-surface-variant pb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary font-display">
              {result?.title || 'No leaf pattern detected'}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {result?.subheading || 'PlantDx could not identify a plant leaf in this image. Further classification was halted to avoid false diagnostic readings.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-container-low border border-surface-variant flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-on-surface">
              What happened?
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              PlantDx checks whether an uploaded image appears to contain a plant leaf before continuing to crop and disease analysis.
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              This image did not match the leaf patterns expected by the current system.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-dashed border-outline-variant bg-surface flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-on-surface text-xs font-semibold">
              <Icon name="info" className="w-4 h-4 text-outline" />
              <span>Supported scope notice</span>
            </div>
            <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
              {result?.scopeNotice || 'PlantDx currently supports plant-leaf analysis only. Non-leaf images, soil, stems, roots, fruit, and broad field landscapes cannot be evaluated by the current disease models.'}
            </p>
          </div>
        </div>

        {/* Uploaded Image Card */}
        {renderImage}

        {/* Practical Photography Retry Guidance */}
        <div className="bg-surface border border-surface-variant rounded-xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-variant pb-3">
            <h3 className="text-sm sm:text-base font-semibold text-primary font-display">
              Try another photo
            </h3>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase text-outline">
              Guidance
            </span>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Follow these recommendations to ensure reliable leaf detection by PlantDx:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result?.retryTips?.map((tip, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-surface-container-low border border-surface-variant flex items-start gap-2.5"
              >
                <Icon name={tip.icon || 'center_focus_strong'} className="w-4 h-4 text-surface-tint mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-on-surface">
                    {tip.title}
                  </span>
                  <span className="text-[11px] text-outline leading-relaxed">
                    {tip.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded bg-surface-container-high text-on-surface-variant text-xs flex items-center gap-2">
            <Icon name="crop_free" className="w-4 h-4 text-outline shrink-0" />
            <span>Keep the leaf large enough in the frame so that leaf margin and color texture occupy most of the photo.</span>
          </div>
        </div>
      </div>

      {/* Secondary Column (Right 5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Actions Module */}
        {renderActions}

        {/* Limitations Module */}
        {renderLimitations}

        {/* Early-Stop Analysis Details Card */}
        <div className="bg-surface border border-surface-variant rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-variant pb-2.5">
            <h3 className="text-sm sm:text-base font-semibold text-primary font-display">
              Analysis details
            </h3>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase text-outline">
              Record
            </span>
          </div>

          <div className="flex flex-col gap-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-1 border-b border-surface-variant">
              <span className="text-outline">Analyzed</span>
              <span className="text-on-surface font-medium">{result?.image?.analyzedAt}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-surface-variant">
              <span className="text-outline">Image file</span>
              <span className="text-on-surface font-medium truncate max-w-[150px]">{result?.image?.name}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-surface-variant">
              <span className="text-outline">Quality check</span>
              <span className="inline-flex items-center gap-1 text-surface-tint font-medium">
                <Icon name="check_circle" className="w-3.5 h-3.5 text-surface-tint" />
                {result?.qualityCheckText || 'Passed (4/4)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-surface-variant">
              <span className="text-outline">Leaf check</span>
              <span className="inline-flex items-center gap-1 text-[#8E4E08] font-semibold">
                <Icon name="warning" className="w-3.5 h-3.5 text-[#8E4E08]" />
                Not matched
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-outline">Analysis pipeline</span>
              <span className="text-on-surface-variant font-medium">Stopped at Stage 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
