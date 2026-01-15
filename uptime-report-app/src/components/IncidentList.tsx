import React from 'react';
import { Incident } from '../types';

interface IncidentListProps {
  incidents: Incident[];
  type: 'critical' | 'down';
}

/**
 * Format a single incident for display
 * Output: "* MonitorName is Critical/Down at HH:MMAM/PM Resolved at HH:MMAM/PM"
 */
function formatIncident(incident: Incident): string {
  return `* ${incident.monitor} is ${incident.status} at ${incident.startTime} Resolved at ${incident.endTime}`;
}

/**
 * Get all incidents formatted as plain text for copying
 */
export function getFormattedIncidents(incidents: Incident[], type: 'critical' | 'down'): string {
  if (incidents.length === 0) return '';

  return incidents.map(formatIncident).join('\n');
}

const IncidentList: React.FC<IncidentListProps> = ({ incidents, type }) => {
  if (incidents.length === 0) {
    return null;
  }

  const isCritical = type === 'critical';

  return (
    <div className="space-y-1">
      {incidents.map((incident, index) => (
        <div
          key={index}
          className={`font-mono text-sm py-1 ${
            isCritical ? 'text-red-300' : 'text-blue-300'
          }`}
        >
          {formatIncident(incident)}
        </div>
      ))}
    </div>
  );
};

export default IncidentList;
