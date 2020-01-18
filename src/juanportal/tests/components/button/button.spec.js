import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import Button from '../../../components/button/button'
import LinkButton from '../../../components/button/linkButton'

/**
 * Helpful variables
 * - When wanting to get styles: window.getComputedStyle(document.querySelector('button')).[color|background...]
 */

test('It renders text', () => {
    const testColour = 'red'
    const testText = 'I am a button'
    const { getByTestId } = render(<Button text={testText} lightColour={testColour} />)
    expect(document.querySelector('button').textContent).toBe(testText)
})

test('It renders a red light', () => {
    render(<Button text="hello" lightColour="red" />)
    const className = document.querySelector('button').className
    const exists = className.indexOf(`trafficLight redLight`) >= 0 ? true : false
    expect(exists).toBe(true)
})

test('It rendered an amber light', () => {
    render(<Button text="hello" lightColour="amber" />)
    const className = document.querySelector('button').className
    const exists = className.indexOf(`trafficLight amberLight`) >= 0 ? true : false
    expect(exists).toBe(true)
})

test('It renders a green light', () => {
    render(<Button text="hello" lightColour="green" />)
    const className = document.querySelector('button').className
    const exists = className.indexOf(`trafficLight greenLight`) >= 0 ? true : false
    expect(exists).toBe(true)
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