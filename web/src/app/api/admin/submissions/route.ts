import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDb } from '@/server/db'
import { withAdmin } from '@/server/handler'
import { FORM_LABELS, FORM_TYPES, STATUSES } from '@/server/submissions'
import type { FormType, SubmissionStatus } from '@/server/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ListRow {
  id: string
  form_type: FormType
  status: SubmissionStatus
  name: string | null
  email: string
  phone: string | null
  message: string | null
  created_at: string
  file_id: string | null
  file_name: string | null
}

export const GET = withAdmin((request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const formType = String(searchParams.get('form_type') || '').trim()
  const status = String(searchParams.get('status') || '').trim()
  const q = String(searchParams.get('q') || '').trim()

  const where: string[] = []
  const params: Record<string, string> = {}

  if ((FORM_TYPES as string[]).includes(formType)) {
    where.push('s.form_type = @formType')
    params.formType = formType
  }
  if ((STATUSES as string[]).includes(status)) {
    where.push('s.status = @status')
    params.status = status
  }
  if (q) {
    where.push("(s.email LIKE @q OR s.name LIKE @q OR IFNULL(s.message, '') LIKE @q)")
    params.q = `%${q.replace(/[%_]/g, '')}%`
  }

  const sql = `
    SELECT
      s.id, s.form_type, s.status, s.name, s.email, s.phone, s.message, s.created_at,
      f.id AS file_id, f.original_name AS file_name
    FROM submissions s
    LEFT JOIN submission_files f ON f.submission_id = s.id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY s.created_at DESC
    LIMIT 200
  `

  const rows = (getDb().prepare(sql).all(params) as ListRow[]).map((row) => ({
    id: row.id,
    formType: row.form_type,
    formLabel: FORM_LABELS[row.form_type] || row.form_type,
    status: row.status,
    name: row.name,
    email: row.email,
    phone: row.phone,
    preview: row.message ? String(row.message).slice(0, 140) : null,
    createdAt: row.created_at,
    hasFile: Boolean(row.file_id),
    fileId: row.file_id || null,
    fileName: row.file_name || null,
  }))

  return NextResponse.json({ items: rows })
})
