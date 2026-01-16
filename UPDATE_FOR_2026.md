# Updating GSoC Hub for 2026 Organizations

This guide explains how to update the website when GSoC 2026 organizations are officially released.

## Quick Steps

1. **Update the year constant** in `scripts/generate-full-gsoc-data.js`:
   ```javascript
   const GSOC_YEAR = 2026; // Change from 2025 to 2026
   ```

2. **Update the organizations list** in `scripts/generate-full-gsoc-data.js`:
   - Replace or add the 2026 organizations to the `MAJOR_ORGS` and `ADDITIONAL_ORGS` arrays
   - You can get the official list from: https://summerofcode.withgoogle.com/programs/2026/organizations

3. **Regenerate the data**:
   ```bash
   node scripts/generate-full-gsoc-data.js
   ```
   This will create/update `scripts/gsoc-2026-data.json`

4. **Update the seed script** (if needed):
   - Update the file path in `seed-data.js` if it references `gsoc-2025-data.json`:
   ```javascript
   const dataPath = path.join(__dirname, 'scripts', 'gsoc-2026-data.json');
   ```

5. **Reseed the database**:
   ```bash
   node seed-data.js
   ```

6. **Update the banner** (if needed):
   - The banner in `components/gsoc-data-banner.tsx` should automatically show the correct year based on your data
   - You may want to update the message to reflect 2026 data

## Optional: Show Only 2026 Data

If you want to filter to show only active/current year projects:

1. **Enable the deadline filter** in `app/api/projects/route.ts`:
   ```typescript
   // Uncomment this line:
   query.applicationDeadline = { $gte: new Date() }
   ```

2. **Enable the deadline filter** in `app/api/match/route.ts`:
   ```typescript
   // Change from:
   const projects = (await Project.find({})
   // To:
   const projects = (await Project.find({
       applicationDeadline: { $gte: new Date() }
   })
   ```

## Notes

- The current setup shows **historical/previous years' GSoC data** to help users find projects
- All projects will be visible regardless of deadline date (historical data mode)
- When 2026 organizations are released, you can easily switch by changing the year constant
- The database structure supports multiple years - you can keep historical data and add 2026 data alongside it
