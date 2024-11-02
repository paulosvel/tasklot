import React, { useEffect, useState } from "react";
import axios from "axios";


const TaskDetails = ({ taskId, currentUserId }: TaskDetailsProps) => {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState("");
  const [taskComments, setTaskComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);
      setTask(response.data);
      setTaskComments(response.data.comments || []);
      setTitle(response.data.title);
      setDescription(response.data.description);
    };
    fetchTask();
  }, [taskId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments) return;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/comments`, {
        content: comments,
        task_id: Number(taskId)
      });
      setTaskComments([...taskComments, response.data] as any);
      setComments("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        title,
        description,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!task) return <div>Loading...</div>;

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
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add a comment"
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
        />
        <button type="submit" className="mt-2 bg-blue-600 text-white rounded-md px-4 py-2">
          Submit Comment
        </button>
      </form>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <ul className="space-y-2">
          {taskComments.map((comment) => (
            <li key={comment?.id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
              {comment?.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskDetails;