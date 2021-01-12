import "@testing-library/jest-dom/extend-expect";
import { Simulate } from "react-dom/test-utils";

import React from "react";
import { fireEvent, render, screen } from '@testing-library/react'
import Slider from "../../../components/slider/slider";

/**
 * Helpful variables
 * - When wanting to get styles: window.getComputedStyle(document.querySelector('button')).[color|background...]
 */

test("It should set all the props", () => {
  // assignment: const { getByTestId } =
  render(<Slider title="My title :)" setChecked={true} id={"2345"} />)
  const title = document.querySelector("p").textContent
  expect(title).toBe("My title :)")
  const label = document.querySelector("label")
  expect(label.title).toBe("Enable or disable for My title :)")
  const input = document.querySelector("input")
  expect(input.disabled).toBe(false)
  expect(input.dataset.id).toBe("2345")
  expect(input.checked).toBe(true)
  const icon = document.querySelector("i")
  expect(icon.className).toBe("fa fa-sm slider-icon fa-check")
});

test("It should update the state when checking the checkbox", () => {
  let handlerData = false
  const handler = (id, wasChecked) => {
    handlerData = {
      id,
      wasChecked
    }
  }
  render(<Slider title="My title :)" setChecked={true} id={"2345"} checkHandler={handler} />);
  const title = document.querySelector("p").textContent
  expect(title).toBe("My title :)")
  const label = document.querySelector("label")
  expect(label.title).toBe("Enable or disable for My title :)")
  const input = document.querySelector("input")
  expect(input.disabled).toBe(false)
  expect(input.dataset.id).toBe("2345")
  expect(input.checked).toBe(true)
  const icon = document.querySelector("i")
  expect(icon.className).toBe("fa fa-sm slider-icon fa-check")
  input.click()
  expect(handlerData).toStrictEqual({ id: "2345", wasChecked: false}) // meaning it is now unchecked
  expect(title).toBe("My title :)")
  expect(label.title).toBe("Enable or disable for My title :)")
  expect(input.disabled).toBe(false)
  expect(input.dataset.id).toBe("2345")
  expect(input.checked).toBe(false)
  expect(icon.className).toBe("fa fa-sm slider-icon fa-times")
});

test("It should update the state when un-checking the checkbox", () => {
  let handlerData = false
  const handler = (id, wasChecked) => {
    handlerData = {
      id,
      wasChecked
    }
  }
  render(<Slider title="My title :)" setChecked={false} id={"2345"} checkHandler={handler} />);
  const title = document.querySelector("p").textContent
  expect(title).toBe("My title :)")
  const label = document.querySelector("label")
  expect(label.title).toBe("Enable or disable for My title :)")
  const input = document.querySelector("input")
  expect(input.disabled).toBe(false)
  expect(input.dataset.id).toBe("2345")
  expect(input.checked).toBe(false)
  const icon = document.querySelector("i")
  expect(icon.className).toBe("fa fa-sm slider-icon fa-cross")
  input.click()
  expect(handlerData).toStrictEqual({ id: "2345", wasChecked: true}) // meaning it is now unchecked
  expect(title).toBe("My title :)")
  expect(label.title).toBe("Enable or disable for My title :)")
  expect(input.disabled).toBe(false)
  expect(input.dataset.id).toBe("2345")
  expect(input.checked).toBe(true)
  expect(icon.className).toBe("fa fa-sm slider-icon fa-check")
});

test("It should still check and uncheck when no handler is passed in", () => {
  render(<Slider title="My title :)" setChecked={false} id={"2345"} />);
  const title = document.querySelector("p").textContent
  expect(title).toBe("My title :)")
  const label = document.querySelector("label")
  expect(label.title).toBe("Enable or disable for My title :)")
  const input = document.querySelector("input")
  expect(input.disabled).toBe(false)
  expect(input.dataset.id).toBe("2345")
  expect(input.checked).toBe(false)
  const icon = document.querySelector("i")
  expect(icon.className).toBe("fa fa-sm slider-icon fa-cross")
  input.click()
  expect(title).toBe("My title :)")
  expect(label.title).toBe("Enable or disable for My title :)")
  expect(input.disabled).toBe(false)
  expect(input.dataset.id).toBe("2345")
  expect(input.checked).toBe(true)
  expect(icon.className).toBe("fa fa-sm slider-icon fa-check")
})