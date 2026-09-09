import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDb, writeAudit } from '@/server/db'
import { withAdmin } from '@/server/handler'
import { readJsonBody } from '@/server/http'
import { FORM_LABELS, STATUSES } from '@/server/submissions'
import type { AuthContext } from '@/server/auth'
import type { SubmissionRow } from '@/server/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteCtx = { params: Promise<{ id: string }> }

interface DetailRow extends SubmissionRow {
  file_id: string | null
  file_name: string | null
  mime_type: string | null
  size_bytes: number | null
}

export const GET = withAdmin(
  async (_request: NextRequest, auth: AuthContext, { params }: RouteCtx) => {
    const { id } = await params

    const row = getDb()
      .prepare(
        `SELECT s.*, f.id AS file_id, f.original_name AS file_name, f.mime_type, f.size_bytes
         FROM submissions s
         LEFT JOIN submission_files f ON f.submission_id = s.id
         WHERE s.id = ?`,
      )
      .get(id) as DetailRow | undefined

    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    writeAudit({
      adminId: auth.admin.id,
      action: 'view_submission',
      entityType: 'submission',
      entityId: row.id,
    })

    return NextResponse.json({
      id: row.id,
      formType: row.form_type,
      formLabel: FORM_LABELS[row.form_type] || row.form_type,
      status: row.status,
      name: row.name,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      linkedinUrl: row.linkedin_url,
      githubUrl: row.github_url,
      privacyAccepted: Boolean(row.privacy_accepted),
      sourcePath: row.source_path,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      file: row.file_id
        ? {
            id: row.file_id,
            originalName: row.file_name,
            mimeType: row.mime_type,
            sizeBytes: row.size_bytes,
          }
        : null,
    })
  },
)

export const PATCH = withAdmin(
  async (request: NextRequest, auth: AuthContext, { params }: RouteCtx) => {
    const { id } = await params
    const body = await readJsonBody(request)
    const status = String(body.status || '')
    if (!(STATUSES as string[]).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const existing = getDb().prepare('SELECT id FROM submissions WHERE id = ?').get(id)
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    getDb()
      .prepare(`UPDATE submissions SET status = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(status, id)

    writeAudit({
      adminId: auth.admin.id,
      action: 'status_change',
      entityType: 'submission',
      entityId: id,
      meta: { status },
    })

    return NextResponse.json({ ok: true, status })
  },
)
