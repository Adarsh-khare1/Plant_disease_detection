/**
 * PlantDx Result Flow Mock Fixtures
 *
 * Centralized presentation fixtures for diagnostic results.
 * Concepts match the documented future API analysis response structure.
 *
 * Canonical Machine Statuses:
 * - healthy
 * - disease_detected
 * - not_leaf
 * - unsupported_crop
 * - analysis_failed
 *
 * Stage Data Schema:
 * - leafCheck: { label: 'leaf' | 'non_leaf', score: number } | null
 * - cropCheck: { label: 'potato' | 'tomato' | 'other', score: number } | null
 * - prediction: { crop: 'potato' | 'tomato', classId: 'healthy' | 'early_blight' | 'late_blight', displayName: string, score: number } | null
 */

export const mockResultFixtures = {
  healthy: {
    id: 'res-demo-healthy-01',
    status: 'healthy',
    badgeText: 'No supported disease pattern identified',
    title: 'Healthy result',
    subheading: 'Among the conditions supported by the current model, this image most closely matched the healthy leaf class.',
    scopeDisclaimer: 'This result does not rule out conditions that are outside PlantDx\'s current model scope or symptoms that may not be visible in the uploaded image.',
    leafCheck: { label: 'leaf', score: 98 },
    cropCheck: { label: 'tomato', score: 96 },
    prediction: {
      crop: 'tomato',
      classId: 'healthy',
      displayName: 'Healthy result',
      score: 94,
    },
    confidenceNote: "Model confidence reflects how strongly the image matched this result among the supported classes. It is not a measure of overall model accuracy.",
    image: {
      name: 'tomato-leaf.jpg',
      previewUrl: '/images/results/sample-healthy-leaf.jpg',
      typeFormatted: 'JPG',
      sizeFormatted: '2.4 MB',
      analyzedAt: 'Today, 10:42',
      imageTag: 'Crop: Tomato',
    },
    qualityCheckText: 'Passed (4/4)',
    explanation: {
      title: 'Why this result?',
      text: "PlantDx found the image most consistent with the healthy class among the supported Tomato conditions.",
      futureNote: "A future model version may highlight image regions that contributed most to the prediction without modifying original pixel data.",
      observation: "Visible leaf appearance was evaluated as part of the model input. No localized symptomatic lesions or chlorotic rings were detected matching known disease patterns.",
    },
    guidance: {
      tabText: "PlantDx compares the uploaded image with the classes represented in its trained model. A Healthy result means the healthy class was the strongest match for this image.",
      monitoringTips: [
        {
          title: "Continue observation",
          desc: "Continue observing the plant for visible changes over regular growth cycles.",
        },
        {
          title: "Check new foliage",
          desc: "If new spots, discoloration, wilting, or damage appear, analyze a new clear image.",
        },
        {
          title: "Local extension",
          desc: "Consider local agricultural extension advice when symptoms persist or affect multiple plants.",
        },
      ],
      importantNote: "Do not apply chemical sprays, fungicides, or fertilizers on the presumption of preventive pest control without confirmed diagnostic need.",
    },
  },

  disease_detected: {
    id: 'res-demo-disease-01',
    status: 'disease_detected',
    badgeText: 'Analysis complete',
    title: 'Early Blight',
    subheading: 'Observed visual patterns in leaf specimen closely align with symptomatic features of early blight.',
    leafCheck: { label: 'leaf', score: 99 },
    cropCheck: { label: 'tomato', score: 97 },
    prediction: {
      crop: 'tomato',
      classId: 'early_blight',
      displayName: 'Early Blight',
      score: 88,
    },
    confidenceNote: "This score reflects the model's relative match among its supported classes. It is not the model's overall accuracy or a biological certainty.",
    image: {
      name: 'tomato-leaf.jpg',
      previewUrl: '/images/results/sample-disease-leaf.jpg',
      typeFormatted: 'JPG',
      sizeFormatted: '2.4 MB',
      analyzedAt: 'Today, 10:42',
      imageTag: 'Crop: Tomato',
    },
    qualityCheckText: 'Passed (4/4)',
    explanation: {
      title: 'Why this result?',
      text: "PlantDx identified visual patterns in the uploaded leaf that were most consistent with this result among the supported classes.",
      futureNote: "A future model version may highlight image regions that contributed most to the prediction without modifying original pixel data.",
      observations: [
        { title: 'Color variation', desc: 'Distinct foliage tones' },
        { title: 'Surface patterns', desc: 'Leaf texture cues' },
        { title: 'Localized areas', desc: 'Symptomatic tissue' },
      ],
    },
    educational: {
      tabText: "Condition information will be shown here for supported disease classes.",
      overview: "Common fungal disease affecting tomato and potato foliage, stems, and fruits.",
      symptoms: "Concentric dark brown rings on older leaves forming characteristic target-like spots.",
      favorableConditions: "Moderate to warm temperatures with extended wet periods or high relative humidity.",
      affectedAreas: "Typically progresses upward from lower canopy leaves before affecting upper foliage.",
      managementNote: "Consult local agricultural extension specialists for region-specific IPM (Integrated Pest Management) protocols. Strictly avoid unauthorized chemical applications.",
    },
  },

  not_leaf: {
    id: 'res-demo-not-leaf-01',
    status: 'not_leaf',
    badgeText: 'Leaf not detected',
    title: 'No leaf pattern detected',
    subheading: 'PlantDx could not identify a plant leaf in this image. Further classification was halted to avoid false diagnostic readings.',
    scopeNotice: 'PlantDx currently supports plant-leaf analysis only. Non-leaf images, soil, stems, roots, fruit, and broad field landscapes cannot be evaluated by the current disease models.',
    leafCheck: { label: 'non_leaf', score: 92 },
    cropCheck: null, // Did not run
    prediction: null, // Did not run
    image: {
      name: 'soil-sample.jpg',
      previewUrl: '/images/results/sample-not-leaf.jpg',
      typeFormatted: 'JPG',
      sizeFormatted: '2.1 MB',
      analyzedAt: 'Today, 10:42',
      imageTag: 'Uploaded image',
    },
    qualityCheckText: 'Passed (4/4)',
    retryTips: [
      {
        icon: 'center_focus_strong',
        title: 'Photograph one leaf clearly',
        desc: 'Focus on a single, whole leaf rather than the overall field or plant bed.',
      },
      {
        icon: 'filter_center_focus',
        title: 'Keep the leaf in focus',
        desc: 'Hold your camera steady to prevent motion blur and capture fine vein details.',
      },
      {
        icon: 'pan_tool',
        title: 'Avoid covering the leaf',
        desc: 'Keep fingers, shadows, tools, or soil debris from obscuring leaf surfaces.',
      },
      {
        icon: 'wb_sunny',
        title: 'Use even lighting',
        desc: 'Diffuse natural daylight works best. Avoid heavy lens flare or deep shade.',
      },
    ],
  },

  unsupported_crop: {
    id: 'res-demo-unsupported-crop-01',
    status: 'unsupported_crop',
    badgeText: 'Crop not supported',
    title: 'Plant leaf detected',
    subheading: 'PlantDx identified the image as a plant leaf, but it could not confidently match it to Tomato or Potato. Disease analysis was not run.',
    reasonText: 'PlantDx first checks whether an image contains a leaf, then determines whether it can route that leaf to one of its supported crop models. This leaf could not be reliably routed to the Tomato or Potato analysis pipeline.',
    leafCheck: { label: 'leaf', score: 97 },
    cropCheck: { label: 'other', score: 89 },
    prediction: null, // Did not run
    image: {
      name: 'leaf-image.jpg',
      previewUrl: '/images/results/sample-unsupported-crop.jpg',
      typeFormatted: 'JPG',
      sizeFormatted: '2.1 MB',
      analyzedAt: 'Today, 10:42',
      imageTag: 'Uploaded image',
    },
    qualityCheckText: 'Passed (4/4)',
    supportedCrops: ['Tomato', 'Potato'],
    guidanceTips: [
      {
        icon: 'center_focus_strong',
        title: 'Make sure one leaf is clearly visible',
        desc: 'Focus on a single leaf rather than multiple overlapping foliage.',
      },
      {
        icon: 'crop_free',
        title: 'Keep full leaf shape visible',
        desc: 'Ensure edges and leaf margins are within the camera frame where possible.',
      },
      {
        icon: 'wb_sunny',
        title: 'Use even lighting',
        desc: 'Diffuse natural daylight prevents harsh shadows or misleading contrast.',
      },
      {
        icon: 'block',
        title: 'Avoid heavy obstruction',
        desc: 'Keep fingers, stems, shadows, and soil debris away from leaf tissue.',
      },
    ],
  },

  analysis_failed: {
    id: 'res-demo-failed-01',
    status: 'analysis_failed',
    badgeText: 'Analysis failed',
    title: "We couldn't complete the analysis",
    subheading: 'Your image was received, but PlantDx encountered an unexpected problem while processing the analysis.',
    reasonText: 'The processing pipeline encountered a temporary error while evaluating the leaf image. This is not a problem with your plant or leaf sample.',
    leafCheck: null, // Only include stage data actually known before failure
    cropCheck: null,
    prediction: null,
    image: {
      name: 'leaf-photo.jpg',
      previewUrl: '/images/results/sample-healthy-leaf.jpg',
      typeFormatted: 'JPG',
      sizeFormatted: '2.4 MB',
      analyzedAt: 'Today, 10:42',
      imageTag: 'Uploaded image',
    },
    qualityCheckText: 'Passed (4/4)',
    retryAdvice: 'Please try submitting the image again or uploading a different photo.',
  },
};
