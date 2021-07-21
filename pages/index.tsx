import {
  Text,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  FormControl,
  InputGroup,
  InputLeftElement,
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
import useOnclickOutside from "react-cool-onclickoutside";
import { FocusScope, useFocusManager } from "@react-aria/focus";
import { IoIosPin, IoIosSearch } from "react-icons/io";

dayjs.extend(utc);
dayjs.extend(timezone);

const IndexPage = () => {
  const firstSuggestion = useRef();
  const search = useRef();
  const clickMe = useRef();
  const [clockStack, setClockStack] = useState([
    { countryName: "Your current time", zoneName: dayjs.tz.guess() },
  ]);
  // const arr = ["1", "2", "3", "4", "5"];
  // console.log(arr);
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
        // componentRestrictions: { country: "us" },
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
      return data.map((suggestion, i) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;
        return (
          <Box
            p="0"
            w="100%"
            onClick={() => {
              handleSelect(suggestion);
            }}
            key={place_id}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSelect(suggestion);
            }}
            ref={i === 0 ? firstSuggestion : undefined}
          >
            <SearchOptions suggest={suggestion}>
              <IoIosPin size="25px" />
              <Heading fontSize="120%" mr="5px">
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
            if (e.key === "Escape") clearSuggestions();
          }}
        >
          {props.children}
        </Button>
      );
    }

    return (
      <Flex ref={ref} w="80%">
        <Box w="50%">
          <Flex
            border="1px solid black"
            borderRadius="10px"
            _focusWithin={{ boxShadow: "1px 1px 1px gray" }}
          >
            <InputGroup>
              <Input
                variant="outline"
                ref={search}
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Search for a city or country"
                fontSize="125%"
                size="lg"
                border="none"
                _focus={{ outline: "none" }}
                onKeyDown={(e) => {
                  if (data.length > 0 && e.key === "ArrowDown")
                    // @ts-expect-error
                    firstSuggestion.current.children[0].focus();
                }}
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
              p="5px"
              // mt="1%"
              borderBottomRadius="10px"
              // bg="red"
              bg="white"
              pos="fixed"
              w="20%"
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

        {/* <Button onClick={() => handleSelect(suggestion)}>Click me!</Button> */}
      </Flex>
    );
  };
  // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:END OF AUTOPALCESFIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:

  const [, getTimezone] = useAsyncFn(async (lat, lng, city) => {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=HUTUZS1BO031&format=json&by=position&lat=${lat}&lng=${lng}`
    );
    const responseData = await response.json();
    responseData.city = city;
    setClockStack((prev) => {
      const alreadyExists = prev.some((loc) => {
        // IF ALREADY EXISTS IN ARRAY
        return loc.zoneName === responseData.zoneName;
      });

      if (!alreadyExists) return [...prev, responseData];
      alert("The timezone already exists");
      return [...prev];
    });
  }, []);

  return (
    <Center>
      <Box flexDir="column" w="75%" mt="2%" mr="2.5%" maxH="100%" minH="90vh">
        <PlacesAutocomplete />
        <RenderClocks arr={clockStack} />
      </Box>
    </Center>
  );
};

export default IndexPage;
