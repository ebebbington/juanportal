import classes from './button.module.css'

export function getLightStylingByColour (lightColour) {
    const lightStyling =
    lightColour === 'green' ?
      classes.greenLight :
    lightColour === 'amber' ?
      classes.amberLight :
    lightColour === 'red' ?
      classes.redLight : false
    return lightStyling
}

export function getStylings () {
  return classes
}