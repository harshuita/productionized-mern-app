import { useEffect, useState } from "react";

const API_URL =`${import.meta.env.VITE_API_URL}/api/tasks`;;

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const fetchTasks = async () => {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (!title.trim()) return;

        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title
            })
        });

        setTitle("");
        fetchTasks();
    };

    const toggleTask = async (task) => {
        await fetch(`${API_URL}/${task._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: task.title,
                completed: !task.completed
            })
        });

        fetchTasks();
    };

    const deleteTask = async (id) => {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        fetchTasks();
    };

    return (
        <div>
            <h1>Task Manager</h1>

            <input
                type="text"
                placeholder="Enter a task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <button onClick={addTask}>Add Task</button>

            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        {task.title} —{" "}
                        {task.completed ? "Completed" : "Pending"}

                        <button onClick={() => toggleTask(task)}>
                            Toggle
                        </button>

                        <button onClick={() => deleteTask(task._id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;