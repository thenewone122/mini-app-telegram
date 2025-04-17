"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Plus, Minus } from "lucide-react"



export function TimeControlSelector({ onChange, className }) {
  const timeOptions= [
    { minutes: 1, increment: 0, label: "Bullet" },
    { minutes: 3, increment: 2, label: "Blitz" },
    { minutes: 5, increment: 3, label: "Blitz" },
    { minutes: 10, increment: 5, label: "Rapid" },
    { minutes: 15, increment: 10, label: "Rapid" },
    { minutes: 30, increment: 0, label: "Classical" },
  ]

  const [selectedOption, setSelectedOption] = useState(timeOptions[2])
  const [customIncrement, setCustomIncrement] = useState(selectedOption.increment)

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setCustomIncrement(option.increment)
    if (onChange) onChange(option.minutes, option.increment)
  }

  const incrementChange = (value) => {
    const newIncrement = Math.max(0, Math.min(60, customIncrement + value))
    setCustomIncrement(newIncrement)
    if (onChange) onChange(selectedOption.minutes, newIncrement)
  }

  return (
    <div className={className}>
      <label className="text-sm font-medium block mb-2">Time Control</label>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {timeOptions.map((option) => (
          <Button
            key={`${option.minutes}-${option.increment}`}
            variant={selectedOption.minutes === option.minutes ? "default" : "outline"}
            size="sm"
            className={
              selectedOption.minutes === option.minutes ? "bg-primary text-primary-foreground" : "bg-secondary/50"
            }
            onClick={() => handleOptionSelect(option)}
          >
            <div className="flex flex-col items-center">
              <span>
                {option.minutes}+{option.increment}
              </span>
              <span className="text-xs opacity-80">{option.label}</span>
            </div>
          </Button>
        ))}
      </div>

      <div className="bg-secondary/50 rounded-md p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium">{selectedOption.minutes} min</span>
          </div>
          <div className="text-sm text-muted-foreground">{selectedOption.label}</div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Increment:</span>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-r-none"
              onClick={() => incrementChange(-1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="h-7 px-3 flex items-center justify-center bg-secondary border-y border-border min-w-[40px]">
              {customIncrement}
            </div>
            <Button variant="outline" size="icon" className="h-7 w-7 rounded-l-none" onClick={() => incrementChange(1)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">seconds</span>
        </div>
      </div>
    </div>
  )
}
