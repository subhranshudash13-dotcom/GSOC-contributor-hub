/*
  Enhanced Seed Script for GSoC Data
  This script loads the curated GSoC organization data
*/
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
try {
    require('dotenv').config();
    console.log('✅ Loaded .env file');
} catch (e) {
    console.log('⚠️  dotenv not installed, using environment variables or defaults');
}

// MongoDB Connection String - from .env or default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gsoc-admin:m2VQLteMPgwur09U@cluster0.zpntett.mongodb.net/gsoc-hub?retryWrites=true&w=majority';

// Debug connection string (hide password)
const uriPreview = MONGODB_URI.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)(@.+)/, (match, protocol, user, pass, rest) => {
    return protocol + user + ':***' + rest;
});
console.log(`📝 Using connection string: ${uriPreview}`);

// Load GSoC data - automatically detects the latest year data file
const scriptsDir = path.join(__dirname, 'scripts');
const dataFiles = fs.readdirSync(scriptsDir).filter(f => f.startsWith('gsoc-') && f.endsWith('-data.json'));
const latestDataFile = dataFiles.sort().reverse()[0] || 'gsoc-2025-data.json';
const dataPath = path.join(scriptsDir, latestDataFile);
console.log(`📁 Using data file: ${latestDataFile}`);
const gsocData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function seedDatabase() {
    console.log('\n🔄 Connecting to MongoDB...');
    
    // Validate connection string format
    if (!MONGODB_URI || (!MONGODB_URI.startsWith('mongodb+srv://') && !MONGODB_URI.startsWith('mongodb://'))) {
        console.error('❌ Invalid MONGODB_URI format');
        console.error('   Connection string should start with mongodb+srv:// or mongodb://');
        console.error(`   Current value: ${MONGODB_URI ? MONGODB_URI.substring(0, 50) + '...' : 'NOT FOUND'}`);
        process.exit(1);
    }
    
    // Extract connection details for debugging
    const uriMatch = MONGODB_URI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/);
    if (uriMatch) {
        const [, username, password, host, database] = uriMatch;
        console.log(`📝 Connection details:`);
        console.log(`   Username: ${username}`);
        console.log(`   Host: ${host}`);
        console.log(`   Database: ${database}`);
        console.log(`   Password: ${'*'.repeat(password.length)}`);
    }
    
    try {
        await mongoose.connect(MONGODB_URI, { 
            serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            retryWrites: true,
            w: 'majority'
        });
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
        console.log(`✅ SUCCESS! Database populated with GSoC data (Year: ${gsocData.year || 'Historical'})`);

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

        const errorMessage = error.message || '';
        const errorName = error.name || '';

        // Handle IP Whitelist Errors
        if (errorName === 'MongooseServerSelectionError' || errorMessage.includes('whitelist') || errorMessage.includes('IP')) {
            console.error('🛑 IP ADDRESS NOT WHITELISTED');
            console.error('Your current IP address is not on the MongoDB Atlas IP whitelist.');
            console.error('\n👉 SOLUTION - Add Your IP to Whitelist:');
            console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
            console.error('2. Select your cluster (or create one if needed)');
            console.error('3. Click on "Network Access" in the left sidebar');
            console.error('4. Click "Add IP Address" button');
            console.error('5. Click "Add Current IP Address" (recommended) OR');
            console.error('   - For development: Add "0.0.0.0/0" to allow all IPs (less secure)');
            console.error('   - For production: Add your specific IP address');
            console.error('6. Click "Confirm"');
            console.error('7. Wait 1-2 minutes for changes to propagate');
            console.error('8. Run this script again');
            console.error('\n💡 Tip: To find your IP, visit: https://whatismyipaddress.com/');
        }
        // Handle Permission Errors
        else if (error.codeName === 'AtlasError' && (error.code === 8000 || error.code === 13)) {
            console.error('🛑 PERMISSION DENIED');
            console.error('The database user does not have "Read and Write" permissions.');
            console.error('\n👉 SOLUTION:');
            console.error('1. Go to MongoDB Atlas (cloud.mongodb.com)');
            console.error('2. Go to "Database Access"');
            console.error('3. Edit your database user');
            console.error('4. Change Role to "Atlas Admin" (easiest fix)');
            console.error('5. Click Update User');
        } 
        // Handle Authentication Errors
        else if (errorMessage.includes('authentication failed') || errorMessage.includes('bad auth') || errorMessage.includes('password')) {
            console.error('🛑 AUTHENTICATION FAILED');
            console.error('Invalid username or password in connection string.');
            console.error('\n👉 SOLUTION:');
            console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
            console.error('2. Go to "Database Access"');
            console.error('3. Check your database user credentials');
            console.error('4. If password is wrong, click "Edit" on your user and reset the password');
            console.error('5. Update the connection string in seed-data.js or .env file');
            console.error('6. Connection string format: mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/dbname');
        }
        // Handle DNS/Network Errors
        else if (errorMessage.includes('getaddrinfo') || errorMessage.includes('ENOTFOUND') || errorMessage.includes('ETIMEDOUT')) {
            console.error('🛑 NETWORK/DNS ERROR');
            console.error('Could not resolve MongoDB Atlas hostname or network timeout.');
            console.error('\n👉 POSSIBLE SOLUTIONS:');
            console.error('1. Check your internet connection');
            console.error('2. Verify cluster hostname is correct in connection string');
            console.error('3. Check if MongoDB Atlas cluster is running (not paused)');
            console.error('4. Try accessing https://cloud.mongodb.com/ in browser');
            console.error('5. Check firewall/antivirus blocking connections');
            console.error('6. Verify cluster name matches: cluster0.zpntett.mongodb.net');
        }
        // Handle Connection Errors
        else if (errorMessage.includes('connection') || errorMessage.includes('Could not connect') || errorName === 'MongooseServerSelectionError') {
            console.error('🛑 CONNECTION FAILED');
            console.error('Could not connect to MongoDB Atlas cluster.');
            console.error('\n👉 POSSIBLE SOLUTIONS:');
            console.error('1. ✅ IP is whitelisted (confirmed from your screenshot)');
            console.error('2. Check if cluster is running: Go to Atlas > Clusters > Check if "Resume" button exists');
            console.error('3. Verify credentials: Check username/password in connection string');
            console.error('4. Verify cluster hostname: Check if cluster0.zpntett.mongodb.net is correct');
            console.error('5. Test connection: Copy connection string from Atlas > Connect > Drivers');
            console.error('6. Make sure database user has correct permissions (Atlas Admin role recommended)');
            console.error('\n💡 Quick Test:');
            console.error('   - Go to MongoDB Atlas');
            console.error('   - Click "Connect" on your cluster');
            console.error('   - Select "Connect your application"');
            console.error('   - Copy the connection string and use it');
        }
        // Generic Error - Show full details
        else {
            console.error('Error Type: ' + errorName);
            console.error('Error Code: ' + (error.code || 'N/A'));
            console.error('Error Message: ' + errorMessage);
            console.error('\nFull Error Details:');
            console.error(JSON.stringify({
                name: errorName,
                code: error.code,
                message: errorMessage,
                codeName: error.codeName
            }, null, 2));
            
            if (error.stack) {
                console.error('\nStack Trace:');
                console.error(error.stack.substring(0, 500) + '...');
            }
        }
        console.error('------------------------------------------\n');
        process.exit(1);
    }
}

seedDatabase();