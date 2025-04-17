"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chessboard } from "react-chessboard"
import { ArrowLeft, ChevronDown, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BetAmountSelector } from "@/components/homgepage/bet-amount-selector"
import { TimeControlSelector } from "@/components/homgepage/time-control-selector"
import { MobileNavigation } from "@/components/homgepage/mobile-navigation"

export default function CreateGamePage() {
  const router = useRouter()
  const [ratingRange, setRatingRange] = useState("any")
  const [boardFlipped, setBoardFlipped] = useState(false)

  const handleCreateGame = () => {
    // In a real app, you would create the game on the server
    // For now, we'll just redirect to a game page
    router.push(`/game/new-${Date.now()}`)
  }

  return (
    <main className="flex min-h-screen flex-col pb-16 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-foreground">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-bold">Create Game</h1>
            <div className="w-5"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container py-4 grid md:grid-cols-2 gap-6">
        {/* Game Settings */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-primary mr-2">♟</span> Game Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <BetAmountSelector />

              <TimeControlSelector />

              <div>
                <label className="text-sm font-medium mb-2 block">Rating Range</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={ratingRange}
                    onChange={(e) => setRatingRange(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-md border border-border bg-secondary text-foreground"
                  >
                    <option value="any">Any Rating</option>
                    <option value="similar">Similar Rating (±100)</option>
                    <option value="higher">Higher Rating ({">"}1900)</option>
                    <option value="lower">Lower Rating ({"<"}1800)</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleCreateGame}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Create Game and Wait for Opponent
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Game Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Game Type</div>
                    <div className="status-indicator active">Rated</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Your game will be listed in the "Open Bets" section for other players to join. Once someone joins,
                    the game will start immediately.
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>
                      {ratingRange === "any" && "Any rating"}
                      {ratingRange === "similar" && "±100 rating"}
                      {ratingRange === "higher" && ">1900 rating"}
                      {ratingRange === "lower" && "<1800 rating"}
                      {ratingRange === "custom" && "Custom rating range"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chess Board Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Board Preview</h2>
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-secondary"
              onClick={() => setBoardFlipped((prev) => !prev)}
            >
              Flip Board
            </Button>
          </div>
          <Chessboard />
          <div className="text-center text-sm text-muted-foreground">
            <p>You will play as {boardFlipped ? "Black" : "White"}</p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </main>
  )
}
