const axios = require('axios');

async function check() {
    const urls = [
        'https://raw.githubusercontent.com/nishantwrp/gsoc-organizations/main/api/data/2025.json',
        'https://raw.githubusercontent.com/nishantwrp/gsoc-organizations/main/api/data/2024.json',
        'https://raw.githubusercontent.com/nishantwrp/gsoc-organizations/main/api/data/2026.json',
        'https://raw.githubusercontent.com/nishantwrp/gsoc-organizations/master/api/data/2025.json',
        'https://raw.githubusercontent.com/nishantwrp/gsoc-organizations/master/api/data/2024.json'
    ];

    for (const url of urls) {
        try {
            console.log(`Checking ${url}`);
            const res = await axios.get(url);
            console.log(`Success! Status: ${res.status}`);
            console.log(`Keys:`, Object.keys(res.data));
            if (Array.isArray(res.data)) {
                console.log(`Array length:`, res.data.length);
                console.log(`First item:`, JSON.stringify(res.data[0]).substring(0, 300));
            } else if (res.data && typeof res.data === 'object') {
                console.log(`Object sample:`, JSON.stringify(res.data).substring(0, 300));
            }
        } catch (err) {
            console.log(`Failed ${url}: ${err.message}`);
        }
    }
}

check();
