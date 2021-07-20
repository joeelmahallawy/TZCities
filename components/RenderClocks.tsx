import {
  Box,
  Center,
  Heading,
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
import React, { useRef } from "react";
import Clock from "react-live-clock";
import { useUpdate } from "react-use";
import { useState } from "react";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function RenderClocks({ arr }) {
  const [PrevDelta, setPrevDelta] = useState();
  const [delta, setDelta] = useState(null);
  const slider = useRef();
  const update = useUpdate();

  return arr.map((country, i) => {
    // function getSliderValue() {
    //   if (delta && datetime.hour() + delta > 24)
    //     console.log(datetime.hour() - 24);
    //   // return datetime.hour() - 24;
    //   if (delta && datetime.hour() + delta < 0) return datetime.hour() + 24;
    // }
    const datetime = dayjs().tz(country.zoneName);

    return (
      <Box w="100%" key={i} alignItems="center">
        <Heading mb="5" fontSize="175%">
          {country.city
            ? `${country.city}`
            : // `${country.countryName}` `${country.countryCode}`
              "Your current time"}

          {country.nextAbbreviation && `(${country.nextAbbreviation})`}
        </Heading>
        <Slider
          aria-label="slider-ex-4"
          defaultValue={datetime.hour() + datetime.minute() / 60}
          value={
            delta && PrevDelta + datetime.hour() > 24
              ? PrevDelta + datetime.hour() - 24
              : delta && PrevDelta + datetime.hour() < 0
              ? PrevDelta + datetime.hour() + 24
              : delta + datetime.hour()
          }
          // FIXME:FIXME:FIXME:FIXME:FIXME:
          max={24}
          min={0}
          step={0.25}
          ref={slider}
          onChange={(e) => {
            setDelta(e - datetime.hour());
            setPrevDelta(delta);
            console.log(e);
            // console.log();
            // console.log(e + datetime.hour() > 24);
            // console.log(e);
            // console.log(e - datetime.hour());
          }}
        >
          {/* {console.log(datetime.hour() - 24)} */}
          <SliderTrack bg="red">
            <SliderFilledTrack bg="blue" />
          </SliderTrack>
          <SliderThumb boxSize={10} bg="black">
            <Box
              color="tomato"
              //  as={}
            />
          </SliderThumb>
        </Slider>

        <Center fontSize="175%">
          {/* {console.log(delta)} */}
          {delta !== null ? (
            <Clock
              date={`${datetime
                .hour(datetime.hour() + delta)
                .minute(Math.abs(delta - Math.floor(delta)) * 60)}`}
              ticking={true}
              format={"h:mm:ss a"}
              timezone={country.zoneName}
              onChange={() => update()}
            />
          ) : (
            <Clock
              ticking={true}
              format={"h:mm:ss a"}
              timezone={country.zoneName}
              onChange={() => update()}
            />
          )}
        </Center>
      </Box>
    );
  });
}
