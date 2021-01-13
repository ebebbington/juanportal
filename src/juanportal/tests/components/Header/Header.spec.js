import "@testing-library/jest-dom/extend-expect";

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Header from "../../../components/header/header";

// test('Rendering on pathname /', () => {
//     //global.window = { location: { pathname: '/profile/add' } }
//     //Object.assign(location, {pathname: '/profile/add'})
//     //window.location.pathname = '/profile/add'
//     window.history.pushState({}, 'Test Title', '/')
//     // window.location.pathname = '/profile/add'
//     render(<Header />)
//     // pathname
//     expect(global.window.location.pathname).toBe('/')
//     // list items
//     const listItems = document.querySelectorAll('ul li')
//     listItems.forEach((listItem) => {
//         expect(listItem.textContent).not.toBe('Home')
//     })
//     // title
//     const title = document.querySelector('h1 strong i').textContent
//     expect(title).toBe('Home')
//     window.history.pushState({}, '', '');
//     window.history.replaceState({}, "Test Title", "/");
// })
//
// test('Rendering on pathname /profile/add', () => {
//     window.history.pushState({}, 'Test Title', '/profile/add')
//     render(<Header />)
//     // url
//     expect(global.window.location.pathname).toBe('/profile/add')
//     // list items
//     const listItems = document.querySelectorAll('ul li')
//     listItems.forEach((listItem) => {
//         expect(listItem.textContent).not.toBe('Add Profile')
//     })
//     // title
//     const title = document.querySelector('h1 strong i').textContent
//     expect(title).toBe('Add Profile')
//     window.history.pushState({}, '', '');
//     window.history.replaceState({}, "Test Title", "/");
// })
//
// test('Rendering on pathname /profile/id/:id', () => {
//     window.history.pushState({}, 'Test Title', '/profile/id/65hfh88')
//     const { container } = render(<Header />)
//     const pathIsCorrect = window.location.pathname.indexOf('/profile/id') > -1 ? true : false
//     // pathname
//     expect(pathIsCorrect).toBe(true)
//     // title
//     const title = container.querySelector('h1 strong i').textContent
//     expect(title).toBe('View Profile')
//     window.history.pushState({}, '', '');
//     window.history.replaceState({}, "Test Title", "/");
// })

test("Title is as expected on initial render", () => {
  render(<Header />);
  const h1 = document.querySelector("h1");
  const text = h1.textContent;
  expect(text).toBe("Home");
});

test("Clicks on the menu to expand and collapse it", () => {
  const { container } = render(<Header />);
  const menuButton = document.querySelector("button");
  const listContainer = container.querySelector(".menuHolder");
  let isExpanded = getComputedStyle(listContainer, null).display === "block";
  let ariaButtonText = document.getElementById("header-button-label")
    .textContent;
  expect(isExpanded).toBe(true);
  expect(ariaButtonText).toBe("Close Sidebar");
  fireEvent.click(menuButton, { button: 1 });
  menuButton.click();
  isExpanded =
    getComputedStyle(document.querySelector(".menuHolder"), null).display ===
    "block";
  ariaButtonText = document.getElementById("header-button-label").textContent;
  expect(isExpanded).toBe(false);
});

test("Home Link HREF is correct", () => {
  const { container } = render(<Header />);
  const homeLink = container.querySelector('a[href="/"]');
  expect(homeLink).not.toBe(null);
});

test("Profile Link HREF is correct", () => {
  const { container } = render(<Header />);
  const profileLink = container.querySelector('a[href="/profile/add"]');
  expect(profileLink).not.toBe(null);
});
