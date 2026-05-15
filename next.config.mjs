import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  outputFileTracingRoot: __dirname,
  turbopack: {},
  webpack: (config) => {
    // Optimize large string serialization for audio processing
    config.cache = {
      ...config.cache,
      buildDependencies: {
        config: [__filename],
      },
      // Use Buffer for large binary data instead of strings
      compression: 'gzip',
      maxMemoryGenerations: 1,
    }
    return config
  },
}

export default nextConfig
