export default function handleInputEvents(event, suggest, data) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
    case "ArrowUp":
      event.preventDefault();
    case "Space":
      event.preventDefault();
  }

  if (data.length > 0 && event.key === "ArrowDown")
    suggest.current.children[0].focus();
}
