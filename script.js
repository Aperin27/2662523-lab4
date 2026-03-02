const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const loadingSpinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName) {
    try {
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "";
        errorMessage.textContent = "";

        countryInfo.classList.add("hidden")
        borderingCountries.classList.add("hidden")
        errorMessage.classList.add("hidden")

        loadingSpinner.classList.remove("hidden")

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if(!response.ok){
            throw new Error("Country not found")
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">`;
        countryInfo.classList.remove("hidden");

        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderDiv = document.createElement("div");
                borderDiv.innerHTML = `
                    <h4>${borderCountry.name.common}</h4>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                `;

                borderingCountries.appendChild(borderDiv);
            }

            borderingCountries.classList.remove("hidden");
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
            borderingCountries.classList.remove("hidden");
        }
    }
     catch (error) {
        errorMessage.textContent = "Country not found. Please try again.";
        errorMessage.classList.remove("hidden");
    }
     finally {
        loadingSpinner.classList.add("hidden");
    }
}


document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});