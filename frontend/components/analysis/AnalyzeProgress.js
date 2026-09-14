import Icon from '@/components/ui/Icon';

/**
 * 4-Step Analysis Progress Bar
 *
 * Steps:
 * 1. Upload
 * 2. Quality check
 * 3. Analyze
 * 4. Result
 *
 * Truthful, restrained design aligned with Stitch specifications and docs.
 */
export default function AnalyzeProgress({ currentState }) {
  const isUpload = currentState === 'upload';
  const isSelected = currentState === 'selected';
  const isQualityPassed = currentState === 'quality_passed';
  const isQualityNeedsImprovement = currentState === 'quality_needs_improvement';
  const isAnalyzing = currentState === 'analyzing';

  return (
    <nav aria-label="Analysis steps" className="flex items-center gap-2 sm:gap-3 pt-1 overflow-x-auto pb-1">
      {/* Step 1: Upload */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {isUpload ? (
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-semibold">
            1
          </span>
        ) : (
          <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[11px]">
            <Icon name="check" className="w-3.5 h-3.5" />
          </span>
        )}
        <span
          className={`text-xs sm:text-sm font-medium ${
            isUpload ? 'text-primary font-semibold' : 'text-on-surface'
          }`}
        >
          1. Upload
        </span>
      </div>

      {/* Divider 1-2 */}
      <div
        className={`w-6 sm:w-8 h-px shrink-0 ${
          !isUpload ? 'bg-primary-container' : 'bg-surface-variant'
        }`}
      />

      {/* Step 2: Quality check */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {isUpload ? (
          <span className="w-5 h-5 rounded-full border border-surface-variant text-outline flex items-center justify-center text-[11px]">
            2
          </span>
        ) : isSelected ? (
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-semibold">
            2
          </span>
        ) : isQualityPassed ? (
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px]">
            <Icon name="check" className="w-3.5 h-3.5" />
          </span>
        ) : isQualityNeedsImprovement ? (
          <span className="w-5 h-5 rounded-full bg-[#E5D7B7] text-[#5A4515] flex items-center justify-center text-[11px]">
            <Icon name="priority_high" className="w-3.5 h-3.5" />
          </span>
        ) : (
          // Analyzing
          <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[11px]">
            <Icon name="check" className="w-3.5 h-3.5" />
          </span>
        )}

        <span
          className={`text-xs sm:text-sm ${
            isSelected || isQualityPassed
              ? 'text-primary font-semibold'
              : isQualityNeedsImprovement
              ? 'text-[#6E4E10] font-semibold'
              : isAnalyzing
              ? 'text-on-surface font-medium'
              : 'text-outline font-medium'
          }`}
        >
          2. Quality check
        </span>

        {isQualityNeedsImprovement && (
          <span className="px-1.5 py-0.5 rounded-sm bg-[#F5EEDC] text-[#6E4E10] border border-[#D8C7A0] text-[10px] uppercase font-mono tracking-wider font-semibold">
            Attention
          </span>
        )}
      </div>

      {/* Divider 2-3 */}
      <div
        className={`w-6 sm:w-8 h-px shrink-0 ${
          isAnalyzing ? 'bg-primary-container' : 'bg-surface-variant'
        }`}
      />

      {/* Step 3: Analyze */}
      <div
        className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${
          isQualityNeedsImprovement || isUpload || isSelected ? 'opacity-50' : ''
        }`}
      >
        {isAnalyzing ? (
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-semibold">
            3
          </span>
        ) : (
          <span className="w-5 h-5 rounded-full bg-surface-container-high text-outline flex items-center justify-center text-[11px]">
            3
          </span>
        )}

        <span
          className={`text-xs sm:text-sm ${
            isAnalyzing ? 'text-primary font-semibold' : 'text-outline'
          }`}
        >
          {isQualityNeedsImprovement ? '3. Analyze (paused)' : '3. Analyze'}
        </span>
      </div>

      {/* Divider 3-4 */}
      <div className="w-6 sm:w-8 h-px bg-surface-variant shrink-0 opacity-50" />

      {/* Step 4: Result */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 opacity-50">
        <span className="w-5 h-5 rounded-full bg-surface-container-high text-outline flex items-center justify-center text-[11px]">
          4
        </span>
        <span className="text-xs sm:text-sm text-outline">4. Result</span>
      </div>
    </nav>
  );
}
