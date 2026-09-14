'use client';

import Icon from '@/components/ui/Icon';

/**
 * ResultLimitations Component
 *
 * Renders important limitations & scope notes in right column.
 */
export default function ResultLimitations({ customLimitations }) {
  const defaultLimitations = [
    'PlantDx analyzes visible patterns in leaf images.',
    'Results depend on image quality and the conditions represented in the trained model.',
    'Some plant-health problems or similar-looking conditions may not be distinguishable from an image alone.',
    'Use results as supporting information rather than the sole basis for crop-management decisions.',
  ];

  const limitations = customLimitations || defaultLimitations;

  return (
    <div className="bg-surface border border-surface-variant rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2 border-b border-surface-variant pb-2.5">
        <Icon name="info" className="w-4 h-4 text-outline" />
        <h3 className="text-sm sm:text-base font-semibold text-primary font-display">
          Important limitations
        </h3>
      </div>

      <ul className="flex flex-col gap-2 text-xs sm:text-sm text-on-surface-variant">
        {limitations.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-primary font-bold shrink-0">•</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
