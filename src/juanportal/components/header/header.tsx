import React, { useState, useEffect, ReactElement } from "react";
const headerStyles = require("./header.module.css")
import { useMediaQuery } from "react-responsive";

interface INavLinks {
  title: string;
  url: string;
  display: boolean;
}

/**
 * @name Header
 *
 * @description
 * Responsible for the header UI
 *
 * @requires
 * Element with the ID of 'header'
 *
 * @example
 * N/A
 *
 * @property {string} title Title of the page
 * @property {string} url The current URL of the page
 * @property {boolean} menuExpanded Is the menu expanded?
 *
 * @method handleMenuClick handles the click of when the menu bar is clicked when it's displayed (mobile view)
 *
 * @return {HTMLCollection}
 */
const Header = (): ReactElement => {
  /**
   * Title of the current page
   *
   * @var {string}
   */
  const [title, setTitle] = useState("");

  /**
   * If the menu is expanded, to show certain UI elements
   *
   * @var {boolean}
   */
  const [menuExpanded, setMenuExpanded] = useState(
    useMediaQuery({ query: `(min-width: 990px` })
  );

  /**
   * URL of the current page
   *
   * @var {string}
   */
  const url: string = window.location.pathname;

  const navLinks: Array<INavLinks> = [
    {
      title: "Home",
      url: "/",
      display: true,
    },
    {
      title: "Add Profile",
      url: "/profile/add",
      display: true,
    },
    // {
    //     title: 'Chat',
    //     url: '/chat',
    //     display: true
    // },
    {
      title: "View Profile",
      url: "/profile/id/", // /profile/id/*
      display: false, // so we cna still set the title
    },
  ];

  /**
   * @method useEffect
   *
   * @description
   * Acts as both component did mount and component did update,
   * so this is called before rendering
   */
  useEffect(() => {
    // Set the title of the header with our list of links
    navLinks.forEach((navLink: INavLinks) => {
      // also check if our url STARTS with for urls such as /profile/id/{some dynamic data}
      if (url === navLink.url || url.indexOf(navLink.url) === 0)
        setTitle(navLink.title);
    });
  });

  /**
   * @method handleMenuClick
   *
   * @description
   * Handles the click of the menu to tell the component it is expanded
   *
   * @example
   * <button onClick={() => handleMenyClick}/>
   */
  const handleMenuClick = (): void => {
    // Opposite of what the value already is
    setMenuExpanded(!menuExpanded);
  };

  return (
    <div className={headerStyles.header}>
      <div>
        <button
          className="btn"
          onClick={handleMenuClick}
          type="button"
          aria-label="Sidebar"
          aria-labelledby="header-button-label"
        >
          <span id="header-button-label" hidden>
            {menuExpanded ? "Close Sidebar" : "Open Sidebar"}
          </span>
          <i className="fa fa-2x fa-bars" />
        </button>
        <div
          className={`${menuExpanded ? headerStyles.show : headerStyles.hide} ${
            headerStyles.navMenu
          } menuHolder`}
        >
          <ul>
            {navLinks.map((navLink: INavLinks) => {
              return (
                navLink.display && (
                  <li
                    className={
                      title === navLink.title ? headerStyles.selected : ""
                    }
                    key={navLink.title}
                  >
                    <a href={navLink.url}>{navLink.title}</a>
                  </li>
                )
              );
            })}
          </ul>
        </div>
      </div>
      <div className={headerStyles.titleHolder}>
        <h1>{title ? title : "Loading..."}</h1>
      </div>
    </div>
  );
};

export default Header;
