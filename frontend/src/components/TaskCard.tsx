interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: string;
    due_date?: string;
  };
  onEdit?: () => void;
}
import React from "react";
import Link from "next/link";

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            <Link href={`/tasks/${task.id}`}>
              {task.title}
            </Link>
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            task.status === 'completed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
          }`}>
            {task.status}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {task.description}
        </p>
        
        {task.due_date && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
        
        <div className="pt-4">
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 
                     dark:hover:text-blue-300 font-medium"
          >
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;