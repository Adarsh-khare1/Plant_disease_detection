import { Suspense } from 'react';
import ResultPageClient from './ResultPageClient';

export const metadata = {
  title: 'Analysis Result | PlantDx',
  description: 'Review diagnostic assessment, model confidence, and management guidance for analyzed crop leaves.',
};

/**
 * PlantDx Analysis Result Route (/app/results/[id])
 *
 * Uses the authenticated AppLayout from parent layout.js.
 * Supports demo visual QA via ?state= (healthy, disease, not-leaf, unsupported-crop, analysis-failed).
 */
export default async function ResultPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-outline font-mono">
          Loading analysis result...
        </div>
      }
    >
      <ResultPageClient
        id={resolvedParams?.id}
        initialDemoState={resolvedSearchParams?.state}
      />
    </Suspense>
  );
}
