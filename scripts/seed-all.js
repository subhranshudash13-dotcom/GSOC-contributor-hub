/*
  Seeding Script for GSoC 2026 and Historical Organizations and Projects
*/
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
try {
    require('dotenv').config();
    console.log('✅ Loaded .env file');
} catch (e) {
    console.log('⚠️ dotenv not installed, using environment variables or defaults');
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment or .env');
    process.exit(1);
}

const compiledDataPath = path.join(__dirname, 'gsoc-compiled-data.json');
if (!fs.existsSync(compiledDataPath)) {
    console.error(`❌ Compiled data file not found at: ${compiledDataPath}`);
    process.exit(1);
}

const gsocData = JSON.parse(fs.readFileSync(compiledDataPath, 'utf8'));
console.log(`📁 Loaded ${gsocData.length} consolidated organizations from compiled data`);

function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function seed() {
    console.log('\n🔄 Connecting to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB');

        // Define schemas inline to avoid dependency conflicts in ES Modules / CommonJS context
        const OrganizationSchema = new mongoose.Schema({
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
            is2026: { type: Boolean, default: false, index: true },
            projectCount: { type: Number, default: 0 },
        }, { timestamps: true });

        const ProjectSchema = new mongoose.Schema({
            org: { type: String, required: true, index: true },
            orgSlug: { type: String, index: true },
            title: { type: String, required: true, index: true },
            description: { type: String, required: true },
            difficulty: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced'],
                required: true,
                index: true
            },
            techStack: [{ type: String, index: true }],
            githubUrl: { type: String, required: true },
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
            topics: [{ type: String, index: true }],
            year: { type: Number, index: true },
            createdAt: { type: Date, default: Date.now },
        });

        // Register models or use existing
        const Organization = mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);
        const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

        // Clear existing data by dropping collections (this drops the indexes too)
        console.log('🔄 Dropping collections to clear old indexes...');
        try {
            await mongoose.connection.db.dropCollection('projects');
            console.log('✅ Dropped projects collection');
        } catch (e) {
            console.log('ℹ️ Projects collection did not exist or could not be dropped');
        }
        try {
            await mongoose.connection.db.dropCollection('organizations');
            console.log('✅ Dropped organizations collection');
        } catch (e) {
            console.log('ℹ️ Organizations collection did not exist or could not be dropped');
        }

        const orgsToInsert = [];
        const projectsToInsert = [];

        for (const orgData of gsocData) {
            const slug = generateSlug(orgData.name);
            const is2026 = orgData.years.includes(2026);
            const projectCount = orgData.projects ? orgData.projects.length : 0;
            const latestYear = orgData.years.length > 0 ? Math.max(...orgData.years) : 0;

            orgsToInsert.push({
                name: orgData.name,
                slug: slug,
                logoUrl: orgData.logoUrl || '',
                backgroundColor: orgData.backgroundColor || '#ffffff',
                description: orgData.description || '',
                websiteUrl: orgData.websiteUrl || '',
                category: orgData.category || 'Other',
                ideasUrl: orgData.ideasUrl || '',
                projectsUrl: orgData.projectsUrl || '',
                technologies: orgData.technologies || [],
                topics: orgData.topics || [],
                years: orgData.years || [],
                latestYear: latestYear,
                is2026: is2026,
                projectCount: projectCount
            });

            // Map and add projects
            if (orgData.projects && orgData.projects.length > 0) {
                orgData.projects.forEach(proj => {
                    // Heuristics for difficulty
                    let difficulty = 'intermediate';
                    const titleAndDesc = (proj.title + ' ' + proj.description).toLowerCase();
                    if (titleAndDesc.includes('easy') || titleAndDesc.includes('beginner') || titleAndDesc.includes('simple') || titleAndDesc.includes('starter')) {
                        difficulty = 'beginner';
                    } else if (titleAndDesc.includes('advanced') || titleAndDesc.includes('performance') || titleAndDesc.includes('optimize') || titleAndDesc.includes('complex') || titleAndDesc.includes('benchmark')) {
                        difficulty = 'advanced';
                    }

                    // Heuristics for org size
                    let orgSize = 'medium';
                    if (projectCount > 25) {
                        orgSize = 'large';
                    } else if (projectCount < 6) {
                        orgSize = 'small';
                    }

                    // Github/Code URL mapping
                    let codeUrl = proj.codeUrl || proj.projectUrl || orgData.websiteUrl || 'https://github.com';
                    if (!codeUrl.startsWith('http://') && !codeUrl.startsWith('https://')) {
                        codeUrl = 'https://' + codeUrl;
                    }

                    // Heuristics for stars
                    const stars = Math.floor(Math.random() * 450) + 15;

                    // Application deadline date mapping
                    let deadlineYear = proj.year || 2026;
                    let applicationDeadline = new Date(`${deadlineYear}-04-15T00:00:00.000Z`);

                    projectsToInsert.push({
                        org: orgData.name,
                        orgSlug: slug,
                        title: proj.title,
                        description: proj.description || 'No description provided.',
                        difficulty: difficulty,
                        techStack: orgData.technologies || [],
                        githubUrl: codeUrl,
                        applicationDeadline: applicationDeadline,
                        thumbnail: orgData.logoUrl || '',
                        stars: stars,
                        location: 'Worldwide',
                        orgSize: orgSize,
                        mentors: proj.studentName ? [`Student: ${proj.studentName}`] : ['GSoC Mentor'],
                        topics: orgData.topics || [],
                        year: proj.year || 2026
                    });
                });
            }
        }

        console.log(`🔄 Inserting ${orgsToInsert.length} organizations...`);
        await Organization.insertMany(orgsToInsert);
        console.log('✅ Organizations inserted successfully!');

        console.log(`🔄 Inserting ${projectsToInsert.length} projects...`);
        // Batch inserts to prevent payload constraints on MongoDB Atlas if data is huge
        const batchSize = 1000;
        for (let i = 0; i < projectsToInsert.length; i += batchSize) {
            const batch = projectsToInsert.slice(i, i + batchSize);
            await Project.insertMany(batch);
            console.log(`   Inserted projects ${i} to ${Math.min(i + batchSize, projectsToInsert.length)}...`);
        }
        console.log('✅ Projects inserted successfully!');

        // Log final statistics
        const finalOrgs = await Organization.countDocuments();
        const finalProjects = await Project.countDocuments();
        const orgs2026 = await Organization.countDocuments({ is2026: true });
        const projects2026 = await Project.countDocuments({ year: 2026 });

        console.log('\n📊 Database Population Summary:');
        console.log(`   Total Organizations: ${finalOrgs}`);
        console.log(`   Organizations active in 2026: ${orgs2026}`);
        console.log(`   Total Projects (2016-2026): ${finalProjects}`);
        console.log(`   Projects in 2026: ${projects2026}`);
        console.log('\n🎉 Database successfully seeded with full GSoC data!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    }
}

seed();
