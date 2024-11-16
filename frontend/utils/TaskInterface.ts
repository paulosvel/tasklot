interface TaskInterface {
  task: {
    id: string;
    title: string;
    description: string;
    status: string;
    due_date?: string;
    owner_id: string;
  };
  currentUserId: string;
}

export default TaskInterface;