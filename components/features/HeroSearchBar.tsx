'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function HeroSearchBar() {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/projects?search=${encodeURIComponent(query)}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex items-center glass rounded-full overflow-hidden backdrop-blur-xl border-2 border-primary/20 hover:border-primary/40 transition-all">
                <Search className="absolute left-6 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search projects by tech stack, organization..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 pl-14 pr-4 py-6 text-base border-0 bg-transparent focus-visible:ring-0"
                />
                <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="m-2 rounded-full px-8"
                >
                    Search
                </Button>
            </div>

            {/* Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
                <span className="text-xs text-muted-foreground">Try:</span>
                {['React', 'Python', 'Machine Learning', 'Blockchain'].map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => {
                            setQuery(tag)
                            router.push(`/projects?search=${encodeURIComponent(tag)}`)
                        }}
                        className="text-xs px-3 py-1 rounded-full glass-dark hover:bg-primary/20 transition-colors"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </form>
    )
}
