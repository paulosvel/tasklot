'use client'

import React, { useState } from "react"

const TeamChat = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([...messages, newMessage])
      setNewMessage("")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Team Chat</h2>
      <div className="border border-gray-300 rounded-lg p-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold">User:</span> {msg}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="border border-gray-300 rounded-l-lg p-2 flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white rounded-r-lg p-2">
          Send
        </button>
      </form>
    </div>
  )
}

export default TeamChat