import { NextResponse } from 'next/server'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Honeypot: silently accept bots without processing.
  if (body.company_website) {
    return NextResponse.json({ ok: true })
  }

  const { project, name, email, phone, privacy } = body
  if (!project || !name || !email || !phone || !privacy) {
    return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // In production, forward to email/CRM/DB here.
  console.log('[submission:project]', { name, email, phone })

  return NextResponse.json({ ok: true })
}
