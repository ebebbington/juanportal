import "@testing-library/jest-dom/extend-expect";
// import { Simulate } from "react-dom/test-utils";
import "setimmediate"

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import Revealer from "../../../components/revealer/revealer";

/**
 * Helpful variables
 * - When wanting to get styles: window.getComputedStyle(document.querySelector('button')).[color|background...]
 */

test("It should display correctly, with the icon and title", () => {
  // assignment: const { getByTestId } =
  const title = "My title :)";
  render(<Revealer text="My title :)" iconClass="fa-chart" />);
  const h2Title = document.querySelector("h2").textContent;
  const iconClass = document.querySelector("i").className;
  expect(h2Title).toBe(title);
  expect(iconClass).toBe("fa fa-3x fa-chart");
});

test("It should call the click handler", () => {
  let handlerEvent = false;
  const handler = () => {
    handlerEvent = true;
  };
  render(
    <Revealer text="My title :)" iconClass="fa-chart" clickHandler={handler} />
  );
  const button = document.querySelector("button");
  button.click();
  expect(handlerEvent).toBe(true);
});

test("Hovering should expand the elem", () => {
  render(<Revealer text="My title :)" iconClass="fa-chart" />);
  const mouseenter = new MouseEvent("mouseenter", {
    bubbles: false,
    cancelable: false,
  });
  const button = document.querySelector("button");
  expect(button.style.width).toBe("");
  fireEvent.mouseEnter(document.querySelector("button"), mouseenter);
  expect(button.style.width).toBe("100%");
});

test("Leaving hover should 'close' the elem", () => {
  render(<Revealer text="My title :)" iconClass="fa-chart" />);
  const mouseenter = new MouseEvent("mouseenter", {
    bubbles: false,
    cancelable: false,
  });
  const button = document.querySelector("button");
  expect(button.style.width).toBe("");
  fireEvent.mouseEnter(button, mouseenter);
  expect(button.style.width).toBe("100%");
  const mouseleave = new MouseEvent("mouseleave", {
    bubbles: false,
    cancelable: false,
  });
  fireEvent.mouseLeave(button, mouseleave);
  expect(button.style.width).toBe("77px");
});

test("Clicking should do nothing when no handler is passed in", () => {
  render(<Revealer text="My title :)" iconClass="fa-chart" />);
  const button = document.querySelector("button");
  button.click();
});
