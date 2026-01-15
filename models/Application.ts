import mongoose, { Schema, model, models } from 'mongoose'
import type { Application } from '@/types'

const ApplicationSchema = new Schema<Application>({
    userId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    status: {
        type: String,
        enum: ['applied', 'interview', 'accepted', 'rejected'],
        default: 'applied',
        index: true
    },
    appliedAt: { type: Date, default: Date.now },
    notes: { type: String },
    updatedAt: { type: Date, default: Date.now },
})

// Compound index for user-project queries
ApplicationSchema.index({ userId: 1, projectId: 1 }, { unique: true })

ApplicationSchema.pre('save', function (next) {
    this.updatedAt = new Date()
    next()
})

export default models.Application || model<Application>('Application', ApplicationSchema)
