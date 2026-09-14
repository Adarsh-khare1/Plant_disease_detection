'use client';

import Icon from '@/components/ui/Icon';

/**
 * HealthyResult Component
 *
 * Renders:
 * 1. Diagnostic assessment card with cautious healthy wording
 * 2. ModelConfidence component driven by prediction.score
 * 3. Restrained explainability ("Why this result?") section
 * 4. Monitoring & guidance section
 * 5. Analysis details card
 */
export default function HealthyResult({ result, renderConfidence, renderImage, renderActions, renderLimitations }) {
  const cropLabel = result?.prediction?.crop
    ? result.prediction.crop.charAt(0).toUpperCase() + result.prediction.crop.slice(1)
    : 'Tomato';

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
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-primary/10 text-primary font-mono text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-surface-tint" />
                Healthy match
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface">
              <span className="text-outline">Crop:</span>
              <span className="font-semibold">{cropLabel}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-b border-surface-variant pb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary font-display">
              Healthy result
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Among the conditions supported by the current model, this image most closely matched the healthy leaf class.
            </p>
            <p className="text-[11px] sm:text-xs text-outline leading-relaxed pt-1">
              This result does not rule out conditions that are outside PlantDx&apos;s current model scope or symptoms that may not be visible in the uploaded image.
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
            PlantDx found the image most consistent with the healthy class among the supported {cropLabel} conditions.
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

          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-xs font-semibold text-on-surface">
              Image observations
            </span>
            <div className="p-3 rounded bg-surface-container-low border border-surface-variant">
              <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
                Visible leaf appearance was evaluated as part of the model input. No localized symptomatic lesions or chlorotic rings were detected matching known disease patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Monitoring & Guidance */}
        <div className="bg-surface border border-surface-variant rounded-xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center border-b border-surface-variant pb-2.5">
            <h3 className="text-xs sm:text-sm font-semibold text-primary border-b-2 border-primary pb-1 font-display">
              Understanding this result & monitoring
            </h3>
          </div>

          <div className="p-3 rounded bg-surface-container-high text-on-surface-variant text-xs sm:text-sm leading-relaxed">
            PlantDx compares the uploaded image with the classes represented in its trained model. A Healthy result means the healthy class was the strongest match for this image.
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-on-surface">
              Keep monitoring
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result?.guidance?.monitoringTips?.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-surface-container-low border border-surface-variant flex flex-col gap-1"
                >
                  <span className="text-xs font-medium text-on-surface">
                    {tip.title}
                  </span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-surface-variant flex flex-col gap-1">
            <span className="text-xs font-semibold text-on-surface">
              Important guidance note
            </span>
            <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
              Do not apply chemical sprays, fungicides, or fertilizers on the presumption of preventive pest control without confirmed diagnostic need.
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
              <span className="text-on-surface font-medium">Healthy class</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
