"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Coins, Users, X } from "lucide-react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loading } from "@/components/loading/loading"
import { MobileNavigation } from "@/components/homgepage/mobile-navigation"
export default function WaitingForOpponentPage() {
  const router = useRouter()
  const [waitTime, setWaitTime] = useState(0)
  const [cancellingGame, setCancellingGame] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime((prev) => prev + 1)
    }, 1000)

    // Simulate finding an opponent after 10-20 seconds
    const timeout = setTimeout(
      () => {
        router.push(`/game/new-${Date.now()}`)
      },
      10000 + Math.random() * 10000,
    )

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [router])

  const formatWaitTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCancelGame = () => {
    setCancellingGame(true)
    setTimeout(() => {
      router.push("/")
    }, 1000)
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
            <h1 className="text-lg font-bold">Finding Opponent</h1>
            <button onClick={handleCancelGame} disabled={cancellingGame}>
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      <div className="container py-6 flex-1 flex flex-col">
        {/* Game Info */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 bg-secondary">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt="You" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">You (1850)</div>
                  <div className="text-sm text-muted-foreground">Waiting for opponent...</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="outline" className="mb-1 border-primary text-primary">
                  <Coins className="w-3 h-3 mr-1" />
                  $100
                </Badge>
                <div className="text-sm flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-primary" />
                  <span>5+2</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 p-3 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Game Status</div>
                <div className="status-indicator waiting">Waiting</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Your game is listed in the "Open Bets" section. Players can join at any time.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waiting Animation */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loading type="pieces" size="lg" text={`Waiting for opponent... (${formatWaitTime(waitTime)})`} />

          <div className="mt-8 text-center max-w-md">
            <h3 className="text-lg font-medium mb-2">Looking for a worthy opponent</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We're matching you with a player of similar rating. This usually takes less than a minute.
            </p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={handleCancelGame}
              disabled={cancellingGame}
            >
              {cancellingGame ? <Loading type="minimal" /> : "Cancel Game"}
            </Button>
          </div>
        </div>

        {/* Player Pool Info */}
        <div className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium">Active Players</span>
                </div>
                <div className="stats-counter">
                  <span className="number">247</span> Online Now
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </main>
  )
}
