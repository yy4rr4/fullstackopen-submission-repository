// import { use, useEffect, useState } from "react";
// import axios from "axios";
// import Persons from "./components/Persons.jsx";
// import Filter from "./components/Filter.jsx";
// import PersonForm from "./components/PersonForm.jsx";
// import Notification from "./components/Notification.jsx";
// import noteServices from "./services/notes.js"

// const App = () => {
//   const [persons, setPersons] = useState([]);
//   const [newName, setNewName] = useState("");
//   const [newNumber, setNewNumber] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [successMessage, setSuccessMessage] = useState(null)
//   const [errorMessage, setErrorMessage] = useState(null)

//   useEffect(() => {
//     noteServices.getAll().then((response) => {
//       console.log(response.data);
//       setPersons(response.data);
//     });
//   }, []);

//   return (
//     <div>
//       <h2>Phonebook</h2>

//       <Notification
//         successMessage={successMessage}
//         errorMessage={errorMessage}
//       />

//       <Filter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

//       <h2>Add New</h2>

//       <PersonForm
//         persons={persons}
//         setPersons={setPersons}
//         newName={newName}
//         setNewName={setNewName}
//         newNumber={newNumber}
//         setNewNumber={setNewNumber}
//         setSuccessMessage={setSuccessMessage}
//         setErrorMessage={setErrorMessage}
//       />

//       <h2>Numbers</h2>

//       <Persons
//         persons={persons}
//         setPersons={setPersons}
//         searchQuery={searchQuery}
//         setSuccessMessage={setSuccessMessage}
//         setErrorMessage={setErrorMessage}
//       />
//     </div>
//   );
// };

// export default App;

import axios from "axios";
import { use, useEffect, useState } from "react";

const App = () => {

  const api_key = import.meta.env.VITE_SOME_KEY;

  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [weatherObject, setWeatherObject] = useState(null)

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log("Countries data: ", response.data);
        setCountries(response.data);
      });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (api_key && filteredCountries.length === 1) {
      const targetCity = filteredCountries[0].capital[0];
      console.log("Country: ", targetCity);
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${targetCity}&units=metric&appid=${api_key}`;

      console.log("URL: ", weatherUrl);
      console.log("API Key: ", api_key);

      axios.get(weatherUrl).then((response) => {
        console.log("Weather data: ", response.data);
        setWeatherObject(response.data);
      });
    }
  }, [query, filteredCountries])

  const renderCountries = () => {

    const showCountryInfo = (countryObj) => (
      weatherObject && <div>
        <h1>{countryObj.name.common}</h1>
        <p>Capital {countryObj.capital[0]}</p>
        <p>Area {countryObj.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(countryObj.languages).map((language, id) => (
            <li key={id}>{language}</li>
          ))}
        </ul>
        <img src={countryObj.flags.png} />
        <h2>Weather in {countryObj.name.common}</h2>
        <p>Temperature {weatherObject.main.temp} Celsius</p>
        <img
          src={`https://openweathermap.org/img/wn/${weatherObject.weather[0].icon}@2x.png`}
        />
        <p>{weatherObject.wind.speed} m/s</p>
      </div>
    );

    if (filteredCountries.length > 10 && query.length !== 0) {
      return <p>Too many matches, specify another filter</p>;
    }

    if (filteredCountries.length === 1) {
      return showCountryInfo(filteredCountries[0]);
    }

    return filteredCountries.map((country) => (
      <p key={country.cca3}>
        {country.name.common}{" "}
        <button onClick={() => setQuery(country.name.common)}>Show</button>
      </p>
    ));
  };

  return (
    <div>
      <form>
        <p>
          Find countries
          <input value={query} onChange={(e) => setQuery(e.target.value)} />
        </p>
      </form>
      {renderCountries()}
    </div>
  );
};

export default App;
