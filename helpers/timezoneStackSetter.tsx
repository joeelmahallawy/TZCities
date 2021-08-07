import dayjs from "dayjs";

export default function timezoneStackSetter() {
  return typeof window !== "undefined" && localStorage.getItem("timezoneStack")
    ? JSON.parse(localStorage.getItem("timezoneStack"))
    : [{ countryName: "Your current time", zoneName: dayjs.tz.guess() }];
}
