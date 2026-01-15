import React, { useState, useMemo } from 'react';
import './App.css';
import UploadZone from './components/UploadZone';
import ResultsDisplay from './components/ResultsDisplay';
import SummaryStats from './components/SummaryStats';
import CopyButton from './components/CopyButton';
import { Incident } from './types';
import { parseIncidents, detectFileType } from './utils/incidentParser';
import { calculateSummary } from './utils/summaryCalculator';
import { formatCriticalText, formatDownText, formatAllText } from './utils/clipboard';

interface FileData {
  name: string;
  size: number;
  text: string;
}

function App() {
  // Separate loading states for each upload zone
  const [criticalLoading, setCriticalLoading] = useState(false);
  const [downLoading, setDownLoading] = useState(false);

  // Separate file data for each type
  const [criticalFile, setCriticalFile] = useState<FileData | null>(null);
  const [downFile, setDownFile] = useState<FileData | null>(null);

  // Separate incident arrays
  const [criticalIncidents, setCriticalIncidents] = useState<Incident[]>([]);
  const [downIncidents, setDownIncidents] = useState<Incident[]>([]);

  // Error and warning states
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Calculate summary stats
  const summaryStats = useMemo(
    () => calculateSummary(criticalIncidents, downIncidents),
    [criticalIncidents, downIncidents]
  );

  const handleCriticalFileProcessed = (text: string, fileName: string, fileSize: number) => {
    const fileType = detectFileType(fileName);
    if (fileType !== 'critical') {
      setError('Wrong file type: Please upload a file with "critical" in the filename for the Critical Report zone. Expected format: site24x7_critical_YYYY-MM-DD.pdf');
      return;
    }

    setError(null);
    setWarning(null);
    const incidents = parseIncidents(text, 'critical');
    setCriticalFile({ name: fileName, size: fileSize, text });
    setCriticalIncidents(incidents);

    // Show warning if no incidents found (not an error)
    if (incidents.length === 0) {
      setWarning(`No critical incidents found in "${fileName}". This could mean there were no critical events during this period.`);
    }
  };

  const handleDownFileProcessed = (text: string, fileName: string, fileSize: number) => {
    const fileType = detectFileType(fileName);
    if (fileType !== 'down') {
      setError('Wrong file type: Please upload a file with "down" in the filename for the Down Report zone. Expected format: site24x7_down_YYYY-MM-DD.pdf');
      return;
    }

    setError(null);
    setWarning(null);
    const incidents = parseIncidents(text, 'down');
    setDownFile({ name: fileName, size: fileSize, text });
    setDownIncidents(incidents);

    // Show warning if no incidents found (not an error)
    if (incidents.length === 0) {
      setWarning(`No down incidents found in "${fileName}". This could mean there were no down events during this period.`);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleReset = () => {
    setCriticalFile(null);
    setDownFile(null);
    setCriticalIncidents([]);
    setDownIncidents([]);
    setError(null);
    setWarning(null);
  };

  const hasAnyData = criticalFile || downFile;
  const hasAnyIncidents = criticalIncidents.length > 0 || downIncidents.length > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-2">
            Site24x7 Uptime Report System
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Upload PDF reports to generate formatted summaries for Slack
          </p>
        </header>

        <main className="max-w-5xl mx-auto">
          {/* Dual Upload Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <UploadZone
              onFileProcessed={handleCriticalFileProcessed}
              onError={handleError}
              isLoading={criticalLoading}
              setIsLoading={setCriticalLoading}
              theme="critical"
              label="CRITICAL Report"
              uploadedFileName={criticalFile?.name}
            />

            <UploadZone
              onFileProcessed={handleDownFileProcessed}
              onError={handleError}
              isLoading={downLoading}
              setIsLoading={setDownLoading}
              theme="down"
              label="DOWN Report"
              uploadedFileName={downFile?.name}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 flex items-start gap-3 animate-fade-in">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          )}

          {/* Warning Display */}
          {warning && !error && (
            <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg text-yellow-300 flex items-start gap-3 animate-fade-in">
              <span className="text-xl flex-shrink-0">ℹ️</span>
              <span className="text-sm sm:text-base">{warning}</span>
            </div>
          )}

          {/* Results Section */}
          {hasAnyData && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-stretch sm:items-center gap-4">
                {/* Copy Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <CopyButton
                    variant="critical"
                    text={formatCriticalText(criticalIncidents)}
                    disabled={criticalIncidents.length === 0}
                  />
                  <CopyButton
                    variant="down"
                    text={formatDownText(downIncidents)}
                    disabled={downIncidents.length === 0}
                  />
                  <CopyButton
                    variant="all"
                    text={formatAllText(summaryStats, criticalIncidents, downIncidents)}
                    disabled={!hasAnyIncidents}
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Reset All
                </button>
              </div>

              {/* Summary Stats - shown at top */}
              {hasAnyIncidents && (
                <div className="animate-fade-in">
                  <SummaryStats stats={summaryStats} />
                </div>
              )}

              {/* Results Display */}
              {hasAnyIncidents ? (
                <div className="animate-fade-in">
                  <ResultsDisplay
                    criticalIncidents={criticalIncidents}
                    downIncidents={downIncidents}
                  />
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-500 animate-fade-in">
                  No incidents found in the uploaded files.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
