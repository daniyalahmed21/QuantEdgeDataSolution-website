import crypto from 'node:crypto'
import { getDb } from './db'
import type { FormType, SubmissionData, SubmissionMeta, SubmissionStatus } from './types'

export function insertSubmission(data: SubmissionData, extras: SubmissionMeta): string {
  const id = crypto.randomUUID()
  getDb().prepare(
    `INSERT INTO submissions (
      id, form_type, name, first_name, last_name, email, phone, message,
      linkedin_url, github_url, privacy_accepted, ip_hash, user_agent, source_path
    ) VALUES (
      @id, @formType, @name, @firstName, @lastName, @email, @phone, @message,
      @linkedinUrl, @githubUrl, @privacyAccepted, @ipHash, @userAgent, @sourcePath
    )`,
  ).run({
    id,
    formType: data.formType,
    name: data.name || null,
    firstName: data.firstName || null,
    lastName: data.lastName || null,
    email: data.email,
    phone: data.phone || null,
    message: data.message || null,
    linkedinUrl: data.linkedinUrl || null,
    githubUrl: data.githubUrl || null,
    privacyAccepted: data.privacyAccepted || 0,
    ipHash: extras.ipHash,
    userAgent: extras.userAgent,
    sourcePath: extras.sourcePath || null,
  })
  return id
}

export const FORM_LABELS: Record<FormType, string> = {
  project_inquiry: 'Project inquiry',
  contact_message: 'Contact message',
  career_application: 'Career application',
}

export const FORM_TYPES: FormType[] = [
  'project_inquiry',
  'contact_message',
  'career_application',
]
export const STATUSES: SubmissionStatus[] = ['new', 'reviewed', 'archived', 'spam']
