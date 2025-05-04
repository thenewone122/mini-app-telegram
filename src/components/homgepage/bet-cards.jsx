"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  ChevronRight,
  Clock,
  Filter,
  Gamepad2,
  Play,
  Star,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import Skeleton from "react-loading-skeleton";
import axiosInstance from "@/lib/axios";
import socket from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const BetCards = ({ userData }) => {
  const { user } = useUser();
  const [activeBets, setActiveBets] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAmount: 0,
    maxAmount: 1000,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axiosInstance.get("/bets");
        setActiveBets(response.data);
        setFilteredBets(response.data);
      } catch (err) {
        console.error("Error fetching active bets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBets();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNewBets = (data) => {
      console.log(data);
      const newBet = data;
      setActiveBets((prev) => [newBet, ...prev]);

      // Apply filters to new bet
      if (
        newBet.amount >= filters.minAmount &&
        newBet.amount <= filters.maxAmount
      ) {
        setFilteredBets((prev) => [newBet, ...prev]);
      }
    };
    socket.on("new-bet", handleNewBets);

    return () => {
      socket.off("new-bet", handleNewBets);
    };
  }, [socket, filters]);

  // Apply filters when they change
  useEffect(() => {
    const filtered = activeBets.filter(
      (bet) =>
        bet.amount >= filters.minAmount && bet.amount <= filters.maxAmount
    );
    setFilteredBets(filtered);
  }, [filters, activeBets]);

  const handleJoinBet = (bet) => {
    setSelectedBet(bet);
    setShowConfirmDialog(true);
  };

  const confirmJoinBet = () => {
    if (!selectedBet) return;

    socket.emit("join-bet", {
      betId: selectedBet.id,
      userId: parseInt(user.userId),
    });

    setShowConfirmDialog(false);
    router.push(`/waiting-for-opponent/${selectedBet.id}`);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Find max bet amount for slider
  const maxBetAmount = activeBets.length
    ? Math.max(...activeBets.map((bet) => bet.amount))
    : 1000;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Available Games</h2>
        <div className="flex items-center gap-2">
          <div className="stats-counter">
            {loading ? (
              <Skeleton
                width={100}
                height={20}
                baseColor="#2d2d2d"
                highlightColor="#3d3d3d"
              />
            ) : (
              <>
                <span className="number">{filteredBets.length}</span> Active
                Games
              </>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={showFilters ? "bg-primary/10" : ""}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="end">
              <DropdownMenuGroup>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Bet Amount Range</Label>
                      <div className="text-xs text-muted-foreground">
                        {filters.minAmount} - {filters.maxAmount} Birr
                      </div>
                    </div>
                    <div className="pt-4 px-2">
                      <Slider
                        defaultValue={[filters.minAmount, filters.maxAmount]}
                        max={maxBetAmount}
                        step={10}
                        onValueChange={(values) => {
                          handleFilterChange("minAmount", values[0]);
                          handleFilterChange("maxAmount", values[1]);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="grid gap-1.5 flex-1">
                      <Label htmlFor="minAmount">Min Amount</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={filters.minAmount}
                        onChange={(e) =>
                          handleFilterChange(
                            "minAmount",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-1.5 flex-1">
                      <Label htmlFor="maxAmount">Max Amount</Label>
                      <Input
                        id="maxAmount"
                        type="number"
                        value={filters.maxAmount}
                        onChange={(e) =>
                          handleFilterChange(
                            "maxAmount",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filters display */}
      {(filters.minAmount > 0 || filters.maxAmount < maxBetAmount) && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">Filters:</span>
          <Badge variant="outline" className="flex items-center gap-1">
            {filters.minAmount}-{filters.maxAmount} birr
            <button
              onClick={() =>
                setFilters({ minAmount: 0, maxAmount: maxBetAmount })
              }
              className="ml-1 hover:bg-secondary rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border">
              <div className="flex items-center p-4">
                <Skeleton
                  circle
                  height={40}
                  width={40}
                  baseColor="#2d2d2d"
                  highlightColor="#3d3d3d"
                />
                <div className="flex-1 ml-4 space-y-2">
                  <Skeleton
                    height={16}
                    width={120}
                    baseColor="#2d2d2d"
                    highlightColor="#3d3d3d"
                  />
                  <div className="flex items-center">
                    <Skeleton
                      height={12}
                      width={80}
                      baseColor="#2d2d2d"
                      highlightColor="#3d3d3d"
                    />
                  </div>
                </div>
                <Skeleton
                  height={32}
                  width={80}
                  baseColor="#2d2d2d"
                  highlightColor="#3d3d3d"
                />
              </div>
            </Card>
          ))
        ) : filteredBets.length === 0 ? (
          <div className="text-muted-foreground text-center py-8 bg-card/30 rounded-lg border border-dashed border-border">
            <div className="flex flex-col items-center gap-2">
              <Filter className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="font-medium">No games match your filters</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filter settings or check back later
              </p>
              {activeBets.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({ minAmount: 0, maxAmount: maxBetAmount })
                  }
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          filteredBets.map((bet) => (
            <Card
              key={bet.id}
              className="game-card bg-card border-border hover:border-primary/20 transition-all duration-300"
            >
              <div className="p-0">
                <div className="flex items-center p-4 shine-effect">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-1 ring-offset-background">
                      <AvatarImage
                        src={`/placeholder.svg?height=48&width=48`}
                        alt={bet.creator.username}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary-foreground font-medium">
                        {bet.creator.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-background">
                      {Math.floor(Math.random() * 10)}
                    </div>
                  </div>

                  <div className="flex-1 ml-4">
                    <div className="flex items-center mb-1">
                      <div className="font-medium text-base">
                        {bet.creator.username}
                      </div>
                      <div className="rating-badge ml-2 flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400 mr-0.5" />
                        <span>{"rating"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="time-badge">
                        <Clock className="w-3 h-3" />
                        {secondsToMinutes(bet.timeControl)}
                      </div>

                      <div className="relative px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary-foreground/90">
                        <Trophy className="w-3 h-3 inline-block mr-1" />
                        Win Rate: {Math.floor(Math.random() * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="relative mb-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full blur-[1px]"></div>
                      <div className="relative bg-background/80 backdrop-blur-sm text-primary-foreground font-medium px-3 py-1 rounded-full text-sm border border-primary/30 shadow-sm">
                        {bet.amount} birr
                      </div>
                    </div>

                    {bet.creator.id == user?.userId ? (
                      <div className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-md">
                        Your game
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="join-btn bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-1 rounded-md shadow-sm hover:shadow-primary/25 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        onClick={() => handleJoinBet(bet)}
                      >
                        <span>Join Game</span>
                        <Gamepad2 className="w-4 h-4 btn-icon" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="h-1 w-full bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5"></div>

                <div className="px-4 py-2 bg-secondary/20 flex justify-between items-center text-xs text-muted-foreground">
                  <div>
                    Created {" "}
                    {formatDistanceToNow(new Date(bet.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                    Active Now
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Join Game</DialogTitle>
            <DialogDescription>
              You are about to join a game created by{" "}
              <span className="font-medium">
                {selectedBet?.creator?.username}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-sm">Bet Amount</div>
              <div className="font-medium text-primary">
                {selectedBet?.amount} Birr
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-sm">Your Balance</div>
              <div className="font-medium">
                {userData?.balance || "N/A"} Birr
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-sm">Balance After Bet</div>
              <div className="font-medium">
                {userData?.balance && selectedBet
                  ? (userData.balance - selectedBet.amount).toFixed(2)
                  : "N/A"}{" "}
                Birr
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              This amount will be deducted from your balance when you join the
              game.
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmJoinBet}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Confirm & Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

function secondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default BetCards;
