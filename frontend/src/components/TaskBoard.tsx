import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { useEffect } from "react";
import io from "socket.io-client";
import TaskCard from "./TaskCard";
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
    movedTask.status = result.destination.droppableId; // Update the task status based on the new position
    updatedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(updatedTasks);

    // Send the updated task to the backend
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${movedTask.id}`, movedTask);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="To-Do">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-bold">To-Do</h2>
            <ul>
              {tasks.filter(task => task.status === "To-Do").map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
            </ul>
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <Droppable droppableId="Completed">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 border border-green-500 rounded-lg mt-4">
            <h2 className="text-xl font-bold">Completed</h2>
            <ul>
              {tasks.filter(task => task.status === "Completed").map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
            </ul>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskBoard;