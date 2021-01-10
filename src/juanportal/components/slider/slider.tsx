import React, { ReactElement, useState } from "react";
// import ReactDOM from 'react-dom'
// import { notify, fetchToApiAsJson } from '../util'
import { getStylings } from "./util";
const sliderStylings = getStylings();

interface IProps {
  title: string;
  setChecked: boolean;
  id?: string;
  checkHandler?: (id: string, isChecked: boolean) => void;
}

/**
 * @name Slider
 *
 * @description
 * The slider component is reponsible for any markup that requires a slider (yes or no style)
 *
 * @example
 * import Slider from '../slider/slider'
 * const Test = () => {
 *   const checkHandler = (id: any, isChecked: boolean) => {}
 *   return (
 *     <Slider title="PIN" setChecked={true|false} id?={id} checkHandler={checkHandler} />
 *   )
 * }
 *
 * @param {string} title Title to accompany the slider with, a 1-2 word description
 * @param {boolean} setChecked Tell the component to check the input checkbox
 * @param {any} id An id for you toassociate the checked data with
 * @param {Function} checkHandler Handler for you to handle the on change of the input. Passes back the id if exists and the new checked status
 */
const Slider = ({
  title,
  setChecked,
  id,
  checkHandler,
}: IProps): ReactElement => {
  const [isChecked, setIsChecked] = useState(setChecked);
  const [iconClass, setIconClass] = useState(
    setChecked ? "fa-check" : "fa-cross"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleInputCheck = (event: React.MouseEvent): void => {
    const inputIsChecked = event.target.checked;
    const id = event.target.dataset.id || null;
    // First display our slider correctly
    if (inputIsChecked) {
      setIsChecked(true);
      setIconClass("fa-check");
    } else {
      setIconClass("fa-times");
      setIsChecked(false);
    }
    // Then send the data off for extra logic
    if (checkHandler) {
      // todo :: call loading utility function
      setIsLoading(true);
      checkHandler(id, inputIsChecked);
      // todo :: stop loading function
      setIsLoading(false);
    }
  };

  return (
    <div className={sliderStylings.sliderContainer}>
      <p>{title}</p>
      <label title={`Enable or disable for ${title}`}>
        <input
          disabled={isLoading}
          data-id={id}
          type="checkbox"
          tabIndex={0}
          defaultChecked={isChecked}
          onClick={(event): void => handleInputCheck(event)}
        ></input>
        <span className="round">
          <i className={`fa fa-sm slider-icon ${iconClass}`}></i>
        </span>
      </label>
    </div>
  );
};

export default Slider;
