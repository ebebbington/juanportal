import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import RegisterForm from '../../../components/RegisterForm/RegisterForm'
import { shallow, mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

test('It renders correctly', () => {
    render(<RegisterForm />)
    const elem = document.querySelector('form')
    const formExists = elem ? true : false
    expect(formExists).toBe(true)
})

test('Name change', () => {
    //const handleNameChange = jest.fn()
    const { container } = render(<RegisterForm />)
    const event = {
        target: { value: 'New Value' }
    }
    fireEvent.change(screen.getByTitle('Name'), event)
    //fireEvent.find('input#name').simulate('change', event)
    const name = container.querySelector('input#name').value
    expect(name).toBe('New Value')
    //const test = wrapper.querySelector('input#name')
    //console.log(test)
   // expect(handleNameChange).toHaveBeenCalled()
})