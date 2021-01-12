import React, { ReactElement } from "react";
// import ReactDOM from 'react-dom'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./revealer.module.css");

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
const Revealer = ({ iconClass, text, clickHandler }: IProps): ReactElement => {
  const defaultWidth = 77; // px

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const buttonElem = event.currentTarget;
    buttonElem.style.width = "100%";
  };

  const handleMouseLeave = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const buttonElem = event.currentTarget;
    buttonElem.style.width = defaultWidth + "px";
  };

  const handleButtonClick = (event: React.MouseEvent): void => {
    if (clickHandler) {
      clickHandler(event);
    }
  };

  return (
    <button
      className={styles.revealerContainer}
      onMouseEnter={(event): void => handleMouseEnter(event)}
      onMouseLeave={(event): void => handleMouseLeave(event)}
      onClick={(event): void => handleButtonClick(event)}
    >
      <i className={`fa fa-3x ${iconClass}`}></i>
      <h2>{text}</h2>
    </button>
  );
};

export default Revealer;
