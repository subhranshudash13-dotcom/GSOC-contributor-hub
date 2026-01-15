import mongoose, { Schema, model, models } from 'mongoose'
import type { GSoCProject } from '@/types'

const ProjectSchema = new Schema<GSoCProject>({
    org: { type: String, required: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
        index: true
    },
    techStack: [{ type: String, index: true }],
    githubUrl: { type: String, required: true, unique: true },
    applicationDeadline: { type: Date, required: true, index: true },
    thumbnail: { type: String },
    stars: { type: Number, default: 0, index: true },
    location: { type: String, required: true, index: true },
    orgSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium',
        index: true
    },
    mentors: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
})

// Text search index for title and description
ProjectSchema.index({ title: 'text', description: 'text' })

export default models.Project || model<GSoCProject>('Project', ProjectSchema)
