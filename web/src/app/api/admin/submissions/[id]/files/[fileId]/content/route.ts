import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDb, writeAudit } from '@/server/db'
import { withAdmin } from '@/server/handler'
import { readLocalFileBuffer } from '@/server/storage'
import type { AuthContext } from '@/server/auth'
import type { SubmissionFileRow } from '@/server/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteCtx = { params: Promise<{ id: string; fileId: string }> }

export const GET = withAdmin(
  async (_request: NextRequest, auth: AuthContext, { params }: RouteCtx) => {
    const { id, fileId } = await params

    const file = getDb()
      .prepare(
        `SELECT f.*, s.id AS submission_id
         FROM submission_files f
         JOIN submissions s ON s.id = f.submission_id
         WHERE f.id = ? AND s.id = ?`,
      )
      .get(fileId, id) as (SubmissionFileRow & { submission_id: string }) | undefined

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    if (file.storage_backend !== 'local') {
      return NextResponse.json({ error: 'S3 download not configured yet' }, { status: 501 })
    }

    const buffer = readLocalFileBuffer(file.stored_key)
    writeAudit({
      adminId: auth.admin.id,
      action: 'preview_file',
      entityType: 'submission_file',
      entityId: file.id,
      meta: { submissionId: file.submission_id },
    })

    return NextResponse.json(
      {
        originalName: file.original_name,
        mimeType: file.mime_type || 'application/pdf',
        sizeBytes: file.size_bytes,
        base64: buffer.toString('base64'),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  },
)
