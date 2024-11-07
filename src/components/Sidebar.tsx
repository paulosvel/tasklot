'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Settings, Users } from "lucide-react"

const Sidebar = () => {
  const router = useRouter()

  const handleNavigateToTasks = () => {
    router.push('/dashboard/tasks')
  }

  const handleNavigateToTeams = () => {
    router.push('/dashboard/teams')
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tasklot</h1>
      </div>
      <nav className="mt-8">
        <a
          onClick={handleNavigateToTasks}
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 cursor-pointer"
        >
          <CheckCircle className="mr-3 h-5 w-5" />
          Tasks
        </a>
        <a
          onClick={handleNavigateToTeams}
          className="flex items-center px-4 py-2 mt-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
  )
}

export default Sidebar