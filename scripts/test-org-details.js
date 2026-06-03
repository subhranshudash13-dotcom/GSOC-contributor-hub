const axios = require('axios');

async function testOrgDetails() {
    try {
        const url2026 = 'https://api.gsocorganizations.dev/2026.json';
        const res2026 = await axios.get(url2026);
        console.log('2026 total orgs:', res2026.data.organizations.length);
        const org2026 = res2026.data.organizations[0];
        console.log('2026 First org keys:', Object.keys(org2026));
        console.log('2026 First org sample:', JSON.stringify(org2026, null, 2));

        const url2025 = 'https://api.gsocorganizations.dev/2025.json';
        const res2025 = await axios.get(url2025);
        console.log('2025 total orgs:', res2025.data.organizations.length);
        const org2025 = res2025.data.organizations[0];
        console.log('2025 First org keys:', Object.keys(org2025));
        console.log('2025 First org sample:', JSON.stringify(org2025, null, 2));
    } catch (err) {
        console.error(err);
    }
}

testOrgDetails();
