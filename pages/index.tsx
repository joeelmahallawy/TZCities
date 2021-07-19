import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  Select,
  Slide,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
// import { google } from "@googlemaps/google-maps-services-js";
import defaultUrl from "@googlemaps/google-maps-services-js";
import React, { useEffect, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AnalogClock from "analog-clock-react";
import { useRef } from "react";
// import Clock from "react-digital-clock";
import Clock from "react-live-clock";
import RenderClocks from "../components/RenderClocks";

import getCountriesOptions from "../helpers/getCountries";
// console.log(google);

dayjs.extend(utc);
dayjs.extend(timezone);

const IndexPage = () => {
  const toggleClockColor = useColorModeValue("black", "white");
  const toggleHandColor = useColorModeValue("white", "black");
  const timeSelector = useRef();
  const searchCity = useRef();
  const [clockStack, setClockStack] = useState([
    { countryName: "Your current time", zoneName: dayjs.tz.guess() },
  ]);

  const options = {
    width: "300px",
    baseColor: toggleClockColor,
    handColors: {
      minute: toggleHandColor,
      hour: toggleHandColor,
      second: "red",
    },
  };

  const { value: countryArr = [] } = useAsync(async () => {
    // const response = await fetch(`https://restcountries.eu/rest/v2/all`);
    // const options = {
    //   mode: "no-cors",
    // };
    // const request = new Request(
    //   `https://maps.googleapis.com/maps/api/js?key=AIzaSyCv1J8JeB52Jb5dZYt6LUkkYPkUaV4ySNg&libraries=places&callback=initMap"`
    // );
    // request.mode = "no-cors";
    // const noCors = request.mode;
    // console.log(noCors);
    const response = await fetch(
      // `https://maps.googleapis.com/maps/api/js?key=AIzaSyCv1J8JeB52Jb5dZYt6LUkkYPkUaV4ySNg&libraries=places&callback=initMap"`,
      // FIXME:
      // `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=AIzaSyCv1J8JeB52Jb5dZYt6LUkkYPkUaV4ySNg&libraries=places&callback=initAutocomplete`
      // FIXME:
      // defaultUrl
      `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=AIzaSyCv1J8JeB52Jb5dZYt6LUkkYPkUaV4ySNg&libraries=places&callback=initMap`
      // { mode: "no-cors" }
      // "https://cors-anywhere.herokuapp.com/http://geodb-free-service.wirefreethought.com"
    );
    console.log(response);
    // console.log(response.json());
    // console.log(response.json());
    // const responseData = await response.json();
    // console.log(responseData);

    // return responseData;
  }, []);

  const [, getTimezone] = useAsyncFn(async (lat, lng, timezone) => {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=HUTUZS1BO031&format=json&by=position&lat=${lat}&lng=${lng}`
    );
    const responseData = await response.json();

    setClockStack((prev) => [...prev, responseData]);
  }, []);
  let autocomplete;
  // const searchCity = getElementById(
  //   "autocomplete"
  // ) as HTMLInputElement;

  function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(searchCity.current, {
      types: ["establishment"],
      componentRestrictions: { country: ["AU"] },
      fields: ["place_id", "geometry", "name"],
    });
    autocomplete.addListener("place_changed", onPlaceChanged);
  }
  function onPlaceChanged() {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      // searchCity.current
      console.log(place);
    }
  }
  // FIXME:FIXME:FIXME:FIXME:FIXME:
  // console.log(this);
  // console.log(searchCity.current);

  return (
    <Center h="100vh">
      <Flex direction="column" alignItems="center">
        <Flex mb="10">
          {/* <Select ref={timeSelector} w="65 %" placeholder="Select option">
            {getCountriesOptions(countryArr)}
          </Select> */}
          {/* FIXME:FIXME:FIXME: */}
          <input
            type="text"
            placeholder="Enter a city"
            id="autocomplete"
            ref={searchCity}
            // onLoad={initAutocomplete}
            onChange={initAutocomplete}
          />

          <Button
            onClick={() => {
              const currentCountry = countryArr.find((country) => {
                // console.log(country);
                // @ts-ignore
                return country.name == timeSelector.current.value;
              });

              if (currentCountry) {
                // console.log();
                const lat = currentCountry.latlng[0];
                const lng = currentCountry.latlng[1];
                const timezone = [...currentCountry.timezones];
                getTimezone(lat, lng, timezone);
              }
              // if (currentCountry === undefined) alert("Please enter country");
            }}
          >
            Add Timezone
          </Button>
        </Flex>
        <Flex>
          <RenderClocks arr={clockStack} options={options} />
        </Flex>
      </Flex>
    </Center>
  );
};

export default IndexPage;

/* <Flex alignItems="center" ref={selectionsContainer}>
            {addedNewClock || (
              <Select ref={timeSelector} w="40%" placeholder="Select option">
                {countryOptions && getCountriesOptions(countryArr)}
              </Select>
            )}
            <Button>Add Timezone</Button>

          </Flex> */
