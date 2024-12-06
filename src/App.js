import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import { FaCheckCircle, FaUndo, FaPlus, FaTrashAlt, FaRegCalendarPlus } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          !task.completed && task.time && task.time <= now
            ? { ...task, completed: true }
            : task
        )
      );
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const handleAddTask = () => {
    if (!taskName) {
      toast.error('Task name is required.');
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName,
      time: taskTime ? new Date(taskTime).toISOString() : null,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setModalOpen(false);
    setTaskName('');
    setTaskTime('');
    toast.success('Task added successfully!');
  };

  const handleTaskComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
    toast.info('Task marked as complete!');
  };

  const handleUnmarkTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: false } : task
      )
    );
    toast.info('Task unmarked as complete!');
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast.success('Task deleted!');
  };

  return (
    <div className="app">
      <header>
        <h1> <FaRegCalendarPlus />To-Do List</h1>
        <button className="add-task-btn" onClick={() => setModalOpen(true)}>
          <FaPlus /> Add Task
        </button>
      </header>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <div className="task-info">
              <h2>{task.name}</h2>
              {task.time && (
                task.completed ? (
                  <p>Completed at: {new Date(task.time).toLocaleString()}</p>
                ) : (
                  <p>Scheduled for: {new Date(task.time).toLocaleString()}</p>
                )
              )}
            </div>

            <div className="task-actions">
              {!task.completed ? (
                <button
                  className="mark-btn"
                  onClick={() => handleTaskComplete(task.id)}
                >
                  <FaCheckCircle /> Mark Complete
                </button>
              ) : (
                <button
                  className="unmark-btn"
                  onClick={() => handleUnmarkTask(task.id)}
                >
                  <FaUndo /> Unmark
                </button>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(task.id)}
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add Task</h2>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="datetime-local"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleAddTask}>Add Task</button>
          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default App;
