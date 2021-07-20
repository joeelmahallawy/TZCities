// import {
//   Box,
//   Heading,
//   Flex,
//   Slider,
//   SliderFilledTrack,
//   SliderThumb,
//   SliderTrack,
// } from "@chakra-ui/react";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
// import React from "react";
// import AnalogClock from "analog-clock-react";
// import Clock from "react-live-clock";
// import { useUpdate } from "react-use";
// import { useState } from "react";
// dayjs.extend(utc);
// dayjs.extend(timezone);

// export default function RenderClocks({ arr, options }) {
//   const update = useUpdate();

//   const [minute, setMinute] = useState(null);
//   const [hour, setHour] = useState(null);
//   // const [delta, setDelta] = useState(0)

//   return arr.map((country, i) => {
//     const datetime = dayjs().tz(country.zoneName);

//     // var time = country.formatted;
//     // var myDate = new Date(time);
//     // console.log(myDate);
//     // console.log(country);
//     // console.log(country);

//     let defaultTime = datetime.hour() + datetime.minute() / 60;

//     return (
//       <Flex m="0 3%" key={i} direction="column" alignItems="center">
//         <Heading mb="5" fontSize="175%">
//           {country.city
//             ? `${country.city}`
//             : // `${country.countryName}` `${country.countryCode}`
//               "Your current time"}

//           {country.nextAbbreviation && `(${country.nextAbbreviation})`}
//         </Heading>
//         <AnalogClock
//           {...options}
//           useCustomTime
//           seconds={datetime.second()}
//           // minutes={minute === null ? datetime.minute() : minute}
//           // hours={
//           //   hour === null ? datetime.hour() + datetime.minute() / 60 : hour
//           // }
//           minutes={datetime.minute()}
//           hours={datetime.hour()}
//         />
//         {console.log(datetime.utc())}

//         <Box fontSize="175%">
//           <Clock
//             ticking={true}
//             format={"h:mm:ss a"}
//             // format={country.formatted}
//             timezone={country.zoneName}
//             onChange={() => update()}
//           />
//         </Box>
//         <Slider
//           aria-label="slider-ex-1"
//           defaultValue={defaultTime}
//           min={0}
//           max={24}
//           step={0.25}
//           onChange={(e) => {
//             // if (e > defaultTime) {
//             //   const delta=e-defaultTime
//             //   // console.log(e - defaultTime);
//             console.log(e);
//             // }
//             // console.log(e < defaultTime);
//             // console.log(e === defaultTime);
//             // FIXME:BASED ON WHETHER GREATER, ADD OR SUBTRACT DELTA AND APPLY TO REST OF CLOCKSFIXME:

//             // console.log(e - datetime.hour());
//             // setHour(e);

//             // setMinute(e * 60);
//           }}
//         >
//           {/* {console.log(((dayjs().hour() + dayjs().minute() / 60) / 24) * 24)} */}
//           <SliderTrack>
//             <SliderFilledTrack />
//           </SliderTrack>
//           <SliderThumb />
//         </Slider>
//       </Flex>
//     );
//   });
// }
