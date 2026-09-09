import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { config } from './config'
import { httpError } from './types'

export function ensureUploadRoot(): void {
  fs.mkdirSync(config.uploadRoot, { recursive: true })
}

function monthKey(date = new Date()): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${y}/${m}`
}

export function buildStoredKey(ext: string): string {
  const safeExt = ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`
  return `resumes/${monthKey()}/${crypto.randomUUID()}${safeExt}`
}

export function absolutePathForKey(storedKey: string): string {
  const normalized = path.normalize(storedKey).replace(/^(\.\.(\/|\\|$))+/, '')
  const full = path.join(config.uploadRoot, normalized)
  if (!full.startsWith(path.resolve(config.uploadRoot))) {
    throw httpError('Invalid storage key', 400)
  }
  return full
}

export async function putLocalFile(
  storedKey: string,
  buffer: Buffer,
): Promise<{ storageBackend: 'local'; storedKey: string }> {
  const full = absolutePathForKey(storedKey)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  await fs.promises.writeFile(full, buffer, { flag: 'wx' })
  return { storageBackend: 'local', storedKey }
}

export function readLocalFileBuffer(storedKey: string): Buffer {
  const full = absolutePathForKey(storedKey)
  if (!fs.existsSync(full)) {
    throw httpError('File not found', 404)
  }
  return fs.readFileSync(full)
}

export function sha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}
