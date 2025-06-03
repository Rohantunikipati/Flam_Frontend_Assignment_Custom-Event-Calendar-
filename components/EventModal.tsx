"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Event } from "../types/event"
import { formatDate } from "../utils/dateUtils"
import { EVENT_CATEGORIES } from "../types/event"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<Event, "id">) => void
  onDelete: (eventId: string) => void
  event: Event | null
  selectedDate: Date | null
}

const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    color: EVENT_CATEGORIES[0].color,
    category: EVENT_CATEGORIES[0].id,
    isRecurring: false,
    recurrence: {
      type: "weekly" as const,
      interval: 1,
      daysOfWeek: [] as number[],
      endDate: "",
      count: undefined as number | undefined,
    },
  })

  useEffect(() => {
    if (event) {
      const eventCategory = EVENT_CATEGORIES.find((cat) => cat.id === event.category) || EVENT_CATEGORIES[0]
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        color: eventCategory.color,
        category: event.category,
        isRecurring: event.isRecurring,
        recurrence: event.recurrence || {
          type: "weekly",
          interval: 1,
          daysOfWeek: [],
          endDate: "",
          count: undefined,
        },
      })
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: formatDate(selectedDate),
        title: "",
        description: "",
        category: EVENT_CATEGORIES[0].id,
        color: EVENT_CATEGORIES[0].color,
        isRecurring: false,
      }))
    }
  }, [event, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const eventData: Omit<Event, "id"> = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: formData.color,
      category: formData.category,
      isRecurring: formData.isRecurring,
      recurrence: formData.isRecurring ? formData.recurrence : undefined,
    }

    onSave(eventData)
  }

  const handleRecurrenceChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        [field]: value,
      },
    }))
  }

  const handleDayOfWeekToggle = (day: number) => {
    const currentDays = formData.recurrence.daysOfWeek || []
    const newDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day]

    handleRecurrenceChange("daysOfWeek", newDays)
  }

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = EVENT_CATEGORIES.find((cat) => cat.id === categoryId) || EVENT_CATEGORIES[0]
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      color: selectedCategory.color,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{event ? "Edit Event" : "Add Event"}</h2>
          <div className="flex items-center space-x-2">
            {event && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(event.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label>Selected Category Color</Label>
            <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-sm text-gray-600">
                {EVENT_CATEGORIES.find((cat) => cat.id === formData.category)?.name} Category
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecurring: checked as boolean }))}
            />
            <Label htmlFor="recurring">Recurring Event</Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label>Recurrence Type</Label>
                <Select
                  value={formData.recurrence.type}
                  onValueChange={(value) => handleRecurrenceChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Repeat Every</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="1"
                    value={formData.recurrence.interval}
                    onChange={(e) => handleRecurrenceChange("interval", Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">
                    {formData.recurrence.type === "daily"
                      ? "day(s)"
                      : formData.recurrence.type === "weekly"
                        ? "week(s)"
                        : formData.recurrence.type === "monthly"
                          ? "month(s)"
                          : "day(s)"}
                  </span>
                </div>
              </div>

              {formData.recurrence.type === "weekly" && (
                <div>
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={formData.recurrence.daysOfWeek?.includes(day.value) || false}
                          onCheckedChange={() => handleDayOfWeekToggle(day.value)}
                        />
                        <Label htmlFor={`day-${day.value}`} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endDate">End Date (optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.recurrence.endDate || ""}
                    onChange={(e) => handleRecurrenceChange("endDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="count">Max Occurrences</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    value={formData.recurrence.count || ""}
                    onChange={(e) =>
                      handleRecurrenceChange("count", e.target.value ? Number.parseInt(e.target.value) : undefined)
                    }
                    placeholder="Unlimited"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
