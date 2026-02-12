import TodoInput from "../components/TodoInput.tsx";

type HomePageProps = { onAdd: (text: string) => void };

function HomePage({ onAdd }: HomePageProps) {
  return (
    <div className="home-content">
      <h2>Welcome to Todo App</h2>
      <p>
        Manage your tasks efficiently with our simple and elegant todo
        application.
      </p>
      <TodoInput onAdd={onAdd} />
    </div>
  );
}

export default HomePage;
