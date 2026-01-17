'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Calendar, Code, Building, MapPin, Users, Share2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { GSoCProject } from '@/types'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Heart, Plus, Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectDetailsClientProps {
    project: GSoCProject
}

export function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showLogModal, setShowLogModal] = useState(false)
    const [logForm, setLogForm] = useState({ title: '', prUrl: '' })

    useEffect(() => {
        if (session) {
            fetch(`/api/user/status?projectId=${project._id}`)
                .then(res => res.json())
                .then(data => setIsSaved(data.isTracked))
                .catch(() => { })
        }
    }, [session, project._id])

    const handleToggleSave = async () => {
        if (!session) {
            toast.error("Please sign in to save projects")
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: project._id, action: 'track' })
            })
            if (res.ok) {
                setIsSaved(!isSaved)
                toast.success(isSaved ? "Removed from shortcuts" : "Project saved to shortcuts!")
            }
        } catch (error) {
            toast.error("Failed to update status")
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogContribution = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!logForm.title || !logForm.prUrl) return

        setIsLoading(true)
        try {
            const res = await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: project._id,
                    action: 'contribute',
                    ...logForm
                })
            })
            if (res.ok) {
                toast.success("Contribution logged!")
                setShowLogModal(false)
                setLogForm({ title: '', prUrl: '' })
            }
        } catch (error) {
            toast.error("Failed to log contribution")
        } finally {
            setIsLoading(false)
        }
    }

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
                                <button
                                    onClick={handleToggleSave}
                                    disabled={isLoading}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all
                                        ${isSaved
                                            ? 'bg-gsoc-purple text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                                            : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}`}
                                >
                                    <Heart className={`h-3 w-3 ${isSaved ? 'fill-white' : ''}`} />
                                    {isSaved ? 'Saved' : 'Save'}
                                </button>
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
                                    <a
                                        href={`https://summerofcode.withgoogle.com/archive/${project.year || 2025}/organizations`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold text-base" size="lg" variant="gradient">
                                            Official GSoC Archive
                                            <ExternalLink className="h-4 w-4 ml-2" />
                                        </Button>
                                    </a>

                                    {session && (
                                        <Button
                                            onClick={() => setShowLogModal(true)}
                                            variant="outline"
                                            className="w-full glass-dark border-gsoc-purple/30 hover:bg-gsoc-purple/10 text-gsoc-purple"
                                            size="lg"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Log Contribution
                                        </Button>
                                    )}

                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button variant="outline" className="w-full hover:bg-white/5 border-primary/30 shadow-sm" size="lg">
                                                <Code className="h-4 w-4 mr-2" />
                                                View Project Codebase
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

            {/* Contribution Log Modal */}
            <AnimatePresence>
                {showLogModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogModal(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md glass-dark border border-primary/20 rounded-2xl p-6 shadow-2xl"
                        >
                            <button
                                onClick={() => setShowLogModal(false)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h3 className="text-xl font-bold mb-6">Log Project Activity</h3>

                            <form onSubmit={handleLogContribution} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Activity Title</label>
                                    <input
                                        required
                                        value={logForm.title}
                                        onChange={e => setLogForm({ ...logForm, title: e.target.value })}
                                        placeholder="e.g., Drafted initial proposal"
                                        className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Link (PR or Issue URL)</label>
                                    <input
                                        required
                                        type="url"
                                        value={logForm.prUrl}
                                        onChange={e => setLogForm({ ...logForm, prUrl: e.target.value })}
                                        placeholder="https://github.com/..."
                                        className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full gradient-purple text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    {isLoading ? 'Saving...' : 'Save Activity'}
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
