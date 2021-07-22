import { Box, Heading, OrderedList, ListItem } from "@chakra-ui/react";
import React from "react";

export default function RenderHelpBlock() {
  return (
    <Box
      overflowY="auto"
      bg="#F9F9F9"
      pl="10px"
      pr="10px"
      pb="10px"
      borderRadius="10px"
      boxShadow="0.5px 0.5px 0.5px 0.5px gray"
      pos="absolute"
      zIndex="99"
      ml="-10%"
    >
      <Heading fontSize={["120%", "140%", "165%", "165%", "225%"]}>
        How to use:
      </Heading>
      <OrderedList fontSize={["80%", "90%", "105%", "130%", "140%"]}>
        <ListItem> Search for a city or country</ListItem>
        <ListItem> Get timezone</ListItem>
        <ListItem>
          Drag the first slider to change your current location's time{" "}
        </ListItem>
        <ListItem>
          Manipulate your current location's time to see times in other
          locations
        </ListItem>
        <ListItem>
          Drag other timezones to see how it compares to yours!
        </ListItem>
      </OrderedList>
    </Box>
  );
}
