const axios = require('axios');

async function testGsocOrgsApi() {
    const urls = [
        'https://api.gsocorganizations.dev/organizations.json',
        'https://api.gsocorganizations.dev/2026.json',
        'https://api.gsocorganizations.dev/2025.json',
        'https://api.gsocorganizations.dev/2026/organizations.json',
        'https://api.gsocorganizations.dev/2025/organizations.json'
    ];

    for (const url of urls) {
        try {
            console.log(`Checking API at: ${url}`);
            const res = await axios.get(url);
            console.log(`Success! Status: ${res.status}`);
            console.log('Keys:', Object.keys(res.data));
            if (Array.isArray(res.data)) {
                console.log('Length:', res.data.length);
                console.log('First item:', JSON.stringify(res.data[0]).substring(0, 300));
            } else if (res.data && typeof res.data === 'object') {
                console.log('Data sample:', JSON.stringify(res.data).substring(0, 500));
            }
        } catch (err) {
            console.log(`Failed ${url}: ${err.message}`);
        }
    }
}

testGsocOrgsApi();
