import {
  useColorModeValue,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Center,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import AnalogClock from "analog-clock-react";
import Clock from "react-live-clock";

export default function RenderClocks({ arrOfCountries, options }) {
  return arrOfCountries.map((country, i) => {
    return (
      <>
        <Box>
          <Heading key={i}>{country}</Heading>
          <AnalogClock {...options} />
          <Center fontSize="175%">
            <Clock ticking={true} format={"h:mm:ss a"} />
          </Center>
        </Box>
      </>
    );
  });
}
