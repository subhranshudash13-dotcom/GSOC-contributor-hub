import { motion } from 'framer-motion'
import Link from 'next/link'
import { CountdownTimer } from '@/components/features/CountdownTimer'
import { HeroSearchBar } from '@/components/features/HeroSearchBar'
import { StatsDisplay } from '@/components/features/StatsDisplay'
import { ProjectCarousel } from '@/components/features/ProjectCarousel'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Target, Rocket } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-primary/20">
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            <span className="text-sm">Google Summer of Code 2026</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl mx-auto">
                            Find Your Dream{' '}
                            <span className="text-gradient gradient-purple">
                                Open Source Project
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            AI-powered project matching for Google Summer of Code. Discover perfect opportunities from 500+ organizations.
                        </p>

                        {/* Countdown */}
                        <div className="py-8">
                            <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                                GSoC 2026 Begins In
                            </h3>
                            <CountdownTimer />
                        </div>

                        {/* Search Bar */}
                        <div className="pt-8">
                            <HeroSearchBar />
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center pt-4">
                            <Link href="/matcher">
                                <Button variant="gradient" size="lg" className="group">
                                    <Sparkles className="h-5 w-5 mr-2" />
                                    AI Project Matcher
                                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/projects">
                                <Button variant="outline" size="lg" className="glass">
                                    Browse All Projects
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-y glass-dark">
                <div className="container">
                    <StatsDisplay />
                </div>
            </section>

            {/* Featured Projects Carousel */}
            <section className="py-20">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Featured Projects
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore popular GSoC projects from top organizations
                        </p>
                    </div>
                    <ProjectCarousel />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 glass-dark">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 glass rounded-xl hover:scale-105 transition-transform">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-purple mb-4">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
                            <p className="text-muted-foreground">
                                Our AI analyzes your skills and interests to find the perfect project match with 90%+ accuracy
                            </p>
                        </div>

                        <div className="text-center p-8 glass rounded-xl hover:scale-105 transition-transform">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-purple mb-4">
                                <Target className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                            <p className="text-muted-foreground">
                                Monitor your applications, contributions, and achievements in one beautiful dashboard
                            </p>
                        </div>

                        <div className="text-center p-8 glass rounded-xl hover:scale-105 transition-transform">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-purple mb-4">
                                <Rocket className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Launch Your Career</h3>
                            <p className="text-muted-foreground">
                                Join thousands of contributors who landed their dream open source opportunities
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20">
                <div className="container">
                    <div className="max-w-4xl mx-auto text-center glass-dark rounded-2xl p-12 border border-primary/20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Find Your Perfect Project?
                        </h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            Let our AI match you with the best GSoC projects based on your skills and interests
                        </p>
                        <Link href="/matcher">
                            <Button variant="gradient" size="lg" className="group">
                                <Sparkles className="h-5 w-5 mr-2" />
                                Start Matching Now
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
