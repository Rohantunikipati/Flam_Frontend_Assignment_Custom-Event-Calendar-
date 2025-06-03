"use client"

import type React from "react"
import { format } from "date-fns"
import type { CalendarDay, Event } from "../types/event"
import { EventCard } from "./EventCard"

interface CalendarGridProps {
  days: CalendarDay[]
  onDayClick: (date: Date) => void
  onEventClick: (event: Event) => void
  onDragStart: (event: Event) => void
  onDrop: (date: Date) => void
  draggedEvent: Event | null
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  onDayClick,
  onEventClick,
  onDragStart,
  onDrop,
  draggedEvent,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    onDrop(date)
  }

  return (
    <div className="p-4 h-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-md">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden" style={{ minHeight: "600px" }}>
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              min-h-[100px] bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors relative
              ${!day.isCurrentMonth ? "text-gray-400 bg-gray-50" : ""}
              ${day.isToday ? "bg-blue-50 border-2 border-blue-200" : ""}
              ${draggedEvent ? "hover:bg-blue-100" : ""}
            `}
            onClick={() => onDayClick(day.date)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, day.date)}
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className={`
                text-sm font-semibold
                ${day.isToday ? "text-blue-600" : ""}
                ${!day.isCurrentMonth ? "text-gray-400" : "text-gray-900"}
              `}
              >
                {format(day.date, "d")}
              </span>
            </div>

            <div className="space-y-1 overflow-hidden">
              {day.events.slice(0, 4).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick(event)
                  }}
                  onDragStart={() => onDragStart(event)}
                  isDragging={draggedEvent?.id === event.id}
                />
              ))}
              {day.events.length > 4 && (
                <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded text-center">
                  +{day.events.length - 4} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
