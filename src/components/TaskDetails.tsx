import React, { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../store/userStore";

const TaskDetails = ({ taskId }: { taskId: string }) => {
  const { currentUserId } = useUserStore();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);
      setTask(response.data);
    };
    fetchTask();
  }, [taskId]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
      title,
      description,
    });
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
            required
          />
          <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2">Update Task</button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 text-white rounded-md px-4 py-2">Cancel</button>
        </form>
      ) : (
        <>
          <h2>{task?.title}</h2>
          <p>{task?.description}</p>
          <p>Due Date: {task?.due_date}</p>
          <p>Status: {task?.status}</p>
          {currentUserId === task?.owner_id && (
            <button onClick={() => setIsEditing(true)} className="text-blue-600">Edit Task</button>
          )}
        </>
      )}
    </div>
  );
};

export default TaskDetails;