import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import withAuth from "../utils/withAuth";

const Dashboard = () => {
  return (
    <div>
      <h1>Task Dashboard</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
};

export default withAuth(Dashboard);