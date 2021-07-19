import {
  useColorModeValue,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Center,
  Flex,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React from "react";
import AnalogClock from "analog-clock-react";
import Clock from "react-live-clock";
import { useUpdate } from "react-use";
import { parse } from "path";
// import { parse } from "path";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function RenderClocks({ arr, options }) {
  const update = useUpdate();

  return arr.map((country, i) => {
    const datetime = dayjs().tz(country.zoneName);

    return (
      <Flex m="0 3%" key={i} direction="column" alignItems="center">
        <Heading mb="5" fontSize="175%">
          {country.city
            ? `${country.city}, ${country.countryName}`
            : "Your current time"}
          {country.nextAbbreviation && `(${country.nextAbbreviation})`}
        </Heading>
        <AnalogClock
          {...options}
          useCustomTime
          seconds={datetime.second()}
          minutes={datetime.minute()}
          hours={datetime.hour() + datetime.minute() / 60}
        />
        <Box fontSize="175%">
          <Clock
            ticking={true}
            format={"h:mm:ss a"}
            timezone={country.zoneName}
            onChange={() => update()}
          />
        </Box>
      </Flex>
    );
  });
}
