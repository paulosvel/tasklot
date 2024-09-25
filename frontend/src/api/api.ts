// lib/api.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', // Base URL of the FastAPI backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptors to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, logging out...');
      // Optionally, you could log the user out here or redirect to login
    }
    return Promise.reject(error);
  }
);

// Define API functions for authentication, tasks, etc.

// Authentication
export const login = async (email: string, password: string) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const register = async (email: string, password: string, name: string) => {
  return axiosInstance.post('/auth/register', { email, password, name });
};

export const logout = async () => {
  return axiosInstance.post('/auth/logout');
};

// Task Management
export const fetchTasks = async () => {
  return axiosInstance.get('/tasks');
};

export const createTask = async (title: string, description: string, priority: string, dueDate: string, assignee: string) => {
  return axiosInstance.post('/tasks', { title, description, priority, dueDate, assignee });
};

export const updateTask = async (id: number, data: { title: string; description: string; completed: boolean }) => {
  return axiosInstance.put(`/tasks/${id}`, data);
};

export const deleteTask = async (id: number) => {
  return axiosInstance.delete(`/tasks/${id}`);
};

export const createTeam = async (name: string) => {
  return axiosInstance.post('/teams', { name });
};

export const inviteToTeam = async (teamId: number, inviteData: { email: string; role: string }) => {
  return axiosInstance.post(`/teams/${teamId}/invite`, inviteData);
};

// New API function to fetch user teams
export const getUserTeams = async () => {
  const response = await axiosInstance.get('/teams');
  return response.data;
};