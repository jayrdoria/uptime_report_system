import { Incident } from '../types';
import { TOTAL_MONITORS } from './constants';

export interface MonitorBreakdown {
  name: string;
  total: number;
  critical: number;
  down: number;
}

export interface SummaryStats {
  totalIncidents: number;
  criticalCount: number;
  downCount: number;
  affectedMonitors: number;
  totalMonitors: number;
  monitorBreakdown: MonitorBreakdown[];
}

/**
 * Calculate summary statistics from Critical and Down incidents
 */
export function calculateSummary(
  criticalIncidents: Incident[],
  downIncidents: Incident[]
): SummaryStats {
  const criticalCount = criticalIncidents.length;
  const downCount = downIncidents.length;
  const totalIncidents = criticalCount + downCount;

  // Calculate per-monitor breakdown
  const monitorMap = new Map<string, MonitorBreakdown>();

  // Process critical incidents
  for (const incident of criticalIncidents) {
    const existing = monitorMap.get(incident.monitor);
    if (existing) {
      existing.total += 1;
      existing.critical += 1;
    } else {
      monitorMap.set(incident.monitor, {
        name: incident.monitor,
        total: 1,
        critical: 1,
        down: 0,
      });
    }
  }

  // Process down incidents
  for (const incident of downIncidents) {
    const existing = monitorMap.get(incident.monitor);
    if (existing) {
      existing.total += 1;
      existing.down += 1;
    } else {
      monitorMap.set(incident.monitor, {
        name: incident.monitor,
        total: 1,
        critical: 0,
        down: 1,
      });
    }
  }

  // Convert map to array and sort by total incidents (descending)
  const monitorBreakdown = Array.from(monitorMap.values()).sort(
    (a, b) => b.total - a.total
  );

  return {
    totalIncidents,
    criticalCount,
    downCount,
    affectedMonitors: monitorBreakdown.length,
    totalMonitors: TOTAL_MONITORS,
    monitorBreakdown,
  };
}

/**
 * Format summary for plain text output (for clipboard)
 */
export function formatSummaryText(stats: SummaryStats): string {
  const lines: string[] = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '📊 OVERALL SUMMARY',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `Total Incidents: ${stats.totalIncidents}`,
    `Critical: ${stats.criticalCount} | Down: ${stats.downCount}`,
    `Affected Monitors: ${stats.affectedMonitors}/${stats.totalMonitors}`,
    '',
    'Monitor Breakdown:',
  ];

  for (const monitor of stats.monitorBreakdown) {
    lines.push(
      `• ${monitor.name}: ${monitor.total} incident${monitor.total !== 1 ? 's' : ''} (${monitor.critical} Critical, ${monitor.down} Down)`
    );
  }

  return lines.join('\n');
}
