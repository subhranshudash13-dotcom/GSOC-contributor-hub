import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'
import { ProjectDetailsClient } from '@/components/features/ProjectDetailsClient'

interface Props {
    params: Promise<{ id: string }>
}

async function getProject(id: string) {
    await dbConnect()
    const project = await Project.findById(id).lean() as any
    if (!project) return null
    // Convert _id to string to avoid serialization issues
    return { ...project, _id: project._id.toString() }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const project = await getProject(id)

    if (!project) {
        return {
            title: 'Project Not Found | GSoC Contributor Hub',
        }
    }

    return {
        title: `${project.title} - ${project.org} | GSoC 2026`,
        description: `Join ${project.org} to work on ${project.title} for GSoC 2026. ${project.description.substring(0, 160)}...`,
        keywords: [...project.techStack, project.org, 'GSoC', 'Open Source', 'Internship'],
        openGraph: {
            title: `${project.title} | GSoC 2026 Project`,
            description: project.description.substring(0, 200),
            images: ['/og-image.jpg'], // Ideally dynamic image
        },
    }
}

export default async function ProjectPage(props: Props) {
    const params = await props.params
    const project = await getProject(params.id)

    if (!project) {
        notFound()
    }

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: project.title,
        description: project.description,
        programmingLanguage: project.techStack,
        author: {
            '@type': 'Organization',
            name: project.org,
        },
        dateCreated: project.createdAt,
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProjectDetailsClient project={project} />
        </>
    )
}
