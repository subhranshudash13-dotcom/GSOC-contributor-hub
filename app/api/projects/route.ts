import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET(req: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(req.url)

        // Build query from filters
        const query: any = {}

        const difficulty = searchParams.get('difficulty')
        if (difficulty) {
            query.difficulty = difficulty
        }

        const techStack = searchParams.get('techStack')
        if (techStack) {
            query.techStack = { $in: techStack.split(',') }
        }

        const orgSize = searchParams.get('orgSize')
        if (orgSize) {
            query.orgSize = orgSize
        }

        const location = searchParams.get('location')
        if (location && location !== 'all') {
            query.location = new RegExp(location, 'i')
        }

        const search = searchParams.get('search')
        if (search) {
            query.$text = { $search: search }
        }

        // Only show projects with future deadlines
        query.applicationDeadline = { $gte: new Date() }

        // Pagination
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        // Sorting
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1
        const sort: any = { [sortBy]: sortOrder }

        // Execute query
        const [projects, total] = await Promise.all([
            Project.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Project.countDocuments(query)
        ])

        return NextResponse.json({
            projects,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Projects API Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect()

        const body = await req.json()

        // Create new project
        const project = await Project.create(body)

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error('Create Project Error:', error)
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        )
    }
}
