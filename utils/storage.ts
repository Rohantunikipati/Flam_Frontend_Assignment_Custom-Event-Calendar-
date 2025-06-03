import type { Event } from "../types/event"

const STORAGE_KEY = "calendar-events"

export const saveEvents = (events: Event[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export const loadEvents = (): Event[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  const events = JSON.parse(stored)

  // Migrate old events that don't have categories
  return events.map((event: any) => ({
    ...event,
    category: event.category || "other", // Default to "other" category
    color: event.color || "#9CA3AF", // Default color for migrated events
  }))
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
