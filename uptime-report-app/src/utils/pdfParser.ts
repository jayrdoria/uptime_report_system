import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use .js extension for better server compatibility
const basePath = process.env.PUBLIC_URL || '';
const workerUrl = `${basePath}/pdf.worker.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Custom error types for better error handling
export class PDFParseError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'PDFParseError';
  }
}

/**
 * Extract text content from a PDF file
 * @param file - The PDF file to parse
 * @returns Promise resolving to the extracted text
 * @throws PDFParseError for various error conditions
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new PDFParseError(
      'File is too large. Maximum size is 10MB.',
      'FILE_TOO_LARGE'
    );
  }

  // Validate file size (min 100 bytes - likely corrupted if smaller)
  if (file.size < 100) {
    throw new PDFParseError(
      'File appears to be empty or corrupted.',
      'FILE_TOO_SMALL'
    );
  }

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new PDFParseError(
      'Failed to read the file. Please try again.',
      'FILE_READ_ERROR'
    );
  }

  // Check PDF magic bytes (%PDF)
  const header = new Uint8Array(arrayBuffer.slice(0, 4));
  const headerStr = String.fromCharCode.apply(null, Array.from(header));
  if (!headerStr.startsWith('%PDF')) {
    throw new PDFParseError(
      'Invalid PDF file. The file does not appear to be a valid PDF.',
      'INVALID_PDF_HEADER'
    );
  }

  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (err: any) {
    if (err?.name === 'PasswordException') {
      throw new PDFParseError(
        'This PDF is password protected. Please use an unprotected PDF.',
        'PASSWORD_PROTECTED'
      );
    }
    throw new PDFParseError(
      'Failed to parse PDF. The file may be corrupted or in an unsupported format.',
      'PDF_PARSE_ERROR'
    );
  }

  if (pdf.numPages === 0) {
    throw new PDFParseError(
      'The PDF has no pages to extract text from.',
      'EMPTY_PDF'
    );
  }

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      fullText += pageText + '\n';
    } catch (err) {
      console.warn(`Failed to extract text from page ${pageNum}:`, err);
      // Continue with other pages
    }
  }

  const trimmedText = fullText.trim();

  if (!trimmedText) {
    throw new PDFParseError(
      'No text could be extracted from this PDF. It may be a scanned image or have no readable content.',
      'NO_TEXT_CONTENT'
    );
  }

  return trimmedText;
}
