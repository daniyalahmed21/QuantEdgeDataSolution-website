export type FormType = 'project_inquiry' | 'contact_message' | 'career_application'
export type SubmissionStatus = 'new' | 'reviewed' | 'archived' | 'spam'

export interface Admin {
  id: string
  email: string
}

export interface SessionRow {
  id: string
  admin_id: string
  expires_at: string
  created_at: string
}

export interface SubmissionRow {
  id: string
  form_type: FormType
  status: SubmissionStatus
  name: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  message: string | null
  linkedin_url: string | null
  github_url: string | null
  privacy_accepted: number
  ip_hash: string | null
  user_agent: string | null
  source_path: string | null
  created_at: string
  updated_at: string
}

export interface SubmissionFileRow {
  id: string
  submission_id: string
  field_name: string
  original_name: string
  stored_key: string
  storage_backend: 'local' | 's3'
  mime_type: string
  size_bytes: number
  sha256: string
  created_at: string
}

/** Normalized shape written to the `submissions` table. */
export interface SubmissionData {
  formType: FormType
  name?: string | null
  firstName?: string | null
  lastName?: string | null
  email: string
  phone?: string | null
  message?: string | null
  linkedinUrl?: string | null
  githubUrl?: string | null
  privacyAccepted: 0 | 1
}

export interface SubmissionMeta {
  ipHash: string | null
  userAgent: string
  sourcePath: string
}

/** Error carrying an HTTP status code, thrown by server helpers. */
export interface HttpError extends Error {
  status?: number
  code?: string
}

export function httpError(message: string, status = 400, code?: string): HttpError {
  const err = new Error(message) as HttpError
  err.status = status
  if (code) err.code = code
  return err
}
