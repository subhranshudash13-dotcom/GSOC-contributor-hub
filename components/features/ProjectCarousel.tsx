'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const FEATURED_PROJECTS = [
    {
        id: 1,
        org: 'TensorFlow',
        title: 'Improve TensorFlow.js Performance',
        description: 'Work on optimizing TensorFlow.js for better browser performance and reducing bundle size.',
        techStack: ['JavaScript', 'TypeScript', 'WebAssembly'],
        difficulty: 'advanced' as const,
        stars: 1250,
    },
    {
        id: 2,
        org: 'Mozilla',
        title: 'Firefox Developer Tools Enhancement',
        description: 'Add new features to Firefox DevTools including better CSS Grid debugging capabilities.',
        techStack: ['React', 'JavaScript', 'CSS'],
        difficulty: 'intermediate' as const,
        stars: 890,
    },
    {
        id: 3,
        org: 'Django',
        title: 'Async ORM Improvements',
        description: 'Enhance Django\'s async ORM capabilities for better performance in async views.',
        techStack: ['Python', 'PostgreSQL', 'Django'],
        difficulty: 'advanced' as const,
        stars: 1050,
        githubUrl: 'https://github.com/django/deps',
    },
]

export function ProjectCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 5000)

        return () => clearInterval(timer)
    }, [currentIndex])

    const nextSlide = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % FEATURED_PROJECTS.length)
    }

    const prevSlide = () => {
        setDirection(-1)
        setCurrentIndex(
            (prev) => (prev - 1 + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length
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

    const project = FEATURED_PROJECTS[currentIndex]

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
                        <Card className="glass-dark border-primary/20 overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-sm text-primary font-semibold mb-1">
                                            {project.org}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-yellow-500">
                                        <Star className="h-5 w-5 fill-current" />
                                        <span className="font-semibold">{project.stars}</span>
                                    </div>
                                </div>

                                <p className="text-muted-foreground mb-6">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.techStack.map((tech) => (
                                        <Badge key={tech} variant="secondary">
                                            {tech}
                                        </Badge>
                                    ))}
                                    <Badge variant={project.difficulty}>
                                        {project.difficulty}
                                    </Badge>
                                </div>

                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                                    <Button variant="gradient" className="w-full group">
                                        View Project
                                        <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </a>
                            </CardContent >
                        </Card >
                    </motion.div >
                </AnimatePresence >
            </div >

            {/* Navigation */}
            < div className="flex justify-center gap-4 mt-6" >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSlide}
                    className="rounded-full glass"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                    {FEATURED_PROJECTS.map((_, index) => (
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
            </div >
        </div >
    )
}
