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
import RenderIntervals from "../helpers/renderIntervals";
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
          <Heading
            fontSize={["60%", "80%", "115%", "150%", "160%", "175%"]}
            fontWeight="600"
          >
            {country.city
              ? `${country.city}, ${country.countryName}`
              : "Your current time"}
            {country.nextAbbreviation && `(${country.nextAbbreviation})`}:{" "}
          </Heading>
          <Heading
            fontWeight="300"
            fontSize={["45%", "70%", "115%", "150%", "160%", "175%"]}
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
          {i === 0 ? (
            <Button
              ml="auto"
              fontSize={["80%", "95%", "110%", "120%", "130%", "160%"]}
              size="xl"
              p="1.25%"
              _focus={{ outline: "none" }}
              onClick={() => {
                setDelta(null);
              }}
            >
              Get Current Time
            </Button>
          ) : (
            <Button
              ml="auto"
              fontSize={["80%", "95%", "110%", "120%", "130%", "160%"]}
              size="xl"
              p="1%"
              _focus={{ outline: "none" }}
              onClick={() => {
                arr.splice(i, 1);
                localStorage.setItem("timezoneStack", JSON.stringify(arr));
              }}
            >
              Remove Time
            </Button>
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
          <SliderTrack height={8} overflow="auto" bg="gray.100">
            <SliderFilledTrack />
          </SliderTrack>

          <SliderThumb
            _focus={{ outline: "none" }}
            boxSize={5}
            height={10}
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
          ml={[0, -7.5, -7.5, -7.5, -7.5]}
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
