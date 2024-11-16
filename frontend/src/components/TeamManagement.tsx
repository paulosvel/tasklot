'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabaseClient"
import useUserStore from "../store/userStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, UserPlus, CheckCircle } from "lucide-react"
import TeamCalendar from "./TeamCalendar"
import TeamChat from "./TeamChat"

const TeamManagement = () => {
  const router = useRouter()
  const { currentUserId, teamId, setTeamId, teams, setTeams } = useUserStore()
  const [newTeamName, setNewTeamName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchTeams = async () => {
      if (currentUserId) {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("admin_id", currentUserId)

        if (error) {
          console.error("Error fetching teams:", error)
          setError("Failed to load teams")
        } else {
          setTeams(data)
        }
      }
    }

    fetchTeams()
  }, [currentUserId, setTeams])

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert([{ name: newTeamName, admin_id: currentUserId }])
        .select()

      if (teamError) {
        setError("Error creating team")
        console.error("Error creating team:", teamError)
        return
      }

      const teamId = teamData[0].id
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([{ team_id: teamId, user_id: currentUserId, role: "admin" }])

      if (memberError) {
        setError("Error adding member to team")
        console.error("Error adding member to team:", memberError)
        return
      }

      setSuccess("Team created successfully!")
      setNewTeamName("")
      setTeams([...teams, teamData[0]])
    } catch (error) {
      console.error("Unexpected error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error: inviteError } = await supabase
        .from("notifications")
        .insert([{ team_id: teamId, email: inviteEmail, user_id: currentUserId }])

      if (inviteError) {
        setError("Error sending invitation")
        console.error("Invite error:", inviteError)
      } else {
        setSuccess("Invitation sent successfully!")
        setInviteEmail("")
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>Create, invite, and manage your teams</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">
              <Users className="mr-2 h-4 w-4" />
              Select Team
            </TabsTrigger>
            <TabsTrigger value="create">
              <CheckCircle className="mr-2 h-4 w-4" />
              Create Team
            </TabsTrigger>
            <TabsTrigger value="invite">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </TabsTrigger>
          </TabsList>
          <TabsContent value="select">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-select">Select a Team</Label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger id="team-select">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="create">
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Team"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="invite">
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Invite by Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading || !teamId}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {/* Render the calendar and chat below the tabs */}
        <TeamCalendar />
        <TeamChat />
      </CardContent>
    </Card>
  )
}

export default TeamManagement