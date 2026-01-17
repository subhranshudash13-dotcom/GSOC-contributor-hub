import mongoose, { Schema, model, models } from 'mongoose'
import type { User } from '@/types'

const ContributionSchema = new Schema({
    projectId: { type: String, required: true },
    prUrl: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'merged', 'closed'],
        default: 'pending'
    },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
})

const UserSchema = new Schema<User>({
    githubId: { type: String },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String },
    skills: [{ type: String }],
    trackedProjects: [{ type: String }],
    badges: [{ type: String }],
    contributions: [ContributionSchema],
    preferences: {
        theme: {
            type: String,
            enum: ['dark', 'light', 'sunset'],
            default: 'dark'
        },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

UserSchema.pre('save', function (next) {
    this.updatedAt = new Date()
    next()
})

export default models.User || model<User>('User', UserSchema)
