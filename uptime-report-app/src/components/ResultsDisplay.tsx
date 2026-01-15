import React from 'react';
import { Incident } from '../types';
import IncidentList, { getFormattedIncidents } from './IncidentList';

interface ResultsDisplayProps {
  criticalIncidents: Incident[];
  downIncidents: Incident[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  criticalIncidents,
  downIncidents,
}) => {
  const hasCritical = criticalIncidents.length > 0;
  const hasDown = downIncidents.length > 0;

  if (!hasCritical && !hasDown) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Critical Incidents Section */}
      {hasCritical && (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-900/50 px-6 py-3 border-b border-red-800">
            <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
              <span className="text-xl">🔴</span>
              CRITICAL INCIDENTS
              <span className="ml-2 px-2 py-0.5 bg-red-800 rounded-full text-xs">
                {criticalIncidents.length}
              </span>
            </h3>
          </div>
          <div className="bg-gray-900 p-4 max-h-80 overflow-y-auto">
            <IncidentList incidents={criticalIncidents} type="critical" />
          </div>
        </div>
      )}

      {/* Down Incidents Section */}
      {hasDown && (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-900/50 px-6 py-3 border-b border-blue-800">
            <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
              <span className="text-xl">🔵</span>
              DOWN INCIDENTS
              <span className="ml-2 px-2 py-0.5 bg-blue-800 rounded-full text-xs">
                {downIncidents.length}
              </span>
            </h3>
          </div>
          <div className="bg-gray-900 p-4 max-h-80 overflow-y-auto">
            <IncidentList incidents={downIncidents} type="down" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
export { getFormattedIncidents };
