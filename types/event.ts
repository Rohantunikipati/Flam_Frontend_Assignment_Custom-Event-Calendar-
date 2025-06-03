export interface Event {
  id: string
  title: string
  description: string
  date: string // ISO date string
  startTime: string
  endTime: string
  color: string
  category: string // Now required and from predefined list
  recurrence?: RecurrencePattern
  isRecurring: boolean
  parentId?: string // For recurring event instances
}

export interface RecurrencePattern {
  type: "daily" | "weekly" | "monthly" | "custom"
  interval: number // Every X days/weeks/months
  daysOfWeek?: number[] // For weekly recurrence (0 = Sunday)
  endDate?: string
  count?: number // Number of occurrences
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: Event[]
}

export interface EventCategory {
  id: string
  name: string
  color: string
  icon?: string
}

export const EVENT_CATEGORIES: EventCategory[] = [
  { id: "work", name: "Work", color: "#3B82F6" },
  { id: "personal", name: "Personal", color: "#10B981" },
  { id: "health", name: "Health & Fitness", color: "#EF4444" },
  { id: "education", name: "Education", color: "#8B5CF6" },
  { id: "social", name: "Social", color: "#EC4899" },
  { id: "travel", name: "Travel", color: "#06B6D4" },
  { id: "finance", name: "Finance", color: "#F59E0B" },
  { id: "family", name: "Family", color: "#84CC16" },
  { id: "hobbies", name: "Hobbies", color: "#6B7280" },
  { id: "other", name: "Other", color: "#9CA3AF" },
]
