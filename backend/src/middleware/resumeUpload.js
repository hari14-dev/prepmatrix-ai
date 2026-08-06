import multer from 'multer';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain'
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — plenty for a resume, keeps memory use bounded

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(new Error('Unsupported file type. Upload a PDF, DOCX, or TXT file.'));
    return;
  }
  cb(null, true);
}

// In-memory storage only — the file is parsed for text and never written to
// disk, so there's nothing to clean up and no persisted copy of anyone's resume.
export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 }
});
