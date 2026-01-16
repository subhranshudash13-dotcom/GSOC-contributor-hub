'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Calendar, Code, Building, MapPin, Users, Share2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { GSoCProject } from '@/types'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProjectDetailsClientProps {
    project: GSoCProject
}

export function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
    const router = useRouter()

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
    }

    return (
        <div className="min-h-screen py-12">
            {/* Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container max-w-5xl">
                {/* Navigation */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-8 hover:bg-white/5"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
                </Button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary">
                                <Building className="h-5 w-5" />
                                <span className="text-lg font-bold tracking-tight">{project.org}</span>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 gap-1 px-2">
                                    <Sparkles className="h-3 w-3" />
                                    Verified Official
                                </Badge>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                {project.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Deadline: {formatDate(project.applicationDeadline)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{project.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <Card className="glass-dark border-primary/20">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-400" />
                                    Project Overview
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Tech Stack */}
                        <Card className="glass-dark border-primary/20">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Code className="h-5 w-5 text-blue-400" />
                                    Technology Stack
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {project.techStack.map(tech => (
                                        <Badge key={tech} className="text-base px-4 py-2" variant="secondary">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card className="glass-dark border-primary/20 bg-gradient-to-b from-white/5 to-transparent">
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Difficulty</div>
                                    <Badge variant={project.difficulty} className="text-base px-4 py-1 capitalize">
                                        {project.difficulty}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Duration</div>
                                        <div className="font-semibold">~175 Hours</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Stipend</div>
                                        <div className="font-semibold text-green-400">~$1500-3000</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-muted-foreground mb-3">Mentors</div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.mentors.map(mentor => (
                                            <div key={mentor} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full text-sm">
                                                <Users className="h-3 w-3" />
                                                {mentor}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold" size="lg" variant="gradient">
                                                Official Project Source
                                                <ExternalLink className="h-4 w-4 ml-2" />
                                            </Button>
                                        </a>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share Project
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Org Info */}
                        <Card className="glass-dark border-primary/20">
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-4">About the Organization</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Size</span>
                                        <span className="capitalize">{project.orgSize}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Topics</span>
                                        <span className="text-right max-w-[60%] truncate">
                                            {project.topics?.join(', ') || 'General'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
