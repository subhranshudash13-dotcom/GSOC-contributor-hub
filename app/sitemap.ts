import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gsoc-contributor-hub.vercel.app'

    // Connect to DB and fetch projects for dynamic routes
    await dbConnect()
    const projects = await Project.find({}).select('_id updatedAt').lean()

    const projectUrls = projects.map((project: any) => ({
        url: `${baseUrl}/projects/${project._id}`,
        lastModified: project.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Static routes
    const routes = [
        '',
        '/projects',
        '/matcher',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.9,
    }))

    return [...routes, ...projectUrls]
}
