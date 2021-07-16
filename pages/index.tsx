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
import { useAsync, useAsyncFn } from "react-use";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AnalogClock from "analog-clock-react";
import { useRef } from "react";
// import Clock from "react-digital-clock";
import Clock from "react-live-clock";
import RenderClocks from "../components/RenderClocks";

import getCountriesOptions from "../helpers/getCountries";

dayjs.extend(utc);
dayjs.extend(timezone);

const IndexPage = () => {
  const toggleClockColor = useColorModeValue("black", "white");
  const toggleHandColor = useColorModeValue("white", "black");
  const timeSelector = useRef();
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
    const response = await fetch(`https://restcountries.eu/rest/v2/all`);
    const responseData = await response.json();

    return responseData;
  }, []);

  const [, getTimezone] = useAsyncFn(async (lat, lng, timezone) => {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=HUTUZS1BO031&format=json&by=position&lat=${lat}&lng=${lng}`
    );
    const responseData = await response.json();

    setClockStack((prev) => [...prev, responseData]);
  }, []);

  return (
    <Center h="100vh">
      <Flex direction="column" alignItems="center">
        <Flex mb="10">
          <Select ref={timeSelector} w="65 %" placeholder="Select option">
            {getCountriesOptions(countryArr)}
          </Select>

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
