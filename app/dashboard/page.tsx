import { auth } from "@/auth"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Project from "@/models/Project"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink, GitPullRequest, LayoutDashboard, Star } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()
    if (!session) redirect("/")

    await dbConnect()
    const userData = await User.findOne({ email: session.user?.email })

    // Fetch details for tracked projects
    const trackedProjects = await Project.find({
        _id: { $in: userData?.trackedProjects || [] }
    })

    return (
        <div className="min-h-screen py-12 bg-background">
            <div className="container px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My GSOC Hub</h1>
                        <p className="text-muted-foreground">Welcome back, {session.user?.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 glass-dark rounded-xl border border-primary/20">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Tracked Projects</p>
                            <p className="text-2xl font-bold text-primary">{trackedProjects.length}</p>
                        </div>
                        <div className="px-4 py-2 glass-dark rounded-xl border border-primary/20">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Contributions</p>
                            <p className="text-2xl font-bold text-gsoc-purple">{userData?.contributions?.length || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tracked Projects Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            Saved Projects
                        </h2>

                        {trackedProjects.length === 0 ? (
                            <div className="glass-dark rounded-2xl p-12 text-center border border-dashed border-primary/20">
                                <LayoutDashboard className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No projects saved yet</p>
                                <p className="text-muted-foreground mb-6">Start exploring GSoC 2026 projects to track them here.</p>
                                <Link href="/projects" className="gradient-purple text-white px-6 py-3 rounded-full font-medium transition-opacity hover:opacity-90">
                                    Browse Projects
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {trackedProjects.map((project: any) => (
                                    <Link key={project._id} href={`/projects/${project._id}`}>
                                        <Card className="glass-dark border-primary/10 hover:border-primary/30 transition-all group overflow-hidden h-full">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/30 text-primary">
                                                        {project.difficulty}
                                                    </Badge>
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                                                <p className="text-sm text-primary font-medium">{project.org}</p>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                    {project.description}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.techStack.slice(0, 3).map((tech: string) => (
                                                        <span key={tech} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {project.techStack.length > 3 && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                                                            +{project.techStack.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Timeline/Activity Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <GitPullRequest className="h-5 w-5 text-gsoc-purple" />
                            Recent Activity
                        </h2>

                        <div className="glass-dark rounded-2xl p-6 border border-primary/10">
                            {userData?.contributions?.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No logged contributions yet.
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {userData?.contributions?.slice(0, 5).map((log: any, idx: number) => (
                                        <div key={idx} className="relative pl-6 border-l border-primary/20">
                                            <div className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                            <p className="text-xs text-muted-foreground mb-1">
                                                {new Date(log.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm font-medium mb-1">{log.title}</p>
                                            <a
                                                href={log.prUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                View Contribution <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
