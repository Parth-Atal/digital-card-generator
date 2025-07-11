/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for Vercel deployment
  images: {
    domains: ['i.ibb.co', 'api.qrserver.com', 'chart.googleapis.com'],
    unoptimized: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
