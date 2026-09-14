/**
 * Centralized Mock Dataset for PlantDx Reports
 */
export const mockReportsData = {
  summary: {
    totalAnalyses: 24,
    passedQuality: 22,
    rejectedQuality: 2,
    healthyCount: 14,
    diseaseDetectedCount: 6,
    nonLeafOrUnsupportedCount: 4,
    lastActivity: '2026-09-14 10:42 AM',
  },
  cropDistribution: [
    { name: 'Tomato', count: 15, percentage: 62.5, color: 'bg-emerald-600' },
    { name: 'Potato', count: 6, percentage: 25.0, color: 'bg-teal-600' },
    { name: 'Non-leaf / Unsupported', count: 3, percentage: 12.5, color: 'bg-amber-600' },
  ],
  conditionBreakdown: [
    { name: 'Healthy (Tomato / Potato)', count: 14, percentage: 58.3, status: 'healthy' },
    { name: 'Early Blight (Tomato / Potato)', count: 4, percentage: 16.7, status: 'disease' },
    { name: 'Late Blight (Tomato / Potato)', count: 2, percentage: 8.3, status: 'disease' },
    { name: 'Non-leaf or Unsupported crop', count: 4, percentage: 16.7, status: 'other' },
  ],
  recentSummaries: [
    { id: 'rep-sep-2026', title: 'September 2026 Monthly Field Summary', date: '2026-09-01', totalScans: 18, diseaseRate: '16.6%' },
    { id: 'rep-aug-2026', title: 'August 2026 Monthly Field Summary', date: '2026-08-01', totalScans: 28, diseaseRate: '21.4%' },
  ],
};
