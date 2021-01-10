import React from "react";
// import ReactDOM from 'react-dom'
import { getStylings } from "./util";
const styles = getStylings();

interface IProps {
  iconClass: string;
  text: string;
  clickHandler?: (event: React.MouseEvent) => void;
}

/**
 * @name Revealer
 *
 * @description
 * A single button element, that displays an icon that can be clicked.
 * On hover it will reveal extra text to accompany the icon,
 * for example, it could be a bar chart icon, that on hover displays
 * "See analytics"
 *
 * @example
 * import ... from ...
 * const Test = () => {
 *   const handleClick = (event) => {
 *     console.log('Someone clicked the Revealer!)
 *   }
 *   return (
 *     <Revealer iconClass="fa-chart" text="See Analytics" clickHandler={handleClick}/>
 *   )
 * }
 *
 * @param {string} iconClass The font awesome class name to determine the icon e.g. "fa-check" but not "fa fa-check"
 * @param {string} text The text to accompany the icon e.g. "See analytics"
 * @param {Function} clickHandler? Your own defined function to handle a click of the button. Passes back the event object
 */
const Revealer = ({ iconClass, text, clickHandler }: IProps): React.FC => {
  const defaultWidth = 63; // px

  const handleMouseEnter = (event: React.MouseEvent): void => {
    const buttonElem = event.target;
    const textElem = event.target.children[1];
    if (buttonElem && textElem) {
      const textWidth: number = textElem.offsetWidth;
      const newWidth: string = defaultWidth + textWidth + "px";
      buttonElem.style.width = newWidth;
    }
  };

  const handleMouseLeave = (event: React.MouseEvent): void => {
    const buttonElem: HTMLElement = event.target;
    if (buttonElem) {
      buttonElem.style.width = defaultWidth + "px";
    }
  };

  return (
    <button
      className={styles.revealerContainer}
      onMouseEnter={(event): void => handleMouseEnter(event)}
      onMouseLeave={(event): void => handleMouseLeave(event)}
      onClick={(event): void => clickHandler(event)}
    >
      <i className={`fa fa-3x ${iconClass}`}></i>
      <h2>{text}</h2>
    </button>
  );
};

export default Revealer;
