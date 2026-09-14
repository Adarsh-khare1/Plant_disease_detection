/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef } from 'react';
import Icon from '@/components/ui/Icon';

/**
 * Image Selected State View
 *
 * Displays:
 * 1. File metadata bar (name, size, type) with Replace / Remove controls
 * 2. Botanical image preview viewport
 * 3. Crop context selector (Tomato, Potato, Not sure)
 * 4. Primary "Check image quality" action
 * 5. Field record privacy note
 */
export default function ImageSelectedState({
  image,
  onReplaceImage,
  onRemoveImage,
  onCheckQuality,
}) {
  const replaceInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onReplaceImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden file input for Replace action */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Replace leaf photo"
      />

      {/* Main Review & Configuration Card */}
      <div className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* File Info & Actions Bar */}
        <div className="px-4 py-2.5 bg-surface-container-low border-b border-surface-variant flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="image" className="w-4 h-4 text-outline" />
            <span className="text-xs sm:text-sm font-semibold text-on-surface truncate max-w-[180px] sm:max-w-xs">
              {image?.name || 'leaf-photo.jpg'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-outline">
              {image?.typeFormatted || 'JPG'} • {image?.sizeFormatted || '2.4 MB'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => replaceInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-xs font-medium py-1 px-1.5 rounded transition-colors cursor-pointer"
            >
              <Icon name="sync" className="w-3.5 h-3.5" />
              <span>Replace image</span>
            </button>
            <span className="text-outline-variant text-xs">•</span>
            <button
              type="button"
              onClick={onRemoveImage}
              className="text-outline hover:text-[#BA1A1A] text-xs font-medium py-1 px-1.5 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Botanical Image Preview Viewport */}
        <div className="relative bg-surface-container w-full h-64 sm:h-80 overflow-hidden flex items-center justify-center">
          <img
            src={image?.previewUrl}
            alt={image?.name || 'Selected leaf preview'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Primary Action Container */}
        <div className="p-4 sm:p-6 flex flex-col gap-3 bg-surface">
          <button
            type="button"
            onClick={onCheckQuality}
            className="w-full min-h-[44px] px-6 py-2.5 bg-primary hover:bg-primary-container active:bg-primary-container text-on-primary rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Icon name="verified" className="w-4 h-4" />
            <span>Check image quality</span>
          </button>
          <p className="text-[11px] sm:text-xs text-outline text-center">
            Disease analysis will not begin until image quality is verified.
          </p>
        </div>
      </div>

      {/* Image privacy note */}
      <div className="bg-surface-container-low border border-surface-variant rounded-lg p-3.5 flex items-start gap-2.5">
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
    </div>
  );
}
