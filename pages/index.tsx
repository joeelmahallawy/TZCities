import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  Select,
  Slide,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Clock from "react-clock";
import ThemedAnalogClock from "themed-analog-clock";
import ReactClock from "react-clock";
// import AnalogClock, { Themes } from "react-analog-clock";
import AnalogClock from "analog-clock-react";
import { useRef } from "react";

// const options = setInterval(() => {
// let options = {
//   useCustomTime: true, // set this to true
//   width: "250px",
//   border: true,
//   borderColor: "white",
//   baseColor: "white",
//   centerColor: "white",
//   centerBorderColor: "#fff",
//   handColors: {
//     second: setInterval(() => new Date().getSeconds()),
//     minute: setInterval(() => new Date().getMinutes()),
//     hour: setInterval(() => new Date().getHours()),
//   },
//   seconds: new Date().getSeconds(), // set your
//   minutes: new Date().getMinutes(), // own
//   hours: new Date().getHours(), // time here.
// };
// }, 1000);

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

  // console.log(new Date());
  // console.log(new Date(2021, 10, 5, 18, 23, 21));
  let options = {
    width: "300px",
    border: true,
    showNumbers: true,
    baseColor: toggleClockColor,
    handColors: {
      second: "darkred",
      minute: toggleHandColor,
      hour: toggleHandColor,
    },
  };
  useEffect(() => {
    getCounties();
  }, []);
  async function getCounties() {
    const response = await fetch(`https://restcountries.eu/rest/v2/all
    `);
    const responseData = await response.json();
    responseData.sort((a, b) => a.name - b.name);
    setCountryArr(responseData);
    console.log(responseData);
    return countryArr;
  }
  function countriesOptions() {
    const returnArr = countryArr.map((coun, i) => {
      // console.log(coun.timezones[0].slice(3));
      return (
        <option value={`${coun.name}`} key={i}>
          {coun.name} {coun.timezones[0]}
        </option>
      );
    });

    console.log(returnArr);
    return returnArr;
  }
  function SlideEx() {
    const { isOpen, onToggle } = useDisclosure();
    // console.log(typeof onToggle);
    return (
      <>
        <Box
        // style={
        //   addedNewClock ? { opacity: "0", transition: "opacity 1s" } : null
        // }
        >
          <Button
            onClick={() => {
              onToggle();
              // console.log(selectionsContainer.current);
              setAddedNewClock(true);
            }}
            style={
              addedNewClock
                ? { opacity: "0", transition: "opacity 0.5s" }
                : null
            }
          >
            Add Time
          </Button>
          <Slide direction="right" in={isOpen} style={{ zIndex: 1 }}>
            <Box>
              <Center h="95vh" w={`92.5vw`} justifyContent="center">
                <AnalogClock {...options} />
              </Center>
            </Box>
          </Slide>
        </Box>
      </>
    );
  }

  return (
    <Center h="100vh">
      <Button onClick={toggleColorMode}>Dark Mode</Button>
      <Box w="50%">
        <Flex bg="red">
          <Box>
            <Heading>Your current time</Heading>
            <AnalogClock {...options} />
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
          </Box>
          {/* FIXME: */}
          <Flex alignItems="center" ref={selectionsContainer}>
            <Select
              ref={timeSelector}
              w="35%"
              placeholder="Select option"
              onClick={() => setcountryOptions(true)}
              onChange={(e) => {
                console.log(e.target);
                setShowNewClock(true);
              }}
              style={
                addedNewClock
                  ? { opacity: "0", transition: "opacity 1s" }
                  : null
              }
            >
              {countryOptions && countriesOptions()}
              {/* <AnalogClock {...options} /> */}
            </Select>
            {SlideEx()}
          </Flex>
          {/* FIXME: */}
        </Flex>
      </Box>
    </Center>
  );
};

export default IndexPage;
