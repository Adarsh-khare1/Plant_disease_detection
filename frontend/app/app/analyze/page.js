import { Suspense } from 'react';
import AnalyzeWorkspace from '@/components/analysis/AnalyzeWorkspace';

export const metadata = {
  title: 'Analyze a Leaf | PlantDx',
  description: 'Upload and inspect crop leaf images with PlantDx automated quality checks and disease analysis.',
};

/**
 * PlantDx Analyze Flow Page
 *
 * Wrapped in Suspense boundary for useSearchParams compatibility in Next.js App Router.
 */
export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-sm text-outline font-mono">
          Loading workspace...
        </div>
      }
    >
      <AnalyzeWorkspace />
    </Suspense>
  );
}
