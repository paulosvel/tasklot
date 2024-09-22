import { create } from 'zustand';
import { fetchTasks, createTask, deleteTask, updateTask } from '../api/api';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface StoreState {
  tasks: Task[];
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  tasks: [],
  isLoggedIn: false,
  setIsLoggedIn: (loggedIn) => {
    set({ isLoggedIn: loggedIn });
  },
  fetchTasks: async () => {
    try {
      const response = await fetchTasks();
      set({ tasks: response.data });
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  },
  addTask: async (task) => {
    try {
      const response = await createTask(task.title, task.description);
      set((state) => ({ tasks: [...state.tasks, response.data] }));
    } catch (error) {
      console.error('Error adding task', error);
    }
  },
  removeTask: async (id) => {
    try {
      await deleteTask(id);
      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
    } catch (error) {
      console.error('Error removing task', error);
    }
  },
  updateTask: async (updatedTask) => {
    try {
      const { id, ...taskData } = updatedTask;
      const response = await updateTask(id, taskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? response.data : task
        ),
      }));
    } catch (error) {
      console.error('Error updating task', error);
    }
  },
}));