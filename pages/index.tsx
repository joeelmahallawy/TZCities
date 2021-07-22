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
import React, { useEffect, useRef, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import RenderClocks from "../components/RenderClocks";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { AiOutlineClockCircle } from "react-icons/ai";
import useOnclickOutside from "react-cool-onclickoutside";
import { FocusScope, useFocusManager } from "@react-aria/focus";
import { IoIosPin, IoIosSearch } from "react-icons/io";
import handleInputEvents from "../helpers/handleInputEvents";

dayjs.extend(utc);
dayjs.extend(timezone);

const IndexPage = () => {
  const firstSuggestion = useRef();
  const search = useRef();
  const [clockStack, setClockStack] = useState(timezoneStackSetter);
  // const [previouslySearched, setPreviouslySearched] = useState(false);

  function timezoneStackSetter() {
    return typeof window !== "undefined" &&
      localStorage.getItem("timezoneStack")
      ? JSON.parse(localStorage.getItem("timezoneStack"))
      : [{ countryName: "Your current time", zoneName: dayjs.tz.guess() }];
  }

  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:BEGINNING OF AUTOPALCESFIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:
  const PlacesAutocomplete = () => {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        types: ["(regions)"],
      },
      debounce: 300,
    });

    const ref = useOnclickOutside(() => {
      // When user clicks outside of the component, we can dismiss
      // the searched suggestions by calling this method
      clearSuggestions();
    });

    const handleInput = (e) => {
      // Update the keyword of the input element
      // console.log(e);
      setValue(e.target.value);
    };

    const handleSelect = async ({ place_id, description }) => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      const results = await getGeocode({
        placeId: place_id,
      });
      const city = results[0].address_components[0].long_name;
      const { lat, lng } = await getLatLng(results[0]);

      return getTimezone(lat, lng, city);
    };

    const renderSuggestions = () => {
      let previouslySearched;
      return data.map((suggestion, i) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        if (localStorage.getItem(`${main_text}`)) previouslySearched = true;
        if (!localStorage.getItem(`${main_text}`)) previouslySearched = false;
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
    function SearchOptionsContainer(props) {
      return (
        <Box role="toolbar" w="100%" p="0">
          <FocusScope>{props.children}</FocusScope>
        </Box>
      );
    }

    function SearchOptions(props, suggest) {
      let focusManager = useFocusManager();
      let onKeyDown = (e) => {
        console.log(e);
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
            search.current.focus();
          // handleInput(search.current.value.slice(0, -1));
          // search.current.value = search.current.value.slice(0, -1);
          // console.log(search.current.value.slice(0, -1));
          // search.current.value.pop();
          // search.current?.focus();
          // FIXME:
        }
      };

      return (
        <Button
          p="0%"
          w="100%"
          borderRadius="0"
          bg="transparent"
          _hover={{ bg: "#DFDFDF" }}
          justifyContent="left"
          _focus={{ bg: "#DFDFDF" }}
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

    return (
      <Flex ref={ref} w="80%">
        <Box w="40%">
          <Flex
            // w="20vw"
            w={["45vw", "42.5vw", "35vw", "27.5vw", "20vw"]}
            h={["60%", "70%", "80%", "90%", "100%"]}
            border="1px solid black"
            borderRadius="10px"
            _focusWithin={{ boxShadow: "1px 1px 1px gray" }}
          >
            <InputGroup h="100%">
              <Input
                alignSelf="center"
                variant="outline"
                ref={search}
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Search for a city or country"
                fontSize={["70%", "80%", "105%", "115%", "125%"]}
                size="lg"
                border="none"
                _focus={{ outline: "none" }}
                onKeyDown={(e) => handleInputEvents(e, firstSuggestion, data)}
              />
              <InputRightElement
                h="100%"
                children={
                  <IoIosSearch
                    size="90%"
                    // size={["80px", "85px", "90px", "95px", "100px"]}
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
              borderBottomRadius="10px"
              bg="white"
              pos="absolute"
              w="20vw"
              mt="5px"
              zIndex="15"
              boxShadow="0px 2px 5px gray"
            >
              <SearchOptionsContainer>
                {renderSuggestions()}
              </SearchOptionsContainer>
            </Flex>
          )}
        </Box>
      </Flex>
    );
  };
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:END OF AUTOPALCESFIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:

  const [, getTimezone] = useAsyncFn(async (lat, lng, city) => {
    localStorage.setItem(`${city}`, `${city}`);
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
      <Box flexDir="column" w="65%" mt="2%" mr="2.5%" maxH="100%" minH="90vh">
        <PlacesAutocomplete />
        <RenderClocks arr={clockStack} />
      </Box>
    </Center>
  );
};

export default IndexPage;
