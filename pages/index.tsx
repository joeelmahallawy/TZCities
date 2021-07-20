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
  ListItem,
  NumberInput,
  Select,
  Slide,
  Switch,
  Text,
  UnorderedList,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { useAsync, useAsyncFn } from "react-use";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useRef } from "react";
import Clock from "react-live-clock";
import RenderClocks from "../components/RenderClocks";
import getCountriesOptions from "../helpers/getCountries";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
// import { getLocationOrigin } from "next/dist/next-server/lib/utils";
// import PlacesAutocomplete from "../components/PlacesAutocomplete";

dayjs.extend(utc);
dayjs.extend(timezone);

const IndexPage = () => {
  const toggleClockColor = useColorModeValue("black", "white");
  const toggleHandColor = useColorModeValue("white", "black");
  const [city, setcity] = useState("");
  const [country, setCountry] = useState("");
  const [clockStack, setClockStack] = useState([
    { countryName: "Your current time", zoneName: dayjs.tz.guess() },
  ]);
  const PlacesAutocomplete = () => {
    const search = useRef();
    // var requestOptions = {
    //   types: ["(cities)"],
    //   componentRestrictions: { country: "us" },
    // };

    const {
      ready,
      value,
      suggestions: { status, data },
      // suggestions,
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        // types: ["(cities)"],
        // componentRestrictions: { country: "us" },
      },

      debounce: 300,
    });
    // console.log(request);

    const ref = useOnclickOutside(() => {
      // When user clicks outside of the component, we can dismiss
      // the searched suggestions by calling this method
      clearSuggestions();
    });

    const handleInput = (e) => {
      // Update the keyword of the input element
      setValue(e.target.value);
    };

    const handleSelect = async ({ place_id, description, types }) => {
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
          types,
          terms,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        // FIXME:FIXME:FIXME:FIXME:FIXME:
        // if (
        //   !types.includes("administrative_area_level_3") &&
        //   !types.includes("locality")
        //   // !suggestion.types.includes("country")
        // )
        //   return;
        // console.log(
        //   new google.maps.places.AutocompleteService().getPlacePredictions(
        //     (input) => {
        //       // console.log(arr);
        //     }
        //   )
        // );

        // const wow =
        //   new google.maps.places.AutocompleteService().getPlacePredictions(
        //     null,
        //     (arr) => {
        //       arr: {
        //         {
        //           {
        //             types: "country";
        //           }
        //         }
        //       }
        //     }
        //   );

        // FIXME:FIXME:FIXME:FIXME:FIXME:
        return (
          <Box
            key={place_id}
            // bg="red"
            onClick={() => handleSelect(suggestion)}
            width="100%"
            border="0.25px solid gray"
            margin="5px"
            listStyleType="none"
          >
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </Box>
        );
      });
    };

    return (
      <div ref={ref} style={{ display: "flex" }}>
        <div>
          <Input
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Where are you going?"
            border="1px solid black"
            ref={search}
            width="10vw"
          />
          {/* We can use the "status" to decide whether we should display the dropdown or not */}
          {status === "OK" && (
            <Box
              borderRadius="10px"
              bg="red"
              fontSize="100%"
              w="10vw"
              pos="fixed"
              zIndex="15"
            >
              {renderSuggestions()}
            </Box>
          )}
        </div>
        <Button onClick={() => console.log("hi")}>Click me!</Button>
      </div>
    );
  };

  const options = {
    width: "300px",
    baseColor: toggleClockColor,
    handColors: {
      minute: toggleHandColor,
      hour: toggleHandColor,
      second: "red",
    },
  };

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
    <Center h="100vh">
      <Flex direction="column" alignItems="center">
        <Flex mb="10">
          <PlacesAutocomplete />
        </Flex>
        <Flex>
          {/* {console.log(clockStack)} */}
          <RenderClocks arr={clockStack} options={options} />
        </Flex>
      </Flex>
    </Center>
  );
};

export default IndexPage;
