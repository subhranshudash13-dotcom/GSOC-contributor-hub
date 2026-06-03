const fs = require('fs').promises;
const path = require('path');

async function getTopTech() {
    try {
        const filePath = path.join(__dirname, 'gsoc-compiled-data.json');
        const content = await fs.readFile(filePath, 'utf8');
        const orgs = JSON.parse(content);

        const techCounts = {};
        for (const org of orgs) {
            if (org.technologies) {
                for (const t of org.technologies) {
                    const tech = t.trim();
                    if (!tech) continue;
                    techCounts[tech] = (techCounts[tech] || 0) + 1;
                }
            }
        }

        const sortedTech = Object.entries(techCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50);

        console.log('Top 50 technologies by organization count:');
        console.log(JSON.stringify(sortedTech.map(x => `${x[0]} (${x[1]})`), null, 2));
    } catch (err) {
        console.error(err);
    }
}

getTopTech();
