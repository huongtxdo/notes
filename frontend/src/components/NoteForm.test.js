import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteForm from "./NoteForm";

test("<NoteForm /> updates parent state and calls onSubmit", async () => {
  const createNote = jest.fn();
  const user = userEvent.setup();

  render(<NoteForm createNote={createNote} />);

  const input = screen.getByRole("textbox");
  // if there are more than 1 'textbox', use getAllByRole
  // if there is placeholder, use getByPlaceholderText
  // if there is id='note-input', use container.querySelector('#note-input')
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form...");
  // if there're more than 1 'textbox', use user.type(inputs[0])
  await user.click(sendButton);

  expect(createNote.mock.calls).toHaveLength(1);
  expect(createNote.mock.calls[0][0].content).toBe("testing a form...");
});