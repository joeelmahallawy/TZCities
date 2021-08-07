import dayjs from "dayjs";

export default function refreshTimezone() {
  let newArr = JSON.parse(localStorage.getItem("timezoneStack"));
  newArr.shift();
  newArr.unshift({
    countryName: "Your current time",
    zoneName: dayjs.tz.guess(),
  });
  localStorage.removeItem("timezoneStack");
  localStorage.setItem("timezoneStack", JSON.stringify(newArr));
}
