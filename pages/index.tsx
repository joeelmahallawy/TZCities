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
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useAsyncFn } from "react-use";
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
import {
  IoIosPin,
  IoIosSearch,
  IoIosHelpCircle,
  IoMdRefreshCircle,
} from "react-icons/io";
import handleInputEvents from "../helpers/handleInputEvents";
import RenderHelpBlock from "../components/renderHelpBlock";
import { NextSeo } from "next-seo";
import { createSEOConfig } from "../utils/seoMeta";
import timezoneStackSetter from "../helpers/timezoneStackSetter";
import refreshTimezone from "../helpers/refreshTimezone";
import renderRefreshBtn from "../components/renderRefreshBtn";
import RenderRefreshBtn from "../components/renderRefreshBtn";

const RenderClocks = dynamic(() => import("../components/RenderClocks"), {
  ssr: false,
});

dayjs.extend(utc);
dayjs.extend(timezone);
// console.log(dayjs.extend());
// console.log();

const IndexPage = () => {
  const firstSuggestion = useRef();
  const search = useRef();
  const [clockStack, setClockStack] = useState(timezoneStackSetter);

  // BEGINNING OF AUTOCOMPLETE
  // FIXME:FIXME:FIXME:
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
            w={["60vw", "42.5vw", "35vw", "35vw", "27.5vw"]}
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
              <Heading
                fontSize={["47.5%", "62.5%", "80%", "95%", "115%"]}
                ml="5px"
                mr="5px"
              >
                {main_text}
              </Heading>{" "}
              <Text fontSize={["40%", "50%", "70%", "85%", "95%"]} color="gray">
                {secondary_text}
              </Text>
            </SearchOptions>
          </Box>
        );
      });
    };
    // SUGGESTION OPTIONS CONTAINER
    function SearchOptionsContainer(props) {
      return (
        <Box role="toolbar" pt={1}>
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
          // p="0%"
          // p={[0, 0.5, 1, 1, 1]}
          alignItems="center"
          // p={8}
          w="100%"
          borderRadius="0"
          bg="transparent"
          _hover={{ bg: "#eeeeee" }}
          justifyContent="left"
          _focus={{ bg: "#eeeeee" }}
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
      <Flex ref={ref} w="100%" alignItems="center" justifyContent="center">
        <Box mr={0} h={["30px", "35px", "40px", "45px", "55px"]}>
          <Flex w={["60vw", "42.5vw", "35vw", "35vw", "27.5vw"]} h="100%">
            <InputGroup>
              <Input
                h="100%"
                ref={search}
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Search for a city"
                fontSize={["70%", "80%", "105%", "115%", "125%"]}
                size="lg"
                onKeyDown={(e) => handleInputEvents(e, firstSuggestion, data)}
              />

              <InputRightElement
                h="100%"
                children={
                  <IoIosSearch
                    size="25px"
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
              borderBottomRadius="6px"
              // bg="gray.100"
              bg="white"
              // boxShadow="0.5px 0.5px 0.5px gray"
              boxShadow="lg"
              pos="absolute"
              mt="5px"
              zIndex="15"
              borderColor="teal"
              borderStyle="solid"
            >
              <SearchOptionsContainer>
                {renderSuggestions()}
              </SearchOptionsContainer>
            </Flex>
          )}
        </Box>
        <Flex ml={3}>
          <RenderHelpBlock />
          {/* <Center _hover={{ cursor: "pointer" }} ml={1}>
            <IoMdRefreshCircle
              size="25px"
              onClick={() => {
                refreshTimezone();
                setClockStack(timezoneStackSetter);
              }}
            />
          </Center> */}

          <Center
            _hover={{ cursor: "pointer" }}
            ml={1}
            onClick={() => setClockStack(timezoneStackSetter)}
          >
            <RenderRefreshBtn />
          </Center>
        </Flex>
      </Flex>
    );
  };
  // END OF AUTOCOMPLETE
  const [, getTimezone] = useAsyncFn(async (lat, lng, city, placeID) => {
    localStorage.setItem(`${placeID}`, `${city}`);
    const response = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=HUTUZS1BO031&format=json&by=position&lat=${lat}&lng=${lng}`
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
    <Center overflowX="hidden" maxW="100%">
      <NextSeo {...createSEOConfig()} />
      <Box w={["85%", "82.5%", "82.5%", "80%", "77.5%"]} mt="2%" mr="2.5%">
        <Box textAlign="center">
          <Heading
            mr={3}
            fontFamily="serif"
            fontSize={["2xl", "3xl", "4xl", "5xl", "6xl"]}
          >
            TZ Cities
          </Heading>
          <Text mr={5} mb={3} fontSize={["50%", "40%", "80%", "95%", "115%"]}>
            Compare timezones for cities all over the world!
          </Text>

          <PlacesAutocomplete />
        </Box>
        <RenderClocks arr={clockStack} />
      </Box>
    </Center>
  );
};

export default IndexPage;
