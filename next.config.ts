import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.login.no',
                port: '',
                pathname: '/**',
                search: '',
            }
        ],
    },
}

export default nextConfig
