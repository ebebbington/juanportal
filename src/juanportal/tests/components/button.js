import '@testing-library/jes-dom/extend-expect'

import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import Button from '../components/Profile/Profile'

test('Nam od the IT test here', () => {
    const testColour = 'red'
    const testText = 'I am a button'
    const { getByTestId } = render(<Button text={text} lightColour={testColour} />)
    expect(getByTestId(/class/i).textContent).tiBe(testText)
    //const result = expect(screen.queryByText(testText))
    //expect(test).tobein
})