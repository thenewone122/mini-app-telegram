"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Coins, Plus, Minus } from "lucide-react"



export function BetAmountSelector({
  minBet = 10,
  maxBet = 1000,
  defaultBet = 100,
  step = 10,
  onChange,
  className,
}) {
  const [betAmount, setBetAmount] = useState(defaultBet)

  const handleSliderChange = (value) => {
    const newValue = value[0]
    setBetAmount(newValue)
    if (onChange) onChange(newValue)
  }

  const handleInputChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value)) return

    const newValue = Math.min(Math.max(value, minBet), maxBet)
    setBetAmount(newValue)
    if (onChange) onChange(newValue)
  }

  const incrementBet = () => {
    const newValue = Math.min(betAmount + step, maxBet)
    setBetAmount(newValue)
    if (onChange) onChange(newValue)
  }

  const decrementBet = () => {
    const newValue = Math.max(betAmount - step, minBet)
    setBetAmount(newValue)
    if (onChange) onChange(newValue)
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Bet Amount</label>
        <div className="bet-amount-badge">
          <Coins className="w-3.5 h-3.5 mr-1" />{betAmount} Birr
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={decrementBet}>
          <Minus className="h-3 w-3" />
        </Button>

        <Slider
          value={[betAmount]}
          min={minBet}
          max={maxBet}
          step={step}
          onValueChange={handleSliderChange}
          className="flex-1"
        />

        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={incrementBet}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="relative">
        <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="number"
          value={betAmount}
          onChange={handleInputChange}
          min={minBet}
          max={maxBet}
          className="pl-10 bg-secondary border-border"
        />
      </div>
    </div>
  )
}
