import { z } from 'zod'
import { httpError } from './types'
import type { SubmissionData } from './types'

const HTTPS_URL_RE = /^https:\/\/[^\s]+$/i
const PHONE_RE = /^[0-9+\-().\s]+$/

/** A trimmed, length-bounded required string. */
const boundedString = (label: string, min: number, max: number) =>
  z
    .string({ required_error: `${label} is required`, invalid_type_error: `${label} is required` })
    .trim()
    .min(min, `${label} must be between ${min} and ${max} characters`)
    .max(max, `${label} must be between ${min} and ${max} characters`)

const emailField = z
  .string({ required_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .max(254, 'Email must be between 1 and 254 characters')
  .email('Email is invalid')

const phoneField = z
  .string({ required_error: 'Phone is required' })
  .trim()
  .min(7, 'Phone must be between 7 and 30 characters')
  .max(30, 'Phone must be between 7 and 30 characters')
  .regex(PHONE_RE, 'Phone number is invalid')

/** Optional https URL: '' / null / undefined -> null, otherwise validated. */
const optionalHttpsUrl = (label: string) =>
  z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    z
      .string()
      .trim()
      .max(500, `${label} must be a valid https URL`)
      .regex(HTTPS_URL_RE, `${label} must be a valid https URL`)
      .optional(),
  )

const TRUTHY = new Set<unknown>([true, 'on', 'true', '1'])
const privacyField = z
  .unknown()
  .refine((v) => TRUTHY.has(v), 'Privacy agreement is required')

export const projectSchema = z
  .object({
    name: boundedString('Name', 1, 120),
    email: emailField,
    phone: phoneField,
    project: z.string().optional(),
    message: z.string().optional(),
    privacy: privacyField,
  })
  .transform((v): SubmissionData => ({
    formType: 'project_inquiry',
    name: v.name,
    email: v.email,
    phone: v.phone,
    message: (v.project ?? v.message ?? '').trim(),
    privacyAccepted: 1,
  }))
  .superRefine((v, ctx) => {
    if (!v.message || v.message.length < 1 || v.message.length > 5000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Project must be between 1 and 5000 characters',
        path: ['project'],
      })
    }
  })

export const contactSchema = z
  .object({
    firstName: z.string().optional(),
    first_name: z.string().optional(),
    lastName: z.string().optional(),
    last_name: z.string().optional(),
    email: emailField,
    phone: phoneField,
    message: boundedString('Message', 1, 5000),
  })
  .transform((v, ctx): SubmissionData => {
    const firstName = (v.firstName ?? v.first_name ?? '').trim()
    const lastName = (v.lastName ?? v.last_name ?? '').trim()
    if (firstName.length < 1 || firstName.length > 80) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'First name must be between 1 and 80 characters',
        path: ['firstName'],
      })
    }
    if (lastName.length < 1 || lastName.length > 80) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Last name must be between 1 and 80 characters',
        path: ['lastName'],
      })
    }
    return {
      formType: 'contact_message',
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: v.email,
      phone: v.phone,
      message: v.message,
      privacyAccepted: 0,
    }
  })

export const careerSchema = z
  .object({
    fullName: z.string().optional(),
    full_name: z.string().optional(),
    name: z.string().optional(),
    email: emailField,
    phone: phoneField,
    linkedin: optionalHttpsUrl('LinkedIn URL'),
    linkedin_url: optionalHttpsUrl('LinkedIn URL'),
    github: optionalHttpsUrl('GitHub URL'),
    github_url: optionalHttpsUrl('GitHub URL'),
  })
  .transform((v, ctx): SubmissionData => {
    const name = (v.fullName ?? v.full_name ?? v.name ?? '').trim()
    if (name.length < 1 || name.length > 120) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Full name must be between 1 and 120 characters',
        path: ['fullName'],
      })
    }
    return {
      formType: 'career_application',
      name,
      email: v.email,
      phone: v.phone,
      linkedinUrl: (v.linkedin ?? v.linkedin_url ?? null) as string | null,
      githubUrl: (v.github ?? v.github_url ?? null) as string | null,
      privacyAccepted: 0,
    }
  })

function parseOrThrow<S extends z.ZodTypeAny>(schema: S, body: unknown): z.infer<S> {
  const result = schema.safeParse(body)
  if (!result.success) {
    const first = result.error.issues[0]
    throw httpError(first?.message || 'Invalid request', 400)
  }
  return result.data
}

export const validateProject = (body: unknown): SubmissionData => parseOrThrow(projectSchema, body)
export const validateContact = (body: unknown): SubmissionData => parseOrThrow(contactSchema, body)
export const validateCareer = (body: unknown): SubmissionData => parseOrThrow(careerSchema, body)

/** Honeypot: bots fill hidden fields. Returns true when the request is a bot. */
export function isHoneypot(body: Record<string, unknown>): boolean {
  return Boolean(
    (typeof body.company_website === 'string' && body.company_website.trim()) ||
      (typeof body.website === 'string' && body.website.trim()),
  )
}
