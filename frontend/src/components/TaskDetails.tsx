import { useEffect, useState } from "react";
import axios from "axios";

const TaskDetails = ({ taskId }) => {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState("");
  
  useEffect(() => {
    const fetchTask = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);
      setTask(response.data);
    };
    fetchTask();
  }, [taskId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // Logic to submit comment
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Due Date: {task.due_date}</p>
      <p>Status: {task.status}</p>
      <form onSubmit={handleCommentSubmit}>
        <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add a comment" />
        <button type="submit">Submit Comment</button>
      </form>
      {/* Render comments here */}
    </div>
  );
};

export default TaskDetails;