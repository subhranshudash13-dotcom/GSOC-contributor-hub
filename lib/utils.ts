import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(d)
}

export function getDaysUntil(targetDate: Date): number {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getTimeUnits(targetDate: Date) {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
}

export function calculateMatchScore(userSkills: string[], projectTechStack: string[]): number {
    const matches = userSkills.filter(skill =>
        projectTechStack.some(tech =>
            tech.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(tech.toLowerCase())
        )
    )

    return Math.round((matches.length / projectTechStack.length) * 100)
}
