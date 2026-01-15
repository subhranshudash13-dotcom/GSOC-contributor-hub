'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { UserProfile, MatchResult } from '@/types'
import toast from 'react-hot-toast'

const TECH_SKILLS = [
    'React', 'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go',
    'Rust', 'Machine Learning', 'Node.js', 'Django', 'Docker', 'Kubernetes'
]

export function MatcherWizard() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [matches, setMatches] = useState<MatchResult[] | null>(null)

    const [profile, setProfile] = useState<UserProfile>({
        skills: [],
        experience: 'intermediate',
        interests: [],
        location: 'worldwide',
        availability: 20,
    })

    const handleSubmit = async () => {
        if (profile.skills.length === 0) {
            toast.error('Please select at least one skill')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            })

            if (!response.ok) throw new Error('Failed to fetch matches')

            const data = await response.json()
            setMatches(data.matches)
            toast.success('Found your perfect matches!')
            setStep(5)
        } catch (error) {
            toast.error('Failed to get matches. Please try again.')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const toggleSkill = (skill: string) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }))
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-4xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <Card className="glass-dark border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-3xl">Select Your Skills</CardTitle>
                                    <p className="text-muted-foreground mt-2">
                                        Choose all technologies and programming languages you're comfortable with
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {TECH_SKILLS.map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-4 py-2 rounded-full border-2 transition-all ${profile.skills.includes(skill)
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>

                                    <Input
                                        placeholder="Add custom skill..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && e.currentTarget.value) {
                                                toggleSkill(e.currentTarget.value)
                                                e.currentTarget.value = ''
                                            }
                                        }}
                                        className="mb-6"
                                    />

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            {profile.skills.length} skills selected
                                        </div>
                                        <Button onClick={() => setStep(2)} variant="gradient">
                                            Next <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <Card className="glass-dark border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-3xl">Experience Level</CardTitle>
                                    <p className="text-muted-foreground mt-2">
                                        What's your experience level with open source contributions?
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 mb-8">
                                        {[
                                            { value: 'beginner', label: 'Beginner', desc: 'New to open source' },
                                            { value: 'intermediate', label: 'Intermediate', desc: 'Some contributions' },
                                            { value: 'advanced', label: 'Advanced', desc: 'Many contributions' },
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setProfile(prev => ({ ...prev, experience: option.value as any }))}
                                                className={`w-full p-6 rounded-xl border-2 text-left transition-all ${profile.experience === option.value
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="font-semibold text-lg">{option.label}</div>
                                                <div className="text-sm text-muted-foreground mt-1">{option.desc}</div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-between">
                                        <Button onClick={() => setStep(1)} variant="outline">
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button onClick={() => setStep(3)} variant="gradient">
                                            Next <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <Card className="glass-dark border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-3xl">Interests & Preferences</CardTitle>
                                    <p className="text-muted-foreground mt-2">
                                        What areas interest you most?
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <label className="block text-sm font-medium mb-3">Location Preference</label>
                                            <Input
                                                value={profile.location}
                                                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                                                placeholder="e.g., India, Worldwide, Remote"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-3">
                                                Weekly Availability: {profile.availability} hours
                                            </label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="40"
                                                value={profile.availability}
                                                onChange={(e) => setProfile(prev => ({ ...prev, availability: parseInt(e.target.value) }))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <Button onClick={() => setStep(2)} variant="outline">
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button onClick={() => setStep(4)} variant="gradient">
                                            Next <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <Card className="glass-dark border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-3xl">Review & Match</CardTitle>
                                    <p className="text-muted-foreground mt-2">
                                        Confirm your profile and find the perfect projects
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <h4 className="font-semibold mb-2">Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills.map(skill => (
                                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Experience</h4>
                                            <Badge variant={profile.experience as any}>
                                                {profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1)}
                                            </Badge>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Location</h4>
                                            <p className="text-muted-foreground">{profile.location}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Availability</h4>
                                            <p className="text-muted-foreground">{profile.availability} hours/week</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <Button onClick={() => setStep(3)} variant="outline">
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button onClick={handleSubmit} variant="gradient" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Finding Matches...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    Find My Matches
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 5 && matches && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold mb-4">Your Perfect Matches! 🎉</h2>
                                <p className="text-muted-foreground">
                                    We found {matches.length} projects that match your skills
                                </p>
                            </div>

                            <div className="space-y-6">
                                {matches.map((match, index) => (
                                    <motion.div
                                        key={match.project._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="glass-dark border-primary/20 hover:border-primary/40 transition-all">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="text-sm text-primary font-semibold mb-1">
                                                            {match.project.org}
                                                        </div>
                                                        <CardTitle className="text-2xl">{match.project.title}</CardTitle>
                                                    </div>
                                                    <div className="text-4xl font-bold text-gradient gradient-purple">
                                                        {match.score}%
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground mb-4">{match.project.description}</p>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {match.matchedSkills.map(skill => (
                                                        <Badge key={skill} variant="default">{skill}</Badge>
                                                    ))}
                                                    <Badge variant={match.project.difficulty}>
                                                        {match.project.difficulty}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm italic text-muted-foreground mb-4">
                                                    "{match.reasoning}"
                                                </p>

                                                <Button variant="gradient" className="w-full">
                                                    View Project Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center mt-8">
                                <Button onClick={() => { setStep(1); setMatches(null); }} variant="outline">
                                    Start New Match
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
