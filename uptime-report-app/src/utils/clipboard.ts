import { Incident } from '../types';
import { SummaryStats, formatSummaryText } from './summaryCalculator';

/**
 * Copy text to clipboard using the modern Clipboard API
 * Falls back to execCommand for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err);
    }
  }

  // Fallback for older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    return result;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}

/**
 * Format a single incident for clipboard with emoji
 */
function formatIncidentWithEmoji(incident: Incident): string {
  const emoji = incident.status === 'Critical' ? '🔴' : '🔵';
  return `${emoji} ${incident.monitor} is ${incident.status} at ${incident.startTime} Resolved at ${incident.endTime}`;
}

/**
 * Format Critical incidents section for clipboard
 */
export function formatCriticalText(incidents: Incident[]): string {
  if (incidents.length === 0) return '';

  const lines: string[] = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🔴 CRITICAL INCIDENTS',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    ...incidents.map(formatIncidentWithEmoji),
  ];

  return lines.join('\n');
}

/**
 * Format Down incidents section for clipboard
 */
export function formatDownText(incidents: Incident[]): string {
  if (incidents.length === 0) return '';

  const lines: string[] = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🔵 DOWN INCIDENTS',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    ...incidents.map(formatIncidentWithEmoji),
  ];

  return lines.join('\n');
}

/**
 * Format all data (Summary + Critical + Down) for clipboard
 */
export function formatAllText(
  stats: SummaryStats,
  criticalIncidents: Incident[],
  downIncidents: Incident[]
): string {
  const sections: string[] = [];

  // Add summary section
  sections.push(formatSummaryText(stats));

  // Add critical section if there are incidents
  if (criticalIncidents.length > 0) {
    sections.push('');
    sections.push(formatCriticalText(criticalIncidents));
  }

  // Add down section if there are incidents
  if (downIncidents.length > 0) {
    sections.push('');
    sections.push(formatDownText(downIncidents));
  }

  return sections.join('\n');
}
