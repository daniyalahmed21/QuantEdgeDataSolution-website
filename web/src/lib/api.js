async function parseJson(res) {
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export async function submitProject(payload) {
  const res = await fetch('/api/submissions/project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Source-Path': window.location.pathname,
    },
    body: JSON.stringify(payload),
  })
  return parseJson(res)
}

export async function submitContact(payload) {
  const res = await fetch('/api/submissions/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Source-Path': window.location.pathname,
    },
    body: JSON.stringify(payload),
  })
  return parseJson(res)
}

export async function submitCareer(formData) {
  formData.set('sourcePath', window.location.pathname)
  const res = await fetch('/api/submissions/career', {
    method: 'POST',
    headers: {
      'X-Source-Path': window.location.pathname,
    },
    body: formData,
  })
  return parseJson(res)
}
