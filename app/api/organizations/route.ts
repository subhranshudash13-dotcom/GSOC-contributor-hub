import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Organization from '@/models/Organization'
import Project from '@/models/Project'

export async function GET(req: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(req.url)
        const slug = searchParams.get('slug')

        // If a slug is specified, return the single organization details and its projects
        if (slug) {
            const org = await Organization.findOne({ slug }).lean()
            if (!org) {
                return NextResponse.json(
                    { error: 'Organization not found' },
                    { status: 404 }
                )
            }

            // Fetch projects associated with this organization (historical + current)
            const projectsRaw = await Project.find({ orgSlug: slug })
                .sort({ year: -1, title: 1 })
                .lean()

            const projects = (projectsRaw as any[]).map(p => ({
                ...p,
                _id: p._id.toString()
            }))

            return NextResponse.json({
                organization: {
                    ...org,
                    _id: (org as any)._id.toString()
                },
                projects
            })
        }

        // Build query for list view
        const query: any = {}

        const is2026 = searchParams.get('is2026')
        if (is2026 === 'true') {
            query.is2026 = true
        }

        const category = searchParams.get('category')
        if (category && category !== 'all') {
            query.category = category
        }

        const tech = searchParams.get('tech')
        if (tech) {
            query.technologies = { $in: tech.split(',').map(t => t.trim()) }
        }

        const year = searchParams.get('year')
        if (year) {
            query.years = parseInt(year)
        }

        const search = searchParams.get('search')
        if (search) {
            query.$text = { $search: search }
        }

        // Pagination
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const skip = (page - 1) * limit

        // Execute query - sort by most recent year first (newest orgs first), then by name
        // Using latestYear field or the max of years array
        const [orgsRaw, total] = await Promise.all([
            Organization.find(query)
                .sort({ latestYear: -1, name: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Organization.countDocuments(query)
        ])

        const organizations = (orgsRaw as any[]).map(o => ({
            ...o,
            _id: o._id.toString()
        }))

        return NextResponse.json({
            organizations,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Organizations API Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch organizations' },
            { status: 500 }
        )
    }
}
