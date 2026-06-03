'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Loader2, ArrowRight, Calendar, Layers, Award, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IOrganization } from '@/models/Organization'
import toast from 'react-hot-toast'

const CATEGORY_OPTIONS = [
    'All',
    'Artificial Intelligence',
    'Cloud',
    'Database',
    'Data Science',
    'Desktop',
    'Education',
    'Graphics',
    'Languages',
    'Media',
    'Operating Systems',
    'Programming languages',
    'Science and medicine',
    'Security',
    'Tools',
    'Web',
    'Other'
]

const POPULAR_TECHS = [
    'All', 'Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'C++', 'Java', 'C', 'Ruby', 'PHP', 'Docker', 'Kubernetes'
]

const YEAR_OPTIONS = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016']

interface PaginationInfo {
    page: number
    limit: number
    total: number
    pages: number
}

export default function OrganizationsPage() {
    const router = useRouter()
    const [organizations, setOrganizations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [tech, setTech] = useState('All')
    const [year, setYear] = useState('All')
    const [is2026Only, setIs2026Only] = useState(false)
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1
    })

    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }))
    }, [category, tech, year, is2026Only])

    useEffect(() => {
        fetchOrganizations()
    }, [category, tech, year, is2026Only, pagination.page])

    const fetchOrganizations = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('page', pagination.page.toString())
            params.append('limit', '12')

            if (category !== 'All') params.append('category', category)
            if (tech !== 'All') params.append('tech', tech)
            if (year !== 'All') params.append('year', year)
            if (is2026Only) params.append('is2026', 'true')
            if (search) params.append('search', search)

            const response = await fetch(`/api/organizations?${params}`)
            if (!response.ok) throw new Error('Failed to fetch')

            const data = await response.json()
            setOrganizations(data.organizations || [])
            setPagination(data.pagination || { page: 1, limit: 12, total: 0, pages: 1 })
        } catch (error) {
            toast.error('Failed to load organizations')
            setOrganizations([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPagination(prev => ({ ...prev, page: 1 }))
        fetchOrganizations()
    }

    return (
        <div className="min-h-screen py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/3 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/3 right-1/10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container">
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Explore Organizations
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Search and filter through all <span className="text-primary font-bold">{pagination.total || 624}</span> Google Summer of Code organizations spanning 2016 to 2026.
                        </p>
                    </motion.div>
                </div>

                {/* Filters */}
                <Card className="glass-dark border-primary/20 mb-8 shadow-xl">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="space-y-6">
                            {/* Search and Toggle */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search organizations by name, description, tags..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 bg-black/20 border-primary/10 hover:border-primary/30 focus:border-primary w-full"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" variant="gradient">
                                        Search
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={is2026Only ? 'default' : 'outline'}
                                        onClick={() => setIs2026Only(!is2026Only)}
                                        className={`transition-all ${is2026Only ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25' : 'glass border-primary/15'}`}
                                    >
                                        <Award className="h-4 w-4 mr-2" />
                                        GSoC 2026 Orgs
                                    </Button>
                                </div>
                            </div>

                            {/* Dropdowns */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-10 px-3 rounded-md border border-primary/10 bg-black/40 hover:bg-black/60 focus:border-primary focus:outline-none text-sm cursor-pointer"
                                    >
                                        {CATEGORY_OPTIONS.map(cat => (
                                            <option key={cat} value={cat} className="bg-neutral-950 text-foreground">{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Popular Technology</label>
                                    <select
                                        value={tech}
                                        onChange={(e) => setTech(e.target.value)}
                                        className="w-full h-10 px-3 rounded-md border border-primary/10 bg-black/40 hover:bg-black/60 focus:border-primary focus:outline-none text-sm cursor-pointer"
                                    >
                                        {POPULAR_TECHS.map(t => (
                                            <option key={t} value={t} className="bg-neutral-950 text-foreground">{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Participation Year</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full h-10 px-3 rounded-md border border-primary/10 bg-black/40 hover:bg-black/60 focus:border-primary focus:outline-none text-sm cursor-pointer"
                                        disabled={is2026Only}
                                    >
                                        {YEAR_OPTIONS.map(y => (
                                            <option key={y} value={y} className="bg-neutral-950 text-foreground">{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Grid List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Searching database...</p>
                    </div>
                ) : organizations.length === 0 ? (
                    <div className="text-center py-20 bg-black/15 border border-primary/10 rounded-xl glass-dark">
                        <Layers className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold mb-2">No organizations found</h3>
                        <p className="text-muted-foreground mb-6">Try refining your search terms or filters</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch('')
                                setCategory('All')
                                setTech('All')
                                setYear('All')
                                setIs2026Only(false)
                            }}
                            className="glass"
                        >
                            Reset All Filters
                        </Button>
                    </div>
                ) : (
                    <div>
                        {/* Results info bar */}
                        <div className="flex items-center justify-between mb-5 px-1">
                            <p className="text-sm text-muted-foreground">
                                Showing <span className="text-foreground font-semibold">{organizations.length}</span> of <span className="text-primary font-semibold">{pagination.total}</span> organizations
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                                <span>Sorted by newest appearance</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {organizations.map((org, index) => (
                                <motion.div
                                    key={org.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <Card
                                        onClick={() => router.push(`/organizations/${org.slug}`)}
                                        className="h-full cursor-pointer glass-dark border-primary/15 hover:border-primary/45 hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col justify-between"
                                    >
                                        <div>
                                            <CardHeader className="flex flex-row items-center gap-4 pb-3">
                                                <div
                                                    className="w-14 h-14 rounded-xl flex items-center justify-center p-2 border border-border/60 overflow-hidden shadow-inner flex-shrink-0"
                                                    style={{ backgroundColor: org.backgroundColor || '#ffffff' }}
                                                >
                                                    {org.logoUrl ? (
                                                        <img
                                                            src={org.logoUrl}
                                                            alt={`${org.name} logo`}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="text-xl font-bold text-neutral-800">
                                                            {org.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CardTitle className="text-base font-bold group-hover:text-primary transition-colors truncate">
                                                            {org.name}
                                                        </CardTitle>
                                                        {org.is2026 && (
                                                            <span className="flex-shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-[10px] font-bold text-primary">
                                                                <CheckCircle2 className="h-2.5 w-2.5" />
                                                                2026
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {org.category}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pb-3">
                                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                                                    {org.description}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {org.technologies.slice(0, 5).map((tech: string) => (
                                                        <Badge key={tech} variant="outline" className="text-[10px] py-0.5 px-2 bg-neutral-900/35 border-muted/50">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                    {org.technologies.length > 5 && (
                                                        <Badge variant="outline" className="text-[10px] py-0.5 px-2 bg-neutral-900/35 border-muted/50 text-muted-foreground">
                                                            +{org.technologies.length - 5} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </div>

                                        <div className="px-6 pb-5 pt-3 border-t border-primary/5 flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{org.years?.length ?? 0} year{(org.years?.length ?? 0) > 1 ? 's' : ''}</span>
                                                </div>
                                                {org.latestYear && (
                                                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold text-[10px]">
                                                        Latest: {org.latestYear}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 font-medium text-primary group-hover:underline">
                                                <span>View Projects</span>
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <Button
                                    variant="outline"
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page === 1}
                                    className="glass"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground px-4">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="glass"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
