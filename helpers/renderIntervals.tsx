import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export default function RenderIntervals({ abbrev }) {
  return Array.from(new Array(12)).map((step, index) => {
    return (
      <Flex
        key={index}
        style={{
          width: `${100 / 24}%`,
        }}
        // fontSize={["20%", "20%", "50%", "65%", "80%"]}
        fontSize="14px"
      >
        <Text fontSize={["33%", "45%", "65%", "85%", "100%"]}>{`${
          index === 0 ? index + 12 : index
        }${abbrev}`}</Text>
      </Flex>
    );
  });
}
