const axios = require('axios');

async function inspect() {
    try {
        const url = 'https://summerofcode.withgoogle.com/api/program/2026/organizations/';
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const org = res.data[0];
        console.log('Keys of organization object:', Object.keys(org));
        console.log('Full organization object:', JSON.stringify(org, null, 2));

        // Let's also check a few other items in the array to see different categories/tags/technologies
        console.log('\n--- First 3 organizations overview ---');
        for (let i = 0; i < Math.min(3, res.data.length); i++) {
            console.log(`Org ${i}:`, res.data[i].name, 'Slug:', res.data[i].slug, 'Precise Keys:', Object.keys(res.data[i]));
        }
    } catch (err) {
        console.error(err);
    }
}

inspect();
