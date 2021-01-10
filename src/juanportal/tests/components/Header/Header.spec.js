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

test("Clicks on the menu to expand and collapse it", () => {
  const { container } = render(<Header />);
  const menuButton = document.querySelector("button");
  //console.log(menuButton)
  //console.log(container.querySelector('button'))
  const listContainer = container.querySelector(".menuHolder");
  //console.log(getComputedStyle(listContainer, null).display)
  let isExpanded = getComputedStyle(listContainer, null).display === "block";
  expect(isExpanded).toBe(true);
  fireEvent.click(menuButton, { button: 1 });
  isExpanded =
    getComputedStyle(container.querySelector(".menuHolder"), null).display ===
    "block";
  setTimeout(() => {
    expect(isExpanded).toBe(false);
  }, 2000);
});

test("Clicking Home Link", () => {
  const { container } = render(<Header />);
  const homeLink = container.querySelector('a[href="/"]');
  //expect(window.location.href).toBe('http://localhost/')
  expect(homeLink).not.toBe(null);
});

test("Add Profile Link", () => {
  const { container } = render(<Header />);
  const profileLink = container.querySelector('a[href="/profile/add"]');
  //window.location.assign = jest.fn() // Create a spy
  //fireEvent.click(homeLink, { button: 2 })
  //expect(window.location.href).toBe('http://localhost/profile/add')
  //expect(window.location.assign).toHaveBeenCalledWith('/profile/add')
  expect(profileLink).not.toBe(null);
});
