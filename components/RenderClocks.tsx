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
  Divider,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React, { useRef } from "react";
import Clock from "react-live-clock";
import { useLocalStorage, useUpdate } from "react-use";
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
        <Flex alignItems="center" gridGap="1%" pb="1%">
          <Heading
            fontSize={["85%", "80%", "115%", "150%", "160%", "175%"]}
            fontWeight="600"
          >
            {country.city ? `${country.city}` : "Your current time"}
            {country.nextAbbreviation && `(${country.nextAbbreviation})`}:{" "}
          </Heading>
          <Heading
            fontWeight="300"
            // fontSize={["100%", "130%", "145%", "160%", "170%", "175%"]}
            fontSize={["85%", "80%", "115%", "150%", "160%", "175%"]}
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
              fontSize={["100%", "110%", "120%", "130%", "140%", "150%"]}
              size="xl"
              p="1%"
              _focus={{ outline: "none" }}
              onClick={() => {
                arr.splice(i, 1);
                localStorage.setItem("timezoneStack", JSON.stringify(arr));
              }}
            >
              Delete Time
            </Button>
          )}
        </Flex>

        <Slider
          aria-label="slider-ex-4"
          value={getSliderValue(datetime, delta)}
          max={24}
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
          <SliderTrack height={8} overflow="auto">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb
            boxSize={5}
            height={10}
            borderRadius={5}
            boxShadow="0.5px 0.5px 0.5px 0.5px gray"
          ></SliderThumb>
        </Slider>
        <Flex
          style={{
            width: "100%",
            height: "100%",
            marginLeft: -5,
          }}
        >
          {Array.from(new Array(24)).map((step, index) => (
            <Flex
              key={index}
              style={{
                width: `${100 / 24}%`,
              }}
              fontSize={["50%", "65%", "75%", "100%", "100%"]}
            >
              {index}
            </Flex>
          ))}
        </Flex>
      </Box>
    );
  });
}
