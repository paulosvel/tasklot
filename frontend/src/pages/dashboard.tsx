'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabaseClient"
import useUserStore from "../store/userStore"
import TaskForm from "../components/TaskForm"
import TaskList from "../components/TaskList"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import TeamManagement from "../components/TeamManagement"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { signOut } from "../lib/auth"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Dashboard({ isAdmin, adminTeamId }) {
  const router = useRouter()
  const { setCurrentUserId, setCurrentUserEmail, currentUserId } = useUserStore()
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [currentView, setCurrentView] = useState("tasks") // State to track the current view

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: user } = await supabase.auth.getUser()
      if (user?.user) {
        setCurrentUserId(user.user.id)
        setCurrentUserEmail(user.user.email || null)
        fetchUserData(user.user.id)
      } else {
        router.push("/login")
      }
    }

    fetchCurrentUser()
  }, [router, setCurrentUserId, setCurrentUserEmail])

  const fetchUserData = async (userId) => {
    // Fetch teams, tasks, and notifications here
    setTasks([
      { id: 1, title: "Complete project proposal", description: "Draft and finalize the project proposal for client review", status: "in-progress", due_date: "2023-06-15T14:00:00Z", assignee_id: "user1", assignee_email: "user1@example.com" },
      { id: 2, title: "Review code changes", description: "Review and approve pending pull requests", status: "todo", due_date: "2023-06-16T10:00:00Z", assignee_id: "user2", assignee_email: "user2@example.com" },
      { id: 3, title: "Update documentation", description: "Update user manual with new features", status: "completed", due_date: "2023-06-14T17:00:00Z", assignee_id: "user3", assignee_email: "user3@example.com" },
    ])
    setNotifications([
      { id: 1, message: "You've been invited to Team C" },
      { id: 2, message: "New task assigned: Client meeting preparation" },
    ])
  }

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask])
    setIsTaskFormOpen(false)
  }

  const handleNavigateToTeams = () => {
    setCurrentView("teams") // Set the current view to teams
  }

  const handleNavigateToTasks = () => {
    setCurrentView("tasks") // Set the current view to tasks
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onNavigateToTeams={handleNavigateToTeams} onNavigateToTasks={handleNavigateToTasks} />
      <main className="flex-1 overflow-y-auto">
        <Navbar notifications={notifications} />
        {/* Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-end items-center mb-4">
                <Sheet open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
                  <SheetTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Create New Task</SheetTitle>
                      <SheetDescription>
                        Add a new task to your list.
                      </SheetDescription>
                    </SheetHeader>
                    <TaskForm onTaskCreated={handleTaskCreated} />
                  </SheetContent>
                </Sheet>
              </div>
              {currentView === "tasks" ? (
                <TabsContent value="all">
                  <TaskList tasks={tasks} />
                </TabsContent>
              ) : (
                <TabsContent value="teams">
                  <TeamManagement />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}