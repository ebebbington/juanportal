import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render} from '@testing-library/react'
import LinkButton from '../../../components/button/linkButton'

test('It renders the correct href on an anchor tag', () => {
    render(<LinkButton text="I am a button" lightColour="green" href="/test/url"/>)
    const href = document.querySelector('a').href
    const exists = href.indexOf('/test/url') >= 0 ? true : false
    expect(exists).toBe(true)
})

test('It fails when no text is passed in', () => {
    render(<LinkButton lightColour="hello" href="jjjj" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})

test('It fails when no style colour is passed in', () => {
    render(<LinkButton text="hello" href="hello" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})

test('Should fail when a wrong value is passed in as a light colour', () => {
    render(<LinkButton text="hello" lightColour="something else" href="hello" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})

test('It should fail when no href is passed in', () => {
    render(<LinkButton text="hello" lightColour="hello" />)
    const elem = document.querySelector('button')
    expect(elem).toBe(null)
})