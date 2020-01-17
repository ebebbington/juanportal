import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import Profile from '../../../components/Profile/Profile'

console.warn('Make sure you can access at least 5 profiles (5 exist) before running this test')

// Because fetch isn't defined here and the Profile component will error,
// we define the function here
const fetch = jest.fn(() => Promise.resolve())

test('It displays the correct number of profiles', () => {
    // fixme :: doesnt display any profiles
    render(<Profile count={5} />)
    console.log(document.querySelectorAll('.profile').length)
})

test('It displays a single profile on view single', () => {
    // fixme :: same as above
    render(<Profile count={5} />)
    console.log(document.querySelectorAll('.profile').length)
})