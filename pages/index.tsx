import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  Select,
  Slide,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import AnalogClock from "analog-clock-react";
import { useRef } from "react";
// import Clock from "react-digital-clock";
import Clock from "react-live-clock";
import RenderClocks from "../components/RenderClocks";

import getCountriesOptions from "../helpers/getCountries";

const IndexPage = () => {
  const { toggleColorMode } = useColorMode();
  const toggleClockColor = useColorModeValue("black", "white");
  const toggleHandColor = useColorModeValue("white", "black");
  const [AddClock, setAddClock] = useState(false);
  const [countryArr, setCountryArr] = useState([]);
  const [countryOptions, setcountryOptions] = useState(false);
  const timeSelector = useRef();
  const [ShowNewClock, setShowNewClock] = useState(false);
  const selectionsContainer = useRef();
  const [addedNewClock, setAddedNewClock] = useState(false);
  const [twelveHourFormat, settwelveHourFormat] = useState(true);
  const [clockStack, setClockStack] = useState([]);

  let options = {
    width: "300px",
    baseColor: toggleClockColor,
    handColors: {
      minute: toggleHandColor,
      hour: toggleHandColor,
      second: "red",
    },
  };

  useEffect(() => {
    getCounties();
  }, []);
  async function getCounties() {
    const response = await fetch(`https://restcountries.eu/rest/v2/all
    `);
    // const response = await fetch(
    //   `https://restcountries.eu/rest/v2/all?fields=name;timezones`
    // );
    const responseData = await response.json();
    responseData.sort((a, b) => a.name - b.name);
    setCountryArr(responseData);
    setcountryOptions(true);
    console.log(responseData);

    return countryArr;
  }

  return (
    <Center h="100vh">
      <Button onClick={toggleColorMode}>Dark Mode</Button>
      <Box w="70%" overflowX="auto">
        <Flex bg="red">
          <Box>
            <Heading>Your current time</Heading>
            <AnalogClock {...options} />
            <Center fontSize="175%">
              <Clock ticking={true} format={"h:mm:ss a"} />
            </Center>
          </Box>
          <Flex alignItems="center" ref={selectionsContainer}>
            {/* {addedNewClock || ( */}
            <Select ref={timeSelector} w="40%" placeholder="Select option">
              {countryOptions && getCountriesOptions(countryArr)}
            </Select>
            {/* )} */}
            <Button
              onClick={() => {
                console.log(timeSelector.current.value);
                // @ts-ignore
                !clockStack.includes(timeSelector.current.value) &&
                  // @ts-ignore
                  clockStack.push(timeSelector.current.value);
                setClockStack([...clockStack]);
              }}
            >
              {/* {console.log(clockStack)} */}
              Add Timezone
            </Button>
          </Flex>
          <RenderClocks arrOfCountries={clockStack} options={options} />
        </Flex>
      </Box>
    </Center>
  );
};

export default IndexPage;

/* <Flex alignItems="center" ref={selectionsContainer}>
            {addedNewClock || (
              <Select ref={timeSelector} w="40%" placeholder="Select option">
                {countryOptions && getCountriesOptions(countryArr)}
              </Select>
            )}
            <Button>Add Timezone</Button>

          </Flex> */
