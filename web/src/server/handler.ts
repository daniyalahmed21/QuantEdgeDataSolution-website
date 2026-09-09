import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireAdmin } from './auth'
import { errorResponse } from './http'
import type { AuthContext } from './auth'

type MaybePromise<T> = T | Promise<T>

/** Wrap a public route handler so thrown errors become JSON responses. */
export function withApi<Ctx = unknown>(
  handler: (request: NextRequest, context: Ctx) => MaybePromise<NextResponse>,
) {
  return async (request: NextRequest, context: Ctx): Promise<NextResponse> => {
    try {
      return await handler(request, context)
    } catch (err) {
      return errorResponse(err)
    }
  }
}

/**
 * Wrap an admin route handler: enforce authentication (401 otherwise) and
 * convert thrown errors to JSON. Centralizes the auth + error boilerplate.
 */
export function withAdmin<Ctx = unknown>(
  handler: (request: NextRequest, auth: AuthContext, context: Ctx) => MaybePromise<NextResponse>,
) {
  return async (request: NextRequest, context: Ctx): Promise<NextResponse> => {
    try {
      const auth = requireAdmin(request)
      if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return await handler(request, auth, context)
    } catch (err) {
      return errorResponse(err)
    }
  }
}
