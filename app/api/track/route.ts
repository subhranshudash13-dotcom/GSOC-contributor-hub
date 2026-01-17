import { auth } from "@/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { projectId, action, prUrl, title } = await req.json()
        await dbConnect()

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        if (action === "track") {
            const isTracked = user.trackedProjects.includes(projectId)
            if (isTracked) {
                user.trackedProjects = user.trackedProjects.filter((id: string) => id !== projectId)
            } else {
                user.trackedProjects.push(projectId)
            }
        } else if (action === "contribute") {
            user.contributions.push({
                projectId,
                prUrl,
                title,
                status: 'pending',
                date: new Date()
            })
        }

        await user.save()
        return NextResponse.json(user)
    } catch (error) {
        console.error("[TRACK_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
