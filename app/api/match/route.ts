import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'
import { matchProjectsWithAI } from '@/lib/ai-matcher'
import type { UserProfile, GSoCProject } from '@/types'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const userProfile: UserProfile = body

        // Validate input
        if (!userProfile.skills || userProfile.skills.length === 0) {
            return NextResponse.json(
                { error: 'Skills are required' },
                { status: 400 }
            )
        }

        // Connect to database
        await dbConnect()

        // Fetch all projects (including historical GSoC data)
        // Remove the deadline filter to include historical projects
        // Remove limit to get ALL projects for matching
        const projects = (await Project.find({})
            .lean()) as unknown as GSoCProject[]

        if (projects.length === 0) {
            return NextResponse.json(
                { error: 'No active projects found' },
                { status: 404 }
            )
        }

        // Get AI-powered matches
        const matches = await matchProjectsWithAI(userProfile, projects)

        return NextResponse.json({ matches })
    } catch (error) {
        console.error('Match API Error:', error)
        return NextResponse.json(
            { error: 'Failed to match projects' },
            { status: 500 }
        )
    }
}
