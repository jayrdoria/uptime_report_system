import React from 'react';
import { SummaryStats as SummaryStatsType } from '../utils/summaryCalculator';

interface SummaryStatsProps {
  stats: SummaryStatsType;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 px-6 py-3 border-b border-purple-800">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
          <span className="text-xl">📊</span>
          OVERALL SUMMARY
        </h3>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Incidents */}
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalIncidents}
            </div>
            <div className="text-sm text-gray-400">Total Incidents</div>
          </div>

          {/* Critical Count */}
          <div className="bg-red-900/30 rounded-lg p-4 text-center border border-red-800">
            <div className="text-3xl font-bold text-red-400 mb-1">
              {stats.criticalCount}
            </div>
            <div className="text-sm text-red-300">Critical</div>
          </div>

          {/* Down Count */}
          <div className="bg-blue-900/30 rounded-lg p-4 text-center border border-blue-800">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {stats.downCount}
            </div>
            <div className="text-sm text-blue-300">Down</div>
          </div>

          {/* Affected Monitors */}
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {stats.affectedMonitors}/{stats.totalMonitors}
            </div>
            <div className="text-sm text-gray-400">Affected Monitors</div>
          </div>
        </div>

        {/* Monitor Breakdown */}
        {stats.monitorBreakdown.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
              Monitor Breakdown
            </h4>
            <div className="space-y-2">
              {stats.monitorBreakdown.map((monitor, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="font-medium text-white">{monitor.name}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      {monitor.total} incident{monitor.total !== 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-2">
                      {monitor.critical > 0 && (
                        <span className="px-2 py-0.5 bg-red-900/50 text-red-300 rounded text-xs">
                          {monitor.critical} Critical
                        </span>
                      )}
                      {monitor.down > 0 && (
                        <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs">
                          {monitor.down} Down
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryStats;
