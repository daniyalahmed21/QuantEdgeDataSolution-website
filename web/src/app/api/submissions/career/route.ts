import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDb, hashIp } from '@/server/db'
import { config } from '@/server/config'
import { validateCareer, isHoneypot } from '@/server/validate'
import { validateResume } from '@/server/files'
import type { UploadedFile } from '@/server/files'
import { buildStoredKey, putLocalFile, sha256 } from '@/server/storage'
import { insertSubmission } from '@/server/submissions'
import { withApi } from '@/server/handler'
import { getClientIp, getUserAgent, getSourcePath, enforceRateLimit } from '@/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LIMIT = { windowMs: 15 * 60 * 1000, max: 20 }

export const POST = withApi(async (request: NextRequest) => {
  const limited = enforceRateLimit(request, 'submit', LIMIT, 'Too many submissions. Try again later.')
  if (limited) return limited

  const form = await request.formData()
  const body: Record<string, string> = {}
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') body[key] = value
  }

  if (isHoneypot(body)) {
    return NextResponse.json({ id: crypto.randomUUID(), ok: true }, { status: 201 })
  }

  const data = validateCareer(body)

  const upload = form.get('resume')
  const fileInput: UploadedFile | null =
    upload && typeof upload !== 'string'
      ? {
          originalname: upload.name,
          size: upload.size,
          buffer: Buffer.from(await upload.arrayBuffer()),
        }
      : null

  const file = await validateResume(fileInput, config.maxResumeBytes)
  const storedKey = buildStoredKey(file.ext)
  const digest = sha256(file.buffer)
  await putLocalFile(storedKey, file.buffer)

  const id = insertSubmission(data, {
    ipHash: hashIp(getClientIp(request)),
    userAgent: getUserAgent(request),
    sourcePath: getSourcePath(request, body),
  })

  getDb()
    .prepare(
      `INSERT INTO submission_files (
        id, submission_id, field_name, original_name, stored_key,
        storage_backend, mime_type, size_bytes, sha256
      ) VALUES (?, ?, 'resume', ?, ?, 'local', ?, ?, ?)`,
    )
    .run(crypto.randomUUID(), id, file.originalName, storedKey, file.mimeType, file.sizeBytes, digest)

  return NextResponse.json({ id }, { status: 201 })
})
