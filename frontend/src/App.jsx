
import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [taskTitle, setTaskTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')


// Dashboard statistics
const totalTasks = tasks.length

const completedTasks = tasks.filter(
  (task) => task.completed
).length

const pendingTasks = tasks.filter(
  (task) => !task.completed
).length

const highPriorityTasks = tasks.filter(
  (task) => task.priority === 'High'
).length  

// Create filtered tasks
  const filteredTasks = tasks.filter((task) => {
  const matchesFilter =
    filter === 'All' ||
    (filter === 'Pending' && !task.completed) ||
    (filter === 'Completed' && task.completed)

  const matchesSearch = task.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase())

  return matchesFilter && matchesSearch
})

  // Fetch tasks when the page loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }

        const data = await response.json()
        setTasks(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault()

    if (!taskTitle.trim()) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: taskTitle,
          priority: priority
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task')
      }

      setTasks((previousTasks) => [data.task, ...previousTasks])
      setTaskTitle('')
      setPriority('Medium')
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }

  // Complete or undo a task
  const handleCompleteTask = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !completed
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task')
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === id ? data.task : task
        )
      )
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }

  // Change task priority
  const handlePriorityChange = async (id, newPriority) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priority: newPriority
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update priority')
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === id ? data.task : task
        )
      )
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete task')
      }

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task._id !== id)
      )
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Task Management</h1>
        <p>Manage your tasks efficiently.</p>
      </header>

      <main>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Enter a new task..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button type="submit">Add Task</button>
        </form>

        {error && <p className="error">{error}</p>}

          {/* Dashboard Statistics */}
          <section className="dashboard">

            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p>{totalTasks}</p>
            </div>

            <div className="stat-card completed-card">
              <h3>Completed</h3>
              <p>{completedTasks}</p>
            </div>

            <div className="stat-card pending-card">
              <h3>Pending</h3>
              <p>{pendingTasks}</p>
            </div>

            <div className="stat-card priority-card">
              <h3>High Priority</h3>
              <p>{highPriorityTasks}</p>
            </div>

          </section>

        <section className="task-list">
          <h2>My Tasks ({tasks.length})</h2>
          <input
              type="text"
              className="task-search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          <div className="task-filters">
            <button onClick={() => setFilter('All')}>
              All
            </button>

            <button onClick={() => setFilter('Pending')}>
              Pending
            </button>

            <button onClick={() => setFilter('Completed')}>
              Completed
            </button>
          </div>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>
              No tasks yet. Add your first task!</p>
          ) : filteredTasks.length === 0 ? (
  <p className="empty-message">
    No tasks match your search or selected filter.
  </p> ) : (
            filteredTasks.map((task) => (
              <div className="task-item" key={task._id}>
                <span className={task.completed ? 'completed' : ''}>
                  {task.title}
                </span>

                <span className={`priority priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>

                <select
                  value={task.priority}
                  onChange={(e) =>
                    handlePriorityChange(task._id, e.target.value)
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <button
                  onClick={() =>
                    handleCompleteTask(task._id, task.completed)
                  }
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>

                <button onClick={() => handleDeleteTask(task._id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App
