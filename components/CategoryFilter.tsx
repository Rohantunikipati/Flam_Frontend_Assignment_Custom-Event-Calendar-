"use client"

import type React from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { EVENT_CATEGORIES } from "../types/event"

interface CategoryFilterProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onCategoryChange }) => {
  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]

    onCategoryChange(newCategories)
  }

  const handleSelectAll = () => {
    if (selectedCategories.length === EVENT_CATEGORIES.length) {
      onCategoryChange([])
    } else {
      onCategoryChange(EVENT_CATEGORIES.map((cat) => cat.id))
    }
  }

  const selectedCount = selectedCategories.length
  const totalCount = EVENT_CATEGORIES.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Categories
          {selectedCount > 0 && selectedCount < totalCount && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{selectedCount}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter by Category</h4>
            <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs">
              {selectedCategories.length === totalCount ? "Clear All" : "Select All"}
            </Button>
          </div>

          <div className="space-y-3">
            {EVENT_CATEGORIES.map((category) => (
              <div key={category.id} className="flex items-center space-x-3">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <label htmlFor={category.id} className="text-sm font-medium cursor-pointer flex-1">
                    {category.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <div className="text-xs text-gray-500">
              {selectedCount === totalCount
                ? "All categories selected"
                : `${selectedCount} of ${totalCount} categories selected`}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
