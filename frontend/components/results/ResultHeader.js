'use client';

import Icon from '@/components/ui/Icon';

/**
 * ResultHeader Component
 *
 * Renders:
 * 1. Diagnostic Status Badge (Healthy, Potential disease, Leaf not detected, Crop not supported, Analysis failed)
 * 2. Main Page Title & Subtitle
 * 3. Adaptable 4-Step Pipeline Workflow Indicator
 */
export default function ResultHeader({ result }) {
  const status = result?.status || 'healthy';

  // Badge styling configuration
  const badgeConfig = {
    healthy: {
      bg: 'bg-primary/10 text-primary border border-primary/20',
      dot: 'bg-surface-tint',
      text: result?.badgeText || 'No supported disease pattern identified',
    },
    disease_detected: {
      bg: 'bg-[#FDA95F]/20 text-[#6D3900] border border-[#FDA95F]/40',
      dot: 'bg-[#8E4E08]',
      text: result?.badgeText || 'Analysis complete',
    },
    not_leaf: {
      bg: 'bg-[#F5EEDC] text-[#6E4E10] border border-[#D8C7A0]',
      dot: 'bg-[#8C6418]',
      text: result?.badgeText || 'Leaf not detected',
    },
    unsupported_crop: {
      bg: 'bg-[#F5EEDC] text-[#6E4E10] border border-[#D8C7A0]',
      dot: 'bg-[#8C6418]',
      text: result?.badgeText || 'Crop not supported',
    },
    analysis_failed: {
      bg: 'bg-[#FFDAD6] text-[#93000A] border border-[#BA1A1A]/30',
      dot: 'bg-[#BA1A1A]',
      text: result?.badgeText || 'Analysis failed',
    },
  };

  const badge = badgeConfig[status] || badgeConfig.healthy;

  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-surface-variant">
      {/* Dynamic Context Badge & Header Text */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm font-mono text-[11px] font-semibold ${badge.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              {badge.text}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-primary font-display tracking-tight">
            Analysis result
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant">
            {result?.subheading || 'Review the result and supporting information below.'}
          </p>
        </div>
      </div>

      {/* Adaptable 4-Step Progress Indicator */}
      <div className="flex items-center gap-2.5 pt-1 overflow-x-auto select-none">
        {/* Step 1: Upload */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[11px]">
            <Icon name="check" className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs text-on-surface font-medium">1. Upload</span>
        </div>
        <div className="w-6 sm:w-8 h-px bg-primary-container shrink-0" />

        {/* Step 2: Quality Check */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[11px]">
            <Icon name="check" className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs text-on-surface font-medium">2. Quality check</span>
        </div>
        <div className={`w-6 sm:w-8 h-px shrink-0 ${status === 'not_leaf' || status === 'analysis_failed' ? 'bg-surface-variant' : 'bg-primary-container'}`} />

        {/* Step 3: Analyze / Leaf Check */}
        {status === 'not_leaf' ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#F5EEDC] text-[#6E4E10] flex items-center justify-center text-[11px] font-semibold">
              <Icon name="info" className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs text-[#6E4E10] font-semibold">3. Leaf check</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[11px]">
              <Icon name="check" className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs text-on-surface font-medium">3. Analyze</span>
          </div>
        )}
        <div className={`w-6 sm:w-8 h-px shrink-0 ${status === 'healthy' || status === 'disease_detected' ? 'bg-primary' : 'bg-surface-variant'}`} />

        {/* Step 4: Result / Crop Check / Disease Analysis */}
        {status === 'healthy' || status === 'disease_detected' ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-semibold">
              4
            </span>
            <span className="text-xs text-primary font-semibold">4. Result</span>
          </div>
        ) : status === 'unsupported_crop' ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#F5EEDC] text-[#6E4E10] flex items-center justify-center text-[11px] font-semibold">
              <Icon name="info" className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs text-[#6E4E10] font-semibold">4. Crop check (unsupported)</span>
          </div>
        ) : status === 'not_leaf' ? (
          <div className="flex items-center gap-1.5 shrink-0 opacity-50">
            <span className="w-5 h-5 rounded-full bg-surface-container-high text-outline flex items-center justify-center text-[11px]">
              4
            </span>
            <span className="text-xs text-outline">4. Crop / disease analysis</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#FFDAD6] text-[#93000A] flex items-center justify-center text-[11px] font-semibold">
              !
            </span>
            <span className="text-xs text-[#93000A] font-semibold">4. Analysis failed</span>
          </div>
        )}
      </div>
    </div>
  );
}
