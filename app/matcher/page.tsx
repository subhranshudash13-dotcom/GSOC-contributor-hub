import { MatcherWizard } from '@/components/features/MatcherWizard'
import { Sparkles } from 'lucide-react'

export const metadata = {
    title: 'AI Project Matcher - GSoC Hub',
    description: 'Find your perfect GSoC project using AI-powered matching',
}

export default function MatcherPage() {
    return (
        <div className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="text-center py-12 border-b glass-dark">
                <div className="container">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-primary/20 mb-4">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-sm">Powered by AI</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        AI Project Matcher
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Answer a few questions and let our AI find the perfect GSoC projects for you
                    </p>
                </div>
            </div>

            <MatcherWizard />
        </div>
    )
}
