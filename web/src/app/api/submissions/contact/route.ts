import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hashIp } from '@/server/db'
import { validateContact, isHoneypot } from '@/server/validate'
import { insertSubmission } from '@/server/submissions'
import { withApi } from '@/server/handler'
import {
  getClientIp,
  getUserAgent,
  getSourcePath,
  enforceRateLimit,
  readJsonBody,
} from '@/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LIMIT = { windowMs: 15 * 60 * 1000, max: 20 }

export const POST = withApi(async (request: NextRequest) => {
  const limited = enforceRateLimit(request, 'submit', LIMIT, 'Too many submissions. Try again later.')
  if (limited) return limited

  const body = await readJsonBody(request)

  if (isHoneypot(body)) {
    return NextResponse.json({ id: crypto.randomUUID(), ok: true }, { status: 201 })
  }

  const data = validateContact(body)
  const id = insertSubmission(data, {
    ipHash: hashIp(getClientIp(request)),
    userAgent: getUserAgent(request),
    sourcePath: getSourcePath(request, body),
  })
  return NextResponse.json({ id }, { status: 201 })
})
