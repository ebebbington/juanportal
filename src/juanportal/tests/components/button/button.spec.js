import "@testing-library/jest-dom/extend-expect";
// import { Simulate } from "react-dom/test-utils";

import React from "react";
import { render } from "@testing-library/react";
import Button from "../../../components/button/button";

/**
 * Helpful variables
 * - When wanting to get styles: window.getComputedStyle(document.querySelector('button')).[color|background...]
 */

const lights = ["red", "amber", "green"];

test("It renders text", () => {
  const testColour = "red";
  const testText = "I am a button";
  // assignment: const { getByTestId } =
  render(<Button text={testText} lightColour={testColour} />);
  expect(document.querySelector("button").textContent).toBe(testText);
});

test("It renders all types of lights", () => {
  lights.forEach((light) => {
    render(<Button text="hello" lightColour={`${light}`} />);
    const buttons = document.querySelectorAll(
      `button.trafficLight.${light}Light`
    );
    expect(buttons.length).toBe(1); // buttons must be set
  });
});

test("It fails when no text is passed in", () => {
  render(<Button lightColour="red" />);
  const elem = document.querySelector("button");
  expect(elem).toBe(null);
});

test("It fails when no style colour is passed in", () => {
  render(<Button text="hello" />);
  const elem = document.querySelector("button");
  expect(elem).toBe(null);
});

test("Should fail when a wrong value is passed in as a light colour", () => {
  render(<Button text="hello" lightColour="something else" />);
  const elem = document.querySelector("button");
  expect(elem).toBe(null);
});

test("Event handler should be called and triggered when one is passed in", () => {
  let name = false;
  let passedInId = false;
  let event = false;
  const handler = (evt, id) => {
    name = true;
    passedInId = id;
    event = evt;
  };
  render(
    <Button text="hello" lightColour="red" clickHandler={handler} id="hello" />
  );
  const elem = document.querySelector("button");
  elem.click();
  expect(name).toBe(true);
  expect(passedInId).toBe("hello");
  expect(!!event).toBe(true);
});

test("Nothing should happen if no handler is passed in and button is clicked", () => {
  render(<Button text="hello" lightColour="red" id="hello" />);
  const elem = document.querySelector("button");
  elem.click();
});
