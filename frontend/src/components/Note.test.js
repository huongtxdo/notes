import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  // 'render' method renders the components in a format that is suitable for tests w/o rendering them to the DOM
  render(<Note note={note} />)

  // 'screen' object accesses the rendered component
  // 'getByText' searches for an element that has the note content and ensure that it exists
  const element = screen.getByText(
    'Component testing is done with react-testing-library'
  )

  // 'screen' has method 'debug' that prints the HTML of a component to the terminal
  // screen.debug()
  //  screen.debug(element) will print a wanted element to console

  // 'expect' is not really needed because the test fails if 'getByText' doesn't find the element it's looking for
  expect(element).toBeDefined()
})

// We can also use CSS-selectors to find rendered elements by using 'querySelector' method of 'container' object
test('Another version of renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library 2',
    important: true,
  }

  const { container } = render(<Note note={note} />)

  // querySelector gets all className="note" elements
  const div = container.querySelector('.note')

  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library 2'
  )
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  const mockHandler = jest.fn() //event handler

  render(<Note note={note} toggleImportance={mockHandler} />)

  const user = userEvent.setup() // a session to interact with the rendered component
  // the test finds the button named 'make not important'...
  const button = screen.getByText('make not important')
  // ... and clicks
  await user.click(button)
  // if the button is found and the user clicks it exactly 1 time, the test is successful`
  expect(mockHandler.mock.calls).toHaveLength(1)
})
