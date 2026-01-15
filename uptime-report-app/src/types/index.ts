// TypeScript interfaces for the Uptime Report System

export interface Incident {
  monitor: string;
  status: 'Critical' | 'Down';
  startTime: string;
  endTime: string;
  rawStartTime: string;
}

export interface FileInfo {
  name: string;
  size: number;
  text: string;
}

export interface ParsedResult {
  incidents: Incident[];
  fileName: string;
  fileSize: number;
}
