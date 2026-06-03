'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink, Calendar, Code2, Globe, Heart, Loader2, Search, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { GSoCProject } from '@/types'
import toast from 'react-hot-toast'

interface OrganizationDetails {
    _id: string
    name: string
    slug: string
    logoUrl?: string
    backgroundColor?: string
    description: string
    websiteUrl?: string
    category: string
    ideasUrl?: string
    projectsUrl?: string
    technologies: string[]
    topics: string[]
    years: number[]
    is2026: boolean
    projectCount: number
}

export default function OrganizationDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    const [loading, setLoading] = useState(true)
    const [organization, setOrganization] = useState<OrganizationDetails | null>(null)
    const [projects, setProjects] = useState<GSoCProject[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedYear, setSelectedYear] = useState<string>('All')

    useEffect(() => {
        if (slug) {
            fetchOrgDetails()
        }
    }, [slug])

    const fetchOrgDetails = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/organizations?slug=${slug}`)
            if (!response.ok) throw new Error('Failed to fetch')

            const data = await response.json()
            setOrganization(data.organization)
            setProjects(data.projects || [])
            
            // Set initial selected year to 2026 if they participated, else the latest year
            if (data.organization?.years && data.organization.years.length > 0) {
                const years = data.organization.years;
                if (years.includes(2026)) {
                    setSelectedYear('2026')
                } else {
                    setSelectedYear(years[0].toString())
                }
            }
        } catch (error) {
            toast.error('Failed to load organization details')
            router.push('/organizations')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading organization details...</p>
            </div>
        )
    }

    if (!organization) return null

    // Filter projects by year and search query
    const filteredProjects = projects.filter(project => {
        const matchesYear = selectedYear === 'All' || project.year?.toString() === selectedYear
        const matchesSearch =
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesYear && matchesSearch
    })

    return (
        <div className="min-h-screen py-12 relative">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container max-w-6xl">
                {/* Back Link */}
                <Button
                    variant="ghost"
                    onClick={() => router.push('/organizations')}
                    className="mb-8 hover:bg-primary/10 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Organizations
                </Button>

                {/* Header Card */}
                <Card className="glass-dark border-primary/20 mb-8 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 w-full" />
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div
                                    className="w-20 h-20 rounded-xl flex items-center justify-center p-3 border border-border/60 overflow-hidden shadow-md flex-shrink-0"
                                    style={{ backgroundColor: organization.backgroundColor || '#ffffff' }}
                                >
                                    {organization.logoUrl ? (
                                        <img
                                            src={organization.logoUrl}
                                            alt={`${organization.name} logo`}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-3xl font-bold text-neutral-800">
                                            {organization.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h1 className="text-3xl font-bold text-foreground">{organization.name}</h1>
                                        {organization.is2026 && (
                                            <Badge className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-2.5 py-0.5 shadow-lg shadow-primary/20">
                                                Active in 2026
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground mt-1.5 flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs bg-neutral-900/35">
                                            {organization.category}
                                        </Badge>
                                        • Joined GSoC {organization.years.length} time{organization.years.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="flex flex-wrap gap-3">
                                {organization.websiteUrl && (
                                    <a href={organization.websiteUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="glass">
                                            <Globe className="h-4 w-4 mr-2" /> Website
                                        </Button>
                                    </a>
                                )}
                                {organization.ideasUrl && (
                                    <a href={organization.ideasUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="glass border-purple-500/20 text-purple-400 hover:text-purple-300">
                                            <Code2 className="h-4 w-4 mr-2" /> Ideas List
                                        </Button>
                                    </a>
                                )}
                                {organization.projectsUrl && (
                                    <a href={organization.projectsUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="gradient" size="sm">
                                            GSoC Page <ExternalLink className="h-3.5 w-3.5 ml-2" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 border-t border-primary/5 pt-6">
                            <h3 className="font-semibold text-lg mb-2.5">About the Organization</h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {organization.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar metadata */}
                    <div className="space-y-6 lg:col-span-1">
                        <Card className="glass-dark border-primary/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold uppercase tracking-wider text-primary/80">Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-2 text-muted-foreground text-xs uppercase tracking-wider">Technologies</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {organization.technologies.map(tech => (
                                            <Badge key={tech} variant="secondary" className="text-xs bg-purple-500/10 border-purple-500/10 text-purple-300">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {organization.topics && organization.topics.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-muted-foreground text-xs uppercase tracking-wider">Topics & Domains</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {organization.topics.map(topic => (
                                                <Badge key={topic} variant="outline" className="text-xs bg-neutral-900/35">
                                                    {topic}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="font-semibold mb-2 text-muted-foreground text-xs uppercase tracking-wider">Participation Years</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {organization.years.map(y => (
                                            <Badge
                                                key={y}
                                                onClick={() => setSelectedYear(y.toString())}
                                                className={`text-xs px-2 py-0.5 cursor-pointer transition-colors ${selectedYear === y.toString()
                                                    ? 'bg-primary text-primary-foreground font-bold'
                                                    : 'bg-black/25 hover:bg-primary/20 text-muted-foreground'
                                                    }`}
                                            >
                                                {y}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Project Explorer */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="glass-dark border-primary/20">
                            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        GSoC Projects
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Showing {filteredProjects.length} of {projects.length} total projects
                                    </p>
                                </div>

                                {/* Year Filter Tabs */}
                                <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
                                    <Button
                                        variant={selectedYear === 'All' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedYear('All')}
                                        className="h-8 text-xs whitespace-nowrap"
                                    >
                                        All Years
                                    </Button>
                                    {organization.years.slice(0, 5).map(y => (
                                        <Button
                                            key={y}
                                            variant={selectedYear === y.toString() ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedYear(y.toString())}
                                            className="h-8 text-xs whitespace-nowrap"
                                        >
                                            {y}
                                        </Button>
                                    ))}
                                    {organization.years.length > 5 && (
                                        <select
                                            value={organization.years.includes(Number(selectedYear)) && organization.years.indexOf(Number(selectedYear)) >= 5 ? selectedYear : ''}
                                            onChange={(e) => { if (e.target.value) setSelectedYear(e.target.value) }}
                                            className="h-8 text-xs rounded-md border border-input bg-background px-2.5 cursor-pointer max-w-[90px]"
                                        >
                                            <option value="">More...</option>
                                            {organization.years.slice(5).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Search Projects */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search projects in this organization..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-black/20 border-primary/10 hover:border-primary/30 focus:border-primary"
                                    />
                                </div>

                                {/* Project List */}
                                <div className="space-y-4 pt-2">
                                    {filteredProjects.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground bg-black/10 border border-border/20 rounded-xl">
                                            No projects found matching the filters
                                        </div>
                                    ) : (
                                        filteredProjects.map((project, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: idx * 0.03 }}
                                                className="p-5 border border-primary/10 hover:border-primary/25 rounded-xl bg-black/20 hover:bg-black/35 transition-all group relative overflow-hidden"
                                            >
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-2.5">
                                                    <div>
                                                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors pr-8">
                                                            {project.title}
                                                        </h4>
                                                        {project.mentors && project.mentors.length > 0 && (
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {project.mentors[0]}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Badge className="bg-purple-500/10 border-purple-500/20 text-purple-300 font-semibold self-start sm:self-auto flex items-center gap-1 flex-shrink-0">
                                                        <Calendar className="w-3 h-3" />
                                                        GSoC {project.year}
                                                    </Badge>
                                                </div>

                                                <div 
                                                    className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300"
                                                    dangerouslySetInnerHTML={{ __html: project.description }}
                                                />

                                                {project.githubUrl && (
                                                    <div className="flex gap-2">
                                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                                                            <Button size="sm" variant="outline" className="glass text-xs py-1 h-7">
                                                                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                                                View Source / Proposal Code
                                                            </Button>
                                                        </a>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
