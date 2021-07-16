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
      <Flex m="0 2%" key={i} direction="column" alignItems="center">
        <Heading mb="5">{country.countryName}</Heading>
        <AnalogClock
          {...options}
          useCustomTime
          seconds={datetime.second()}
          minutes={datetime.minute()}
          hours={datetime.hour()}
        />
        <Box fontSize="175%">
          <Clock
            ticking={true}
            // date={country.time}
            format={"h:mm:ss a"}
            timezone={country.zoneName}
            onChange={() => update()}
            // timezone=""
            // interval={updateClock}
            // format={"10:14:23"}
            // date={setInterval(() => {
            //   return `${country.time}`;
            // }, 1000)}
          />
        </Box>
      </Flex>
    );
  });
}
