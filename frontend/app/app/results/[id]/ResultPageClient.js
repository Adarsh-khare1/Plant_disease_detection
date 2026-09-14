'use client';

import { useSearchParams } from 'next/navigation';
import ResultWorkspace from '@/components/results/ResultWorkspace';

/**
 * ResultPageClient Component
 *
 * Client-side boundary that resolves route id and `?state=` query parameters
 * using canonical machine statuses:
 * - /app/results/demo?state=healthy
 * - /app/results/demo?state=disease_detected
 * - /app/results/demo?state=not_leaf
 * - /app/results/demo?state=unsupported_crop
 * - /app/results/demo?state=analysis_failed
 */
export default function ResultPageClient({ id, initialDemoState }) {
  const searchParams = useSearchParams();

  const queryState = searchParams.get('state') || initialDemoState;

  const validStates = [
    'healthy',
    'disease_detected',
    'not_leaf',
    'unsupported_crop',
    'analysis_failed',
  ];

  let demoState = 'healthy';

  if (queryState && validStates.includes(queryState)) {
    demoState = queryState;
  } else if (id && validStates.includes(id)) {
    demoState = id;
  }

  return <ResultWorkspace demoState={demoState} />;
}
