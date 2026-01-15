import type { UserProfile, GSoCProject, MatchResult } from '@/types'

const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'

interface AIResponse {
    matches: Array<{
        projectIndex: number
        score: number
        reasoning: string
        matchedSkills: string[]
    }>
}

export async function matchProjectsWithAI(
    userProfile: UserProfile,
    projects: GSoCProject[]
): Promise<MatchResult[]> {
    try {
        // Build the AI prompt
        const prompt = buildMatchPrompt(userProfile, projects)

        // Call the appropriate AI provider
        const response = AI_PROVIDER === 'groq'
            ? await callGroqAPI(prompt)
            : await callOpenAI(prompt)

        // Parse and format results
        return formatMatchResults(response, projects)
    } catch (error) {
        console.error('AI Matching Error:', error)
        // Fallback to rule-based matching
        return fallbackMatching(userProfile, projects)
    }
}

function buildMatchPrompt(profile: UserProfile, projects: GSoCProject[]): string {
    return `You are an expert GSoC mentor helping match contributors with ideal projects.

User Profile:
- Skills: ${profile.skills.join(', ')}
- Experience Level: ${profile.experience}
- Interests: ${profile.interests.join(', ')}
- Location: ${profile.location}
- Weekly Availability: ${profile.availability} hours

Available Projects (${projects.length}):
${projects.map((p, i) => `
${i + 1}. ${p.title} by ${p.org}
   - Tech Stack: ${p.techStack.join(', ')}
   - Difficulty: ${p.difficulty}
   - Location: ${p.location}
   - Description: ${p.description.substring(0, 150)}...
`).join('\n')}

Task: Analyze the user's profile and return the top 5 best-matching projects. For each match, provide:
1. Project index (1-${projects.length})
2. Match score (0-100)
3. Matched skills (from user's skills that align with project tech stack)
4. Brief reasoning (1-2 sentences explaining why this is a good match)

Return ONLY valid JSON in this exact format:
{
  "matches": [
    {
      "projectIndex": 1,
      "score": 95,
      "matchedSkills": ["React", "TypeScript"],
      "reasoning": "Perfect alignment with your React and TypeScript skills. The project difficulty matches your experience level."
    }
  ]
}

Return exactly 5 matches, ordered by score (highest first).`
}

async function callOpenAI(prompt: string): Promise<AIResponse> {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY

    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at matching GSoC contributors with projects. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    })

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse JSON from response
    return JSON.parse(content)
}

async function callGroqAPI(prompt: string): Promise<AIResponse> {
    const GROQ_API_KEY = process.env.GROQ_API_KEY

    if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured')
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at matching GSoC contributors with projects. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    })

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse JSON from response
    return JSON.parse(content)
}

function formatMatchResults(aiResponse: AIResponse, projects: GSoCProject[]): MatchResult[] {
    return aiResponse.matches
        .map(match => {
            const project = projects[match.projectIndex - 1]
            if (!project) return null
            return {
                project,
                score: match.score,
                matchedSkills: match.matchedSkills,
                reasoning: match.reasoning,
            }
        })
        .filter((match): match is MatchResult => match !== null)
}

function fallbackMatching(profile: UserProfile, projects: GSoCProject[]): MatchResult[] {
    // Simple rule-based matching as fallback
    const scored = projects.map(project => {
        let score = 0
        const matchedSkills: string[] = []

        // Check skill matches
        profile.skills.forEach(skill => {
            if (project.techStack.some(tech =>
                tech.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(tech.toLowerCase())
            )) {
                score += 20
                matchedSkills.push(skill)
            }
        })

        // Check difficulty match
        if (project.difficulty === profile.experience) {
            score += 30
        } else if (
            (profile.experience === 'intermediate' && project.difficulty !== 'beginner') ||
            (profile.experience === 'beginner' && project.difficulty !== 'advanced')
        ) {
            score += 15
        }

        // Check location preference
        if (profile.location.toLowerCase().includes(project.location.toLowerCase()) ||
            project.location.toLowerCase() === 'worldwide') {
            score += 10
        }

        return {
            project,
            score: Math.min(score, 100),
            matchedSkills,
            reasoning: `Matched ${matchedSkills.length} of your skills. ${project.difficulty === profile.experience
                ? 'Perfect difficulty level.'
                : 'Good difficulty level.'
                }`
        }
    })

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
}
