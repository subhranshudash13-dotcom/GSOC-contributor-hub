const axios = require('axios');

async function check2026Projects() {
    try {
        const url2026 = 'https://api.gsocorganizations.dev/2026.json';
        const res2026 = await axios.get(url2026);
        const orgs = res2026.data.organizations;
        console.log('2026 Total Orgs:', orgs.length);

        let orgsWithProjectsCount = 0;
        let sampleOrgWithProjects = null;

        for (const org of orgs) {
            if (org.projects && org.projects.length > 0) {
                orgsWithProjectsCount++;
                if (!sampleOrgWithProjects) {
                    sampleOrgWithProjects = org;
                }
            }
        }

        console.log('Orgs with projects:', orgsWithProjectsCount);
        if (sampleOrgWithProjects) {
            console.log('Sample org name:', sampleOrgWithProjects.name);
            console.log('Sample org projects length:', sampleOrgWithProjects.projects.length);
            console.log('Sample project:', JSON.stringify(sampleOrgWithProjects.projects[0], null, 2));
        } else {
            console.log('No projects found in 2026 organizations! Let\'s print the keys of the first org:');
            console.log(Object.keys(orgs[0]));
            console.log('First org data:', JSON.stringify(orgs[0], null, 2));
        }
    } catch (err) {
        console.error(err);
    }
}

check2026Projects();
