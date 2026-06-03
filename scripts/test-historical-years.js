const axios = require('axios');

async function checkYears() {
    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const availableYears = [];

    for (const year of years) {
        const url = `https://raw.githubusercontent.com/nishantwrp/gsoc-organizations/master/api/data/${year.toString()}.json`;
        try {
            const res = await axios.head(url);
            if (res.status === 200) {
                console.log(`Year ${year} is available!`);
                availableYears.push(year);
            }
        } catch (err) {
            // Not available
        }
    }
    console.log('Available years:', availableYears);
}

checkYears();
