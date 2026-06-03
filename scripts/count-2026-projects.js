const axios = require('axios');

async function countProjects() {
    try {
        const url2026 = 'https://api.gsocorganizations.dev/2026.json';
        const res = await axios.get(url2026);
        const orgs = res.data.organizations;
        let totalProjects = 0;
        for (const org of orgs) {
            if (org.projects) {
                totalProjects += org.projects.length;
            }
        }
        console.log('Total 2026 Orgs:', orgs.length);
        console.log('Total 2026 Projects:', totalProjects);
    } catch (err) {
        console.error(err);
    }
}

countProjects();
