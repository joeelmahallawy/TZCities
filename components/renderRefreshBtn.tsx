import {
  Box,
  Button,
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Heading,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { IoMdRefreshCircle } from "react-icons/io";
import refreshTimezone from "../helpers/refreshTimezone";
import timezoneStackSetter from "../helpers/timezoneStackSetter";

export default function RenderRefreshBtn() {
  return (
    <Popover
      returnFocusOnClose={false}
      closeOnBlur={false}
      placement="bottom"
      trigger="hover"
    >
      <PopoverTrigger>
        <Button size="0" bg="transparent" _hover={{ bg: "transparent" }}>
          <IoMdRefreshCircle
            size="25px"
            onClick={() => {
              refreshTimezone();
            }}
          />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="100%">
          <PopoverArrow />
          <PopoverHeader>Click here to refresh current timezone!</PopoverHeader>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
