'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabaseClient"
import useUserStore from "../store/userStore"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, CheckCircle, LogOut, Plus, Settings, Users, X } from "lucide-react"
import TaskForm from "../components/TaskForm"
import TaskList from "../components/TaskList"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import TeamManagement from "../components/TeamManagement"

export default function Dashboard({ isAdmin, adminTeamId }) {
  const router = useRouter()
  const { setCurrentUserId, setCurrentUserEmail, setTeamId, currentUserId, currentUserEmail, teamId } = useUserStore()
  const [teams, setTeams] = useState([])
  const [currentUserTeams, setCurrentUserTeams] = useState([])
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false)

  const handleNavigateToTasks = () => {
    router.push('/dashboard/tasks')
  }

  const handleNavigateToTeams = () => {
    router.push('/dashboard/teams')
  }

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
    // For brevity, I'm using placeholder data
    setTeams([{ id: 1, name: "Team A" }, { id: 2, name: "Team B" }])
    setCurrentUserTeams([{ team_id: 1, role: "member" }, { team_id: 2, role: "admin" }])
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

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tasklot</h1>
        </div>
        <nav className="mt-8">
          <a
            onClick={handleNavigateToTasks}
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
          >
            <CheckCircle className="mr-3 h-5 w-5" />
            Tasks
          </a>
          <a
            onClick={handleNavigateToTeams}
            className="flex items-center px-4 py-2 mt-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Users className="mr-3 h-5 w-5" />
            Teams
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 mt-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id}>{notification.message}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>
                        {currentUserEmail ? currentUserEmail.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{currentUserEmail}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
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
              <TabsContent value="all">
                <TaskList tasks={tasks} />
              </TabsContent>
              <TabsContent value="in-progress">
                <TaskList tasks={tasks.filter((task) => task.status === "in-progress")} />
              </TabsContent>
              <TabsContent value="completed">
                <TaskList tasks={tasks.filter((task) => task.status === "completed")} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}