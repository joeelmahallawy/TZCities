import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  List,
  ListItem,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useColorModeValue,
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

dayjs.extend(utc);
dayjs.extend(timezone);

const IndexPage = () => {
  const clickMe = useRef();
  const [clockStack, setClockStack] = useState([
    { countryName: "Your current time", zoneName: dayjs.tz.guess() },
  ]);

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

          structured_formatting: { main_text, secondary_text },
        } = suggestion;

        return (
          <ListItem
            // id={`${i}`}
            ref={clickMe}
            key={place_id}
            onClick={() => handleSelect(suggestion)}
            listStyleType="none"
            _hover={{ bg: "#DFDFDF" }}
            fontSize="115%"
            p="1%"
          >
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </ListItem>
        );
      });
    };

    return (
      <Flex ref={ref} w="95%" ml="2.5%">
        <Box w="100%">
          <Input
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Search for a city or country"
            pos="sticky"
            top="0"
            fontSize="125%"
            onKeyDown={(e) => {
              // console.log(e);
              // console.log(cursor);
              console.log(data[0]);

              if (data.length > 0 && e.key == "a") console.dir(clickMe.current);
            }}
          />
          {/* We can use the "status" to decide whether we should display the dropdown or not */}
          {status === "OK" && (
            <Box
              p="1%"
              mt="1%"
              borderBottomRadius="10px"
              bg="#EFEFEF"
              boxShadow="0px 2px 5px gray"
            >
              {" "}
              <List>{renderSuggestions()}</List>
            </Box>
          )}
        </Box>
        <Button onClick={() => console.log("hi")}>Click me!</Button>
      </Flex>
    );
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
    <Flex>
      <Box w="25%" mt={10} pos="-webkit-sticky">
        <PlacesAutocomplete />
      </Box>
      <Center
        flexDir="column"
        w="100%"
        mt="2%"
        mr="2.5%"
        maxH="100%"
        minH="100vh"
        // bg="red.100"
      >
        <RenderClocks arr={clockStack} />
      </Center>
    </Flex>
  );
};

export default IndexPage;

// FIXME:FIXME:FIXME:FIXME:FIXME:

// const Item = ({ character, focus, index, setFocus }) => {
//   const ref = useRef(null);

//   useEffect(() => {
//     if (focus) {
//       // Move element into view when it is focused
//       ref.current.focus();
//     }
//   }, [focus]);

//   const handleSelect = useCallback(() => {
//     alert(`${character}`);
//     // setting focus to that element when it is selected
//     setFocus(index);
//   }, [character, index, setFocus]);

//   return (
//     <li
//       tabIndex={focus ? 0 : -1}
//       role="button"
//       ref={ref}
//       onClick={handleSelect}
//       onKeyPress={handleSelect}
//     >
//       {character}
//     </li>
//   );
// };

function Toolbar(props) {
  return (
    <div role="toolbar">
      <FocusScope>{props.children}</FocusScope>
    </div>
  );
}

function ToolbarButton(props) {
  let focusManager = useFocusManager();
  let onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowRight":
        focusManager.focusNext({ wrap: true });
        break;
      case "ArrowLeft":
        focusManager.focusPrevious({ wrap: true });
        break;
    }
  };

  return <button onKeyDown={onKeyDown}>{props.children}</button>;
}
