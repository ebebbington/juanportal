import React from 'react'
import ReactDOM from 'react-dom'

/**
 * @class BaseComponent
 * 
 * @extends React.Component
 * 
 * @description
 * The base component every other component should extend.
 * This holds methods available to all components such as
 * the `notifier`
 * 
 * @method notify Display a notification into the view
 * 
 * @example
 * import BaseComponent from './BaseComponent'
 * class MyComponent extends BaseComponent {}
 */
class BaseComponent extends React.Component {


    constructor (props: any) {
        super(props)
    }

    /**
     * @method notify
     * 
     * @description
     * Makes a call to the vNotify library to access it's functions,
     * then calls them using the passed in parameters.
     * The reason for this implementation, was because I wanted a notifier,
     * and wanted it available to all components (reusable code).
     * Another reason 'why' this is implemented this way, is because below
     * if the only way i've found to utilise a library e.g. in a normal JS file
     * you could just call `vNotify` if the script is included in the HTML, but because 
     * this is a server-side file, and a JSX component, it has no knowledge
     * of that library, so we have to generate it ourselves and display
     * it in the DOM
     * 
     * @todo Remove the old script tag from the BODY and not the head
     * (because our main one is in the head, but the generated ones are in the body)
     * before adding a new one
     * 
     * @example
     * // Undynamically
     * const title = 'Image'
     * const text = 'Does not meet the required extension criteria'
     * this.notify(title, text, type)
     * // Dynamically (after say, a HTTP request fetch)
     * const title = 'Image' // we've just send a request to upload an image
     * const text = json.message
     * const type = json.success ? 'success' : 'error'
     * this.notify(title, text, type)
     * 
     * @param {string} title The title to give the notification e,g 'Profile Register'
     * @param {string} text  The body text to accompany the title e.g. 'Succeeded!'
     * @param {string} type  The type of notification e.g. 'error', following are supported: success|error|warning|info|notify
     * 
     * @return {void}
     */
    protected notify (title: string, text: string, type: string): void {
        const script = document.createElement("script");
        script.src = "/public/libs/vanilla-notify.min.js";
        script.async = true;
        script.onload = (a: any) => {
            console.log('script loaded')
            console.log(a)
            if (type === 'success')
                //@ts-ignore
                vNotify.success({text: text, title: title})
            if (type === 'warning')
                //@ts-ignore
                vNotify.warning({text: text, title: title})
            if (type === 'error')
                //@ts-ignore
                vNotify.error({text: text, title: title})
            if (type === 'info')
                //@ts-ignore
                vNotify.info({text: text, title: title})
            if (type === 'notify')
                //@ts-ignore
                vNotify.notify({text: text, title: title})
            // or
            // window.vNotify.[...]
        }
        document.body.appendChild(script);
    }

}

export default BaseComponent