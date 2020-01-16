import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import Button from '../../components/button/button'

/**
 * Helpful variables
 * - When wanting to get styles: window.getComputedStyle(document.querySelector('button')).[color|background...]
 */

function renderButtonAndCheckClassName (lightColour) {
    const testColour = lightColour
    const testText = 'I am a button'
    const { getByTestId } = render(<Button text={testText} lightColour={testColour} />)
    const className = document.querySelector('button').className
    return className.indexOf(`trafficLight ${testColour}Light`) >= 0 ? true : false
}

test('It renders text', () => {
    const testColour = 'red'
    const testText = 'I am a button'
    const { getByTestId } = render(<Button text={testText} lightColour={testColour} />)
    expect(document.querySelector('button').textContent).toBe(testText)
})

test('It renders a red light', () => {
    expect(renderButtonAndCheckClassName('red')).toBe(true)
})

test('It rendered an amber light', () => {
    expect(renderButtonAndCheckClassName('amber')).toBe(true)
})

test('It renders a green light', () => {
    expect(renderButtonAndCheckClassName('green')).toBe(true)
})

test('It renders an anchor tag if specified', () => {
    render(<Button text="I am a button" lightColour="green" setAnchor={true} anchorHref="test" />)
    const exists = document.querySelector('a') ? true : false
    expect(exists).toBe(true)
})

test('It renders the correct href on an anchor tag', () => {
    render(<Button text="I am a button" lightColour="green" anchorHref="/test/url" setAnchor={true}/>)
    const href = document.querySelector('a').href
    const exists = href.indexOf('/test/url') >= 0 ? true : false
    expect(exists).toBe(true)
})

test('It renders a child', () => {
    render(<Button text="I am a button" lightColour="green" childClassName="fa fa-group"/>)
    const button = document.querySelector('button')
    const children = button.children
    const iTag = children[0]
    const pTag = children[1]
    expect(iTag.nodeName).toBe('I')
    expect(iTag.className).toBe('fa fa-group')
    expect(pTag.nodeName).toBe('P')
    expect(pTag.textContent).toBe('I am a button')
})