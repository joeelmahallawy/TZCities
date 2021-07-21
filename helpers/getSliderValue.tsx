export default function getSliderValue(date, delta) {
  if (delta !== null && delta + date.hour() > 24)
    return delta + date.hour() - 24;
  if (delta !== null && delta + date.hour() < 0)
    return 24 + delta + date.hour();
  // if (delta !== null && delta + date.hour() == 24) return 0;
  if (delta === null) return date.hour() + date.minute() / 60;
  return delta + date.hour();
}
