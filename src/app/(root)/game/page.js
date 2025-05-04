"use client";

import { useState, useEffect, } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  Flag,
  RotateCcw,
  Trophy,
  SkipForward,
  SkipBack,
  Pause,
  RotateCw,
  Settings,
} from "lucide-react";

import Link from "next/link";
import { Chessboard } from "react-chessboard";
import { CapturedPieces } from "@/components/game/captured-pieces";
import { MoveHistory } from "@/components/game/move-history";
import ChatComponent from "@/components/game/chatMessages";

export default function GamePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft1, setTimeLeft1] = useState(300); // 5 minutes in seconds
  const [timeLeft2, setTimeLeft2] = useState(300);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [capturedPieces, setCapturedPieces] = useState({
    white: [],
    black: [],
  });

  const [boardFlipped, setBoardFlipped] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showAnalysisTools, setShowAnalysisTools] = useState(false);
  const [premoveEnabled, setPremoveEnabled] = useState(true);
  const [showLegalMoves, setShowLegalMoves] = useState(true);

  const game = {
    // id: params.id,
    player1: { name: "You", rating: 1850, avatar: "Y" },
    player2: { name: "Magnus", rating: 2200, avatar: "M" },
    betAmount: 200,
    timeControl: "5 min",
    increment: 2, // seconds added after each move
  };

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start the game timer
  useEffect(() => {



    return () => clearInterval(interval);
  }, [gameStarted, isPlayerTurn, isPaused]);


  // Toggle board orientation
  const flipBoard = () => {
    setBoardFlipped((prev) => !prev);
  };

  // Toggle game pause
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Navigate through move history
  const goToMove = (index) => {
    setCurrentMoveIndex(index);
    setShowAnalysisTools(true);
  };

  // Go to previous move
  const goToPreviousMove = () => {
    if (currentMoveIndex > -1) {
      setCurrentMoveIndex((prev) => prev - 1);
      setShowAnalysisTools(true);
    }
  };

  // Go to next move
  const goToNextMove = () => {
    if (currentMoveIndex < moveHistory.length - 1) {
      setCurrentMoveIndex((prev) => prev + 1);
    } else if (currentMoveIndex === moveHistory.length - 1) {
      setCurrentMoveIndex(-1); // Back to live game
      setShowAnalysisTools(false);
    }
  };

  // Offer draw
  const offerDraw = () => {
    // In a real app, this would send a draw offer to the opponent
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text: "You offered a draw",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  // Resign game
  const resignGame = () => {
    // In a real app, this would end the game
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text: "You resigned the game",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-foreground">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 border-primary">
                <span className="text-primary">${game.betAmount} Bet</span>
              </Badge>
              <div className="relative group">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg hidden group-hover:block z-20">
                  <div className="p-2 text-sm">
                    <div
                      className="flex items-center justify-between p-1 hover:bg-secondary/50 rounded-sm cursor-pointer"
                      onClick={flipBoard}
                    >
                      <span>Flip Board</span>
                      <RotateCw className="h-4 w-4" />
                    </div>
                    <div
                      className="flex items-center justify-between p-1 hover:bg-secondary/50 rounded-sm cursor-pointer"
                      onClick={() => setShowCoordinates((prev) => !prev)}
                    >
                      <span>Show Coordinates</span>
                      <span>{showCoordinates ? "On" : "Off"}</span>
                    </div>
                    <div
                      className="flex items-center justify-between p-1 hover:bg-secondary/50 rounded-sm cursor-pointer"
                      onClick={() => setPremoveEnabled((prev) => !prev)}
                    >
                      <span>Premoves</span>
                      <span>{premoveEnabled ? "On" : "Off"}</span>
                    </div>
                    <div
                      className="flex items-center justify-between p-1 hover:bg-secondary/50 rounded-sm cursor-pointer"
                      onClick={() => setShowLegalMoves((prev) => !prev)}
                    >
                      <span>Show Legal Moves</span>
                      <span>{showLegalMoves ? "On" : "Off"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Game Info */}
      <div className="container py-2">
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              {/* Player 2 (Top) */}
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-secondary">
                  <AvatarImage
                    src={`/placeholder.svg?height=32&width=32`}
                    alt={game.player2.name}
                  />
                  <AvatarFallback>{game.player2.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm flex items-center">
                    {game.player2.name}
                    {!isPlayerTurn && gameStarted && (
                      <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {game.player2.rating}
                  </div>
                </div>
              </div>

              {/* Time Control */}
              <div className="flex items-center px-3 py-1 bg-secondary rounded-md">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span className="font-mono font-medium">
                  {formatTime(timeLeft2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Status */}
      {!gameStarted && (
        <div className="container py-2">
          <div className="bg-secondary/50 rounded-md p-3 text-center pulse">
            Waiting for opponent to join...
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="container py-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chess Board */}
        <div className="md:col-span-2">
          <div className="relative">
            <Chessboard />

            {/* Captured Pieces */}
            <div className="mt-2">
              <CapturedPieces
                white={capturedPieces.white}
                black={capturedPieces.black}
              />
            </div>

            {/* Player 1 Info (moved here from bottom) */}
            <div className="mt-4">
              <Card className="bg-card border-border">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    {/* Player 1 (Bottom) */}
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2 bg-secondary">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                          alt={game.player1.name}
                        />
                        <AvatarFallback>{game.player1.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm flex items-center">
                          {game.player1.name}
                          {isPlayerTurn && gameStarted && (
                            <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {game.player1.rating}
                        </div>
                      </div>
                    </div>

                    {/* Time Control */}
                    <div className="flex items-center px-3 py-1 bg-secondary rounded-md">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-mono font-medium">
                        {formatTime(timeLeft1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Tools (when viewing history) */}
            {showAnalysisTools && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Analysis Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Viewing move {currentMoveIndex + 1} of {moveHistory.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousMove}
                    disabled={currentMoveIndex === -1}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMove}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnalysisTools(false)}
                  >
                    Return to Game
                  </Button>
                </div>
              </div>
            )}

            {/* Game over overlay (shown when time runs out) */}
            {(timeLeft1 === 0 || timeLeft2 === 0) && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                <Trophy className="w-16 h-16 text-chess-highlight mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  {timeLeft2 === 0 ? "You Won!" : "You Lost!"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {timeLeft2 === 0
                    ? "Your opponent ran out of time"
                    : "You ran out of time"}
                </p>
                <div className="flex gap-3">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Collect ${game.betAmount}
                  </Button>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Back to Lobby
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel (Move History & Chat) */}
        <div className="space-y-4">
          {/* Move History */}
          <div className="h-[300px]">
            <MoveHistory
              moves={moveHistory}
              currentMove={currentMoveIndex}
              onSelectMove={goToMove}
            />
          </div>

          {/* Chat */}
          <ChatComponent betId={123} user={1234} />
        </div>
      </div>

      {/* Game Controls */}
      <div className="container py-3">
        <div className="flex flex-wrap justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-secondary"
            onClick={offerDraw}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Offer Draw
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-secondary"
            onClick={resignGame}
          >
            <Flag className="w-4 h-4 mr-2" />
            Resign
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-secondary"
            onClick={togglePause}
          >
            <Pause className="w-4 h-4 mr-2" />
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-secondary"
            onClick={flipBoard}
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Flip Board
          </Button>
        </div>
      </div>
    </main>
  );
}
