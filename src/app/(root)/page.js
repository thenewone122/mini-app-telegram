"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  Clock,
  Trophy,
  Wallet,
  CastleIcon as ChessKnight,
  Award,
  Users,
} from "lucide-react";
import Link from "next/link";
import { BetAmountSelector } from "@/components/homgepage/bet-amount-selector";
import { TimeControlSelector } from "@/components/homgepage/time-control-selector";
import { MobileNavigation } from "@/components/homgepage/mobile-navigation";
import { CreateGameModal } from "@/components/homgepage/create-game-model";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/context/context";
import { Loading } from "@/components/loading/loading";
import BetCards from "@/components/homgepage/bet-cards";

export default function Home() {
  const { user } = useUser();
  const [amount, setAmount] = useState(null);
  const [time, setTime] = useState(null);
  const [userData, setUserData] = useState(null);
  function handleAmountOnChange(newValue) {
    setAmount(newValue);
  }
  function handleTimeOnCahnge(minute, increment) {
    setTime(minute);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axiosInstance.get(`/user/${user.userId}`);
      setUserData(response.data);
    };

    fetchUserData();
  }, [user]);

  if (!user || !userData) {
    return <Loading type="spinner" fullScreen={true} />;
  }

  return (
    <main className="flex min-h-screen flex-col pb-16 md:pb-0">
      {/* Header with balance */}
      <header className="px-3 py-3 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative mr-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary text-2xl transform -translate-y-0.5">
                  ♟
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-chess-highlight rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                +
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Play <span className="text-primary">Chess</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/transactions" className="relative group">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 rounded-full transition-all duration-200 group-hover:bg-primary/20">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-medium">{userData.balance} Birr</span>
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                +
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Create Game Card */}
      <section className=" py-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <ChessKnight className="w-5 h-5 mr-2 text-primary" />
              Create a Game
            </CardTitle>
            <CardDescription>
              Set your bet amount and wait for an opponent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BetAmountSelector onChange={handleAmountOnChange} />
                <TimeControlSelector onChange={handleTimeOnCahnge} />
              </div>
              <CreateGameModal amount={amount} time={time} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Tabs */}
      <section className=" flex-1 pb-6">
        <Tabs defaultValue="bets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger
              value="bets"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Open Bets
            </TabsTrigger>
            <TabsTrigger
              value="winners"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Winners
            </TabsTrigger>
            <TabsTrigger
              value="howto"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              How to Play
            </TabsTrigger>
          </TabsList>

          {/* Bets Tab */}
          <TabsContent value="bets" className="space-y-4 mt-4">
            <BetCards userData={userData} />
          </TabsContent>

          {/* Winners Tab */}
          <TabsContent value="winners" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Winners</h2>
              <div className="stats-counter">
                <span className="number">152</span> Games Today
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 1,
                  winner: "Alexandra",
                  loser: "Boris",
                  amount: 250,
                  time: "2h ago",
                  avatar: "A",
                },
                {
                  id: 2,
                  winner: "Magnus",
                  loser: "Wesley",
                  amount: 180,
                  time: "5h ago",
                  avatar: "M",
                },
                {
                  id: 3,
                  winner: "Hikaru",
                  loser: "Levon",
                  amount: 320,
                  time: "Yesterday",
                  avatar: "H",
                },
                {
                  id: 4,
                  winner: "Anish",
                  loser: "Maxime",
                  amount: 150,
                  time: "Yesterday",
                  avatar: "A",
                },
              ].map((game) => (
                <Card
                  key={game.id}
                  className="game-card overflow-hidden bg-card border-border"
                >
                  <div className="flex items-center p-4">
                    <Avatar className="h-10 w-10 mr-4 bg-secondary">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40`}
                        alt={game.winner}
                      />
                      <AvatarFallback>{game.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium flex items-center">
                        {game.winner}{" "}
                        <Trophy className="w-3 h-3 mx-1 text-chess-highlight" />
                        <span className="text-sm text-muted-foreground">
                          vs {game.loser}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {game.time}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="result-indicator win">
                        +${game.amount}
                      </div>
                      <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* How to Play Tab */}
          <TabsContent value="howto" className="space-y-4 mt-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  How to Play
                </CardTitle>
                <CardDescription>
                  Learn the rules and get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2">
                      1
                    </span>
                    Creating a Game
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Set your bet amount and time control, then create a game.
                    Your game will be listed in the "Open Bets" tab for others
                    to join.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2">
                      2
                    </span>
                    Joining a Game
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse available games in the "Open Bets" tab. Click "Join
                    Game" to accept a bet and start playing.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2">
                      3
                    </span>
                    Playing Chess
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Standard chess rules apply. The player with white pieces
                    moves first. When the game ends, the winner receives the bet
                    amount.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2">
                      4
                    </span>
                    Managing Your Balance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use the Telegram bot commands to deposit or withdraw funds.
                    Your current balance is always displayed at the top of the
                    app.
                  </p>
                </div>

                <Link href="#" className="block mt-4">
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    View Full Rules
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </main>
  );
}
