export interface User {
    _id?: string
    githubId: string
    email: string
    name: string
    avatar?: string
    skills: string[]
    trackedProjects: string[]
    badges: string[]
    contributions: Contribution[]
    preferences: {
        theme: 'dark' | 'light' | 'sunset'
    }
    createdAt: Date
    updatedAt: Date
}

export interface GSoCProject {
    _id?: string
    org: string
    title: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    techStack: string[]
    githubUrl: string
    applicationDeadline: Date
    thumbnail: string
    stars: number
    location: string
    orgSize: 'small' | 'medium' | 'large'
    mentors: string[]
    topics?: string[]
    year?: number
    createdAt?: Date
}

export interface Contribution {
    projectId: string
    prUrl: string
    status: 'pending' | 'merged' | 'closed'
    title: string
    date: Date
}

export interface Application {
    _id?: string
    userId: string
    projectId: string
    status: 'applied' | 'interview' | 'accepted' | 'rejected'
    appliedAt: Date
    notes?: string
    updatedAt: Date
}

export interface MatchResult {
    project: GSoCProject
    score: number
    matchedSkills: string[]
    reasoning: string
}

export interface UserProfile {
    skills: string[]
    experience: 'beginner' | 'intermediate' | 'advanced'
    interests: string[]
    location: string
    availability: number
}

export interface GitHubStats {
    username: string
    totalPRs: number
    mergedPRs: number
    starsEarned: number
    repositories: number
    followers: number
}
