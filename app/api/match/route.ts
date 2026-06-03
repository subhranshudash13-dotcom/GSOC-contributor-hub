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

        // Convert user skills to case-insensitive regex queries
        const skillRegexes = userProfile.skills.map(skill => new RegExp(`^${skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i'))

        // Fetch up to 80 projects matching the user's skills or topics, prioritizing 2026 projects
        const query = {
            $or: [
                { techStack: { $in: skillRegexes } },
                { topics: { $in: skillRegexes } }
            ]
        }

        const projectsRaw = (await Project.find(query)
            .sort({ year: -1, stars: -1 })
            .limit(80)
            .lean()) as any[]

        const projects = projectsRaw.map(p => ({
            ...p,
            _id: p._id.toString()
        })) as unknown as GSoCProject[]

        if (projects.length === 0) {
            // Fallback: If no projects matched the specific skills, fetch top 80 projects from 2026
            const fallbackProjectsRaw = (await Project.find({ year: 2026 })
                .sort({ stars: -1 })
                .limit(80)
                .lean()) as any[]

            projects.push(...fallbackProjectsRaw.map(p => ({
                ...p,
                _id: p._id.toString()
            })) as unknown as GSoCProject[])
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
