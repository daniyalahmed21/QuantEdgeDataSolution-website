import { NextResponse } from 'next/server'
import { withAdmin } from '@/server/handler'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = withAdmin((_request, auth) => NextResponse.json({ admin: auth.admin }))
