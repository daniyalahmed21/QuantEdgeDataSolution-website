import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { loginAdmin, setSessionCookie } from '@/server/auth'
import { withApi } from '@/server/handler'
import { enforceRateLimit, readJsonBody } from '@/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LIMIT = { windowMs: 15 * 60 * 1000, max: 10 }

export const POST = withApi(async (request: NextRequest) => {
  const limited = enforceRateLimit(request, 'login', LIMIT, 'Too many login attempts. Try again later.')
  if (limited) return limited

  const body = await readJsonBody(request)
  const { admin, session } = loginAdmin(body.email, body.password)
  const response = NextResponse.json({ admin })
  setSessionCookie(response, session.id)
  return response
})
