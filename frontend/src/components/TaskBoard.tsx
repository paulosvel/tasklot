import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { useEffect } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const TaskBoard = ({ tasks, setTasks }) => {
  useEffect(() => {
    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      });
    });

    return () => {
      socket.off("taskUpdated");
    };
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);

    // Update the task status based on the new position
    const newStatus = result.destination.droppableId; // Assuming droppableId corresponds to status
    movedTask.status = newStatus;

    setTasks(updatedTasks);

    // Send the updated task to the backend
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${movedTask.id}`, movedTask);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="To-Do">
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.filter(task => task.status === "To-Do").map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided) => (
                  <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {task.title}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      {/* Repeat for other statuses like "In Progress" and "Done" */}
    </DragDropContext>
  );
};

export default TaskBoard;