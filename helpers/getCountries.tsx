export default function getCountriesOptions(arr) {
  const returnArr = arr.map((coun, i) => {
    return (
      <option value={coun.name} key={i}>
        {coun.name}
      </option>
    );
  });

  return returnArr;
}
