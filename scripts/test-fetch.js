const axios = require('axios');

async function test() {
    const urls = [
        'https://summerofcode.withgoogle.com/api/program/current/organization/',
        'https://summerofcode.withgoogle.com/api/program/current/organizations/',
        'https://summerofcode.withgoogle.com/api/program/2026/organization/',
        'https://summerofcode.withgoogle.com/api/program/2026/organizations/'
    ];

    for (const url of urls) {
        try {
            console.log(`Fetching: ${url}`);
            const res = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            console.log(`Success! Status: ${res.status}`);
            console.log('Keys:', Object.keys(res.data));
            if (Array.isArray(res.data)) {
                console.log('Length:', res.data.length);
                console.log('First item:', JSON.stringify(res.data[0]).substring(0, 200));
            } else if (res.data && typeof res.data === 'object') {
                console.log('Data sample:', JSON.stringify(res.data).substring(0, 500));
            }
            break; // Stop at first success
        } catch (err) {
            console.error(`Failed ${url}: ${err.message}`);
        }
    }
}

test();
