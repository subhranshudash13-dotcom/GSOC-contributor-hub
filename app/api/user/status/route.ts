import { auth } from "@/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ isTracked: false })
        }

        const { searchParams } = new URL(req.url)
        const projectId = searchParams.get('projectId')

        if (!projectId) {
            return new NextResponse("Project ID required", { status: 400 })
        }

        await dbConnect()
        const user = await User.findOne({ email: session.user.email })

        if (!user) {
            return NextResponse.json({ isTracked: false })
        }

        const isTracked = user.trackedProjects.includes(projectId)
        return NextResponse.json({ isTracked })
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
