import "@testing-library/jest-dom/extend-expect";
// import { Simulate } from "react-dom/test-utils";
import "setimmediate";

import React from "react";
import { render } from "@testing-library/react";
import Dropdown from "../../../components/dropdown/dropdown";

/**
 * Helpful variables
 * - When wanting to get styles: window.getComputedStyle(document.querySelector('button')).[color|background...]
 */

test("It renders the data passed in", () => {
  const dataToPopulateULWith = [
    { text: "Simon", checked: true, id: 1003 },
    { text: "James", checked: false },
  ];
  const title = "Friends";
  render(<Dropdown title={title} liData={dataToPopulateULWith} />);
  const elemTitle = document.querySelector("p").textContent;
  const dropdownButttonText = document.querySelector("button").textContent;
  const listItems = document.querySelectorAll("li > label > input");
  expect(elemTitle).toBe("Friends");
  expect(dropdownButttonText).toBe("1 Selected");
  expect(listItems.length).toBe(2);
  const friends = [];
  listItems.forEach((item) => {
    friends.push({
      text: item.value,
      checked: item.checked,
      id: item.dataset.id,
    });
  });
  expect(friends[0].text).toBe("Simon");
  expect(friends[0].checked).toBe(true);
  expect(friends[0].id).toBe("1003");
  expect(friends[1].text).toBe("James");
  expect(friends[1].checked).toBe(false);
  expect(friends[1].id).toBe(undefined);
});

test("It updates the text and checked value when an event is triggered", () => {
  const dataToPopulateULWith = [
    { text: "Simon", checked: true, id: 1003 },
    { text: "James", checked: false },
  ];
  const title = "Friends";
  render(<Dropdown title={title} liData={dataToPopulateULWith} />);
  const simonCheckbox = document.querySelector('input[data-id="1003"]');
  simonCheckbox.click();
  let dropdownButtonText = document.querySelector("button").textContent;
  expect(dropdownButtonText).toBe("0 Selected");
  expect(simonCheckbox.checked).toBe(false);
  const jamesCheckbox = document.querySelector('input[value="James"]');
  jamesCheckbox.click();
  dropdownButtonText = document.querySelector("button").textContent;
  expect(dropdownButtonText).toBe("1 Selected");
  expect(jamesCheckbox.checked).toBe(true);
});

test("It calls the change handler if passed in, and updates the selected text", () => {
  const dataToPopulateULWith = [
    { text: "Simon", checked: true, id: 1003 },
    { text: "James", checked: false },
  ];
  const title = "Friends";
  let passedBackData = false;
  const handler = (data) => {
    passedBackData = data;
  };
  render(
    <Dropdown
      title={title}
      liData={dataToPopulateULWith}
      checkedHandler={handler}
    />
  );
  const simonCheckbox = document.querySelector('input[data-id="1003"]');
  simonCheckbox.click();
  expect(passedBackData).toStrictEqual({
    checked: false,
    id: "1003",
    text: "Simon",
  });
});
