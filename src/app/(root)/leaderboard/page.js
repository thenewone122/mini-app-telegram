"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Trophy, DollarSign, Percent, ChevronUp, Filter, Users } from "lucide-react"
import Link from "next/link"
import { MobileNavigation } from "@/components/homgepage/mobile-navigation"
import { Loading } from "@/components/loading/loading"

// Sample data for the leaderboard
const leaderboardData = {
  rating: [
    { id: 1, name: "Magnus C.", rating: 2850, winRate: 72, earnings: 4250, avatar: "M", country: "🇳🇴" },
    { id: 2, name: "Hikaru N.", rating: 2790, winRate: 68, earnings: 3800, avatar: "H", country: "🇺🇸" },
    { id: 3, name: "Fabiano C.", rating: 2780, winRate: 65, earnings: 3500, avatar: "F", country: "🇺🇸" },
    { id: 4, name: "Ding L.", rating: 2775, winRate: 64, earnings: 3200, avatar: "D", country: "🇨🇳" },
    { id: 5, name: "Ian N.", rating: 2770, winRate: 63, earnings: 3100, avatar: "I", country: "🇷🇺" },
    { id: 6, name: "Anish G.", rating: 2760, winRate: 62, earnings: 2900, avatar: "A", country: "🇳🇱" },
    { id: 7, name: "Wesley S.", rating: 2755, winRate: 61, earnings: 2800, avatar: "W", country: "🇺🇸" },
    { id: 8, name: "Levon A.", rating: 2750, winRate: 60, earnings: 2700, avatar: "L", country: "🇦🇲" },
    { id: 9, name: "Maxime V.", rating: 2745, winRate: 59, earnings: 2600, avatar: "M", country: "🇫🇷" },
    { id: 10, name: "Shakhriyar M.", rating: 2740, winRate: 58, earnings: 2500, avatar: "S", country: "🇦🇿" },
  ],
  earnings: [
    { id: 1, name: "Magnus C.", rating: 2850, winRate: 72, earnings: 4250, avatar: "M", country: "🇳🇴" },
    { id: 2, name: "Hikaru N.", rating: 2790, winRate: 68, earnings: 3800, avatar: "H", country: "🇺🇸" },
    { id: 3, name: "Fabiano C.", rating: 2780, winRate: 65, earnings: 3500, avatar: "F", country: "🇺🇸" },
    { id: 4, name: "Ding L.", rating: 2775, winRate: 64, earnings: 3200, avatar: "D", country: "🇨🇳" },
    { id: 5, name: "Ian N.", rating: 2770, winRate: 63, earnings: 3100, avatar: "I", country: "🇷🇺" },
    { id: 6, name: "Anish G.", rating: 2760, winRate: 62, earnings: 2900, avatar: "A", country: "🇳🇱" },
    { id: 7, name: "Wesley S.", rating: 2755, winRate: 61, earnings: 2800, avatar: "W", country: "🇺🇸" },
    { id: 8, name: "Levon A.", rating: 2750, winRate: 60, earnings: 2700, avatar: "L", country: "🇦🇲" },
    { id: 9, name: "Maxime V.", rating: 2745, winRate: 59, earnings: 2600, avatar: "M", country: "🇫🇷" },
    { id: 10, name: "Shakhriyar M.", rating: 2740, winRate: 58, earnings: 2500, avatar: "S", country: "🇦🇿" },
  ].sort((a, b) => b.earnings - a.earnings),
  winRate: [
    { id: 1, name: "Magnus C.", rating: 2850, winRate: 72, earnings: 4250, avatar: "M", country: "🇳🇴" },
    { id: 2, name: "Hikaru N.", rating: 2790, winRate: 68, earnings: 3800, avatar: "H", country: "🇺🇸" },
    { id: 3, name: "Fabiano C.", rating: 2780, winRate: 65, earnings: 3500, avatar: "F", country: "🇺🇸" },
    { id: 4, name: "Ding L.", rating: 2775, winRate: 64, earnings: 3200, avatar: "D", country: "🇨🇳" },
    { id: 5, name: "Ian N.", rating: 2770, winRate: 63, earnings: 3100, avatar: "I", country: "🇷🇺" },
    { id: 6, name: "Anish G.", rating: 2760, winRate: 62, earnings: 2900, avatar: "A", country: "🇳🇱" },
    { id: 7, name: "Wesley S.", rating: 2755, winRate: 61, earnings: 2800, avatar: "W", country: "🇺🇸" },
    { id: 8, name: "Levon A.", rating: 2750, winRate: 60, earnings: 2700, avatar: "L", country: "🇦🇲" },
    { id: 9, name: "Maxime V.", rating: 2745, winRate: 59, earnings: 2600, avatar: "M", country: "🇫🇷" },
    { id: 10, name: "Shakhriyar M.", rating: 2740, winRate: 58, earnings: 2500, avatar: "S", country: "🇦🇿" },
  ].sort((a, b) => b.winRate - a.winRate),
  monthly: [
    { id: 3, name: "Fabiano C.", rating: 2780, winRate: 65, earnings: 3500, avatar: "F", country: "🇺🇸" },
    { id: 2, name: "Hikaru N.", rating: 2790, winRate: 68, earnings: 3800, avatar: "H", country: "🇺🇸" },
    { id: 1, name: "Magnus C.", rating: 2850, winRate: 72, earnings: 4250, avatar: "M", country: "🇳🇴" },
    { id: 7, name: "Wesley S.", rating: 2755, winRate: 61, earnings: 2800, avatar: "W", country: "🇺🇸" },
    { id: 5, name: "Ian N.", rating: 2770, winRate: 63, earnings: 3100, avatar: "I", country: "🇷🇺" },
    { id: 4, name: "Ding L.", rating: 2775, winRate: 64, earnings: 3200, avatar: "D", country: "🇨🇳" },
    { id: 9, name: "Maxime V.", rating: 2745, winRate: 59, earnings: 2600, avatar: "M", country: "🇫🇷" },
    { id: 6, name: "Anish G.", rating: 2760, winRate: 62, earnings: 2900, avatar: "A", country: "🇳🇱" },
    { id: 8, name: "Levon A.", rating: 2750, winRate: 60, earnings: 2700, avatar: "L", country: "🇦🇲" },
    { id: 10, name: "Shakhriyar M.", rating: 2740, winRate: 58, earnings: 2500, avatar: "S", country: "🇦🇿" },
  ],
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)

  // Filter players based on search query
  const filterPlayers = (players) => {
    if (!searchQuery) return players
    return players.filter((player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  // Simulate loading when changing tabs
  const handleTabChange = (value) => {
    setIsLoading(true)
    setActiveTab(value)
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
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
            <h1 className="text-lg font-bold">Leaderboard</h1>
            <button onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="container py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {showFilters && (
          <div className="mt-3 p-3 bg-secondary/50 rounded-md">
            <div className="text-sm font-medium mb-2">Filters</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="friends" className="rounded bg-secondary border-border" />
                <label htmlFor="friends" className="text-sm">
                  Friends Only
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" className="rounded bg-secondary border-border" />
                <label htmlFor="active" className="text-sm">
                  Active Players
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="similar" className="rounded bg-secondary border-border" />
                <label htmlFor="similar" className="text-sm">
                  Similar Rating (±200)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="played" className="rounded bg-secondary border-border" />
                <label htmlFor="played" className="text-sm">
                  Played Against
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="container py-2">
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-card border-border">
            <CardContent className="p-3">
              <div className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">Your Rank</div>
                <div className="text-xl font-bold flex items-center">
                  <span className="text-primary">#42</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3">
              <div className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">Rating</div>
                <div className="text-xl font-bold">1850</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3">
              <div className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
                <div className="text-xl font-bold">65%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <section className="container flex-1 pb-6">
        <Tabs defaultValue="rating" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger
              value="rating"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Rating
            </TabsTrigger>
            <TabsTrigger
              value="earnings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Earnings
            </TabsTrigger>
            <TabsTrigger
              value="winRate"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Win Rate
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Monthly
            </TabsTrigger>
          </TabsList>

          {/* Loading state */}
          {isLoading ? (
            <div className="py-12">
              <Loading type="pieces" text="Loading leaderboard..." />
            </div>
          ) : (
            <>
              {/* Rating Tab */}
              <TabsContent value="rating" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-chess-highlight" />
                    Top Players by Rating
                  </h2>
                  <div className="stats-counter">
                    <span className="number">{filterPlayers(leaderboardData.rating).length}</span> Players
                  </div>
                </div>

                <Card className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 bg-secondary/50 text-sm font-medium">
                      <div>Rank</div>
                      <div>Player</div>
                      <div className="text-right">Rating</div>
                    </div>

                    <div className="divide-y divide-border">
                      {filterPlayers(leaderboardData.rating).map((player, index) => (
                        <div
                          key={player.id}
                          className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 items-center hover:bg-secondary/30 transition-colors"
                        >
                          <div className="font-bold text-muted-foreground w-8">{index + 1}</div>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3 bg-secondary">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                              <AvatarFallback>{player.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center">
                                {player.name} <span className="ml-1">{player.country}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Win Rate: {player.winRate}%</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-primary/10 border-primary">
                              <span className="text-primary">{player.rating}</span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Earnings Tab */}
              <TabsContent value="earnings" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    Top Players by Earnings
                  </h2>
                  <div className="stats-counter">
                    <span className="number">{filterPlayers(leaderboardData.earnings).length}</span> Players
                  </div>
                </div>

                <Card className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 bg-secondary/50 text-sm font-medium">
                      <div>Rank</div>
                      <div>Player</div>
                      <div className="text-right">Earnings</div>
                    </div>

                    <div className="divide-y divide-border">
                      {filterPlayers(leaderboardData.earnings).map((player, index) => (
                        <div
                          key={player.id}
                          className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 items-center hover:bg-secondary/30 transition-colors"
                        >
                          <div className="font-bold text-muted-foreground w-8">{index + 1}</div>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3 bg-secondary">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                              <AvatarFallback>{player.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center">
                                {player.name} <span className="ml-1">{player.country}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Rating: {player.rating}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-primary/10 border-primary">
                              <span className="text-primary">${player.earnings}</span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Win Rate Tab */}
              <TabsContent value="winRate" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Percent className="w-5 h-5 mr-2 text-chess-highlight" />
                    Top Players by Win Rate
                  </h2>
                  <div className="stats-counter">
                    <span className="number">{filterPlayers(leaderboardData.winRate).length}</span> Players
                  </div>
                </div>

                <Card className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 bg-secondary/50 text-sm font-medium">
                      <div>Rank</div>
                      <div>Player</div>
                      <div className="text-right">Win Rate</div>
                    </div>

                    <div className="divide-y divide-border">
                      {filterPlayers(leaderboardData.winRate).map((player, index) => (
                        <div
                          key={player.id}
                          className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 items-center hover:bg-secondary/30 transition-colors"
                        >
                          <div className="font-bold text-muted-foreground w-8">{index + 1}</div>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3 bg-secondary">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                              <AvatarFallback>{player.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center">
                                {player.name} <span className="ml-1">{player.country}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Rating: {player.rating}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-primary/10 border-primary">
                              <span className="text-primary">{player.winRate}%</span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Monthly Tab */}
              <TabsContent value="monthly" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center">
                    <ChevronUp className="w-5 h-5 mr-2 text-primary" />
                    Monthly Performers
                  </h2>
                  <div className="stats-counter">
                    <span className="number">{filterPlayers(leaderboardData.monthly).length}</span> Players
                  </div>
                </div>

                <Card className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 bg-secondary/50 text-sm font-medium">
                      <div>Rank</div>
                      <div>Player</div>
                      <div className="text-right">Change</div>
                    </div>

                    <div className="divide-y divide-border">
                      {filterPlayers(leaderboardData.monthly).map((player, index) => (
                        <div
                          key={player.id}
                          className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 items-center hover:bg-secondary/30 transition-colors"
                        >
                          <div className="font-bold text-muted-foreground w-8">{index + 1}</div>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3 bg-secondary">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={player.name} />
                              <AvatarFallback>{player.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center">
                                {player.name} <span className="ml-1">{player.country}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Rating: {player.rating}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                index < 3
                                  ? "bg-primary/10 border-primary"
                                  : index > 6
                                    ? "bg-destructive/10 border-destructive"
                                    : "bg-secondary border-border"
                              }
                            >
                              <span
                                className={
                                  index < 3 ? "text-primary" : index > 6 ? "text-destructive" : "text-muted-foreground"
                                }
                              >
                                {index < 3 ? "↑" : index > 6 ? "↓" : "="} {Math.abs(index - 5)}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </section>

      {/* Friends Section */}
      <section className="container pb-6">
        <h2 className="text-lg font-semibold flex items-center mb-3">
          <Users className="w-5 h-5 mr-2 text-primary" />
          Your Friends
        </h2>

        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[
                { id: 101, name: "Alex K.", rating: 1820, winRate: 62, rank: 45, avatar: "A", country: "🇺🇸" },
                { id: 102, name: "Maria L.", rating: 1905, winRate: 58, rank: 38, avatar: "M", country: "🇪🇸" },
                { id: 103, name: "David P.", rating: 1750, winRate: 55, rank: 67, avatar: "D", country: "🇬🇧" },
              ].map((friend, index) => (
                <div
                  key={friend.id}
                  className="grid grid-cols-[auto_1fr_auto] gap-2 p-3 items-center hover:bg-secondary/30 transition-colors"
                >
                  <div className="font-bold text-muted-foreground w-8">#{friend.rank}</div>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3 bg-secondary">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={friend.name} />
                      <AvatarFallback>{friend.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center">
                        {friend.name} <span className="ml-1">{friend.country}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Rating: {friend.rating}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-secondary border-border">
                      <span className="text-muted-foreground">Win: {friend.winRate}%</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </main>
  )
}
