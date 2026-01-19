/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
    // Prevent Next.js from incorrectly inferring the monorepo/workspace root
    // when there are multiple lockfiles on disk.
    outputFileTracingRoot: path.join(__dirname),
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
}

module.exports = nextConfig
