'use client'

import React, { useState } from "react"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const TeamCalendar = () => {
  const [date, setDate] = useState(new Date())

  const handleDateChange = (newDate: Date) => {
    setDate(newDate)
    // You can add functionality to fetch events for the selected date here
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Team Calendar</h2>
      {/* <Calendar
        onChange={handleDateChange}
        value={date}
      /> */}
      <div className="mt-4">
        <p>Selected Date: {date.toDateString()}</p>
        {/* You can display events for the selected date here */}
      </div>
    </div>
  )
}

export default TeamCalendar