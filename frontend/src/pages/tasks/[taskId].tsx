import { useRouter } from "next/router";
import TaskDetails from "../../components/TaskDetails";

const TaskDetailPage = () => {
  const router = useRouter();
  const { taskId } = router.query; // Get the taskId from the URL

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {taskId ? <TaskDetails taskId={taskId} /> : <div>Loading...</div>}
      </div>
    </div>
  );
};

export default TaskDetailPage;