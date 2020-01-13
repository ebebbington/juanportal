/*
* Flow Of Process
* 1. ReactDOM.render() is called, passing in a component class and optional parameters
* 2. Constructor is called, with the parameter holding passed in values
* 3. render() is called to display the component given the attached parent
* 4. componentDidMount() is called when the component is first rendered
* 5. Methods are called by the event handlers inside the components elements
* 6. When a method invokes `setState({})` the component updates, resulting in a call to `componentDidUpdate()`
* 7. The elements are re-rendered and will reapply their values e.g. element uses state prop as a classname,
*    that prop value was changed so when the element gets that value, it's the updated value. Get the updated
*    values inside the `componentDidUpdate()` method
* 8. .............
*/

import React from 'react'
import ReactDOM from 'react-dom';

// You can even use a BaseComponent if you wish
class BaseComponent extends React.Component {
    protected sayHello () {
        console.log('Hello!')
    }
}

interface IProps {
    exampleProp: boolean
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
class SomeClassComponent extends React.Component<IProps> {

    /**
     * Holds properties required by the component
     * 
     * @var {object}
     */
    public state: {
        test: string,
        isNice: boolean
    } = {
        test: 'Hello world!',
        isNice: false
    }

    /**
     * Description
     * 
     * @var {data type}
     */
    private exampleProp: boolean

    /**
     * @method Constructor
     * 
     * @description
     * Sets the states for the passed in props, and binds event handlers that are
     * called inside the render method
     * 
     * @param {props} props Description
     */
    constructor(props: any) {
        super(props);
        console.log('[constructor]')
        this.exampleProp = props.exampleProp
        this.handleClick = this.handleClick.bind(this)
    }

    /**
     * @method componentDidMount
     * 
     * @description
     * On first mount (render). Can check the passed in props to then do something
     * 
     * @return {void}
     */
    public componentDidMount (): void {
        console.log('[componentDidMount]')
        if (this.state.test === 'Hello world!') {
            this.setState({isNice: true})
        }
    }

    /**
     * @method componentDidUpdate
     * 
     * @description Is called when the component updated e.g. from a `setSate({})`
     * 
     * @example
     * this.setState({property: value})
     * 
     * @param prevProps
     * @param prevState
     * @param snapshot
     * 
     * @return {void}
     */
    public componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any) {
        console.log('[componentDidUpdate]')
        console.log('Showing the new state:')
        console.log(this.state)
    }

    private handleClick () {
        console.log('[handleClick')
    }

    /**
     * @method render
     * 
     * @description
     * This method is called when before the component mounts and after the constructor.
     * Handles the display of the HTML.
     * Re-renders when component state changes
     * 
     * @return
     */
    public render () {
        return (
            <div onClick={() => this.handleClick}>
                Hello world!
            </div>
        )
    }

}
ReactDOM.render(<SomeClassComponent exampleProp={true} />, document.getElementById('root'))
// or
export default SomeClassComponent