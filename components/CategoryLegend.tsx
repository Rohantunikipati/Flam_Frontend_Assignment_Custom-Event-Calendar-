"use client"

import type React from "react"
import { EVENT_CATEGORIES } from "../types/event"

interface CategoryLegendProps {
  selectedCategories: string[]
}

export const CategoryLegend: React.FC<CategoryLegendProps> = ({ selectedCategories }) => {
  const visibleCategories = EVENT_CATEGORIES.filter(
    (cat) => selectedCategories.length === 0 || selectedCategories.includes(cat.id),
  )

  if (visibleCategories.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
        <p className="text-xs text-gray-500 mt-1">
          {selectedCategories.length === 0 ? "All categories" : `${selectedCategories.length} selected`}
        </p>
      </div>

      <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-3">
          {visibleCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-200"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 block truncate">{category.name}</span>
              </div>
            </div>
          ))}
        </div>

        {visibleCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No categories selected</p>
          </div>
        )}
      </div>
    </div>
  )
}
