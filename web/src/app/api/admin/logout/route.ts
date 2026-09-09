import { NextResponse } from 'next/server'
import { withAdmin } from '@/server/handler'
import { destroySession, clearSessionCookie } from '@/server/auth'
import { writeAudit } from '@/server/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = withAdmin((_request, auth) => {
  destroySession(auth.sessionId)
  writeAudit({ adminId: auth.admin.id, action: 'logout' })
  const response = NextResponse.json({ ok: true })
  clearSessionCookie(response)
  return response
})
