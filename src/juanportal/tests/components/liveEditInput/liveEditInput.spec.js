import "@testing-library/jest-dom/extend-expect";
// import { Simulate } from "react-dom/test-utils";
import "setimmediate";

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import LiveEditInput from "../../../components/liveEditInput/liveEditInput";

/**
 * Helpful variables
 * - When wanting to get styles: window.getComputedStyle(document.querySelector('button')).[color|background...]
 */

test("It displays the title, sets size by default", () => {
  // assignment: const { getByTestId } =
  const title = "Update Password";
  render(<LiveEditInput title={title} />);
  const domTitle = document.querySelector("p").textContent;
  const size = document.querySelector("input").size;
  const inputTitle = document.querySelector("input").title;
  const buttonTitle = document.querySelector("button").title;
  const buttonVal = document.querySelector("button").dataset.val;
  const buttonId = document.querySelector("button").dataset.id;
  expect(domTitle).toBe(title);
  expect(size).toBe(1);
  expect(inputTitle).toBe(title);
  expect(buttonTitle).toBe(title);
  expect(buttonVal).toBe("");
  expect(buttonId).toBe(undefined);
});

test("It sets the input value and size if passed in", () => {
  // assignment: const { getByTestId } =
  const title = "Update Password";
  const inputValue = "Myoldpassword";
  render(<LiveEditInput title={title} inputVal={inputValue} />);
  const input = document.querySelector("input");
  expect(input.size).toBe(inputValue.length);
  expect(input.value).toBe(inputValue);
  const button = document.querySelector("button");
  expect(button.dataset.val).toBe(inputValue);
});

test("Passed in a handler gets called when button pressed", () => {
  const title = "Update Password";
  const inputValue = "Myoldpassword";
  let handlerData = false;
  const handler = (data) => {
    handlerData = data;
  };
  render(
    <LiveEditInput title={title} inputVal={inputValue} saveHandler={handler} />
  );
  const button = document.querySelector("button");
  button.click();
  expect(handlerData).toStrictEqual({ id: undefined, val: "Myoldpassword" });
});

test("Id is set when passed in, and passed into the handler", () => {
  const title = "Update Password";
  const inputValue = "Myoldpassword";
  const id = "abcdefg";
  let handlerData = false;
  const handler = (data) => {
    handlerData = data;
  };
  render(
    <LiveEditInput
      title={title}
      inputVal={inputValue}
      id={id}
      saveHandler={handler}
    />
  );
  const button = document.querySelector("button");
  expect(button.dataset.id).toBe(id);
  button.click();
  expect(handlerData).toStrictEqual({ id: id, val: inputValue });
});

test("Input value and size are changed when value for input elem is changed", () => {
  const title = "Update Password";
  const inputValue = "Myoldpassword";
  render(<LiveEditInput title={title} inputVal={inputValue} />);
  const newPass = "My new password";
  const event = {
    target: { value: newPass },
  };
  fireEvent.change(document.querySelector("input"), event);
  const input = document.querySelector("input");
  expect(input.size).toBe(newPass.length);
  expect(input.value).toBe(newPass);
  const button = document.querySelector("button");
  expect(button.dataset.val).toBe(newPass);
});

test("Sets input size to 1 if input field is emptied", () => {
  const title = "Update Password";
  const inputValue = "Myoldpassword";
  render(<LiveEditInput title={title} inputVal={inputValue} />);
  const event = {
    target: { value: "" },
  };
  fireEvent.change(document.querySelector("input"), event);
  const input = document.querySelector("input");
  const button = document.querySelector("button");
  expect(input.size).toBe(1);
  expect(input.value).toBe("");
  expect(button.dataset.val).toBe("");
});

test("Should still work whn button is clicked but no handler passed in", () => {
  const title = "Update Password";
  const inputValue = "Myoldpassword";
  const id = "abc";
  render(<LiveEditInput title={title} inputVal={inputValue} id={id} />);
  const button = document.querySelector("button");
  button.click();
  const input = document.querySelector("input");
  expect(input.size).toBe(inputValue.length);
  expect(input.value).toBe(inputValue);
  expect(button.dataset.val).toBe(inputValue);
});
