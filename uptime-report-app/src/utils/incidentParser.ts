import { Incident } from '../types';
import { CRITICAL_SITES, DOWN_SITES } from './constants';
import { formatTime, parseTimestamp } from './timeFormatter';

/**
 * Parse incidents from PDF text
 * @param text - The extracted PDF text
 * @param fileType - 'critical' or 'down' based on filename
 * @returns Array of parsed incidents sorted chronologically
 */
export function parseIncidents(text: string, fileType: 'critical' | 'down'): Incident[] {
  const incidents: Incident[] = [];

  // Determine which sites to look for based on file type
  const targetSites = fileType === 'critical' ? CRITICAL_SITES : DOWN_SITES;
  const status: 'Critical' | 'Down' = fileType === 'critical' ? 'Critical' : 'Down';

  // For each target site, find all occurrences with their timestamps
  for (const site of targetSites) {
    // Create a regex to find the site name followed by timestamps
    // The pattern accounts for the PDF format where site name is followed by timestamps
    const siteRegex = new RegExp(
      escapeRegex(site) + '\\s+' +
      '((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+\\d{1,2},\\s+\\d{4}\\s+\\d{1,2}:\\d{2}(?::\\d{2})?\\s*(?:AM|PM))' +
      '\\s+' +
      '((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+\\d{1,2},\\s+\\d{4}\\s+\\d{1,2}:\\d{2}(?::\\d{2})?\\s*(?:AM|PM))',
      'gi'
    );

    let match;
    while ((match = siteRegex.exec(text)) !== null) {
      const rawStartTime = match[1];
      const rawEndTime = match[3];

      incidents.push({
        monitor: site,
        status,
        startTime: formatTime(rawStartTime),
        endTime: formatTime(rawEndTime),
        rawStartTime,
      });
    }
  }

  // Sort incidents chronologically by start time
  return sortIncidentsByTime(incidents);
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sort incidents by their start time chronologically (oldest first)
 */
function sortIncidentsByTime(incidents: Incident[]): Incident[] {
  return [...incidents].sort((a, b) => {
    const dateA = parseTimestamp(a.rawStartTime);
    const dateB = parseTimestamp(b.rawStartTime);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Detect file type based on filename
 * @param filename - The name of the uploaded file
 * @returns 'critical' or 'down' based on filename, or null if unknown
 */
export function detectFileType(filename: string): 'critical' | 'down' | null {
  const lowerName = filename.toLowerCase();

  if (lowerName.includes('critical')) {
    return 'critical';
  }

  if (lowerName.includes('down')) {
    return 'down';
  }

  return null;
}
