import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the file-tracing root to this app so an unrelated lockfile in the
  // user's home directory doesn't get inferred as the workspace root.
  outputFileTracingRoot: __dirname,
  images: {
    // Marketing assets are pre-optimized PNG/WEBP in /public; keep it simple.
    unoptimized: true,
  },
}

export default nextConfig
