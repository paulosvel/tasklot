import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useRouter } from "next/router";

const Dashboard = ({ currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [currentUser]);

  const [tasks, setTasks] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage and organize your tasks efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TaskForm currentUserId={currentUser?.id} />
            </div>
            <div className="lg:col-span-2">
              <TaskList tasks={tasks} setTasks={setTasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;