import '@testing-library/jest-dom/extend-expect'

import {render} from '@testing-library/react'
import Button from '../../../components/button/button'

/**
 * Helpful variables
 * - When wanting to get styles: window.getComputedStyle(document.querySelector('button')).[color|background...]
 */

const lights = ["red", "amber", "green"]

test('It renders text', () => {
    const testColour = 'red'
    const testText = 'I am a button'
    // assignment: const { getByTestId } =
    render(<Button text={testText} lightColour={testColour} />)
    expect(document.querySelector('button').textContent).toBe(testText)
})

test('It renders all types of lights', () => {
    lights.forEach(light => {
        render(<Button text="hello" lightColour=`${light}` />)
        const className = document.querySelector('button').className
        const exists = className.indexOf(`trafficLight ${light}Light`) >= 0 ? true : false
        expect(exists).toBe(true)
    })
})

test('It fails when no text is passed in', () => {
    render(<Button lightColour="red" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})

test('It fails when no style colour is passed in', () => {
    render(<Button text="hello" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})

test('Should fail when a wrong value is passed in as a light colour', () => {
    render(<Button text="hello" lightColour="something else" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})