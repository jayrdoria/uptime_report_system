import React, { useState, useCallback, useRef } from 'react';

type UploadTheme = 'critical' | 'down' | 'default';

interface UploadZoneProps {
  onFileProcessed: (text: string, fileName: string, fileSize: number) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  theme?: UploadTheme;
  label?: string;
  uploadedFileName?: string;
}

const themeStyles = {
  critical: {
    border: 'border-red-600',
    borderHover: 'hover:border-red-500',
    borderActive: 'border-red-500 bg-red-500/10',
    icon: 'text-red-500',
    accent: 'text-red-400',
    spinner: 'border-red-500',
    bg: 'bg-red-900/20',
  },
  down: {
    border: 'border-blue-600',
    borderHover: 'hover:border-blue-500',
    borderActive: 'border-blue-500 bg-blue-500/10',
    icon: 'text-blue-500',
    accent: 'text-blue-400',
    spinner: 'border-blue-500',
    bg: 'bg-blue-900/20',
  },
  default: {
    border: 'border-gray-600',
    borderHover: 'hover:border-gray-500',
    borderActive: 'border-blue-500 bg-blue-500/10',
    icon: 'text-gray-500',
    accent: 'text-blue-400',
    spinner: 'border-blue-500',
    bg: 'bg-gray-800/50',
  },
};

const UploadZone: React.FC<UploadZoneProps> = ({
  onFileProcessed,
  onError,
  isLoading,
  setIsLoading,
  theme = 'default',
  label,
  uploadedFileName,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styles = themeStyles[theme];

  const processFile = useCallback(
    async (file: File) => {
      // Check file extension as well as MIME type
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPDF) {
        onError('Please upload a PDF file. Only .pdf files are supported.');
        return;
      }

      setIsLoading(true);
      try {
        const { extractTextFromPDF } = await import('../utils/pdfParser');
        const text = await extractTextFromPDF(file);
        onFileProcessed(text, file.name, file.size);
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        // Use the error message from PDFParseError if available
        if (err?.name === 'PDFParseError') {
          onError(err.message);
        } else {
          onError('Failed to parse PDF file. The file may be corrupted or in an unsupported format.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [onFileProcessed, onError, setIsLoading]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragOver ? styles.borderActive : `${styles.border} ${styles.borderHover} hover:${styles.bg}`}
        ${isLoading ? 'pointer-events-none opacity-60' : ''}
        ${uploadedFileName ? styles.bg : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {label && (
        <div className={`text-sm font-semibold mb-3 ${styles.accent}`}>
          {label}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className={`animate-spin rounded-full h-10 w-10 border-4 ${styles.spinner} border-t-transparent mb-3`}></div>
          <p className="text-gray-300 text-sm">Processing PDF...</p>
        </div>
      ) : uploadedFileName ? (
        <div className="flex flex-col items-center">
          <svg
            className={`w-10 h-10 mb-2 ${styles.icon}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-gray-300 text-sm font-medium truncate max-w-full px-2">
            {uploadedFileName}
          </p>
          <p className="text-gray-500 text-xs mt-1">Click to replace</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            className={`w-10 h-10 mb-3 ${isDragOver ? styles.icon : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-300 text-sm mb-1">
            <span className={`font-semibold ${styles.accent}`}>Click to upload</span> or drag and drop
          </p>
          <p className="text-gray-500 text-xs">PDF files only</p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
