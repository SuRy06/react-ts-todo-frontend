import { type FormEvent, useRef, useState } from "react";
import "./TodoInput.css";
import type { TodoInputProps } from "../../types/index.ts";

function TodoInput({ onAdd }: TodoInputProps) {
  // Track the input text as the user types.
  const [text, setText] = useState("");
  // Keep a ref to the input so we can restore focus after submit.
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Ignore empty or whitespace-only submissions.
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
    // Focus the input field after adding a todo for better UX.
    inputRef.current?.focus();
  };

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        aria-label="Add a new task"
        autoComplete="off"
        name="todo"
        placeholder="Add a new task"
        value={text}
        // Update state as the user types.
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoInput;
