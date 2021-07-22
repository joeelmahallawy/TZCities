export default function handleInputEvents(event, suggest, data) {
  if (
    event.key === "ArrowDown" ||
    event.key === "ArrowUp" ||
    event.key === "Space"
  )
    event.preventDefault();

  if (data.length > 0 && event.key === "ArrowDown")
    suggest.current.children[0].focus();
}
