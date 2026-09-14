'use client';

import Icon from '@/components/ui/Icon';

/**
 * DiseaseResult Component
 *
 * Data-driven component for displaying disease classification outcomes.
 * Driven by prediction structure:
 * - prediction.crop: 'potato' | 'tomato'
 * - prediction.classId: 'early_blight' | 'late_blight'
 * - prediction.displayName: 'Early Blight' | 'Late Blight'
 * - prediction.score: number
 */
export default function DiseaseResult({ result, renderConfidence, renderImage, renderActions, renderLimitations }) {
  const cropLabel = result?.prediction?.crop
    ? result.prediction.crop.charAt(0).toUpperCase() + result.prediction.crop.slice(1)
    : 'Tomato';

  const diseaseDisplayName = result?.prediction?.displayName || result?.title || 'Early Blight';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Primary Column (Left 7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Diagnostic Assessment Card */}
        <div className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm flex flex-col p-5 sm:p-6 gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase text-outline font-semibold">
                Diagnostic assessment
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-[#FDA95F]/20 text-[#6D3900] border border-[#FDA95F]/40 font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8E4E08]" />
                Potential disease
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface">
              <span className="text-outline">Crop:</span>
              <span className="font-semibold">{cropLabel}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-b border-surface-variant pb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary font-display">
              {diseaseDisplayName}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {result?.subheading || 'Observed visual patterns in leaf specimen closely align with symptomatic features of this condition.'}
            </p>
          </div>

          {/* Model Confidence Component */}
          {renderConfidence}
        </div>

        {/* Uploaded Leaf Image Card */}
        {renderImage}

        {/* Why This Result? (Explainability Section) */}
        <div className="bg-surface border border-surface-variant rounded-xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-variant pb-3">
            <h3 className="text-sm sm:text-base font-semibold text-primary font-display">
              Why this result?
            </h3>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase text-outline">
              Explainability
            </span>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            PlantDx identified visual patterns in the uploaded leaf that were most consistent with this result among the supported classes.
          </p>

          <div className="p-3.5 rounded-lg border border-dashed border-outline-variant bg-surface-container-low flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
              <Icon name="psychology" className="w-4 h-4 text-surface-tint" />
              <span>Visual explanation — Future feature</span>
            </div>
            <p className="text-[11px] sm:text-xs text-outline leading-relaxed">
              Visual explanation is not available in the current prototype. A future model version may highlight image regions that contributed most to the prediction without modifying original pixel data.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold text-on-surface">
              Image observations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {result?.explanation?.observations?.map((obs, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-surface-container-low border border-surface-variant flex flex-col gap-0.5"
                >
                  <span className="text-xs font-medium text-on-surface">
                    {obs.title}
                  </span>
                  <span className="text-[11px] text-outline">
                    {obs.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimal Educational Condition Overview */}
        <div className="bg-surface border border-surface-variant rounded-xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center border-b border-surface-variant pb-2.5">
            <h3 className="text-xs sm:text-sm font-semibold text-primary border-b-2 border-primary pb-1 font-display">
              About this condition & management guidance
            </h3>
          </div>

          <div className="p-3 rounded bg-surface-container-high text-on-surface-variant text-xs sm:text-sm leading-relaxed">
            {result?.educational?.tabText || 'Condition information will be shown here for supported disease classes.'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface">Overview</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {result?.educational?.overview || 'Common fungal disease affecting solanaceous crop foliage.'}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface">Common symptoms</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {result?.educational?.symptoms || 'Concentric dark brown rings forming target-like foliar spots.'}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface">Favorable conditions</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {result?.educational?.favorableConditions || 'Warm temperatures with extended wet periods or high humidity.'}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface">Affected plant areas</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {result?.educational?.affectedAreas || 'Typically progresses upward from lower canopy foliage.'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-variant flex flex-col gap-1">
            <span className="text-xs font-semibold text-on-surface">
              Management & cultural guidance outline
            </span>
            <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
              {result?.educational?.managementNote || 'Consult local agricultural extension specialists for region-specific IPM (Integrated Pest Management) protocols. Strictly avoid unauthorized chemical applications.'}
            </p>
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
              <span className="text-outline">Crop</span>
              <span className="text-on-surface font-medium">{cropLabel}</span>
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
              <span className="text-outline">Prediction match</span>
              <span className="text-on-surface font-medium">{diseaseDisplayName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
