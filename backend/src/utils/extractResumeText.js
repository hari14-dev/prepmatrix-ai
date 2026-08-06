import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts plain text from an uploaded resume file buffer.
 * Supports PDF, DOCX, and plain text. Throws a user-facing message
 * on failure (corrupt file, scanned/image-only PDF, etc.).
 */
export async function extractResumeText({ buffer, mimetype, originalname }) {
  if (mimetype === 'application/pdf') {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = (result?.text || '').trim();
    if (!text) {
      throw new Error('Could not read text from this PDF — it may be a scanned image. Try pasting the text instead.');
    }
    return text;
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    const text = (result?.value || '').trim();
    if (!text) {
      throw new Error('Could not read text from this DOCX file. Try pasting the text instead.');
    }
    return text;
  }

  if (mimetype === 'text/plain') {
    const text = buffer.toString('utf-8').trim();
    if (!text) {
      throw new Error('This file appears to be empty.');
    }
    return text;
  }

  throw new Error(`Unsupported file type for "${originalname}". Upload a PDF, DOCX, or TXT file.`);
}
