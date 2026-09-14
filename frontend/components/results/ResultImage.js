/* eslint-disable @next/next/no-img-element */
'use client';

import Icon from '@/components/ui/Icon';

/**
 * ResultImage Component
 *
 * Renders the uploaded photograph display card:
 * 1. Top bar with filename, format/size, analysis timestamp
 * 2. Image preview viewport
 * 3. Bottom bar with capture format note
 */
export default function ResultImage({ image }) {
  if (!image) return null;

  return (
    <div className="bg-surface border border-surface-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
      {/* File Info Bar */}
      <div className="px-4 py-2.5 bg-surface-container-low border-b border-surface-variant flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Icon name="image" className="w-4 h-4 text-outline" />
          <span className="text-xs sm:text-sm font-semibold text-on-surface truncate max-w-[180px] sm:max-w-xs">
            {image.name || 'leaf-photo.jpg'}
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] text-outline">
            • {image.sizeFormatted || '2.4 MB'} • Analyzed: {image.analyzedAt || 'Today, 10:42'}
          </span>
        </div>
        <span className="font-mono text-[10px] sm:text-[11px] text-outline uppercase font-semibold">
          {image.imageTag || 'Uploaded image'}
        </span>
      </div>

      {/* Image Preview Viewport */}
      <div className="relative bg-surface-container w-full h-64 sm:h-72 overflow-hidden flex items-center justify-center">
        <img
          src={image.previewUrl}
          alt={image.name || 'Uploaded leaf photo'}
          className="w-full h-full object-cover select-none"
        />
      </div>

      {/* Bottom Verification Bar */}
      <div className="px-4 py-2.5 bg-surface border-t border-surface-variant flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-outline">
          Original unedited capture • No bounding annotations applied
        </span>
        <span className="font-mono text-[10px] sm:text-[11px] text-surface-tint uppercase font-semibold">
          Image format
        </span>
      </div>
    </div>
  );
}
