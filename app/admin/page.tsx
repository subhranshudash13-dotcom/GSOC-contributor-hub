import { auth } from "@/auth"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Github, Mail, ShieldCheck, Users } from "lucide-react"

export default async function AdminPage() {
    const session = await auth()

    // Simple Admin Check: Modify this with your GitHub email
    const isAdmin = session?.user?.email === "subhranshudash13@gmail.com" || session?.user?.email?.includes("admin")

    if (!isAdmin) {
        redirect("/")
    }

    await dbConnect()
    const users = await User.find({}).sort({ createdAt: -1 })

    return (
        <div className="min-h-screen py-12 bg-background">
            <div className="container px-4">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl gradient-purple">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Owner Dashboard</h1>
                        <p className="text-muted-foreground">Manage and view all registered GSoC contributors</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="glass-dark border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{users.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="glass-dark rounded-2xl border border-primary/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-primary/10 bg-primary/5">
                                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stats</th>
                                    <th className="p-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {users.map((user: any) => (
                                    <tr key={user._id} className="hover:bg-primary/5 transition-colors">
                                        <td className="p-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-primary/20">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Github className="h-3 w-3" /> {user.githubId || 'Google User'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex gap-2">
                                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                                                    {user.trackedProjects.length} Saved
                                                </Badge>
                                                <Badge variant="secondary" className="bg-gsoc-purple/10 text-gsoc-purple border-none">
                                                    {user.contributions.length} Projects
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
