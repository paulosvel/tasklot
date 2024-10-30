import { useState } from "react";
import axios from "axios";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks/`, {
      title,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task Description" />
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;