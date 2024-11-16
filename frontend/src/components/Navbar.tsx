'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import useUserStore from "../store/userStore"

const Navbar = ({ notifications }) => {
  const router = useRouter()
  const { currentUserEmail } = useUserStore()

  const handleSignOut = async () => {
    // await signOut()
    router.push('/login')
  }

  return (
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
                <span style={{ cursor: "pointer" }} onClick={handleSignOut}>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar