const axios = require('axios');

async function checkApiYears() {
    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const results = [];

    for (const year of years) {
        const url = `https://api.gsocorganizations.dev/${year}.json`;
        try {
            const res = await axios.head(url);
            if (res.status === 200) {
                console.log(`Year ${year} is available on api.gsocorganizations.dev!`);
                results.push(year);
            }
        } catch (err) {
            // Not available
        }
    }
    console.log('Available years:', results);
}

checkApiYears();
