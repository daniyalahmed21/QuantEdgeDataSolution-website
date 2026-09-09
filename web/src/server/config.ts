import path from 'node:path'

// App root (…/web). Next runs with cwd at the project root in dev and prod.
const root = process.cwd()

export interface ServerConfig {
  dbPath: string
  uploadRoot: string
  ipHashSecret: string
  adminEmail: string
  adminPassword: string
  cookieName: string
  maxResumeBytes: number
  sessionTtlMs: number
  isProd: boolean
}

const DEFAULT_ADMIN_PASSWORD = 'ChangeMeNow!123'
const DEFAULT_IP_HASH_SECRET = 'dev-change-me-quantedge-ip'

export const config: ServerConfig = {
  dbPath: process.env.DB_PATH || path.join(root, 'data', 'app.sqlite'),
  uploadRoot: process.env.UPLOAD_ROOT || path.join(root, 'data', 'uploads'),
  ipHashSecret: process.env.IP_HASH_SECRET || DEFAULT_IP_HASH_SECRET,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@quantedge.local',
  adminPassword: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  cookieName: 'qe_admin_session',
  maxResumeBytes: 5 * 1024 * 1024,
  sessionTtlMs: 1000 * 60 * 60 * 12,
  isProd: process.env.NODE_ENV === 'production',
}

/**
 * Refuse to run in production with the shipped default secrets. Called lazily
 * on first DB access (runtime), never during `next build`, so a missing env in
 * CI does not break the build — it fails safe at request time instead.
 */
export function assertSecureConfig(): void {
  if (!config.isProd) return
  const insecure: string[] = []
  if (config.adminPassword === DEFAULT_ADMIN_PASSWORD) insecure.push('ADMIN_PASSWORD')
  if (config.ipHashSecret === DEFAULT_IP_HASH_SECRET) insecure.push('IP_HASH_SECRET')
  if (insecure.length) {
    throw new Error(
      `Refusing to start in production with default secrets. Set: ${insecure.join(', ')}.`,
    )
  }
}
