// Browser-side API client for the Next.js route handlers.

export interface AdminUser {
  id: string
  email: string
}

export interface SubmissionListItem {
  id: string
  formType: string
  formLabel: string
  status: string
  name: string | null
  email: string
  phone: string | null
  preview: string | null
  createdAt: string
  hasFile: boolean
  fileId: string | null
  fileName: string | null
}

export interface SubmissionDetail {
  id: string
  formType: string
  formLabel: string
  status: string
  name: string | null
  firstName: string | null
  lastName: string | null
  email: string
  phone: string | null
  message: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  privacyAccepted: boolean
  sourcePath: string | null
  createdAt: string
  updatedAt: string
  file: {
    id: string
    originalName: string
    mimeType: string
    sizeBytes: number
  } | null
}

async function parseJson<T = unknown>(res: Response): Promise<T> {
  const text = await res.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data as T
}

export interface ProjectPayload {
  project: string
  name: string
  email: string
  phone: string
  privacy: boolean
  company_website?: string
}

export async function submitProject(payload: ProjectPayload): Promise<{ id: string }> {
  const res = await fetch('/api/submissions/project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Source-Path': window.location.pathname,
    },
    body: JSON.stringify(payload),
  })
  return parseJson(res)
}

export interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  company_website?: string
}

export async function submitContact(payload: ContactPayload): Promise<{ id: string }> {
  const res = await fetch('/api/submissions/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Source-Path': window.location.pathname,
    },
    body: JSON.stringify(payload),
  })
  return parseJson(res)
}

export async function submitCareer(formData: FormData): Promise<{ id: string }> {
  formData.set('sourcePath', window.location.pathname)
  const res = await fetch('/api/submissions/career', {
    method: 'POST',
    headers: { 'X-Source-Path': window.location.pathname },
    body: formData,
  })
  return parseJson(res)
}

// ---- Admin ----

export async function adminLogin(email: string, password: string): Promise<{ admin: AdminUser }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return parseJson(res)
}

export async function adminLogout(): Promise<{ ok: boolean }> {
  const res = await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
  return parseJson(res)
}

export async function adminMe(): Promise<{ admin: AdminUser }> {
  const res = await fetch('/api/admin/me', { credentials: 'include' })
  return parseJson(res)
}

export async function adminListSubmissions(
  params: { form_type?: string; status?: string; q?: string } = {},
): Promise<{ items: SubmissionListItem[] }> {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) qs.set(key, value)
  })
  const res = await fetch(`/api/admin/submissions?${qs}`, { credentials: 'include' })
  return parseJson(res)
}

export async function adminGetSubmission(id: string): Promise<SubmissionDetail> {
  const res = await fetch(`/api/admin/submissions/${id}`, { credentials: 'include' })
  return parseJson(res)
}

export async function adminUpdateStatus(
  id: string,
  status: string,
): Promise<{ ok: boolean; status: string }> {
  const res = await fetch(`/api/admin/submissions/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  return parseJson(res)
}

/** Load a resume as a Blob (base64 JSON) so download managers cannot intercept it. */
export async function adminFetchFileBlob(
  submissionId: string,
  fileId: string,
  mimeType = 'application/pdf',
): Promise<Blob> {
  const res = await fetch(
    `/api/admin/submissions/${submissionId}/files/${fileId}/content`,
    { credentials: 'include' },
  )
  const data = await parseJson<{ base64?: string; mimeType?: string }>(res)
  if (!data?.base64) {
    throw new Error('Empty file received from server')
  }
  const binary = atob(data.base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], {
    type: (data.mimeType || mimeType || 'application/pdf').split(';')[0].trim(),
  })
}
