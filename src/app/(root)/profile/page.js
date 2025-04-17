import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ChevronRight, Clock, Settings, Trophy, User } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-foreground">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-bold">Profile</h1>
            <Link href="/settings">
              <Settings className="w-5 h-5 text-foreground" />
            </Link>
          </div>
        </div>
      </header>

      {/* Profile Card */}
      <section className="container py-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-20 w-20 mb-4 bg-secondary">
                <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt="Profile" />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-muted-foreground">@johndoe</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="border-primary bg-secondary/50">
                  <span className="text-primary">Rating: 1850</span>
                </Badge>
                <Badge variant="outline" className="border-primary bg-secondary/50">
                  <Trophy className="w-3 h-3 mr-1 text-chess-highlight" />
                  <span className="text-primary">15 Wins</span>
                </Badge>
              </div>
              <div className="grid grid-cols-3 w-full mt-6 text-center gap-4">
                <div>
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-xs text-muted-foreground">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Losses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs text-muted-foreground">Draws</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stats and Links */}
      <section className="container pb-6">
        <h3 className="text-lg font-semibold mb-3">Statistics</h3>
        <Card className="mb-4 bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-3 text-chess-highlight" />
                  <span>Win Rate</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">65%</span>
                  <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-primary" />
                  <span>Average Game Time</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">12m 30s</span>
                  <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 flex items-center justify-center text-primary">$</div>
                  <span>Total Earnings</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">$2,450</span>
                  <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-lg font-semibold mb-3">Recent Games</h3>
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[
                { id: 1, opponent: "Magnus", result: "win", amount: 200, time: "2h ago" },
                { id: 2, opponent: "Hikaru", result: "loss", amount: -150, time: "Yesterday" },
                { id: 3, opponent: "Fabiano", result: "win", amount: 300, time: "Apr 10, 2023" },
              ].map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">vs {game.opponent}</div>
                    <div className="text-sm text-muted-foreground">{game.time}</div>
                  </div>
                  <div className="flex items-center">
                    <span className={`font-medium ${game.result === "win" ? "text-primary" : "text-destructive"}`}>
                      {game.result === "win" ? "+" : ""}
                      {game.amount}
                    </span>
                    <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
