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
    const handleNameChange = jest.fn()
    const wrapper = mount(<RegisterForm />)
    const event = {

        target: { value: 'New Value' }
    }
    wrapper.find('input#name').simulate('change', event)
    console.log(document.querySelector('form input#name'))
    expect(nameInput.value).toBe('New Value')
    expect(handleNameChange).toHaveBeenCalled()
})