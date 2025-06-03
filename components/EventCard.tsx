"use client"

import type React from "react"
import type { Event } from "../types/event"
import { formatDisplayTime } from "../utils/dateUtils"

interface EventCardProps {
  event: Event
  onClick: (e: React.MouseEvent) => void
  onDragStart: () => void
  isDragging: boolean
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, onDragStart, isDragging }) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart()
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`
        text-xs p-1 rounded cursor-pointer transition-all duration-200
        ${isDragging ? "opacity-50 scale-95" : "hover:scale-105"}
        ${event.parentId ? "border-l-2 border-dashed" : ""}
      `}
      style={{
        backgroundColor: event.color + "20",
        borderColor: event.color,
        color: event.color,
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs opacity-75">
        {formatDisplayTime(event.startTime)}
        {event.parentId && " (recurring)"}
      </div>
    </div>
  )
}
