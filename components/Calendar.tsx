"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { addMonths, subMonths, format } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarGrid } from "./CalendarGrid"
import { EventModal } from "./EventModal"
import type { Event } from "../types/event"
import { generateCalendarDays, generateRecurringEvents, hasTimeConflict } from "../utils/dateUtils"
import { saveEvents, loadEvents, generateId } from "../utils/storage"
import { CategoryFilter } from "./CategoryFilter"
import { CategoryLegend } from "./CategoryLegend"

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    const storedEvents = loadEvents()
    setAllEvents(storedEvents)
    updateDisplayedEvents(storedEvents, currentDate, searchTerm, selectedCategories)
  }, [])

  useEffect(() => {
    updateDisplayedEvents(allEvents, currentDate, searchTerm, selectedCategories)
  }, [allEvents, currentDate, searchTerm, selectedCategories])

  const updateDisplayedEvents = (baseEvents: Event[], date: Date, search: string, categories: string[]) => {
    const startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    const endDate = new Date(date.getFullYear(), date.getMonth() + 2, 0)

    let displayEvents: Event[] = []

    baseEvents.forEach((event) => {
      if (event.isRecurring && event.recurrence) {
        const recurringEvents = generateRecurringEvents(event, startDate, endDate)
        displayEvents.push(...recurringEvents)
      } else {
        const eventDate = new Date(event.date)
        if (eventDate >= startDate && eventDate <= endDate) {
          displayEvents.push(event)
        }
      }
    })

    // Filter by search term
    if (search) {
      displayEvents = displayEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Filter by categories
    if (categories.length > 0) {
      displayEvents = displayEvents.filter((event) => categories.includes(event.category))
    }

    setEvents(displayEvents)
  }

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setIsModalOpen(true)
  }

  const handleSaveEvent = (eventData: Omit<Event, "id">) => {
    const conflicts = allEvents.filter(
      (existing) => existing.id !== selectedEvent?.id && hasTimeConflict({ ...eventData, id: "" }, existing),
    )

    if (conflicts.length > 0) {
      if (!confirm("This event conflicts with existing events. Do you want to continue?")) {
        return
      }
    }

    let updatedEvents: Event[]

    if (selectedEvent) {
      // Editing existing event
      if (selectedEvent.parentId) {
        // Editing a recurring event instance
        const newEvent: Event = { ...eventData, id: generateId() }
        updatedEvents = [...allEvents, newEvent]
      } else {
        // Editing a regular event or recurring parent
        updatedEvents = allEvents.map((event) =>
          event.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : event,
        )
      }
    } else {
      // Creating new event
      const newEvent: Event = { ...eventData, id: generateId() }
      updatedEvents = [...allEvents, newEvent]
    }

    setAllEvents(updatedEvents)
    saveEvents(updatedEvents)
    setIsModalOpen(false)
    setSelectedEvent(null)
    setSelectedDate(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    const eventToDelete = allEvents.find((e) => e.id === eventId)

    if (eventToDelete?.parentId) {
      // Deleting a recurring event instance
      const updatedEvents = allEvents.filter((event) => event.id !== eventId)
      setAllEvents(updatedEvents)
      saveEvents(updatedEvents)
    } else {
      // Deleting a regular event or recurring parent
      const updatedEvents = allEvents.filter((event) => event.id !== eventId && event.parentId !== eventId)
      setAllEvents(updatedEvents)
      saveEvents(updatedEvents)
    }

    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleDragStart = (event: Event) => {
    setDraggedEvent(event)
  }

  const handleDrop = (targetDate: Date) => {
    if (!draggedEvent) return

    const updatedEvent = {
      ...draggedEvent,
      date: format(targetDate, "yyyy-MM-dd"),
    }

    const conflicts = allEvents.filter(
      (existing) => existing.id !== draggedEvent.id && hasTimeConflict(updatedEvent, existing),
    )

    if (conflicts.length > 0) {
      if (!confirm("Moving this event will create conflicts. Continue?")) {
        setDraggedEvent(null)
        return
      }
    }

    let updatedEvents: Event[]

    if (draggedEvent.parentId) {
      // Moving a recurring event instance - create new standalone event
      const newEvent: Event = { ...updatedEvent, id: generateId(), parentId: undefined }
      updatedEvents = [...allEvents, newEvent]
    } else {
      // Moving a regular event
      updatedEvents = allEvents.map((event) => (event.id === draggedEvent.id ? updatedEvent : event))
    }

    setAllEvents(updatedEvents)
    saveEvents(updatedEvents)
    setDraggedEvent(null)
  }

  const calendarDays = generateCalendarDays(currentDate, events)

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Custom Event Calendar</h1>
            <p className="text-gray-600">Manage your events with drag-and-drop, recurring events, and more</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Section */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-white shadow-lg rounded-lg m-4 flex flex-col h-full">
            {/* Calendar Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-gray-900">{format(currentDate, "MMMM yyyy")}</h2>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <CategoryFilter selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
                <Button
                  onClick={() => {
                    setSelectedDate(new Date())
                    setSelectedEvent(null)
                    setIsModalOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            {/* Calendar Grid - Scrollable */}
            <div className="flex-1 overflow-auto">
              <CalendarGrid
                days={calendarDays}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                draggedEvent={draggedEvent}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Category Legend */}
        <div className="w-64 flex-shrink-0 p-4">
          <CategoryLegend selectedCategories={selectedCategories} />
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
          setSelectedDate(null)
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  )
}
