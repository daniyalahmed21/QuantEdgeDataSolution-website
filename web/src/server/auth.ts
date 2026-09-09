import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import type { NextRequest, NextResponse } from 'next/server'
import { getDb, writeAudit } from './db'
import { config } from './config'
import { httpError } from './types'
import type { Admin } from './types'

interface SessionInfo {
  id: string
  expiresAt: string
}

function expiryIso(ms: number = config.sessionTtlMs): string {
  return new Date(Date.now() + ms).toISOString().replace('T', ' ').slice(0, 19)
}

function createSession(adminId: string): SessionInfo {
  const id = crypto.randomUUID()
  const expiresAt = expiryIso()
  getDb().prepare('INSERT INTO sessions (id, admin_id, expires_at) VALUES (?, ?, ?)').run(
    id,
    adminId,
    expiresAt,
  )
  return { id, expiresAt }
}

export function destroySession(sessionId: string | null): void {
  if (!sessionId) return
  getDb().prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
}

export function getSessionAdmin(sessionId: string | null): Admin | null {
  if (!sessionId) return null
  const row = getDb()
    .prepare(
      `SELECT a.id, a.email, s.expires_at
       FROM sessions s
       JOIN admins a ON a.id = s.admin_id
       WHERE s.id = ?`,
    )
    .get(sessionId) as { id: string; email: string; expires_at: string } | undefined
  if (!row) return null
  if (new Date(row.expires_at + 'Z') < new Date()) {
    destroySession(sessionId)
    return null
  }
  return { id: row.id, email: row.email }
}

export function loginAdmin(
  email: unknown,
  password: unknown,
): { admin: Admin; session: SessionInfo } {
  const admin = getDb()
    .prepare('SELECT id, email, password_hash FROM admins WHERE email = ?')
    .get(String(email || '').trim().toLowerCase()) as
    | { id: string; email: string; password_hash: string }
    | undefined
  if (!admin || !bcrypt.compareSync(String(password || ''), admin.password_hash)) {
    throw httpError('Invalid email or password', 401)
  }
  getDb().prepare(`UPDATE admins SET last_login_at = datetime('now') WHERE id = ?`).run(admin.id)
  const session = createSession(admin.id)
  writeAudit({ adminId: admin.id, action: 'login' })
  return { admin: { id: admin.id, email: admin.email }, session }
}

export function getSessionIdFromRequest(request: NextRequest): string | null {
  return request.cookies.get(config.cookieName)?.value ?? null
}

export interface AuthContext {
  admin: Admin
  sessionId: string
}

/** Resolve the authenticated admin for a request, or null. */
export function requireAdmin(request: NextRequest): AuthContext | null {
  const sessionId = getSessionIdFromRequest(request)
  const admin = getSessionAdmin(sessionId)
  if (!admin || !sessionId) return null
  return { admin, sessionId }
}

export function setSessionCookie(response: NextResponse, sessionId: string): void {
  response.cookies.set(config.cookieName, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProd,
    maxAge: Math.floor(config.sessionTtlMs / 1000),
    path: '/',
  })
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(config.cookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProd,
    maxAge: 0,
    path: '/',
  })
}
