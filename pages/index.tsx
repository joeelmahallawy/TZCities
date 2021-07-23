import {
  Text,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  OrderedList,
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dynamic from "next/dynamic";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { AiOutlineClockCircle } from "react-icons/ai";
import useOnclickOutside from "react-cool-onclickoutside";
import { FocusScope, useFocusManager } from "@react-aria/focus";
import { IoIosPin, IoIosSearch, IoIosHelpCircle } from "react-icons/io";
import handleInputEvents from "../helpers/handleInputEvents";
import RenderHelpBlock from "../helpers/renderHelpBlock";
import TZGet from "../logoImage/TZGet.png";

const RenderClocks = dynamic(() => import("../components/RenderClocks"), {
  ssr: false,
});

dayjs.extend(utc);
dayjs.extend(timezone);

const IndexPage = () => {
  const firstSuggestion = useRef();
  const search = useRef();
  const [clockStack, setClockStack] = useState(timezoneStackSetter);
  const [showHelp, setShowHelp] = useState(false);

  function timezoneStackSetter() {
    return typeof window !== "undefined" &&
      localStorage.getItem("timezoneStack")
      ? JSON.parse(localStorage.getItem("timezoneStack"))
      : [{ countryName: "Your current time", zoneName: dayjs.tz.guess() }];
  }

  // BEGINNING OF AUTOCOMPLETE
  const PlacesAutocomplete = () => {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        types: ["(cities)"],
      },
      debounce: 300,
    });
    // DISMISSING SUGGESTIONS
    const ref = useOnclickOutside(() => {
      clearSuggestions();
    });
    // HANDLE INPUTS
    const handleInput = (e) => {
      // Update the keyword of the input element
      setValue(e.target.value);
    };

    // HANDLE SELECTIONS
    const handleSelect = async ({ place_id, description }) => {
      setValue(description, false);
      clearSuggestions();

      const results = await getGeocode({
        placeId: place_id,
      });

      const city = results[0].address_components[0].long_name;
      const { lat, lng } = await getLatLng(results[0]);

      return getTimezone(lat, lng, city, place_id);
    };

    // RENDERING SUGGESTIONS WHEN TYPING
    const renderSuggestions = () => {
      let previouslySearched;

      return data.map((suggestion, i) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        if (localStorage.getItem(`${place_id}`)) previouslySearched = true;
        if (!localStorage.getItem(`${place_id}`)) previouslySearched = false;
        return (
          <Box
            p={1}
            w={["45vw", "42.5vw", "35vw", "27.5vw", "20vw"]}
            onClick={() => {
              handleSelect(suggestion);
            }}
            key={place_id}
            onKeyDown={(e) => {
              e.preventDefault();

              if (e.key === "Enter") handleSelect(suggestion);
            }}
            ref={i === 0 ? firstSuggestion : undefined}
          >
            <SearchOptions suggest={suggestion}>
              {previouslySearched ? (
                <AiOutlineClockCircle
                  alignmentBaseline="auto"
                  size="25px"
                  color="gray"
                />
              ) : (
                <IoIosPin size="25px" color="gray" />
              )}
              <Heading fontSize="120%" ml="5px" mr="5px">
                {main_text}
              </Heading>{" "}
              <Text color="gray">{secondary_text}</Text>
            </SearchOptions>
          </Box>
        );
      });
    };
    // SUGGESTION OPTIONS CONTAINER
    function SearchOptionsContainer(props) {
      return (
        <Box role="toolbar" p="0">
          <FocusScope>{props.children}</FocusScope>
        </Box>
      );
    }
    // SUGGESTION OPTIONS ELEMENTS
    function SearchOptions(props, suggest) {
      let focusManager = useFocusManager();
      let onKeyDown = (e) => {
        e.preventDefault();
        switch (e.key) {
          case "ArrowDown":
            focusManager.focusNext({
              wrap: true,
            });
            break;
          case "ArrowUp":
            focusManager.focusPrevious({ wrap: true });
            break;
          case "Enter":
            handleSelect(suggest);
          case "Backspace":
            // @ts-expect-error
            search.current.focus();
        }
      };

      return (
        <Button
          p="0%"
          w="100%"
          borderRadius="0"
          bg="transparent"
          _hover={{ bg: "gray.100" }}
          justifyContent="left"
          _focus={{ bg: "gray.100" }}
          onKeyDown={onKeyDown}
          onKeyDownCapture={(e) => {
            e.preventDefault();
            if (e.key === "Escape") clearSuggestions();
          }}
        >
          {props.children}
        </Button>
      );
    }
    // PLACES AUTOCOMPLETE

    return (
      <Flex ref={ref} w="80%" alignItems="center">
        <Box w="40%">
          <Flex
            w={["45vw", "42.5vw", "35vw", "27.5vw", "20vw"]}
            h={["60%", "70%", "80%", "90%", "100%"]}
          >
            <InputGroup h="100%">
              <Input
                ref={search}
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Search for a city or country"
                fontSize={["70%", "80%", "105%", "115%", "125%"]}
                size="lg"
                onKeyDown={(e) => handleInputEvents(e, firstSuggestion, data)}
              />

              <InputRightElement
                h="100%"
                children={
                  <IoIosSearch
                    size="90%"
                    // @ts-expect-error
                    onClick={() => search.current?.focus()}
                  />
                }
              />
            </InputGroup>
          </Flex>

          {/* We can use the "status" to decide whether we should display the dropdown or not */}
          {status === "OK" && (
            <Flex
              borderBottomRadius="4px"
              bg="white"
              pos="absolute"
              w={["45vw", "42.5vw", "35vw", "27.5vw", "20vw"]}
              mt="5px"
              zIndex="15"
              borderColor="teal"
              borderSize="1px"
              borderStyle="solid"
            >
              <SearchOptionsContainer>
                {renderSuggestions()}
              </SearchOptionsContainer>
            </Flex>
          )}
        </Box>
        <Box
          ml={["60%", "45%", "30%", "15%", "0%"]}
          onMouseEnter={() => setShowHelp(true)}
          onMouseLeave={() => setShowHelp(false)}
        >
          <Box _hover={{ cursor: "pointer" }}>
            <IoIosHelpCircle
              color="gray"
              alignmentBaseline="central"
              size="25px"
            />
          </Box>
          {showHelp && <RenderHelpBlock />}
        </Box>
      </Flex>
    );
  };
  // END OF AUTOCOMPLETE
  const [, getTimezone] = useAsyncFn(async (lat, lng, city, placeID) => {
    localStorage.setItem(`${placeID}`, `${city}`);
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=HUTUZS1BO031&format=json&by=position&lat=${lat}&lng=${lng}`
    );
    const responseData = await response.json();
    responseData.city = city;

    setClockStack((prev) => {
      const alreadyExists = prev.some((loc) => {
        // IF ALREADY EXISTS IN ARRAY SET TRUE AND DONT ADD ANOTHER
        return loc.zoneName === responseData.zoneName;
      });

      if (!alreadyExists) {
        localStorage.setItem(
          `timezoneStack`,
          JSON.stringify([...prev, responseData])
        );
        return [...prev, responseData];
      }
      alert("Timezone already exists");
      return [...prev];
    });
  }, []);
  {
  }

  return (
    <Center>
      <Box
        w="65%"
        mt="2%"
        mr="2.5%"
        maxH="100%"
        minH="90vh"
        justifyContent="center"
      >
        <Flex justifyContent="center" direction="column">
          <Heading>Hello</Heading>
          <Text>ASDASD</Text>
          <PlacesAutocomplete />
        </Flex>
        <RenderClocks arr={clockStack} />
      </Box>
    </Center>
  );
};

export default IndexPage;
