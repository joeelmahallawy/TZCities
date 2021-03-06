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
import { BiDownvote } from "react-icons/bi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React, { useRef } from "react";
import Clock from "react-live-clock";
import { useLocalStorage, useUpdate } from "react-use";
import { useState } from "react";
import getSliderValue from "../helpers/getSliderValue";
import RenderIntervals from "./renderIntervals";
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
      <Box w="100%" key={i} alignItems="center" mt="2.25%" pb={7}>
        <Flex alignItems="center" gridGap="1%" pb="1%">
          <Box>
            <Heading
              fontSize={["60%", "75%", "115%", "150%", "160%", "175%"]}
              fontWeight="600"
            >
              {country.city
                ? `${country.city}, ${country.countryName}`
                : "Your current time"}
              {country.nextAbbreviation && `(${country.nextAbbreviation})`}:{" "}
            </Heading>
          </Box>
          <Box>
            <Heading
              fontWeight="300"
              fontSize={["50%", "80%", "115%", "150%", "160%", "200%"]}
            >
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
          </Box>

          {i === 0 ? (
            <Box ml="auto">
              <Button
                p={[1, 3, 5, 6, 7]}
                fontSize={["xs", "sm", "lg", "lg", "xl"]}
                size="md"
                variant="solid"
                alignItems="center"
                _focus={{ outline: "none" }}
                onClick={() => {
                  setDelta(null);
                }}
              >
                Get Current Time
              </Button>
            </Box>
          ) : (
            <Box ml="auto">
              <Button
                size="md"
                // bg="red"
                p={[1, 3, 5, 6, 7]}
                fontSize={["xs", "sm", "lg", "lg", "xl"]}
                variant="outline"
                _hover={{ bg: "red.100" }}
                _focus={{ outline: "none" }}
                colorScheme="red"
                onClick={() => {
                  arr.splice(i, 1);
                  localStorage.setItem("timezoneStack", JSON.stringify(arr));
                }}
              >
                Remove Time
              </Button>
            </Box>
          )}
        </Flex>

        <Slider
          tabIndex={-1}
          focusThumbOnChange={false}
          aria-label="slider-ex-4"
          value={getSliderValue(datetime, delta)}
          max={23.99}
          min={0}
          step={0.16666667} // (1/6) for 10 minutes intervals
          ref={slider}
          mr="5%"
          mb="1%"
          onChange={(e) => {
            setDelta(e - datetime.hour());
          }}
          height={12}
        >
          <SliderTrack height={10} overflow="auto" bg="gray.100">
            <SliderFilledTrack />
          </SliderTrack>

          <SliderThumb
            _focus={{ outline: "none" }}
            boxSize={5}
            height={12}
            width={[3, 4, 4, 5, 5]}
            borderRadius={5}
            boxShadow="0.5px 0.5px 0.5px 0.5px black"
            bg="gray.200"
          ></SliderThumb>
        </Slider>
        <Flex
          style={{
            width: "100%",
            height: "100%",
          }}
          ml={[-1, -7.5, -7.5, -7.5, -3]}
        >
          {/* @ts-expect-error */}
          <RenderIntervals abbrev={"am"} />
          {/* @ts-expect-error */}
          <RenderIntervals abbrev={"pm"} />
        </Flex>
      </Box>
    );
  });
}
