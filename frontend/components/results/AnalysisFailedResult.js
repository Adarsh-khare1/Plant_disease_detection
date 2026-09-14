'use client';

import Icon from '@/components/ui/Icon';

/**
 * AnalysisFailedResult Component
 *
 * Restrained error state when an analysis fails to execute.
 * Uses the established PlantDx design tokens.
 *
 * IMPORTANT CONTRACT:
 * Does NOT expose stack traces, Python errors, GPU errors, MongoDB details, or model paths.
 */
export default function AnalysisFailedResult({ result, renderImage, renderActions, renderLimitations }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Primary Column (Left 7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Error Status Card */}
        <div className="bg-surface border border-[#BA1A1A]/30 rounded-xl overflow-hidden shadow-sm flex flex-col p-5 sm:p-6 gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase text-outline font-semibold">
              Pipeline status
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-[#FFDAD6] text-[#93000A] border border-[#BA1A1A]/30 font-mono text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A]" />
              Analysis failed
            </span>
          </div>

          <div className="flex flex-col gap-1.5 border-b border-surface-variant pb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary font-display">
              {result?.title || "We couldn't complete the analysis"}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {result?.subheading || 'Your image was received, but PlantDx encountered an unexpected problem while processing the analysis.'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-container-low border border-surface-variant flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#93000A] text-xs font-semibold">
              <Icon name="error" className="w-4 h-4 text-[#BA1A1A]" />
              <span>What this means</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {result?.reasonText || 'The processing pipeline encountered a temporary error while evaluating the leaf image. This is not a problem with your plant or leaf sample.'}
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
              {result?.retryAdvice || 'Please try submitting the image again or uploading a different photo.'}
            </p>
          </div>
        </div>

        {/* Uploaded Image Card */}
        {renderImage}

        {/* Actionable Next Steps Card */}
        <div className="bg-surface border border-surface-variant rounded-xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-variant pb-3">
            <h3 className="text-sm sm:text-base font-semibold text-primary font-display">
              Recommended next steps
            </h3>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase text-outline">
              Recovery
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded bg-surface-container-low border border-surface-variant flex items-start gap-2.5">
              <Icon name="refresh" className="w-4 h-4 text-surface-tint mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-on-surface">
                  Retry analysis
                </span>
                <span className="text-[11px] text-outline leading-relaxed">
                  Try submitting the image again to resolve transient network or system issues.
                </span>
              </div>
            </div>

            <div className="p-3 rounded bg-surface-container-low border border-surface-variant flex items-start gap-2.5">
              <Icon name="upload_file" className="w-4 h-4 text-surface-tint mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-on-surface">
                  Try another image
                </span>
                <span className="text-[11px] text-outline leading-relaxed">
                  Upload another clear, well-lit photo of your plant leaf.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Column (Right 5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Actions Module */}
        {renderActions}

        {/* Limitations Module */}
        {renderLimitations}

        {/* Analysis Details Card */}
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
            <div className="flex items-center justify-between py-1">
              <span className="text-outline">Pipeline status</span>
              <span className="text-[#93000A] font-semibold">Processing error</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
