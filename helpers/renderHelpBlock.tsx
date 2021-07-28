import {
  Box,
  Heading,
  OrderedList,
  ListItem,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Button,
  PopoverArrow,
} from "@chakra-ui/react";
import React from "react";
import { IoIosHelpCircle } from "react-icons/io";
export default function RenderHelpBlock() {
  const initRef = React.useRef();
  return (
    <Popover
      returnFocusOnClose={false}
      closeOnBlur={false}
      placement="bottom"
      initialFocusRef={initRef}
      trigger="hover"
    >
      <PopoverTrigger>
        <Box _hover={{ cursor: "pointer" }} _active={{ outline: "none" }}>
          <IoIosHelpCircle
            color="gray"
            alignmentBaseline="central"
            size="25px"
          />
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w={["90%", "100%", "100%", "100%", "100%"]}>
          <PopoverHeader>
            <Heading size="md">How to use</Heading>
          </PopoverHeader>
          <PopoverBody>
            <Box textAlign="left" overflowY="auto" p={3}>
              <OrderedList>
                <ListItem>Search for a city</ListItem>
                <ListItem>Get city's timezone</ListItem>
                <ListItem>
                  Move any slider to synchronously change all of the location's
                  time{" "}
                </ListItem>
                <ListItem>Add as many cities as you want!</ListItem>
              </OrderedList>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
