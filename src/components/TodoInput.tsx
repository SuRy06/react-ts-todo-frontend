import { type FormEvent, useRef, useState } from "react";
import "./TodoInput.css";
import type { TodoInputProps } from "../types/index.ts";

function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
    // Focus the input field after adding a todo for better UX
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
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoInput;
