import { fileTypeFromBuffer } from 'file-type'
import { httpError } from './types'

const ALLOWED: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

const EXT_MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export interface UploadedFile {
  originalname: string
  buffer: Buffer
  size: number
}

export interface ValidatedResume {
  originalName: string
  ext: string
  mimeType: string
  sizeBytes: number
  buffer: Buffer
}

function extname(name = ''): string {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i).toLowerCase() : ''
}

function sanitizeOriginalName(name = 'resume.pdf'): string {
  return name.replace(/[^\w.\-()+\s]/g, '_').slice(0, 180) || 'resume.pdf'
}

export async function validateResume(
  file: UploadedFile | null,
  maxBytes: number,
): Promise<ValidatedResume> {
  if (!file) {
    throw httpError('Resume file is required', 400)
  }
  if (file.size > maxBytes) {
    throw httpError('Resume must be 5MB or smaller', 400)
  }

  const ext = extname(file.originalname)
  if (!Object.prototype.hasOwnProperty.call(EXT_MIME, ext)) {
    throw httpError('Only PDF, DOC, and DOCX resumes are allowed', 400)
  }

  const detected = await fileTypeFromBuffer(file.buffer)
  let mime = detected?.mime

  if (ext === '.pdf') {
    if (mime && mime !== 'application/pdf') {
      throw httpError('Invalid PDF file', 400)
    }
    const head = file.buffer.subarray(0, 5).toString('utf8')
    if (head !== '%PDF-') {
      throw httpError('Invalid PDF file', 400)
    }
    mime = 'application/pdf'
  } else if (ext === '.docx') {
    if (mime && mime !== 'application/zip' && !ALLOWED[mime]) {
      throw httpError('Invalid DOCX file', 400)
    }
    mime = EXT_MIME['.docx']
  } else if (ext === '.doc') {
    mime = EXT_MIME['.doc']
  }

  return {
    originalName: sanitizeOriginalName(file.originalname),
    ext,
    mimeType: mime as string,
    sizeBytes: file.size,
    buffer: file.buffer,
  }
}
