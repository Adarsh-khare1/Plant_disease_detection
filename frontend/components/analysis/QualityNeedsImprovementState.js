/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef } from 'react';
import Icon from '@/components/ui/Icon';

/**
 * Quality Needs Improvement State View
 *
 * Displays:
 * 1. Image review with optional user crop context
 * 2. Quality assessment highlighting failed criteria (Sharpness, Lighting)
 * 3. Actionable "How to improve this photo" guidance box
 * 4. Recovery actions ("Take another photo", "Choose another image")
 * 5. Explanatory notice that analysis is paused until requirements are met (NO Analyze button)
 */
export default function QualityNeedsImprovementState({
  image,
  qualityData,
  onReplaceImage,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onReplaceImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden file input for file selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload replacement leaf photo"
      />

      {/* Main Review & Assessment Card */}
      <div className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* File Info Bar */}
        <div className="px-4 py-2.5 bg-surface-container-low border-b border-surface-variant flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="image" className="w-4 h-4 text-outline" />
            <span className="text-xs sm:text-sm font-semibold text-on-surface truncate max-w-[180px] sm:max-w-xs">
              {image?.name || 'tomato-leaf.jpg'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-outline">
              {image?.typeFormatted || 'JPG'} • {image?.sizeFormatted || '2.4 MB'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-xs font-medium py-1 px-1.5 rounded transition-colors cursor-pointer"
          >
            <Icon name="sync" className="w-3.5 h-3.5" />
            <span>Replace image</span>
          </button>
        </div>

        {/* Botanical Image Preview */}
        <div className="relative bg-surface-container w-full h-64 sm:h-72 overflow-hidden flex items-center justify-center border-b border-surface-variant">
          <img
            src={image?.previewUrl}
            alt={image?.name || 'Leaf preview needing quality improvement'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quality Assessment Panel */}
        <div className="p-4 sm:p-6 flex flex-col gap-4 bg-surface">
          <div className="flex items-center justify-between border-b border-surface-variant pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-primary font-display">
                Image quality
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#F5EEDC] text-[#6E4E10] border border-[#D8C7A0] font-mono text-[10px] sm:text-[11px] font-semibold">
                <Icon name="warning" className="w-3.5 h-3.5 text-[#8C6418]" />
                {qualityData?.summaryBadge || '2 checks need attention'}
              </span>
            </div>
          </div>

          {/* 4 Verification Checks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {qualityData?.checks?.map((check) => {
              const isNeedsImprovement = check.status === 'needs_improvement';
              return (
                <div
                  key={check.id}
                  className={`p-3 rounded-lg border flex flex-col gap-1 ${
                    isNeedsImprovement
                      ? 'border-[#D8C7A0] bg-[#FAF6EE]'
                      : 'border-surface-variant bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        isNeedsImprovement ? 'text-[#6E4E10]' : 'text-on-surface'
                      }`}
                    >
                      {check.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-semibold ${
                        isNeedsImprovement ? 'text-[#8C6418]' : 'text-surface-tint'
                      }`}
                    >
                      <Icon
                        name={isNeedsImprovement ? 'error' : 'check_circle'}
                        className="w-3.5 h-3.5"
                      />
                      {check.statusText}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
                    {check.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Actionable Improvement Tips */}
          <div className="p-3.5 sm:p-4 rounded-lg border border-[#D8C7A0] bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[#6E4E10] text-xs sm:text-sm font-semibold">
              <Icon name="tips_and_updates" className="w-4 h-4" />
              <span>How to improve this photo</span>
            </div>
            <ul className="flex flex-col gap-1.5 pt-1 text-[11px] sm:text-xs text-on-surface-variant">
              {qualityData?.improvementTips?.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-semibold text-[#6E4E10] shrink-0">
                    {tip.category}:
                  </span>
                  <span>{tip.advice}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Leaf Visibility Notice */}
          <div className="pt-2 border-t border-surface-variant">
            <div className="p-3 rounded bg-surface-container-high flex items-start gap-2.5">
              <Icon name="visibility" className="w-4 h-4 text-outline mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">
                  Leaf visibility
                </span>
                <span className="text-[11px] text-outline leading-relaxed mt-0.5">
                  Also check that the full affected area of the leaf is visible. Automated checks evaluate clarity and balance, not botanical specimen placement.
                </span>
              </div>
            </div>
          </div>

          {/* Recovery Actions (NO Analyze Button) */}
          <div className="flex flex-col gap-2.5 pt-3 border-t border-surface-variant">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:flex-1 min-h-[44px] px-6 py-2.5 bg-primary hover:bg-primary-container active:bg-primary-container text-on-primary rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="photo_camera" className="w-4 h-4" />
                <span>Take another photo</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 border border-surface-variant hover:bg-surface-container-high text-on-surface rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Icon name="folder_open" className="w-4 h-4" />
                <span>Choose another image</span>
              </button>
            </div>

            <div className="pt-1 text-center sm:text-left">
              <p className="text-[11px] text-outline">
                Analysis is paused until quality requirements are met.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
