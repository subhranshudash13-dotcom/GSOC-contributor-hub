/*
  Enhanced Seed Script for GSoC 2025 Data
  This script loads the curated GSoC 2025 organization data
*/
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB Connection String - from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gsoc-admin:m2VQLteMPgwur09U@cluster0.zpntett.mongodb.net/gsoc-hub?retryWrites=true&w=majority';

// Load GSoC 2025 data
const dataPath = path.join(__dirname, 'scripts', 'gsoc-2025-data.json');
const gsocData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function seedDatabase() {
    console.log('\n🔄 Connecting to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected to MongoDB');

        const Project = mongoose.model('Project', new mongoose.Schema({
            org: String,
            title: String,
            description: String,
            difficulty: String,
            techStack: [String],
            githubUrl: String,
            applicationDeadline: Date,
            thumbnail: String,
            stars: Number,
            location: String,
            orgSize: String,
            mentors: [String],
            topics: [String],  // NEW: Domain topics
            year: Number,       // NEW: GSoC year
            createdAt: Date
        }));

        console.log(`🔄 Loading GSoC ${gsocData.year} data...`);

        // Check Count (Read)
        const count = await Project.countDocuments();
        console.log(`✅ Found ${count} existing projects in database`);

        // Clear existing data and insert new
        if (count > 0) {
            console.log('🔄 Clearing existing data...');
            await Project.deleteMany({});
            console.log('✅ Cleared old data');
        }

        console.log(`🔄 Inserting ${gsocData.projects.length} projects from ${gsocData.organizations.length} organizations...`);
        await Project.insertMany(gsocData.projects);
        console.log('✅ SUCCESS! Database populated with GSoC 2025 data');

        // Display statistics
        const newCount = await Project.countDocuments();
        const uniqueOrgs = await Project.distinct('org');
        console.log('\n📊 Database Statistics:');
        console.log(`   Total Projects: ${newCount}`);
        console.log(`   Unique Organizations: ${uniqueOrgs.length}`);
        console.log(`   GSoC Year: ${gsocData.year}`);

        console.log('\n🎉 DONE!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR OCCURRED:');
        console.error('------------------------------------------');

        // Handle Permission Errors
        if (error.codeName === 'AtlasError' && (error.code === 8000 || error.code === 13)) {
            console.error('🛑 PERMISSION DENIED');
            console.error('The database user does not have "Read and Write" permissions.');
            console.error('\n👉 SOLUTION:');
            console.error('1. Go to MongoDB Atlas (cloud.mongodb.com)');
            console.error('2. Go to "Database Access"');
            console.error('3. Edit your database user');
            console.error('4. Change Role to "Atlas Admin" (easiest fix)');
            console.error('5. Click Update User');
        } else {
            console.error('Error Message: ' + error.message);
            console.error('Stack: ' + error.stack);
        }
        console.error('------------------------------------------\n');
        process.exit(1);
    }
}

seedDatabase();