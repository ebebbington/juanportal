/**
 * @name util.js
 * 
 * @description
 * The purpose of this file is to provide reusable functions
 * or actions to actions, that cna be shared across components
 * 
 * @method notify
 */
//--------------------------------------------------------------

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
export const notify = ((title: string, text: string, type: string) => {
    // Checking for an old script and removing it because prior to this, the body would just fill up
    // with script tags, so here it's just a cleanup job
    const oldNotifyScript = document.querySelector('script#notify')
    if (oldNotifyScript) {
        // remove
        oldNotifyScript.parentNode?.removeChild(oldNotifyScript)
    }
    const newNotiyScript = document.createElement("script");
    newNotiyScript.src = "/public/libs/vanilla-notify.min.js";
    newNotiyScript.id = 'notify'
    newNotiyScript.async = true;
    newNotiyScript.onload = (a: any) => {
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
    document.body.appendChild(newNotiyScript);
})

interface IJsonResponse {
    success: boolean,
    message: string,
    data: any
}
/**
 * @method fetchToApiAsJson
 * 
 * @description
 * Sends a HTTP request to the given url with the options if passed in,
 * converts the response to json and checks if the property success is true.
 * Resolves when the success is true and rejects when it isn't or if an error occured
 * 
 * @example
 * const url: '/some/url'
 * [const options: any = { method: 'DELETE' }]
 * fetchToApiAsJson(url, options).then((res) => {
 *  // res = the response from the API, and success is true
 * }).catch((err) => {
 *  // err is either the json response or error object.
 * })
 * 
 * @param {string} url Url to make the reuqest to
 * @param {object} options The key value pair of HTTP options 
 * 
 * @return {Promise<any>}
 */
 export const fetchToApiAsJson = (url: string, options: { [key: string]: any } = {}): Promise<any> => {
    console.log('[fetchToApiAsJson')
    console.log('URL: ' + url)
    console.log('Options: ')
    console.log(options)
    return new Promise((resolve, reject) => {
        fetch(url, options).then((response) => {
            return response.json()
        }).then((json: IJsonResponse) => {
            console.log(json)
            if (json.success) {
                resolve(json)
            }
            if (!json.success) {
                reject(json)
            }
        }).catch((err) => {
            reject(err)
        })
    })
}