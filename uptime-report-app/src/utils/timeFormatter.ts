/**
 * Time formatting utilities for converting PDF timestamps to display format
 */

/**
 * Convert timestamp from PDF format to display format
 * From: "Jan 15, 2026 3:37:03 PM" or "Jan 15, 2026 3:37 PM"
 * To: "03:37PM"
 */
export function formatTime(rawTime: string): string {
  // Regex to extract time components
  const timeMatch = rawTime.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)/i);

  if (!timeMatch) {
    return rawTime; // Return original if pattern doesn't match
  }

  let hours = parseInt(timeMatch[1], 10);
  const minutes = timeMatch[2];
  const period = timeMatch[3].toUpperCase();

  // Pad hours to 2 digits
  const paddedHours = hours.toString().padStart(2, '0');

  return `${paddedHours}:${minutes}${period}`;
}

/**
 * Parse a raw timestamp string to extract date for sorting
 * Returns a Date object for chronological comparison
 * Format: "Jan 15, 2026 3:37:03 PM"
 */
export function parseTimestamp(rawTime: string): Date {
  // Match the pattern: "Jan 15, 2026 3:37:03 PM"
  const match = rawTime.match(
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)/i
  );

  if (!match) {
    // Fallback: try native parsing
    const parsed = new Date(rawTime);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    return new Date();
  }

  const monthNames: { [key: string]: number } = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  const month = monthNames[match[1].toLowerCase()];
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  let hours = parseInt(match[4], 10);
  const minutes = parseInt(match[5], 10);
  const seconds = match[6] ? parseInt(match[6], 10) : 0;
  const period = match[7].toUpperCase();

  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return new Date(year, month, day, hours, minutes, seconds);
}
