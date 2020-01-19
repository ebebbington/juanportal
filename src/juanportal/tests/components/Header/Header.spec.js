import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import Header from '../../../components/Header/Header'

test('Rendering on pathanme /', () => {
    //global.window = { location: { pathname: '/profile/add' } }
    //Object.assign(location, {pathname: '/profile/add'})
    //window.location.pathname = '/profile/add'
    window.history.pushState({}, 'Test Title', '/')
    // window.location.pathname = '/profile/add'
    render(<Header />)
    // pathnamr
    expect(global.window.location.pathname).toBe('/')
    // list items
    const listItems = document.querySelectorAll('ul li')
    listItems.forEach((listItem) => {
        expect(listItem.textContent).not.toBe('Home')
    })
    // title
    const title = document.querySelector('h1 strong i').textContent
    expect(title).toBe('Home')
})

test('Rendering on pathname /profile/add', () => {
    window.history.pushState({}, 'Test Title', '/profile/add')
    render(<Header />)
    // url
    expect(global.window.location.pathname).toBe('/profile/add')
    // list items
    const listItems = document.querySelectorAll('ul li')
    listItems.forEach((listItem) => {
        expect(listItem.textContent).not.toBe('Add Profile')
    })
    // title
    const title = document.querySelector('h1 strong i').textContent
    expect(title).toBe('Add Profile')
})

test('Rendering on pathname /profile/id/:id', () => {
    window.history.pushState({}, 'Test Title', '/profile/id/65hfh88')
    render(<Header />)
    const pathIsCorrect = window.location.pathname.indexOf('/profile/id') > -1 ? true : false
    // pathname
    expect(pathIsCorrect).toBe(true)
    // title
    const title = document.querySelector('h1 strong i').textContent
    expect(title).toBe('View Profile')
})

test('Clicks on the menu to expand and collapse it', () => {
    // fixme :: how to set screen width so we can test out the media queries?
    render(<Header />)
    const menuButton = document.querySelector('div button')
    const listContainer = document.querySelector('.menuHolder')
    console.log(getComputedStyle(listContainer, null).display) // some reaosn its displayed as block when it should be none
    let isExpanded = getComputedStyle(listContainer, null).display === 'none' ? false : true
    expect(isExpanded).toBe(false)
    menuButton.click()
    isExpanded = getComputedStyle(listContainer, null).display === 'none' ? false : true
    expect(isExpanded).toBe(true)
})