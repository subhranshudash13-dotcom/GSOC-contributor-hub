const fs = require('fs');
const path = require('path');

const GSOC_YEAR = 2025;
const OUTPUT_FILE = path.join(__dirname, 'gsoc-2025-data.json');

// Real high-profile GSoC orgs
const MAJOR_ORGS = [
    { name: "Apache Software Foundation", tech: ["Java", "Python", "Go"], topics: ["Big Data", "Web"] },
    { name: "Mozilla", tech: ["JavaScript", "Rust", "C++"], topics: ["Web", "Browser"] },
    { name: "TensorFlow", tech: ["Python", "C++", "ML"], topics: ["AI", "Machine Learning"] },
    { name: "Python Software Foundation", tech: ["Python", "C"], topics: ["Languages"] },
    { name: "Django Software Foundation", tech: ["Python", "Django", "SQL"], topics: ["Web"] },
    { name: "Cloud Native Computing Foundation (CNCF)", tech: ["Go", "Kubernetes", "Cloud"], topics: ["Cloud", "Container"] },
    { name: "The Linux Foundation", tech: ["C", "Linux", "Kernel"], topics: ["OS"] },
    { name: "KDE Community", tech: ["C++", "Qt", "Linux"], topics: ["Desktop"] },
    { name: "GNOME Foundation", tech: ["C", "GTK", "Rust"], topics: ["Desktop"] },
    { name: "Blender Foundation", tech: ["C++", "Python", "Graphics"], topics: ["Graphics", "3D"] },
    { name: "Wikimedia Foundation", tech: ["PHP", "JavaScript", "Wiki"], topics: ["Web"] },
    { name: "OpenCV", tech: ["C++", "Python", "CV"], topics: ["Computer Vision"] },
    { name: "Ruby on Rails", tech: ["Ruby", "Rails", "Web"], topics: ["Web"] },
    { name: "Haskell.org", tech: ["Haskell", "Functional"], topics: ["Languages"] },
    { name: "Julia Language", tech: ["Julia", "Math"], topics: ["Data Science"] },
    { name: "R Project", tech: ["R", "Statistics"], topics: ["Data Science"] },
    { name: "VideoLAN", tech: ["C", "C++", "Video"], topics: ["Media"] },
    { name: "FFmpeg", tech: ["C", "Assembly"], topics: ["Media"] },
    { name: "Git", tech: ["C", "Shell"], topics: ["Tools"] },
    { name: "Eclipse Foundation", tech: ["Java", "IDE"], topics: ["Tools"] }
];

// Additional known GSoC orgs to reach ~185
const ADDITIONAL_ORGS = [
    "PostgreSQL", "MariaDB", "MySQL", "Redis", "MongoDB",
    "Creative Commons", "OpenMRS", "Moodle", "Joomla", "Drupal",
    "WordPress", "FreeBSD", "NetBSD", "OpenBSD", "Haiku",
    "ReactOS", "Wine", "QEMU", "KVM", "Xen",
    "OpenStack", "Ceph", "Prometheus", "Envoy", "Jaeger",
    "Fluentd", "Containerd", "Rkt", "CoreDNS", "Etcd",
    "Linkerd", "NATS", "Notary", "TUF", "Vitess",
    "Cilium", "Falco", "Harbor", "Helm", "KEDA",
    "OpenPolicyAgent", "Rook", "SPIFFE", "SPIRE", "TiKV",
    "Argo", "Buildpacks", "CloudEvents", "Cortex", "CRI-O",
    "Dragonfly", "Emissary-Ingress", "Flux", "gRPC", "KubeEdge",
    "KubeVirt", "Longhorn", "Nifen", "OpenTelemetry", "Schemata",
    "Thanos", "Volcano", "WasmEdge", "Chaos Mesh", "Contour",
    "Karmada", "KubeVela", "OpenEBS", "OpenYurt", "SuperEdge",
    "Vineyard", "OpenMM", "Biopython", "BioJava", "BioPerl",
    "BioRuby", "BioJS", "Cytoscape", "Galaxy", "Human Cell Atlas",
    "OpenGenome", "OpenWorm", "Sugar Labs", "Processing Foundation", "p5.js",
    "OpenFrameworks", "Cinder", "Three.js", "Babylon.js", "Godot Engine",
    "Defold", "O3DE", "Inkji", "Krita", "GIMP",
    "Inkscape", "Scribus", "Audacity", "MuseScore", "Ardour",
    "Mixxx", "OBS Studio", "Kodi", "Plex", "Jellyfin",
    "VLC", "HandBrake", "Shotcut", "OpenShot", "Olive",
    "Synfig", "Pencil2D", "TupiTube", "OpenToonz", "LibreOffice",
    "OpenOffice", "AbiWord", "Gnumeric", "Calligra", "OnlyOffice",
    "Etherpad", "CryptPad", "Jitsi", "BigBlueButton", "Mattermost",
    "Rocket.Chat", "Zulip", "Signal", "Telegram", "Wire",
    "Matrix.org", "XMPP", "ActivityPub", "Mastodon", "PixelFed",
    "PeerTube", "Funkwhale", "Lemmy", "Diaspora", "Friendica",
    "Hubzilla", "Pleroma", "Misskey", "GNU Social", "WordPress",
    "Ghost", "Jekyll", "Hugo", "Gatsby", "Next.js",
    "Nuxt.js", "Svelte", "Vue.js", "Angular", "Ember.js",
    "Backbone.js", "jQuery", "D3.js", "Chart.js", "Leaflet",
    "OpenLayers", "Cesium", "Mapbox", "OSGeo", "QGIS",
    "GRASS GIS", "PostGIS", "GDAL", "Proj", "Geos",
    "MapServer", "GeoServer", "OpenStreetMap", "GraphHopper", "Valhalla"
];

// Combine lists
const ALL_ORG_NAMES = [...MAJOR_ORGS.map(o => o.name), ...ADDITIONAL_ORGS];
const MAJOR_ORG_MAP = new Map(MAJOR_ORGS.map(o => [o.name, o]));

// Helper to get random item
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generators
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const LOCATIONS = ['Worldwide', 'Remote', 'USA', 'Europe', 'Asia', 'Global'];
const SIZES = ['small', 'medium', 'large'];

const VERBS = ['Implement', 'Design', 'Optimize', 'Refactor', 'Create', 'Enhance', 'Build', 'Develop', 'Integrated', 'Migrate'];
const NOUNS = ['Dashboard', 'API', 'Interface', 'Backend', 'Frontend', 'Database', 'Support', 'Module', 'Plugin', 'Extension', 'Toolkit', 'Library', 'Framwork', 'Core', 'Documentation'];
const ADJECTIVES = ['New', 'Better', 'Faster', 'Secure', 'Modern', 'Robust', 'Scalable', 'Real-time', 'Cloud-native', 'Mobile'];

function generateProject(orgName) {
    const known = MAJOR_ORG_MAP.get(orgName);

    // Pick tech based on org name if known, else random
    let tech = known ? known.tech : [sample(['Python', 'JavaScript', 'Go', 'Rust', 'Java', 'C++']), sample(['React', 'Node.js', 'SQL', 'NoSQL']), 'Open Source'];
    let topics = known ? known.topics : [sample(['Web', 'Tools', 'Science', 'Cloud', 'Security'])];

    const title = `${sample(VERBS)} ${sample(ADJECTIVES)} ${sample(NOUNS)} for ${orgName.split(' ')[0]}`;
    const desc = `${orgName} is looking for contributors to help with the ${title}. This involves working with ${tech[0]} and ${tech[1]} to deliver a high-quality solution.`;

    return {
        org: orgName,
        title: title,
        description: desc,
        difficulty: sample(DIFFICULTIES),
        techStack: tech,
        githubUrl: `https://github.com/${orgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}/project-${Math.random().toString(36).substring(7)}`,
        applicationDeadline: "2026-03-31T00:00:00.000Z",
        thumbnail: "",
        stars: randomInt(50, 5000),
        location: sample(LOCATIONS),
        orgSize: sample(SIZES),
        mentors: [`@${orgName.toLowerCase().replace(/[^a-z0-9]/g, '')}-mentor`],
        topics: topics,
        year: GSOC_YEAR
    };
}

async function generate() {
    console.log(`🚀 Generating ${GSOC_YEAR} Data...`);
    const projects = [];
    const organizations = [];

    for (const orgName of ALL_ORG_NAMES) {
        // Generate 1-4 projects per org
        const numProjects = randomInt(1, 4);

        // Add Org Info
        organizations.push({
            name: orgName,
            description: `${orgName} is a leading open source organization.`
        });

        for (let i = 0; i < numProjects; i++) {
            projects.push(generateProject(orgName));
        }
    }

    console.log(`✅ Generated ${projects.length} projects for ${organizations.length} organizations.`);

    // Save
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
        year: GSOC_YEAR,
        projects,
        organizations
    }, null, 2));

    console.log(`📁 Saved to ${OUTPUT_FILE}`);
}

generate();
