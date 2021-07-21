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
import { useLocalStorage, useUpdate } from "react-use";
import { useState } from "react";
import getSliderValue from "../helpers/getSliderValue";
dayjs.extend(utc);
dayjs.extend(timezone);

// function deleteTime() {

// }

export default function RenderClocks({ arr }) {
  // const myStorage = localStorage;
  // localStorage.setItem("countriesArr", "arr[0].countryName");
  // localStorage;
  // useLocalStorage
  // localStorage.
  // localStorage.clear();
  // const dataaa = JSON.stringify(arr);
  // localStorage[1,2,3,4,5] = JSON.stringify(arr);
  // localStorage["selectedCitiesArray"] = JSON.stringify([arr]);
  // console.log(wow);

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
            fontSize={["95%", "100%", "125%", "150%", "160%", "175%"]}
            fontWeight="600"
          >
            {country.city ? `${country.city}` : "Your current time"}
            {country.nextAbbreviation && `(${country.nextAbbreviation})`}:{" "}
          </Heading>
          <Heading
            fontWeight="300"
            fontSize={["100%", "130%", "145%", "160%", "170%", "175%"]}
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
          {
            i === 0 ? (
              <Button
                ml="auto"
                // fontSize="140%"
                fontSize={["100%", "110%", "120%", "130%", "140%", "150%"]}
                size="xl"
                p="1%"
                _focus={{ outline: "none" }}
                onClick={() => {
                  setDelta(null);
                }}
              >
                Get Current Times
              </Button>
            ) : (
              <Button
                ml="auto"
                // fontSize="140%"
                fontSize={["100%", "110%", "120%", "130%", "140%", "150%"]}
                size="xl"
                p="1%"
                _focus={{ outline: "none" }}
                onClick={() => {
                  arr.splice(i, 1);
                }}
              >
                Delete Time
              </Button>
            )
            // FIXME:FIXME:FIXME:FIXME:FIXME:
          }
        </Flex>

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
          <SliderThumb boxSize={[5, 6, 7, 8, 9, 10]} bg="black">
            <Box
              color="tomato"
              //  as={}
            />
          </SliderThumb>
        </Slider>

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
