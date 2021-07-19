// import { useState, useEffect } from "react";
// import PlacesAutocomplete from "./PlacesAutocomplete";

// const SomeComponent = () => {
//   const [gmapsLoaded, setGmapsLoaded] = useState(false);

//   // This is how you do componentDidMount() with React hooks
//   useEffect(() => {
//     window.initMap = () => setGmapsLoaded(true);
//     const gmapScriptEl = document.createElement(`script`);
//     gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=SECRET_EATING&libraries=places&callback=initMap`;
//     document
//       .querySelector(`body`)
//       .insertAdjacentElement(`beforeend`, gmapScriptEl);
//   }, []);

//   return <div>{gmapsLoaded && <PlacesAutocomplete />}</div>;
// };

// export default SomeComponent;
