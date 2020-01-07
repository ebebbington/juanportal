/**
 * @description
 * This file represents the use of CSS inside of a React
 * component when utilising a JSON file
 * 
 * @example
 * import styles from 'this/file.js'
 * ...
 *   <button style={styles.button}
 */

export default {
    button: {
        backgroundColor: 'red',
        color: 'blue',
        '&:hover': {
            color: 'yellow'
        }
    }
}