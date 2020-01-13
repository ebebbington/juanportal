import React, { useState } from 'react'
//@ts-ignore
import styles from './thisfile.module.css'

/**
 * Interface for the parameters passed in
 */
interface IParams {
  someParam: string
  someOtherParam?: number
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
const SomeComponent = (IParams) => {

    const [myHook, setMyHook] = useState(0)

    return (
        <div>
            <button onClick={() => setMyHook(myHook + 1)}>
                Hello World! You click me {myHook} time(s)
            </button>
        </div>
    )
}