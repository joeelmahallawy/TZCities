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
        <Box _hover={{ cursor: "pointer" }}>
          <IoIosHelpCircle
            color="gray"
            alignmentBaseline="central"
            size="25px"
          />
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="35vw">
          <PopoverHeader>
            <Heading
              textAlign="center"
              fontSize={["120%", "140%", "165%", "165%", "225%"]}
            >
              How to use:
            </Heading>
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Box textAlign="left" overflowY="auto" p={1}>
              <OrderedList fontSize={["80%", "90%", "105%", "130%", "120%"]}>
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
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
