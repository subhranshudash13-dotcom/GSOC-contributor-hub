import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gsoc-contributor-hub.vercel.app'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/', // Don't crawl API routes
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
