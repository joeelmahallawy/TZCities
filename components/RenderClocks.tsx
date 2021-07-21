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
import getSliderValue from "../helpers/getSliderValue";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function RenderClocks({ arr }) {
  const [delta, setDelta] = useState(null);
  const slider = useRef();
  const update = useUpdate();

  return arr.map((country, i) => {
    if (!country.zoneName) return;
    const datetime = dayjs().tz(country.zoneName);

    return (
      <Box w="100%" key={i} alignItems="center" mt="2.25%">
        <Flex alignItems="center">
          <Heading mb="5" pl="2.5%" mt="1%" fontSize="200%" fontWeight="600">
            {country.city
              ? `${country.city}`
              : // `${country.countryName}` `${country.countryCode}`
                "Your current time"}
            {country.nextAbbreviation && `(${country.nextAbbreviation})`}:{" "}
          </Heading>
          <Heading fontWeight="300" margin="1%">
            {delta !== null ? (
              <Clock
                date={`${datetime
                  .hour(getSliderValue(datetime, delta))
                  .minute((delta - Math.floor(delta)) * 60)}`}
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
          </Heading>
        </Flex>
        <Flex>
          <Slider
            aria-label="slider-ex-4"
            value={getSliderValue(datetime, delta)}
            max={24}
            min={0}
            step={0.16666667}
            // step={1 / 60}
            ref={slider}
            mr="5%"
            mb="1%"
            onChange={(e) => {
              setDelta(e - datetime.hour());
            }}
          >
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
          <Button
            fontSize="150%"
            size="xl"
            p="1%"
            onClick={() => {
              setDelta(null);
            }}
          >
            Get Current Times
          </Button>
        </Flex>

        {/* <Center fontSize="175%"> */}
        {/* {delta !== null ? (
            <Clock
              date={`${datetime
                .hour(getSliderValue(datetime, delta))
                .minute((delta - Math.floor(delta)) * 60)}`}
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
        </Center> */}
      </Box>
    );
  });
}
