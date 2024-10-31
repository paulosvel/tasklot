import { useEffect, useState } from "react";
import axios from "axios";

const TaskDetails = ({ taskId }) => {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState("");
  const [taskComments, setTaskComments] = useState([]);
  
  useEffect(() => {
    const fetchTask = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);
      setTask(response.data);
      setTaskComments(response.data.comments || []); // Assuming comments are part of the task data
    };
    fetchTask();
  }, [taskId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comments) return;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/comments`, {
        content: comments,
        task_id: Number(taskId)
      });
      setTaskComments([...taskComments, response.data] as any); // Add the new comment to the state
      setComments(""); // Clear the input
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Due Date: {task.due_date}</p>
      <p>Status: {task.status}</p>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add a comment"
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button type="submit" className="mt-2 bg-blue-600 text-white rounded-md px-4 py-2">
          Submit Comment
        </button>
      </form>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <ul className="space-y-2">
          {taskComments.map((comment) => (
            <li key={comment.id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
              {comment.text} {/* Assuming comment has a 'text' property */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskDetails;