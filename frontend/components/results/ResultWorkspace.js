'use client';

import ResultHeader from './ResultHeader';
import ResultImage from './ResultImage';
import ModelConfidence from './ModelConfidence';
import HealthyResult from './HealthyResult';
import DiseaseResult from './DiseaseResult';
import NotLeafResult from './NotLeafResult';
import UnsupportedCropResult from './UnsupportedCropResult';
import AnalysisFailedResult from './AnalysisFailedResult';
import ResultActions from './ResultActions';
import ResultLimitations from './ResultLimitations';
import { mockResultFixtures } from '@/lib/mock/results';

/**
 * ResultWorkspace Coordinator
 *
 * Orchestrates rendering of the 5 canonical result application states:
 * 1. healthy
 * 2. disease_detected
 * 3. not_leaf
 * 4. unsupported_crop
 * 5. analysis_failed
 */
export default function ResultWorkspace({ resultData, demoState }) {
  // Determine active result fixture based on prop or canonical demo state string
  const resolveResult = () => {
    if (resultData) return resultData;
    if (demoState && mockResultFixtures[demoState]) return mockResultFixtures[demoState];
    return mockResultFixtures.healthy;
  };

  const activeResult = resolveResult();
  const status = activeResult?.status || 'healthy';

  // ModelConfidence receives prediction.score (only when prediction exists)
  const renderConfidence = activeResult?.prediction?.score != null ? (
    <ModelConfidence
      confidence={activeResult.prediction.score}
      note={activeResult.confidenceNote}
    />
  ) : null;

  const renderImage = <ResultImage image={activeResult?.image} />;
  const renderActions = <ResultActions status={status} />;
  const renderLimitations = <ResultLimitations />;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Workflow Progress & Header */}
      <ResultHeader result={activeResult} />

      {/* State View Rendering */}
      {status === 'healthy' && (
        <HealthyResult
          result={activeResult}
          renderConfidence={renderConfidence}
          renderImage={renderImage}
          renderActions={renderActions}
          renderLimitations={renderLimitations}
        />
      )}

      {status === 'disease_detected' && (
        <DiseaseResult
          result={activeResult}
          renderConfidence={renderConfidence}
          renderImage={renderImage}
          renderActions={renderActions}
          renderLimitations={renderLimitations}
        />
      )}

      {status === 'not_leaf' && (
        <NotLeafResult
          result={activeResult}
          renderImage={renderImage}
          renderActions={renderActions}
          renderLimitations={renderLimitations}
        />
      )}

      {status === 'unsupported_crop' && (
        <UnsupportedCropResult
          result={activeResult}
          renderImage={renderImage}
          renderActions={renderActions}
          renderLimitations={renderLimitations}
        />
      )}

      {status === 'analysis_failed' && (
        <AnalysisFailedResult
          result={activeResult}
          renderImage={renderImage}
          renderActions={renderActions}
          renderLimitations={renderLimitations}
        />
      )}
    </div>
  );
}
