const axios = require('axios');

async function testProjects() {
    const urls = [
        'https://summerofcode.withgoogle.com/api/program/2026/projects/',
        'https://summerofcode.withgoogle.com/api/program/2026/project/',
        'https://summerofcode.withgoogle.com/api/program/2026/projects/accepted/',
        'https://summerofcode.withgoogle.com/api/program/2026/accepted-projects/',
        'https://summerofcode.withgoogle.com/api/program/2026/accepted_projects/'
    ];

    for (const url of urls) {
        try {
            console.log(`Checking projects at: ${url}`);
            const res = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            console.log(`Success! Status: ${res.status}`);
            console.log('Sample data keys:', Object.keys(res.data));
            if (Array.isArray(res.data)) {
                console.log('Length:', res.data.length);
                console.log('Sample:', JSON.stringify(res.data[0]).substring(0, 300));
            } else {
                console.log('Data structure:', JSON.stringify(res.data).substring(0, 500));
            }
            break;
        } catch (err) {
            console.log(`Failed ${url}: ${err.message}`);
        }
    }
}

testProjects();
