import {
  useColorModeValue,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Center,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Button,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React from "react";
import AnalogClock from "analog-clock-react";
import Clock from "react-live-clock";
import { useUpdate } from "react-use";
import { parse } from "path";
import { useState } from "react";
import { useRef } from "react";
// import { parse } from "path";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function RenderClocks({ arr, options }) {
  const update = useUpdate();

  const [minute, setMinute] = useState(null);
  const [hour, setHour] = useState(null);

  return arr.map((country, i) => {
    const datetime = dayjs().tz(country.zoneName);

    return (
      <Flex m="0 3%" key={i} direction="column" alignItems="center">
        <Heading mb="5" fontSize="175%">
          {country.city
            ? `${country.city}`
            : // `${country.countryName}` `${country.countryCode}`

              "Your current time"}

          {country.nextAbbreviation && `(${country.nextAbbreviation})`}
        </Heading>
        <AnalogClock
          {...options}
          useCustomTime
          seconds={datetime.second()}
          minutes={minute || datetime.minute()}
          // minutes={minute}
          hours={hour || datetime.hour() + datetime.minute() / 60}
          // hours={hour}
        />

        <Box fontSize="175%">
          <Clock
            ticking={true}
            format={"h:mm:ss a"}
            // format={country.formatted}
            timezone={country.zoneName}
            onChange={() => update()}
          />
        </Box>

        {/* FIXME: */}
        {/* {console.log(dayjs().hour()/100)} */}
        <Slider
          aria-label="slider-ex-1"
          defaultValue={
            ((dayjs().hour() + dayjs().minute() / 60) / 24 / 100) * 24
          }
          // min={0}
          max={24}
          // step={}
          onChange={(e) => {
            console.log(e);

            setHour(e);
            // setMinute(e / 24);
          }}
        >
          {console.log(((dayjs().hour() + dayjs().minute() / 60) / 24) * 24)}
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        {/* <Slider
          aria-label="slider-ex-1"
          defaultValue={datetime.minute()}
          min={0}
          max={60}
          step={5}
          onChange={(e) => {
            setMinute(e);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider> */}
        {/* FIXME: */}
      </Flex>
    );
  });
}
