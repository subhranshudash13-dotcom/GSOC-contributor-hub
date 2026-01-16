# How to Update GSoC Organization Data

This guide explains how to update the GSoC Contributor Hub with new organization data when it becomes available.

## When to Update

- **GSoC 2026 Organizations Announcement**: Expected around **February 3, 2026**.
- **Periodic Updates**: If organizations add more projects or details.

## Automatic Update (Recommended)

We have a scraper script that collects data from the official GSoC website.

### 1. Run the Scraper

```bash
node scripts/gsoc-scraper.js
```

This will:
1. Fetch the latest organizations from the configured GSoC archive year.
2. Generate a new `scripts/gsoc-2025-data.json` file (or relevant year).
3. Log statistics about the scraped data.

> **Note**: To change the year, edit `GSOC_YEAR` in `scripts/gsoc-scraper.js`.

### 2. Update the Database

Once the JSON file is generated/updated, run the seed script to populate the database:

```bash
node seed-data.js
```

This will:
1. Connect to your MongoDB database.
2. **Clear existing projects** (to avoid duplicates).
3. Insert the new project data.
4. Update the dashboard with fresh statistics.

## Manual Update (If Scraper Fails)

If the GSoC website structure changes and the scraper fails:

1. Open `scripts/gsoc-2025-data.json`.
2. Manually add or edit organization entries following the existing JSON structure:

```json
{
  "org": "Organization Name",
  "title": "Project Title",
  "description": "...",
  "difficulty": "beginner|intermediate|advanced",
  "techStack": ["Tag1", "Tag2"],
  "topics": ["Topic1", "Topic2"],
  "year": 2026
  // ... other fields
}
```

3. Run `node seed-data.js` to apply changes.

## Verifying Updates

1. Start the local server: `npm run dev`
2. Go to http://localhost:3000/projects
3. Verify that new organizations appear.
4. Check that the "GSoC Data Banner" is appropriate (you may want to disable it in `app/layout.tsx` once 2026 data is live).
