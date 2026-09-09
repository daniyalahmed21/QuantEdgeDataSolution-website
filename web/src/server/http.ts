import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { httpError } from './types'
import type { HttpError } from './types'

const MAX_JSON_BYTES = 32 * 1024

/** Read and size-cap a JSON request body. Returns {} on parse failure. */
export async function readJsonBody(
  request: NextRequest,
  maxBytes = MAX_JSON_BYTES,
): Promise<Record<string, unknown>> {
  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > maxBytes) {
    throw httpError('Request body too large', 413)
  }
  try {
    const body = (await request.json()) as unknown
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip') || null
}

export function getUserAgent(request: NextRequest): string {
  return String(request.headers.get('user-agent') || '').slice(0, 400)
}

export function getSourcePath(request: NextRequest, body?: { sourcePath?: unknown }): string {
  return String(request.headers.get('x-source-path') || body?.sourcePath || '').slice(0, 200)
}

interface RateBucket {
  count: number
  resetAt: number
}

// Simple fixed-window in-memory rate limiter. Fine for a single-node deploy;
// swap for a shared store (Redis) if you scale horizontally.
const globalForRate = globalThis as typeof globalThis & { __qeRateBuckets?: Map<string, RateBucket> }
const buckets = globalForRate.__qeRateBuckets ?? (globalForRate.__qeRateBuckets = new Map())

export interface RateLimitOptions {
  windowMs: number
  max: number
}

export interface RateLimitResult {
  allowed: boolean
  retryAfterMs?: number
}

export function rateLimit(key: string, { windowMs, max }: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = buckets.get(key)
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }
  if (entry.count >= max) {
    return { allowed: false, retryAfterMs: entry.resetAt - now }
  }
  entry.count += 1
  return { allowed: true }
}

/**
 * Enforce a per-IP rate limit; returns a 429 response when exceeded, else null.
 */
export function enforceRateLimit(
  request: NextRequest,
  scope: string,
  options: RateLimitOptions,
  message: string,
): NextResponse | null {
  const ip = getClientIp(request) ?? 'unknown'
  const result = rateLimit(`${scope}:${ip}`, options)
  if (result.allowed) return null
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: result.retryAfterMs
        ? { 'Retry-After': String(Math.ceil(result.retryAfterMs / 1000)) }
        : undefined,
    },
  )
}

/** Convert a thrown error (optionally carrying a `status`) into a JSON response. */
export function errorResponse(err: unknown): NextResponse {
  const e = err as HttpError
  const status = e?.status || 500
  const message = status === 500 ? 'Internal server error' : e?.message || 'Request failed'
  if (status === 500) console.error(err)
  return NextResponse.json({ error: message }, { status })
}
