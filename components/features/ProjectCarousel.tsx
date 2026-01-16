'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Star, ExternalLink, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { GSoCProject } from '@/types'
import toast from 'react-hot-toast'

export function ProjectCarousel() {
    const router = useRouter()
    const [projects, setProjects] = useState<GSoCProject[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const fetchFeaturedProjects = async () => {
            try {
                // Fetch random or highly rated projects
                const response = await fetch('/api/projects?limit=5&sortBy=stars&sortOrder=desc')
                if (!response.ok) throw new Error('Failed to fetch projects')
                const data = await response.json()
                if (data.projects && data.projects.length > 0) {
                    setProjects(data.projects)
                }
            } catch (error) {
                console.error('Failed to load featured projects:', error)
                // toast.error('Could not load featured projects')
            } finally {
                setLoading(false)
            }
        }

        fetchFeaturedProjects()
    }, [])

    useEffect(() => {
        if (projects.length === 0) return

        const timer = setInterval(() => {
            nextSlide()
        }, 5000)

        return () => clearInterval(timer)
    }, [currentIndex, projects])

    const nextSlide = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % projects.length)
    }

    const prevSlide = () => {
        setDirection(-1)
        setCurrentIndex(
            (prev) => (prev - 1 + projects.length) % projects.length
        )
    }

    const variants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? 90 : -90,
            opacity: 0,
        }),
        center: {
            rotateY: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            rotateY: direction > 0 ? -90 : 90,
            opacity: 0,
        }),
    }

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (projects.length === 0) return null

    const project = projects[currentIndex]

    return (
        <div className="relative max-w-4xl mx-auto">
            <div className="perspective-1000">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="glass-dark border-primary/20 overflow-hidden h-[400px] flex flex-col justify-center">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-sm text-primary font-semibold mb-1">
                                            {project.org}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 line-clamp-1">{project.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <Star className="h-5 w-5 fill-current" />
                                        <span className="font-semibold">{project.stars || 0}</span>
                                    </div>
                                </div>

                                <p className="text-muted-foreground mb-6 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.techStack.slice(0, 4).map((tech) => (
                                        <Badge key={tech} variant="secondary">
                                            {tech}
                                        </Badge>
                                    ))}
                                    <Badge variant={project.difficulty}>
                                        {project.difficulty}
                                    </Badge>
                                </div>

                                <Button
                                    onClick={() => project._id && router.push(`/projects/${project._id.toString()}`)}
                                    variant="gradient"
                                    className="w-full group"
                                >
                                    View Project
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent >
                        </Card >
                    </motion.div >
                </AnimatePresence >
            </div >

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSlide}
                    className="rounded-full glass"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1)
                                setCurrentIndex(index)
                            }}
                            className={`h-2 rounded-full transition-all ${index === currentIndex
                                ? 'w-8 bg-primary'
                                : 'w-2 bg-primary/30 hover:bg-primary/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSlide}
                    className="rounded-full glass"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
