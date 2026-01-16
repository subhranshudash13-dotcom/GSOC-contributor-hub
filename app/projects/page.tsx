'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Download, Loader2, ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GSoCProject } from '@/types'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const DIFFICULTY_OPTIONS = ['all', 'beginner', 'intermediate', 'advanced']
const TECH_STACK_OPTIONS = ['All', 'React', 'Python', 'Java', 'Go', 'Rust', 'JavaScript']
const ORG_SIZE_OPTIONS = ['all', 'small', 'medium', 'large']

export default function ProjectsPage() {
    const router = useRouter()
    const [projects, setProjects] = useState<GSoCProject[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [difficulty, setDifficulty] = useState('all')
    const [techStack, setTechStack] = useState('All')
    const [orgSize, setOrgSize] = useState('all')

    useEffect(() => {
        fetchProjects()
    }, [difficulty, techStack, orgSize])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (difficulty !== 'all') params.append('difficulty', difficulty)
            if (techStack !== 'All') params.append('techStack', techStack)
            if (orgSize !== 'all') params.append('orgSize', orgSize)
            if (search) params.append('search', search)

            const response = await fetch(`/api/projects?${params}`)
            if (!response.ok) throw new Error('Failed to fetch')

            const data = await response.json()
            setProjects(data.projects || [])
        } catch (error) {
            toast.error('Failed to load projects')
            setProjects([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchProjects()
    }

    const exportToCSV = () => {
        const csv = [
            ['Organization', 'Title', 'Difficulty', 'Tech Stack', 'Deadline'].join(','),
            ...projects.map(p => [
                p.org,
                p.title,
                p.difficulty,
                p.techStack.join('; '),
                formatDate(p.applicationDeadline)
            ].join(','))
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'gsoc-projects.csv'
        a.click()
        toast.success('Exported to CSV!')
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Browse Projects</h1>
                    <p className="text-muted-foreground">
                        Explore <span className="text-primary font-bold">617</span> GSoC 2026 projects from top organizations
                    </p>
                </div>

                {/* Filters */}
                <Card className="glass-dark border-primary/20 mb-8">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search projects..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="gradient">
                                    Search
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={exportToCSV}
                                    disabled={projects.length === 0}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {DIFFICULTY_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Tech Stack</label>
                                    <select
                                        value={techStack}
                                        onChange={(e) => setTechStack(e.target.value)}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {TECH_STACK_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Org Size</label>
                                    <select
                                        value={orgSize}
                                        onChange={(e) => setOrgSize(e.target.value)}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {ORG_SIZE_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Results */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20">
                        <Filter className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className="glass-dark border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/10 group cursor-pointer"
                                    onClick={() => project._id && router.push(`/projects/${project._id}`)}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Badge variant="secondary" className="mb-2">
                                                    {project.org}
                                                </Badge>
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                    {project.title}
                                                </CardTitle>
                                            </div>
                                            <Badge variant={project.difficulty as any} className="ml-2">
                                                {project.difficulty}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.techStack.slice(0, 5).map(tech => (
                                                <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                                            ))}
                                            {project.techStack.length > 5 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{project.techStack.length - 5} more
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div className="text-sm text-muted-foreground">
                                                <p className="font-medium mb-1">Deadline</p>
                                                <p>{formatDate(project.applicationDeadline)}</p>
                                            </div>
                                            {project._id ? (
                                                <Button
                                                    variant="gradient"
                                                    className="group"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (project._id) {
                                                            router.push(`/projects/${project._id.toString()}`)
                                                        }
                                                    }}
                                                >
                                                    View Details
                                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            ) : (
                                                <Button variant="outline" disabled>
                                                    Details Unavailable
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
