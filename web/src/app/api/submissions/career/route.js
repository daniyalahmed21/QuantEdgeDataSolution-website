import { NextResponse } from 'next/server'

const MAX_RESUME_BYTES = 8 * 1024 * 1024 // 8MB

export async function POST(request) {
  let form
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
  }

  if (form.get('company_website')) {
    return NextResponse.json({ ok: true })
  }

  const fullName = form.get('fullName')
  const email = form.get('email')
  const phone = form.get('phone')
  const resume = form.get('resume')

  if (!fullName || !email || !phone) {
    return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!resume || typeof resume === 'string') {
    return NextResponse.json({ error: 'Please attach your resume.' }, { status: 400 })
  }
  if (resume.size > MAX_RESUME_BYTES) {
    return NextResponse.json({ error: 'Resume must be under 8MB.' }, { status: 400 })
  }

  console.log('[submission:career]', { fullName, email, resume: resume.name })

  return NextResponse.json({ ok: true })
}
