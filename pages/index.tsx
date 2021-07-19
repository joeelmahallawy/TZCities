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

import React, { useEffect, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useRef } from "react";
import Clock from "react-live-clock";
import RenderClocks from "../components/RenderClocks";
import getCountriesOptions from "../helpers/getCountries";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { getLocationOrigin } from "next/dist/next-server/lib/utils";
// import PlacesAutocomplete from "../components/PlacesAutocomplete";

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
  const PlacesAutocomplete = () => {
    const search = useRef();
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        /* Define search scope here */
      },
      debounce: 300,
    });
    const ref = useOnclickOutside(() => {
      // When user clicks outside of the component, we can dismiss
      // the searched suggestions by calling this method
      clearSuggestions();
    });

    const handleInput = (e) => {
      // Update the keyword of the input element
      setValue(e.target.value);
    };

    const handleSelect =
      ({ description }) =>
      () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
        clearSuggestions();
        let returnedCord;
        // Get latitude and longitude via utility functions
        getGeocode({ address: description })
          .then((results) => {
            // console.log(results[0].address_components[0].long_name);
            console.log(results);
            console.log(getLatLng(results[0]));
          })
          .then((obj) => {
            console.log(obj);
            // console.log("📍 Coordinates: ", { lat, lng });
            // FIXME:FIXME:FIXME:GIVE LAT AND LONG TO API TO GE TTIMEZONEFIXME:FIXME:FIXME:
            // getTimezone(lat, lng);
          })
          .catch((error) => {
            console.log("😱 Error: ", error);
          });

        // const returnedCord={lat,lng}
      };

    const renderSuggestions = () =>
      data.map((suggestion) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        return (
          <li
            key={place_id}
            onClick={handleSelect(suggestion)}
            style={{
              width: "100%",
              border: "0.25px solid gray",
              listStyle: "none",
              margin: "5px",
            }}
          >
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </li>
        );
      });

    return (
      <div ref={ref} style={{ display: "flex" }}>
        <div>
          <Input
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Where are you going?"
            border="1px solid black"
            ref={search}
          />
          {/* We can use the "status" to decide whether we should display the dropdown or not */}
          {status === "OK" && <ul>{renderSuggestions()}</ul>}
        </div>
        <Button onClick={() => console.log("hi")}>Click me!</Button>
      </div>
    );
  };

  const options = {
    width: "300px",
    baseColor: toggleClockColor,
    handColors: {
      minute: toggleHandColor,
      hour: toggleHandColor,
      second: "red",
    },
  };

  const [, getTimezone] = useAsyncFn(async (lat, lng, city) => {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=HUTUZS1BO031&format=json&by=position&lat=${lat}&lng=${lng}`
    );
    const responseData = await response.json();
    console.log(responseData);
    console.log("WOW IT WORKED");
    responseData.city = city;
    // console.log(responseData);
    setClockStack((prev) => [...prev, responseData]);
  }, []);
  console.log(clockStack);
  return (
    <Center h="100vh">
      <Flex direction="column" alignItems="center">
        <Flex mb="10">
          {/* <Button onClick={() => getTimezone(12, -82)}></Button> */}
          <PlacesAutocomplete />
        </Flex>
        <Flex>
          <RenderClocks arr={clockStack} options={options} />
        </Flex>
      </Flex>
    </Center>
  );
};

export default IndexPage;
