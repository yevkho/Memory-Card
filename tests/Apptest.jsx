export default function AppTest() {
  return <h1>Our First Test</h1>;
}

import { useState } from "react";

export const AppTest2 = () => {
  const [heading, setHeading] = useState("Magnificent Monkeys");

  const clickHandler = () => {
    setHeading("Radical Rhinos");
  };

  return (
    <>
      <button type="button" onClick={clickHandler}>
        Click Me Again
      </button>
      <h1>{heading}</h1>
    </>
  );
};
