'use client'

import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const TaskList = ({ currentUserId, teamId }) => {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      setError("")
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")

        if (error) {
          throw new Error(error.message)
        }

        setTasks(data as any)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        setError("Error fetching tasks: " + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [teamId])

  const getStatusColor = (status: any) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const filterTasks = (status) => {
    return tasks.filter((task) => task.status === status)
  }

  const TaskCard = ({ task }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <Badge className={`${getStatusColor(task.status)} text-white`}>
            {task.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-4 w-4" />
            {new Date(task.due_date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {new Date(task.due_date).toLocaleTimeString()}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://avatar.vercel.sh/${task.assignee_id}`} />
              <AvatarFallback>{task.users?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{task.users?.email || 'Unassigned'}</span>
          </div>
          {task.status === 'completed' && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="todo">To Do</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <TabsContent value="all">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>
        <TabsContent value="todo">
          {filterTasks('todo').map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>
        <TabsContent value="in-progress">
          {filterTasks('in-progress').map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>
        <TabsContent value="completed">
          {filterTasks('completed').map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}

export default TaskList