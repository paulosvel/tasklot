import React, { useState, useEffect } from "react"
import useUserStore from "../store/userStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const TaskForm = ({ onTaskCreated }) => {
  const { currentUserId, teamId } = useUserStore()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [assigneeId, setAssigneeId] = useState("")
  const [status, setStatus] = useState("pending")
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {

  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    // try {
    //   const { data, error } = await supabase.from("tasks").insert([
    //     {
    //       title,
    //       description,
    //       due_date: dueDate,
    //       owner_id: currentUserId,
    //       assignee_id: assigneeId,
    //       status,
    //       team_id: teamId,
    //     },
    //   ]).select()

    //   if (error) {
    //     setError("Error creating task")
    //     console.error("Error creating task:", error)
    //   } else {
    //     setTitle("")
    //     setDescription("")
    //     setDueDate(undefined)
    //     setAssigneeId("")
    //     setStatus("pending")
    //     onTaskCreated(data[0])
    //   }
    // } catch (error) {
    //   console.error("Unexpected error:", error)
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Assignee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </CardFooter>
      </form>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  )
}

export default TaskForm