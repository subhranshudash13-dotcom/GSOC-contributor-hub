const fs = require('fs').promises;
const path = require('path');

async function getUniqueFields() {
    try {
        const filePath = path.join(__dirname, 'gsoc-compiled-data.json');
        const content = await fs.readFile(filePath, 'utf8');
        const orgs = JSON.parse(content);

        const categories = new Set();
        const technologies = new Set();
        const topics = new Set();

        for (const org of orgs) {
            if (org.category) categories.add(org.category);
            if (org.technologies) {
                for (const t of org.technologies) {
                    technologies.add(t);
                }
            }
            if (org.topics) {
                for (const top of org.topics) {
                    topics.add(top);
                }
            }
        }

        console.log('Total organizations:', orgs.length);
        console.log('Unique Categories count:', categories.size);
        console.log('Categories:', Array.from(categories).sort());
        console.log('Unique Technologies count:', technologies.size);
        console.log('Technologies sample (top 30):', Array.from(technologies).sort().slice(0, 30));
        console.log('Unique Topics count:', topics.size);
        console.log('Topics sample (top 30):', Array.from(topics).sort().slice(0, 30));
    } catch (err) {
        console.error(err);
    }
}

getUniqueFields();
