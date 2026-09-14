'use client';

/**
 * ModelConfidence Component
 *
 * Renders model prediction confidence bar & explanation.
 * Only renders when a valid numeric score exists.
 */
export default function ModelConfidence({ confidence, note }) {
  if (confidence === undefined || confidence === null || isNaN(confidence)) {
    return null;
  }

  // Format as clean integer percentage
  const formattedScore = `${Math.round(confidence)}%`;

  return (
    <div className="p-4 rounded-lg bg-surface-container-low border border-surface-variant flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-on-surface">
          Model confidence
        </span>
        <span className="text-base sm:text-lg font-semibold text-primary font-display">
          {formattedScore}
        </span>
      </div>

      {/* Visual Bar */}
      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
        />
      </div>

      <p className="text-[11px] sm:text-xs text-on-surface-variant pt-0.5 leading-relaxed">
        {note ||
          "This score reflects the model's relative match among its supported classes. It is not the model's overall accuracy or a biological certainty."}
      </p>
    </div>
  );
}
