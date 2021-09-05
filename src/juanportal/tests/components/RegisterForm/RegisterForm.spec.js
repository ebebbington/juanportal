import "@testing-library/jest-dom/extend-expect";
import "whatwg-fetch";
import "setimmediate"

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import RegisterForm from "../../../components/RegisterForm/RegisterForm";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Simulate } from "react-dom/test-utils";
// import { getByText } from "@testing-library/dom";
// import { wait } from '@testing-library/dom'
configure({ adapter: new Adapter() });

test("It renders correctly", () => {
  render(<RegisterForm />);
  const elem = document.querySelector("form");
  const formExists = elem ? true : false;
  expect(formExists).toBe(true);
});

test("Name change", () => {
  //const handleNameChange = jest.fn()
  const { container } = render(<RegisterForm />);
  const event = {
    target: { value: "New Value" },
  };
  fireEvent.change(screen.getByTitle("Name"), event);
  //fireEvent.find('input#name').simulate('change', event)
  const name = container.querySelector("input#name").value;
  expect(name).toBe("New Value");
  //const test = wrapper.querySelector('input#name')
  //console.log(test)
  // expect(handleNameChange).toHaveBeenCalled()
});

test("Submitting with no name shows error (fails validation)", () => {
  //
});

test("Submitting with name > than 150 chars fails (fails validation)", () => {
  //
});

test("Submitting with description > 400 characters shows error (fails validation)", () => {
  //
});

test("Submitting file with ext that isnt [jpg, jpeg, png] errors (fails validation)", () => {
  //
});

test("Description change", () => {
  const { container } = render(<RegisterForm />);
  const event = {
    target: { value: "New Description" },
  };
  fireEvent.change(screen.getByTitle("Description"), event);
  const description = container.querySelector("input#description").value;
  expect(description).toBe("New Description");
});

test("Image Upload", () => {
  const { container } = render(<RegisterForm />);
  const file = new File(["(⌐□_□)"], "test-pic.png", { type: "image/png" });
  const imageInput = screen.getByTitle("Picture upload");
  Simulate.change(imageInput, { target: { files: [file] } });
  const filename = container.querySelector("i#filename").textContent;
  expect(filename).toBe("test-pic.png");
});

test("Image text should be '' when cancelling image selection that results in choosing no file", () => {
  const { container } = render(<RegisterForm />);
  const file = new File(["(⌐□_□)"], "", { type: "image/png" });
  const imageInput = screen.getByTitle("Picture upload");
  Simulate.change(imageInput, { target: { files: [file] } });
  const filename = container.querySelector("i#filename").textContent;
  expect(filename).toBe("");
});

// TODO
// test("Submit Profile should work as expected and save the profile", async () => {
//   const { container } = render(<RegisterForm />);
//   // name change
//   let event = {
//     target: { value: "New Value" },
//   };
//   fireEvent.change(screen.getByTitle("Name"), event);
//   // description change
//   event.target.value = "New Description";
//   fireEvent.change(screen.getByTitle("Description"), event);
//   // image upload
//   const file = new File(["(⌐□_□)"], "test-pic.png", { type: "image/png" });
//   const imageInput = screen.getByTitle("Picture upload");
//   Simulate.change(imageInput, { target: { files: [file] } });
//   // submit
//   const submitButton = document.querySelector("button");
//   //document.querySelector("form").dispatchEvent(new Event('submit'));
//   submitButton.click();
//   //Simulate.submit(container.querySelector("div > button"));
//   // assertions
//   await wait(() => {
//
//   })
//   const nameElements = container.querySelectorAll("h3");
//   let names = [];
//   nameElements.forEach((elem) => {
//     names.push(elem.textContent);
//   });
//   // TODO :: Will need to remove the user.
// });

// TODO  :: Cover rest of component
