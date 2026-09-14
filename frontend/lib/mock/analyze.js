/**
 * PlantDx Analyze Flow Mock Fixtures
 *
 * This centralized presentation fixture will eventually be replaced by data
 * from the documented PlantDx backend quality-check response (/api/v1/images/{id}/quality).
 *
 * The Product Image Quality Gate evaluates raw photograph clarity for actionable
 * user guidance (resolution, sharpness/blur, exposure/lighting, contrast),
 * distinct from the deterministic ML DSP preprocessing pipeline.
 */

export const mockAnalyzeData = {
  // Default sample image used in demo states or as fallback reference
  defaultSampleImage: {
    name: 'leaf-photo.jpg',
    sizeFormatted: '2.4 MB',
    typeFormatted: 'JPG',
    sizeBytes: 2516582,
    previewUrl: '/images/analyze/sample-leaf.jpg',
  },

  // Presentation fixtures for image quality gate
  qualityPassed: {
    status: 'passed',
    title: 'Ready for analysis',
    headline: 'Image quality check',
    subtitle: 'Your photo is suitable for analysis.',
    summaryBadge: '4 checks passed',
    checks: [
      {
        id: 'resolution',
        label: 'Resolution',
        status: 'good',
        statusText: 'Good',
        description: 'Image dimensions are suitable for analysis.',
      },
      {
        id: 'sharpness',
        label: 'Sharpness',
        status: 'good',
        statusText: 'Good',
        description: 'Leaf details are clear enough for analysis.',
      },
      {
        id: 'lighting',
        label: 'Lighting',
        status: 'good',
        statusText: 'Good',
        description: 'Lighting is even across the visible leaf.',
      },
      {
        id: 'contrast',
        label: 'Contrast',
        status: 'good',
        statusText: 'Good',
        description: 'Clear contrast between leaf tissue and background.',
      },
    ],
  },

  qualityNeedsImprovement: {
    status: 'needs_improvement',
    title: 'Needs improvement',
    headline: 'Image quality check',
    subtitle: 'This photo may not provide enough detail for a reliable analysis.',
    summaryBadge: '2 checks need attention',
    checks: [
      {
        id: 'resolution',
        label: 'Resolution',
        status: 'good',
        statusText: 'Good',
        description: 'Image dimensions are suitable for analysis.',
      },
      {
        id: 'sharpness',
        label: 'Sharpness',
        status: 'needs_improvement',
        statusText: 'Needs improvement',
        description: 'Leaf details appear blurred.',
        tip: 'Hold the camera steady and tap the leaf to focus before taking the photo.',
      },
      {
        id: 'lighting',
        label: 'Lighting',
        status: 'needs_improvement',
        statusText: 'Needs improvement',
        description: 'Parts of the leaf are too dark or unevenly lit.',
        tip: 'Move to brighter, even lighting and avoid strong shadows or direct glare.',
      },
      {
        id: 'contrast',
        label: 'Contrast',
        status: 'good',
        statusText: 'Good',
        description: 'The leaf remains distinguishable from the background.',
      },
    ],
    improvementTips: [
      {
        category: 'Sharpness',
        advice: 'Hold the camera steady and tap the leaf to focus before taking the photo.',
      },
      {
        category: 'Lighting',
        advice: 'Move to brighter, even lighting and avoid strong shadows or direct glare.',
      },
    ],
  },

  // Authoritative user-facing stages during analysis (no fictional lab telemetry or fake percentages)
  analyzingStages: [
    {
      id: 'received',
      label: 'Image received',
      status: 'complete',
      meta: 'Complete',
    },
    {
      id: 'quality_checked',
      label: 'Image quality checked',
      status: 'complete',
      meta: 'Complete',
    },
    {
      id: 'identifying_leaf',
      label: 'Identifying leaf',
      status: 'in_progress',
      meta: 'In progress',
    },
    {
      id: 'identifying_crop',
      label: 'Identifying crop',
      status: 'pending',
      meta: 'Pending',
    },
    {
      id: 'analyzing_leaf',
      label: 'Analyzing leaf',
      status: 'pending',
      meta: 'Pending',
    },
  ],
};
