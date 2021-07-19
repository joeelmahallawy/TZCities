import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import React, { useRef } from "react";
import { Button, Heading, Input, ListItem } from "@chakra-ui/react";

const PlacesAutocomplete = () => {
  const search = useRef();
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
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

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();
      let returnedCord;
      // Get latitude and longitude via utility functions
      getGeocode({ address: description })
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          console.log("📍 Coordinates: ", { lat, lng });
          // FIXME:FIXME:FIXME:GIVE LAT AND LONG TO API TO GE TTIMEZONEFIXME:FIXME:FIXME:
        })
        .catch((error) => {
          console.log("😱 Error: ", error);
        });

      // const returnedCord={lat,lng}
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          style={{
            width: "100%",
            border: "0.25px solid gray",
            listStyle: "none",
            margin: "5px",
          }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

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
        />
        {/* We can use the "status" to decide whether we should display the dropdown or not */}
        {status === "OK" && <ul>{renderSuggestions()}</ul>}
      </div>
      <Button onClick={() => console.log("hi")}>Click me!</Button>
    </div>
  );
};
export default PlacesAutocomplete;
