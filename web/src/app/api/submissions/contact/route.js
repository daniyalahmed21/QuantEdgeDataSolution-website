import { NextResponse } from 'next/server'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (body.company_website) {
    return NextResponse.json({ ok: true })
  }

  const { firstName, lastName, email, phone, message } = body
  if (!firstName || !lastName || !email || !phone || !message) {
    return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  console.log('[submission:contact]', { firstName, lastName, email })

  return NextResponse.json({ ok: true })
}
