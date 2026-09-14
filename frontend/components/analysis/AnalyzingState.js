/* eslint-disable @next/next/no-img-element */
'use client';

import Icon from '@/components/ui/Icon';

/**
 * Analyzing State View
 *
 * Implements clean, truthful, restrained PlantDx presentation:
 * 1. Botanical leaf image framing with corner registration marks
 * 2. Calm processing engine with indeterminate progress line
 * 3. Truthful execution status stages aligned with the 4-model pipeline
 * 4. Right informational rail ("About this analysis", "About your image")
 * 5. Strictly free of lab jargon, fake telemetry, fake percentages, and unverified disease scope
 */
export default function AnalyzingState({
  image,
  stages = [],
  onCancel,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Primary Operational Column (Left / Specimen & Progress) - 8 cols */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        {/* Leaf Image Card */}
        <section className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
          {/* Top Info Bar */}
          <div className="px-4 py-2.5 bg-surface-container-low border-b border-surface-variant flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="image" className="w-4 h-4 text-outline" />
              <span className="text-[11px] font-mono text-on-surface uppercase tracking-wider font-semibold truncate max-w-[200px] sm:max-w-xs">
                {image?.name || 'leaf-photo.jpg'} • {image?.typeFormatted || 'JPG'} • {image?.sizeFormatted || '2.4 MB'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-surface-tint bg-surface px-2 py-0.5 rounded border border-surface-variant">
              <Icon name="check" className="w-3.5 h-3.5" />
              <span>Image uploaded</span>
            </div>
          </div>

          {/* Botanical Image Viewport with Corner Registration Marks */}
          <div className="relative bg-surface-container-high w-full overflow-hidden flex items-center justify-center min-h-[260px] max-h-[420px]">
            <img
              src={image?.previewUrl}
              alt={image?.name || 'Leaf photograph being analyzed'}
              className="w-full h-full max-h-[420px] object-contain select-none"
            />
            {/* Subtle field corner registration markers evoking scientific herbarium plates */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-surface/90 pointer-events-none" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-surface/90 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-surface/90 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-surface/90 pointer-events-none" />
          </div>
        </section>

        {/* Calm Processing Status Module */}
        <section
          aria-labelledby="processing-status-heading"
          className="bg-surface border border-surface-variant rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container-low border border-surface-variant flex items-center justify-center shrink-0 text-primary">
                {/* Steady spinner */}
                <svg
                  className="animate-spin h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2
                  id="processing-status-heading"
                  className="text-base sm:text-lg font-semibold text-on-surface font-display"
                >
                  Analyzing your leaf
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  This usually takes a few moments.
                </p>
              </div>
            </div>
          </div>

          {/* Indeterminate botanical progress line */}
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-primary rounded-full animate-indeterminate" />
          </div>

          {/* Truthful Architectural Processing Stages */}
          <div className="border-t border-surface-variant pt-3.5 flex flex-col gap-2">
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-outline mb-0.5 font-medium">
              Execution Status
            </div>

            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              {stages.map((stage) => {
                const isComplete = stage.status === 'complete';
                const isInProgress = stage.status === 'in_progress';

                return (
                  <li
                    key={stage.id}
                    className={`flex items-center gap-2.5 px-2 py-1 rounded transition-colors ${
                      isInProgress
                        ? 'text-primary font-medium bg-surface-container-low border border-surface-variant/50'
                        : isComplete
                        ? 'text-on-surface'
                        : 'text-outline opacity-60'
                    }`}
                  >
                    {isComplete ? (
                      <Icon
                        name="check_circle"
                        className="w-4 h-4 text-surface-tint shrink-0"
                      />
                    ) : isInProgress ? (
                      <span className="w-2 h-2 rounded-full bg-surface-tint animate-pulse shrink-0 ml-1 mr-1" />
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-outline shrink-0 ml-1 mr-1" />
                    )}

                    <span className={isInProgress ? 'font-semibold' : ''}>
                      {stage.label}
                    </span>

                    <span
                      className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider ml-auto ${
                        isInProgress
                          ? 'text-primary font-semibold'
                          : isComplete
                          ? 'text-outline'
                          : 'text-outline'
                      }`}
                    >
                      {stage.meta}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Operational Safeguards & Actions */}
          <div className="border-t border-surface-variant pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
              <Icon name="hourglass_empty" className="w-4 h-4 text-outline shrink-0" />
              <span>You can remain on this page while the analysis completes.</span>
            </div>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-outline hover:text-[#BA1A1A] hover:bg-[#FBF7F7] transition-colors text-xs font-medium self-start sm:self-auto cursor-pointer"
              >
                <Icon name="close" className="w-3.5 h-3.5" />
                <span>Cancel analysis</span>
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Informational Rail (Right Rail) - 4 cols */}
      <aside className="lg:col-span-4 flex flex-col gap-4" aria-label="Analysis information">
        {/* About this analysis Card */}
        <article className="bg-surface border border-surface-variant rounded-xl p-4 sm:p-5 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center justify-between border-b border-surface-variant pb-2.5">
            <h3 className="text-sm sm:text-base font-semibold text-on-surface font-display">
              About this analysis
            </h3>
            <span className="font-mono text-[10px] sm:text-[11px] text-outline uppercase">
              PlantDx
            </span>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            PlantDx evaluates visible foliar characteristics across the leaf surface, texture, and coloration against supported crop conditions.
          </p>

          <div className="p-3 bg-surface-container-low rounded-lg border border-surface-variant flex flex-col gap-1">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-primary font-semibold">
              What happens next
            </span>
            <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
              When analysis completes, you will receive condition assessment details, observed pattern matches, and practical next steps.
            </p>
          </div>
        </article>

        {/* Image Use & Privacy Card */}
        <article className="bg-surface border border-surface-variant rounded-xl p-4 sm:p-5 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-outline font-semibold">
            <Icon name="lock" className="w-3.5 h-3.5 text-surface-tint" />
            <span>About your image</span>
          </div>
          <h4 className="text-xs sm:text-sm font-semibold text-on-surface">
            Image use
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Your image is currently used only within this prototype flow. Storage and retention behavior will be finalized with backend integration.
          </p>
        </article>
      </aside>
    </div>
  );
}
