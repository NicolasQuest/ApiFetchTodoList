import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const lista = {
  listStyleType: "none",
  color: "aqua",
  paddingTop: "90px",
  fontSize: "1.5rem",
  textAlign: "center",
  paddingLeft: "10px",
};

//create your first component
const Home = () => {
  const [todoList, setTodoList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [visibleIndex, setVisibleIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  const handleMouseEnter = (index) => {
    setVisibleIndex(index);
  };

  const taskToEdit = (event) => {
    setEditedTask(event.target.value);
  };

  const toggleTaskMarked = async (index) => {
    const task = todoList[index];
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: task.label,
          is_done: !task.is_done,
        }),
      });
      getTodo();
    } catch (error) {
      console.error("No se pudo marcar como hecha:", error);
    }
  };

  //PARA eliminar x item
  const removeItem = async (itemToRemove) => {
    const task = todoList[itemToRemove];
    try {
      await deleteTask(task.id); // elimino del backend
      getTodo();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const handleMouseLeave = () => {
    setVisibleIndex(null);
  };

  const removeItems = () => {
    setTodoList([]);
    deleteUser();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendTask();
    }
  };

  //  FETCH API

  let getTodo = () => {
    fetch("https://playground.4geeks.com/todo/users/NicolasQuest")
      .then((response) => {
        if (!response.ok) {
          createUser();
          throw new Error(`error : ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTodoList(data.todos);
      })
      .catch((error) => {
        console.log("Looks like there was a problem, error: \n", error);
        alert("Looks like there was a problem, error: \n", error);
      });
  };

  useEffect(() => {
    getTodo();
  }, []);

  function sendTask() {
    let bodyData = {
      label: inputValue,
      is_done: false,
    };
    fetch("https://playground.4geeks.com/todo/todos/NicolasQuest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setInputValue("");
        getTodo();
      })
      .catch((error) => {
        console.error("Looks like there was a problem, error: \n", error);
      });
  }

  function deleteUser() {
    fetch("https://playground.4geeks.com/todo/users/NicolasQuest", {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`error : ${response.statusText}`);
        console.log(response);
        return response.text();
      })
      .then((data) => {
        console.log("Usuario eliminado:", data);
        setTodoList([]);
        return createUser(); //el return me funciona como un await (.then + return = await)
      })
      .then(() => {
        getTodo();
      })
      .catch((error) => {
        console.error("Looks like there was a problem, error: \n", error);
      });
  }
  function createUser() {
    return fetch("https://playground.4geeks.com/todo/users/NicolasQuest", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`error : ${response.statusText}`);
        return response.json();
      })
      .then((data) => {
        console.log("User created:", data);
      })
      .catch((error) => {
        console.error("Error while creating the user", error);
        alert("Looks like there was a problem, error: \n" + error);
      });
  }
  const deleteTask = async (taskId) => {
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${taskId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("error", response.status, response.statusText);
      return {
        error: { status: response.status, statusText: response.statusText },
      };
    }
  };

  return (
    <div className="text-center">
      <div className="py-2 d-flex justify-content-center">
        <input
          className="form-control mx-3"
          type="text"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ maxWidth: "500px", width: "100%", fontSize: "1.5rem" }}
        />
      </div>
      {todoList.length === 0 ? (
        <div className="d-flex justify-content-center">
          <div className="py-2 quesito">
            <h2 style={lista}>No Tasks yet</h2>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="py-2 quesito">
            <ul className="px-0 mx-0">
              {todoList.map((task, index) => (
                <div
                  style={{
                    borderBottom: task.is_done
                      ? "2.5px solid rgb(4, 86, 104)"
                      : "none",
                  }}
                  key={task.id}
                  className="d-flex align-self-center py-1"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <li
                    className="ps-2"
                    style={{
                      lista,
                    }}
                  >
                    {task.label}
                  </li>
                  {visibleIndex === index && (
                    <div className="ms-auto">
                      <span
                        style={{ fontSize: "1.1rem", cursor: "pointer" }}
                        className="pe-3"
                        onClick={() => {
                          setCurrentTaskIndex(index);
                          setShowModal(true);
                          setEditedTask(task.label);
                        }}
                      >
                        ✏️
                      </span>
                      <span
                        style={{ fontSize: "1rem", cursor: "pointer" }}
                        className=" pe-3"
                        onClick={() => {
                          removeItem(index);
                        }}
                      >
                        ❌
                      </span>
                      <span
                        style={{
                          fontSize: "1.1rem",
                          cursor: "pointer",
                        }}
                        className=" pe-3"
                        onClick={() => {
                          toggleTaskMarked(index);
                        }}
                      >
                        ✅
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
      <button onClick={removeItems} className="btn btn-danger my-2 mx-1">
        Clear All!
      </button>

      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Edit your task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              className="form-control"
              value={editedTask}
              onChange={taskToEdit}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => setShowModal(false)}>
              Close without saving
            </Button>
            <Button
              variant="success"
              onClick={async () => {
                const task = todoList[currentTaskIndex];
                const taskId = task.id;
                try {
                  await fetch(
                    `https://playground.4geeks.com/todo/todos/${taskId}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        label: editedTask,
                        is_done: !task.is_done,
                      }),
                    }
                  );
                  setShowModal(false);
                  getTodo();
                } catch (error) {
                  console.error("Failed to edit task", error);
                }
              }}
            >
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Home;
