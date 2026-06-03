const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function compileData() {
    console.log('🚀 Starting compilation of GSoC data (2016-2026)...');
    
    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const orgMap = new Map(); // Name -> consolidated org info

    // Helper to normalize organization name for matching
    function normalizeName(name) {
        return name
            .toLowerCase()
            .trim()
            .replace(/^the\s+/, '') // Remove leading "the "
            .replace(/[^a-z0-9]/g, ''); // Remove non-alphanumeric chars
    }

    for (const year of years) {
        const url = `https://api.gsocorganizations.dev/${year}.json`;
        try {
            console.log(`📥 Fetching data for ${year}...`);
            const res = await axios.get(url);
            const data = res.data;
            const orgs = data.organizations || [];

            console.log(`   Found ${orgs.length} organizations in ${year}`);

            for (const org of orgs) {
                const normName = normalizeName(org.name);
                
                if (!orgMap.has(normName)) {
                    orgMap.set(normName, {
                        name: org.name,
                        logoUrl: org.image_url || '',
                        backgroundColor: org.image_background_color || '#ffffff',
                        description: org.description || '',
                        websiteUrl: org.url || '',
                        category: org.category || '',
                        ideasUrl: org.ideas_url || '',
                        projectsUrl: org.projects_url || '',
                        technologies: org.technologies ? [...org.technologies] : [],
                        topics: org.topics ? [...org.topics] : [],
                        years: [year],
                        projects: []
                    });
                } else {
                    const existing = orgMap.get(normName);
                    // Add year if not present
                    if (!existing.years.includes(year)) {
                        existing.years.push(year);
                    }
                    // Update details with more recent info
                    if (year >= Math.max(...existing.years)) {
                        existing.name = org.name;
                        if (org.image_url) existing.logoUrl = org.image_url;
                        if (org.image_background_color) existing.backgroundColor = org.image_background_color;
                        if (org.description) existing.description = org.description;
                        if (org.url) existing.websiteUrl = org.url;
                        if (org.category) existing.category = org.category;
                        if (org.ideas_url) existing.ideasUrl = org.ideas_url;
                        if (org.projects_url) existing.projectsUrl = org.projects_url;
                    }
                    // Merge technologies
                    if (org.technologies) {
                        for (const tech of org.technologies) {
                            if (!existing.technologies.includes(tech)) {
                                existing.technologies.push(tech);
                            }
                        }
                    }
                    // Merge topics
                    if (org.topics) {
                        for (const topic of org.topics) {
                            if (!existing.topics.includes(topic)) {
                                existing.topics.push(topic);
                            }
                        }
                    }
                }

                // If the org has projects, store them associated with the year
                if (org.projects && org.projects.length > 0) {
                    const existing = orgMap.get(normName);
                    for (const proj of org.projects) {
                        existing.projects.push({
                            year: year,
                            title: proj.title,
                            description: proj.description || proj.short_description || '',
                            studentName: proj.student_name || '',
                            codeUrl: proj.code_url || '',
                            projectUrl: proj.project_url || ''
                        });
                    }
                }
            }
        } catch (err) {
            console.error(`❌ Error fetching/processing data for ${year}:`, err.message);
        }
    }

    // Convert map to array and sort years in descending order
    const consolidatedOrgs = Array.from(orgMap.values()).map(org => {
        org.years.sort((a, b) => b - a); // Newest years first
        // Clean lists
        org.technologies = org.technologies.map(t => t.trim()).filter(Boolean);
        org.topics = org.topics.map(t => t.trim()).filter(Boolean);
        return org;
    });

    console.log(`\n✅ Compilation finished!`);
    console.log(`📊 Statistics:`);
    console.log(`   Total unique organizations: ${consolidatedOrgs.length}`);
    
    // Count active in 2026
    const activeIn2026 = consolidatedOrgs.filter(org => org.years.includes(2026)).length;
    console.log(`   Active in 2026: ${activeIn2026}`);

    // Save to files
    const outputDir = path.join(__dirname);
    const outputFile = path.join(outputDir, 'gsoc-compiled-data.json');
    await fs.writeFile(outputFile, JSON.stringify(consolidatedOrgs, null, 2));
    console.log(`📁 Saved compiled dataset to: ${outputFile}`);
}

compileData().catch(console.error);
