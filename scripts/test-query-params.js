const axios = require('axios');

async function testParams() {
    const urls = [
        'https://summerofcode.withgoogle.com/api/program/2026/projects/?page=1',
        'https://summerofcode.withgoogle.com/api/program/2026/projects/?page=1&page_size=20',
        'https://summerofcode.withgoogle.com/api/program/2026/project/?page=1',
        'https://summerofcode.withgoogle.com/api/program/2026/project/?page=1&page_size=20'
    ];

    for (const url of urls) {
        try {
            console.log(`Checking: ${url}`);
            const res = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            console.log(`Success! Status: ${res.status}`);
            console.log('Keys:', Object.keys(res.data));
            if (res.data.results) {
                console.log('Results length:', res.data.results.length);
                console.log('First result:', JSON.stringify(res.data.results[0]).substring(0, 300));
            } else {
                console.log('Data:', JSON.stringify(res.data).substring(0, 300));
            }
            break;
        } catch (err) {
            console.log(`Failed ${url}: ${err.message}`);
        }
    }
}

testParams();
