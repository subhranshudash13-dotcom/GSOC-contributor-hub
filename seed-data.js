/*
  Updated Seed Script with Diagnostic Logging
*/
const mongoose = require('mongoose');

// Your MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://gsoc-admin:m2VQLteMPgwur09U@cluster0.zpntett.mongodb.net/gsoc-hub?retryWrites=true&w=majority';

// Sample Data
const sampleProjects = [
    {
        org: 'TensorFlow',
        title: 'Improve TensorFlow.js Performance',
        description: 'Work on optimizing TensorFlow.js for better browser performance and reducing bundle size for production applications.',
        difficulty: 'advanced',
        techStack: ['JavaScript', 'TypeScript', 'WebAssembly', 'Machine Learning'],
        githubUrl: 'https://github.com/tensorflow/tfjs',
        applicationDeadline: new Date('2026-03-15'),
        thumbnail: '',
        stars: 1250,
        location: 'Worldwide',
        orgSize: 'large',
        mentors: ['@tensorflow-mentor'],
        createdAt: new Date()
    },
    {
        org: 'Mozilla',
        title: 'Firefox Developer Tools Enhancement',
        description: 'Add new features to Firefox DevTools including better CSS Grid debugging capabilities and performance profiling.',
        difficulty: 'intermediate',
        techStack: ['React', 'JavaScript', 'CSS', 'Web APIs'],
        githubUrl: 'https://github.com/firefox-devtools/debugger',
        applicationDeadline: new Date('2026-03-20'),
        thumbnail: '',
        stars: 890,
        location: 'Worldwide',
        orgSize: 'large',
        mentors: ['@mozilla-mentor'],
        createdAt: new Date()
    },
    {
        org: 'Django',
        title: 'Async ORM Improvements',
        description: 'Enhance Django\'s async ORM capabilities for better performance in async views and support for more database operations.',
        difficulty: 'advanced',
        techStack: ['Python', 'PostgreSQL', 'Django', 'AsyncIO'],
        githubUrl: 'https://github.com/django/django',
        applicationDeadline: new Date('2026-03-18'),
        thumbnail: '',
        stars: 1050,
        location: 'Worldwide',
        orgSize: 'medium',
        mentors: ['@django-mentor'],
        createdAt: new Date()
    }
];

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
            createdAt: Date
        }));

        console.log('🔄 Checking permissions...');

        // Check Count (Read)
        const count = await Project.countDocuments();
        console.log(`✅ Read Permission OK. (Found ${count} projects)`);

        // Check Insert (Write)
        if (count === 0) {
            console.log('🔄 Attempting to INSERT sample data...');
            await Project.insertMany(sampleProjects);
            console.log('✅ SUCCESS! Added sample projects.');
        } else {
            console.log('ℹ️  Skipping insert: Data already exists.');
        }

        console.log('\n🎉 DONE!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR OCCURRED:');
        console.error('------------------------------------------');

        // Handle Permission Errors
        if (error.codeName === 'AtlasError' && (error.code === 8000 || error.code === 13)) {
            console.error('🛑 PERMISSION DENIED');
            console.error('The database user "gsoc-admin" does not have "Read and Write" permissions.');
            console.error('\n👉 SOLUTION:');
            console.error('1. Go to MongoDB Atlas (cloud.mongodb.com)');
            console.error('2. Go to "Database Access"');
            console.error('3. Edit user "gsoc-admin"');
            console.error('4. Change Role to "Atlas Admin" (easiest fix)');
            console.error('5. Click Update User');
        } else {
            console.error('Error Message: ' + error.message);
        }
        console.error('------------------------------------------\n');
        process.exit(1);
    }
}

seedDatabase();