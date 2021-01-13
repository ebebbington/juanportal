import React, { useState, ReactElement, useEffect } from "react";
import styles from "./thisfile.module.css";

/**
 * Interface for the parameters passed in
 */
interface IParams {
  someParam: string;
  someOtherParam?: number;
}

/**
 * @name <ComponentName>
 *
 * @description
 * <Description of this component>
 *
 * @requires
 * <Does this component need an element to be rendered in? what is it's id?>
 *
 * @example
 * <example use of how to use this component, e.g. say we export it>
 * import ThisComponent from './ThatComponent'
 * ReactDOM.render(<ThisComponent <params> />, document....)
 *
 * @property {<data type>} propertyName Brief description
 *
 * @method <methodName> Brief description
 *
 * @param {<Interface name>} Parameters to be passed in
 *
 * @return {HTMLCollection}
 */
const SomeComponent: React.FC<IParams> = (IParams, children) => {
  /**
   * some description
   *
   * @var {data type}
   */
  const [myHook, setMyHook] = useState(0);

  /**
   * @method useEffect
   *
   * @description
   * Acts as both component did mount and component did update,
   * so this is called before rendering
   */
  useEffect(() => {
    if (!myHook) setMyHook(1);
  }, []);

  return (
    <div>
      <button onClick={() => setMyHook(myHook + 1)}>
        Hello World! You click me {myHook} time(s)
      </button>
    </div>
  );

  return children as ReactElement<any>;
};

export default SomeComponent;
