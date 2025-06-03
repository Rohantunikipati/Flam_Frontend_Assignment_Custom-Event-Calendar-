# 📅 Custom Event Calendar

A fully interactive, dynamic event calendar built using **React**. This calendar allows users to add, edit, delete, and manage both single and recurring events, complete with drag-and-drop functionality and optional filtering.

🔗 **Live Demo**: [https://flam-frontend-assignment-custom-eve.vercel.app/](https://flam-frontend-assignment-custom-eve.vercel.app/)

---

## ✨ Features

### 1. 📆 Monthly View Calendar
- Displays a traditional monthly grid.
- Highlights the **current day**.
- Navigation for **previous/next months**.

### 2. 📝 Event Management
- **Add Events** by clicking a date.
- **Edit Events** by clicking on any event block.
- **Delete Events** with confirmation.
- Event form includes:
  - Title
  - Date and Time (with picker)
  - Description
  - Recurrence Options (Daily, Weekly, Monthly, Custom)
  - Event Color/Category

### 3. 🔁 Recurring Events
- Support for:
  - Daily recurrence
  - Weekly recurrence (custom days)
  - Monthly recurrence (specific date)
  - Custom recurrence (e.g., every 2 weeks)
- Recurring events rendered across all valid occurrences.

### 4. 🔄 Drag-and-Drop Rescheduling
- Drag and drop events between days to **reschedule easily**.
- Handles **edge cases**, such as moving to a conflicting time/day.

### 5. ⚠️ Conflict Management
- Warns user on **event conflicts** (overlapping date/time).
- Prevents accidental overlapping unless explicitly allowed.

### 6. 🔍 Filtering & Searching *(Optional)*
- Filter events by **category**.
- **Search bar** for event title/description.
- Dynamic filtering as user types.

### 7. 💾 Event Persistence
- Uses **Local Storage** to persist events.
- Events remain saved across page refreshes and sessions.

### 8. 📱 Responsive Design *(Optional)*
- Fully responsive layout.
- Supports smaller screen views with layout adjustments (e.g., weekly/daily fallback).

---

## ⚙️ Tech Stack

- **Framework:** Next.js
- **Date Handling:** [date-fns](https://date-fns.org/)
- **State Management:** React useState / useReducer
- **Drag & Drop:** [React DnD](https://react-dnd.github.io/react-dnd/) or custom
- **Styling:** CSS Modules / Tailwind / SCSS (based on your implementation)

---

## 📁 Project Structure (Example)

