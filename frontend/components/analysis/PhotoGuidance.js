/* eslint-disable @next/next/no-img-element */
import Icon from '@/components/ui/Icon';

/**
 * Reusable Photographic Field Guidance Card
 *
 * Implements the approved Stitch design specifications:
 * - 4 core field photography guidelines
 * - Good vs Poor reference standards with visual examples
 * - Optional field record privacy note
 */
export default function PhotoGuidance({ showPrivacy = true, className = '' }) {
  return (
    <aside className={`flex flex-col gap-4 ${className}`} aria-label="Field photography guidance">
      {/* Guidance Card */}
      <div className="bg-surface border border-surface-variant rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-surface-variant pb-3">
          <h3 className="text-base sm:text-lg font-semibold text-primary font-display">
            For a better analysis
          </h3>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-mono font-medium text-outline">
            Field Guide
          </span>
        </div>

        {/* 4 Core Guidelines */}
        <ul className="flex flex-col gap-3 sm:gap-3.5">
          <li className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center shrink-0 text-primary mt-0.5">
              <Icon name="crop_free" className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-medium text-on-surface">
                Photograph one leaf clearly
              </span>
              <span className="text-[11px] sm:text-xs text-on-surface-variant">
                Center a single leaf against soil or foliage.
              </span>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center shrink-0 text-primary mt-0.5">
              <Icon name="wb_sunny" className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-medium text-on-surface">
                Use natural or even lighting
              </span>
              <span className="text-[11px] sm:text-xs text-on-surface-variant">
                Avoid harsh glare, deep shadows, or flash reflections.
              </span>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center shrink-0 text-primary mt-0.5">
              <Icon name="center_focus_strong" className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-medium text-on-surface">
                Keep the leaf in focus
              </span>
              <span className="text-[11px] sm:text-xs text-on-surface-variant">
                Ensure leaf surface and vein textures are sharp.
              </span>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center shrink-0 text-primary mt-0.5">
              <Icon name="pan_tool" className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-medium text-on-surface">
                Avoid covering damaged areas
              </span>
              <span className="text-[11px] sm:text-xs text-on-surface-variant">
                Keep fingers and tools clear of symptomatic spots.
              </span>
            </div>
          </li>
        </ul>

        {/* Educational Visual Comparison */}
        <div className="flex flex-col gap-2 pt-2 border-t border-surface-variant">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-mono font-medium text-outline mb-1">
            Reference Standards
          </span>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* Good Photo Reference Card */}
            <div className="border border-[#2E6B4F]/30 bg-[#F4F6F4] rounded-lg p-2 sm:p-2.5 flex flex-col gap-1.5">
              <div className="relative w-full h-24 sm:h-28 rounded overflow-hidden bg-surface-container">
                <img
                  src="/images/analyze/good-reference.jpg"
                  alt="Reference standard showing a clear, well-focused tomato leaf in natural lighting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 bg-primary text-on-primary px-1.5 py-0.5 rounded-sm font-mono text-[9px] sm:text-[10px] flex items-center gap-1 uppercase font-semibold">
                  <Icon name="check" className="w-3 h-3" />
                  <span>Good</span>
                </div>
              </div>
              <ul className="flex flex-col gap-0.5 mt-0.5">
                <li className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="text-surface-tint font-bold">✓</span> Leaf fully visible
                </li>
                <li className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="text-surface-tint font-bold">✓</span> Sharp veins & texture
                </li>
                <li className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <span className="text-surface-tint font-bold">✓</span> Natural daylight
                </li>
              </ul>
            </div>

            {/* Poor Photo Reference Card */}
            <div className="border border-[#BA1A1A]/30 bg-[#FBF7F7] rounded-lg p-2 sm:p-2.5 flex flex-col gap-1.5">
              <div className="relative w-full h-24 sm:h-28 rounded overflow-hidden bg-surface-container">
                <img
                  src="/images/analyze/poor-reference.jpg"
                  alt="Reference standard showing a blurred leaf obscured by fingers and harsh shadows"
                  className="w-full h-full object-cover grayscale opacity-90"
                />
                <div className="absolute top-1.5 left-1.5 bg-[#BA1A1A] text-white px-1.5 py-0.5 rounded-sm font-mono text-[9px] sm:text-[10px] flex items-center gap-1 uppercase font-semibold">
                  <Icon name="close" className="w-3 h-3" />
                  <span>Poor</span>
                </div>
              </div>
              <ul className="flex flex-col gap-0.5 mt-0.5">
                <li className="flex items-center gap-1 text-[11px] text-outline">
                  <span className="text-[#BA1A1A] font-bold">✕</span> Blurry or unaligned
                </li>
                <li className="flex items-center gap-1 text-[11px] text-outline">
                  <span className="text-[#BA1A1A] font-bold">✕</span> Harsh dark shadows
                </li>
                <li className="flex items-center gap-1 text-[11px] text-outline">
                  <span className="text-[#BA1A1A] font-bold">✕</span> Leaf cropped / covered
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Image privacy note */}
      {showPrivacy && (
        <div className="bg-surface-container-low border border-surface-variant rounded-lg p-3 sm:p-4 flex items-start gap-2.5">
          <Icon name="lock" className="w-4 h-4 text-outline mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-on-surface">
              About your image
            </span>
            <span className="text-[11px] sm:text-xs text-outline leading-relaxed mt-0.5">
              Your image is currently used only within this prototype flow. Storage and retention behavior will be finalized with backend integration.
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
