import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { config, assertSecureConfig } from './config'

type DatabaseType = Database.Database

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    form_type TEXT NOT NULL CHECK (form_type IN (
      'project_inquiry',
      'contact_message',
      'career_application'
    )),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
      'new', 'reviewed', 'archived', 'spam'
    )),
    name TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    privacy_accepted INTEGER NOT NULL DEFAULT 0,
    ip_hash TEXT,
    user_agent TEXT,
    source_path TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_submissions_type_created
    ON submissions(form_type, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_submissions_email
    ON submissions(email);
  CREATE INDEX IF NOT EXISTS idx_submissions_status
    ON submissions(status);

  CREATE TABLE IF NOT EXISTS submission_files (
    id TEXT PRIMARY KEY,
    submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL DEFAULT 'resume',
    original_name TEXT NOT NULL,
    stored_key TEXT NOT NULL UNIQUE,
    storage_backend TEXT NOT NULL CHECK (storage_backend IN ('local', 's3')),
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    sha256 TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    admin_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    meta TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`

function seedAdmin(database: DatabaseType): void {
  const email = config.adminEmail.toLowerCase().trim()
  const passwordHash = bcrypt.hashSync(config.adminPassword, 12)
  const existing = database.prepare('SELECT id FROM admins WHERE email = ?').get(email) as
    | { id: string }
    | undefined

  if (existing) {
    database
      .prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
      .run(passwordHash, existing.id)
    return
  }

  database
    .prepare('INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)')
    .run(crypto.randomUUID(), email, passwordHash)
}

function createDb(): DatabaseType {
  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true })
  const database = new Database(config.dbPath)
  database.pragma('journal_mode = WAL')
  database.pragma('foreign_keys = ON')
  database.exec(SCHEMA)
  seedAdmin(database)
  return database
}

// Cache the connection on globalThis so Next's dev HMR doesn't open a new
// SQLite handle (and re-seed) on every hot reload. Created lazily on first use
// (never at import/build time) so no file I/O happens during `next build`.
const globalForDb = globalThis as typeof globalThis & { __qeDb?: DatabaseType }

export function getDb(): DatabaseType {
  if (globalForDb.__qeDb) return globalForDb.__qeDb
  assertSecureConfig()
  globalForDb.__qeDb = createDb()
  return globalForDb.__qeDb
}

export function hashIp(ip: string | null): string | null {
  if (!ip) return null
  return crypto.createHmac('sha256', config.ipHashSecret).update(ip).digest('hex')
}

export interface AuditInput {
  adminId?: string | null
  action: string
  entityType?: string | null
  entityId?: string | null
  meta?: Record<string, unknown> | null
}

export function writeAudit({
  adminId = null,
  action,
  entityType = null,
  entityId = null,
  meta = null,
}: AuditInput): void {
  getDb().prepare(
    `INSERT INTO audit_events (id, admin_id, action, entity_type, entity_id, meta)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    crypto.randomUUID(),
    adminId,
    action,
    entityType,
    entityId,
    meta ? JSON.stringify(meta) : null,
  )
}
