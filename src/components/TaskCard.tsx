import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import TaskInterface from "../../utils/TaskInterface";
const TaskCard = ({ task, currentUserId }: TaskInterface) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.due_date);
  const [status, setStatus] = useState(task.status);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`, {
        title,
        description,
        due_date: dueDate,
        status: currentUserId === task.owner_id ? status : "Completed",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      {isEditing ? (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
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
          <input
            type="date"
            value={dueDate ? dueDate.split("T")[0] : ""}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
          />
          {currentUserId === task?.owner_id && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2">Update Task</button>
            <button type="button" onClick={handleCloseEdit} className="bg-gray-600 text-white rounded-md px-4 py-2">Cancel</button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <Link href={`/tasks/${task.id}`}>
                {task.title}
              </Link>
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              task.status === 'Completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
            }`}>
              {task.status}
            </span>
            <button onClick={handleEditClick} className="text-blue-600">Edit</button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
          {task.due_date && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TaskCard;