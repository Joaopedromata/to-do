import "./App.css";
import { useState, useEffect } from "react";
import axios from 'axios'

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (filter === "all") {
      axios.get("http://localhost:3333/tasks")
        .then((response) => {
          setTasks(response.data)
        })
        .catch((error) => console.log(error))
      return
    }
    if (filter === "pending") {
      axios.get("http://localhost:3333/tasks/pending")
        .then(response => {
          setTasks(response.data)
        })
        .catch(error => console.log(error))
      return
    }

    if (filter === "completed") {
      axios.get("http://localhost:3333/tasks/completed")
        .then(response => {
          setTasks(response.data)
        })
        .catch(error => console.log(error))
      return
    }
  }, [filter])

  function addTask(event) {
    event.preventDefault();


    if (inputValue.trim() === "") {
      return;
    }

    axios.post("http://localhost:3333/tasks", { name: inputValue })
      .then((response) => {
        setTasks([ ...tasks, response.data ])
      })
      .catch((error) => {
        console.log(error)
      })

    setInputValue("");
  }

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function deleteTask(id) {
    axios.delete("http://localhost:3333/tasks/" + id)
      .then(() => {
        const filteredTasks = tasks.filter((task) => task.id !== id);
        setTasks(filteredTasks);
      })
      .catch((error) => console.log(error))

  }

  function completeTask(id) {
    axios.patch('http://localhost:3333/tasks/' + id + '/completed')
    .then(response => {
      const newTasks = tasks.map((task) => {
        if (task.id === id) {
          return response.data
        }

        return task
      })

      setTasks(newTasks)
    })
    .catch(error => console.log(error))
  }

  return (
    <div className="container">
      <form className="form" onSubmit={(event) => addTask(event)}>
        <input
          placeholder="Nova Tarefa"
          onChange={(event) => handleChange(event)}
          value={inputValue}
        />
        <button>Nova Tarefa</button>
      </form>

      <div className="filters">
        <button
          className={filter === "all" ? "selected" : ""}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
        <button
          className={filter === "pending" ? "selected" : ""}
          onClick={() => setFilter("pending")}
        >
          Pendentes
        </button>
        <button
          className={filter === "completed" ? "selected" : ""}
          onClick={() => setFilter("completed")}
        >
          Completas
        </button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => completeTask(task.id)}
            />
            <span>{task.name}</span>
            <button onClick={() => deleteTask(task.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
