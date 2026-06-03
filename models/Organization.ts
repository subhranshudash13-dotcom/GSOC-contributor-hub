import mongoose, { Schema, model, models } from 'mongoose'

export interface IOrganization {
    _id?: string
    name: string
    slug: string
    logoUrl?: string
    backgroundColor?: string
    description: string
    websiteUrl?: string
    category: string
    ideasUrl?: string
    projectsUrl?: string
    technologies: string[]
    topics: string[]
    years: number[]          // All years org participated in GSoC
    latestYear: number       // Most recent year org participated (for sorting)
    is2026: boolean          // Whether selected for GSoC 2026
    projectCount: number     // Total number of archived projects
    createdAt?: Date
    updatedAt?: Date
}

const OrgProjectSchema = new Schema({
    year: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    studentName: { type: String, default: '' },
    codeUrl: { type: String, default: '' },
    projectUrl: { type: String, default: '' },
}, { _id: false })

const OrganizationSchema = new Schema<IOrganization>(
    {
        name: { type: String, required: true, index: true },
        slug: { type: String, required: true, unique: true, index: true },
        logoUrl: { type: String, default: '' },
        backgroundColor: { type: String, default: '#ffffff' },
        description: { type: String, required: true },
        websiteUrl: { type: String, default: '' },
        category: { type: String, required: true, index: true },
        ideasUrl: { type: String, default: '' },
        projectsUrl: { type: String, default: '' },
        technologies: [{ type: String, index: true }],
        topics: [{ type: String }],
        years: [{ type: Number }],
        latestYear: { type: Number, default: 0, index: true },
        is2026: { type: Boolean, default: false, index: true },
        projectCount: { type: Number, default: 0 },
    },
    { timestamps: true }
)

// Text index for search
OrganizationSchema.index({ name: 'text', description: 'text', technologies: 'text', topics: 'text' })

export default models.Organization || model<IOrganization>('Organization', OrganizationSchema)
