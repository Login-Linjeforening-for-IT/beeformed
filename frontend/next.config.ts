import type { NextConfig } from 'next'
import { envLoad } from 'utilbee'

envLoad({ path: '../.env' })

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
