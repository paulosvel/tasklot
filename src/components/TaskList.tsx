// components/TaskList.tsx
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { supabase } from "../lib/supabaseClient";
import useUserStore from "../store/userStore";

const TaskList = () => {
  const { currentUserId } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
        if (error) throw error;
        setTasks(data);
      } catch (error) {
        setError("Failed to load tasks");
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [currentUserId]);

  if (isLoading) {
    return <div className="flex justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} currentUserId={currentUserId} />
      ))}
    </div>
  );
};

export default TaskList;
