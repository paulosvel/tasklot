import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient"; 
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TeamForm from "../components/TeamForm";
import Notifications from "../components/Notifications";
import TeamInviteForm from "../components/TeamInviteForm";
import useUserStore from "../store/userStore";

const Dashboard = ({ isAdmin, adminTeamId }: { isAdmin: boolean, adminTeamId: string }) => {
  const router = useRouter();
  const setCurrentUserId = useUserStore((state) => state.setCurrentUserId);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: user }: any = await supabase.auth.getUser();
      console.log(user);
      if (user) {
        setCurrentUserId(user.user.id); 
        console.log(user.user.id);
      } else {
        router.push("/login");
      }
    };

    fetchCurrentUser();
  }, [router, setCurrentUserId]);

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
          <div>
            <Notifications  />
            <TeamInviteForm teamId={adminTeamId} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TeamForm currentUserId={useUserStore.getState().currentUserId} />
            <div className="lg:col-span-1">
              <TaskForm />
            </div>
            <div className="lg:col-span-2">
              <TaskList  setTasks={setTasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
