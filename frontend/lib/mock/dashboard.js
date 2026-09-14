/**
 * Centralized Demo Data Fixture for PlantDx Authenticated Dashboard.
 *
 * NOTE: This fixture contains static presentation demo data designed to match
 * the approved Stitch reference screen (Screen ID: e910633964ac481a8c3ae24d8d3d7583).
 *
 * This centralized demo fixture will later be replaced by data from the documented
 * PlantDx API layer. Dashboard aggregation strategy will be finalized during backend
 * integration. Documented endpoints such as GET /api/v1/analyses will provide the underlying
 * analysis records.
 *
 * Do NOT use fake network requests or random dynamic values.
 */

export const dashboardMockData = {
  header: {
    contextSubtitle: 'Tomato & Potato analysis',
    actionText: 'Analyze a leaf',
    actionHref: '/app/analyze',
    profileHref: '/app/profile',
  },
  greeting: {
    title: 'Dashboard',
    subtitle: "Here's an overview of your recent plant analyses.",
    chipText: 'Tomato & Potato analysis',
  },
  overview: {
    totalAnalyses: {
      count: 48,
      label: 'Total analyses',
      meta: '48 analyses',
    },
    healthyResults: {
      count: 34,
      label: 'Healthy results',
      meta: '34 healthy',
    },
    potentialDiseaseResults: {
      count: 14,
      label: 'Potential disease results',
      meta: '14 potential disease',
    },
  },
  cropActivity: {
    title: 'Crop activity',
    subtitle: 'Your analyses by crop.',
    crops: [
      { name: 'Tomato', count: 31, percentage: 66, color: '#1B3B2B' },
      { name: 'Potato', count: 17, percentage: 34, color: '#C87D38' },
    ],
  },
  healthOverview: {
    title: 'Health overview',
    subtitle: 'Healthy and potential disease results.',
    categories: [
      { name: 'Healthy', count: 34, percentage: 71, color: '#2E7D32' },
      { name: 'Potential disease', count: 14, percentage: 29, color: '#991B1B' },
    ],
  },
  quickActions: [
    {
      id: 'analyze',
      title: 'Analyze a leaf',
      subtitle: 'Start new analysis',
      icon: 'photo_camera',
      href: '/app/analyze',
    },
    {
      id: 'history',
      title: 'View history',
      subtitle: 'All records',
      icon: 'history',
      href: '/app/history',
    },
    {
      id: 'library',
      title: 'Disease library',
      subtitle: 'Reference guide',
      icon: 'menu_book',
      href: '/diseases',
    },
    {
      id: 'reports',
      title: 'View reports',
      subtitle: 'Summary views',
      icon: 'description',
      href: '/app/reports',
    },
  ],
  continueWork: {
    badge: 'Analysis in progress',
    crop: 'Tomato',
    description: 'Draft capture ready for review.',
    actionText: 'Continue analysis',
    href: '/app/analyze',
  },
  recentAnalyses: {
    title: 'Recent analyses',
    totalCount: 48,
    displayedCount: 5,
    viewAllHref: '/app/history',
    items: [
      {
        id: 'rec-1',
        image: '/images/landing/hero-leaf.jpg',
        crop: 'Tomato',
        result: 'Example diagnosis',
        confidence: 88,
        date: 'Today, 08:45',
        status: 'Potential disease',
        isHealthy: false,
      },
      {
        id: 'rec-2',
        image: '/images/landing/hero-leaf.jpg',
        crop: 'Potato',
        result: 'Healthy',
        confidence: 94,
        date: 'Yesterday, 16:21',
        status: 'Healthy',
        isHealthy: true,
      },
      {
        id: 'rec-3',
        image: '/images/landing/hero-leaf.jpg',
        crop: 'Tomato',
        result: 'Example diagnosis',
        confidence: 82,
        date: 'Oct 14, 2024',
        status: 'Potential disease',
        isHealthy: false,
      },
      {
        id: 'rec-4',
        image: '/images/landing/hero-leaf.jpg',
        crop: 'Tomato',
        result: 'Healthy',
        confidence: 96,
        date: 'Oct 12, 2024',
        status: 'Healthy',
        isHealthy: true,
      },
      {
        id: 'rec-5',
        image: '/images/landing/hero-leaf.jpg',
        crop: 'Potato',
        result: 'Example diagnosis',
        confidence: 79,
        date: 'Oct 10, 2024',
        status: 'Potential disease',
        isHealthy: false,
      },
    ],
  },
  userProfile: {
    name: 'Alex Chen',
    role: 'Profile',
    initials: 'AC',
    href: '/app/profile',
  },
};
