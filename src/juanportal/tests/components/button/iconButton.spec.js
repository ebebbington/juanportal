import '@testing-library/jest-dom/extend-expect'

import {render} from '@testing-library/react'
import IconButton from '../../../components/button/iconButton'

test('It renders a child', () => {
    render(<IconButton text="I am a button" lightColour="green" iconClass="fa fa-group" />)
    // const button = document.querySelector('button')
    // const children = button.children
    const iTag = document.querySelector('i')
    const pTag = document.querySelector('p')
    expect(iTag.nodeName).toBe('I')
    expect(iTag.className).toBe('fa fa-group')
    expect(pTag.nodeName).toBe('P')
    expect(pTag.textContent).toBe('I am a button')
})

test('It fails when no text is passed in', () => {
    render(<IconButton lightColour="hello" iconClass="hello" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})

test('It fails when no style colour is passed in', () => {
    render(<IconButton text="hello" iconClass="hello" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})

test('Should fail when a wrong value is passed in as a light colour', () => {
    render(<IconButton text="hello" iconClass="hello" lightColour="hello" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})

test('It should fail if no icon class is passed in', () => {
    render(<IconButton text="hello" lightColour="hello" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})