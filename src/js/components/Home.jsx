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

  const taskToEdit = (itemToEdit) => {
    setEditedTask(itemToEdit.target.value);
  };

  const toggleTaskMarked = (index) => {
    const copyTodoList = [...todoList];
    copyTodoList[index].isDone = true;
    setTodoList(copyTodoList);
  };
  const removeItem = (itemToRemove) => {
    let updatedList = [...todoList];
    updatedList.splice(itemToRemove, 1);
    setTodoList(updatedList);
  };
  const handleMouseLeave = () => {
    setVisibleIndex(null);
  };

  const removeItems = () => {
    setTodoList([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setTodoList([
        ...todoList,
        {
          label: inputValue,
          isDone: false,
        },
      ]);
      setInputValue("");
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
                    borderBottom: task.isDone
                      ? "2.5px solid rgb(4, 86, 104)"
                      : "none",
                  }}
                  key={index}
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
      <button onClick={removeItems} className="btn btn-danger my-2">
        Clear All!{" "}
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
              onClick={() => {
                const updatedTodoList = [...todoList];
                updatedTodoList[currentTaskIndex].label = editedTask;
                setTodoList(updatedTodoList);
                setShowModal(false);
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
