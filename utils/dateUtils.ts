import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  isToday,
  isSameMonth,
  addDays,
  addWeeks,
} from "date-fns"
import type { Event, CalendarDay } from "../types/event"

export const formatDate = (date: Date): string => format(date, "yyyy-MM-dd")
export const formatTime = (date: Date): string => format(date, "HH:mm")
export const formatDisplayDate = (date: Date): string => format(date, "MMM d, yyyy")
export const formatDisplayTime = (time: string): string => {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export const generateCalendarDays = (currentDate: Date, events: Event[]): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  return days.map((day) => ({
    date: day,
    isCurrentMonth: isSameMonth(day, currentDate),
    isToday: isToday(day),
    events: events.filter((event) => isSameDay(new Date(event.date), day)),
  }))
}

export const generateRecurringEvents = (baseEvent: Event, startDate: Date, endDate: Date): Event[] => {
  if (!baseEvent.recurrence) return [baseEvent]

  const events: Event[] = []
  const { type, interval, daysOfWeek, endDate: recurrenceEndDate, count } = baseEvent.recurrence

  let currentDate = new Date(baseEvent.date)
  let occurrenceCount = 0
  const maxDate = recurrenceEndDate ? new Date(recurrenceEndDate) : endDate

  while (currentDate <= maxDate && currentDate <= endDate && (!count || occurrenceCount < count)) {
    if (currentDate >= startDate) {
      events.push({
        ...baseEvent,
        id: `${baseEvent.id}-${occurrenceCount}`,
        date: formatDate(currentDate),
        parentId: baseEvent.id,
      })
    }

    switch (type) {
      case "daily":
        currentDate = addDays(currentDate, interval)
        break
      case "weekly":
        if (daysOfWeek && daysOfWeek.length > 0) {
          // Find next occurrence based on selected days
          let nextDate = addDays(currentDate, 1)
          while (!daysOfWeek.includes(nextDate.getDay()) && nextDate <= maxDate) {
            nextDate = addDays(nextDate, 1)
          }
          currentDate = nextDate
        } else {
          currentDate = addWeeks(currentDate, interval)
        }
        break
      case "monthly":
        currentDate = addMonths(currentDate, interval)
        break
      case "custom":
        currentDate = addDays(currentDate, interval)
        break
    }

    occurrenceCount++
  }

  return events
}

export const hasTimeConflict = (event1: Event, event2: Event): boolean => {
  if (event1.date !== event2.date) return false

  const start1 = event1.startTime
  const end1 = event1.endTime
  const start2 = event2.startTime
  const end2 = event2.endTime

  return start1 < end2 && end1 > start2
}
