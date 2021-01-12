import React, {ReactElement, useState} from "react";
// import ReactDOM from 'react-dom'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dropdownStylings = require("./dropdown.module.css");

interface ILiData {
  text: string;
  checked: boolean;
  id?: string | number;
}
interface IProps {
  title: string;
  liData: Array<ILiData>;
  checkedHandler?: (data: {
    text: string;
    id?: string;
    checked: boolean;
  }) => void;
}

/**
 * @name Dropdown
 *
 * @description
 * Responsible for dropdown UI
 *
 * @example
 * import Dropdown from '../dropdown/dropdown'
 * const Test = () => {
 *   const dataToPopulateULWith = [{text: 'Simon', checked: true, id?: 1003}, {...}]
 *   const title = 'Friends'
 *   const handleCheck = ({text: string, id?: string, checked: boolean}) {
 *     console.log('A checkbox was modified! Here is the data of that list item:')
 *     console.log('The text: ' + text + '. Is it checked: ' + checked + '. The id for the data: ' + id)
 *   }
 *   return (
 *     <Dropdown title={title} liData={data} checkedHandler={handleCheck} />
 *   )
 * }
 *
 * @param {string} title Title to give the dropdown
 * @param {Array<{text: string, id?: string, checked: boolean}>} liData Data used to populate the list items, where `id` can be used to identify certain data
 * @param {Function} checkedHandler On change of input, calls this function passing in the text, checked, and id data should the calling component wish to do extra logic when data is changed
 */
const Dropdown = ({ title, liData, checkedHandler }: IProps): ReactElement => {
  // Just loop through the data provided to get the number of checked
  // items, to display this count on initial load
  let countOfChecked = 0;
  liData.forEach((data) => {
    if (data.checked) countOfChecked += 1;
  });

  const [listItems, setListItems] = useState(liData)
  const [selected, setSelected] = useState(countOfChecked);

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    console.log("[Dropdown] HandleChange")
    const text: string = event.currentTarget.value;
    const isChecked: boolean = event.currentTarget.checked;
    const id = event.currentTarget.dataset.id;
    const passBackData: {
      text: string;
      id?: string;
      checked: boolean;
    } = {
      text: text,
      id: id,
      checked: isChecked,
    };
    // Show how many are selected for this component
    setSelected(isChecked ? selected + 1 : selected - 1);
    const otherListItems = listItems.filter(item => item.text !== text)
    const newListItems = [...otherListItems, passBackData]
    setListItems(newListItems)
    // Then call passed in function to let them do anything they need with the data
    if (checkedHandler) {
      console.log('yes checked handler')
      checkedHandler(passBackData);
    }
  };

  return (
    <div className={dropdownStylings.dropdownContainer}>
      <p>{title}</p>
      <button
        id="dropdown-description"
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        title={`Open up the dropdown for ${title}`}
      >
        {selected} Selected
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdown-description">
        {listItems.map((data) => (
          <li key={data.text + Math.random().toString(36)}>
            <label>
              <input
                type="checkbox"
                defaultChecked={data.checked}
                onChange={(event): void => handleChange(event, )}
                data-id={data.id}
                value={data.text}
              ></input>
              {data.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
