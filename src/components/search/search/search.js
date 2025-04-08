import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { WEATHER_API_KEY } from "./api";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);

  const loadOptions = async (inputValue) => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=${WEATHER_API_KEY}`
    );
    const data = await response.json();

    return {
      options: data.map((city) => ({
        value: `${city.lat} ${city.lon}`,
        label: `${city.name}, ${city.country}`,
      })),
    };
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
