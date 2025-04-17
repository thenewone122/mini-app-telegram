"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

import Link from "next/link"
import { Chessboard } from "react-chessboard"
import { CapturedPieces } from "@/components/game/captured-pieces"
import { MoveHistory } from "@/components/game/move-history"

export default function GamePage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft1, setTimeLeft1] = useState(300) // 5 minutes in seconds
  const [timeLeft2, setTimeLeft2] = useState(300)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [moveHistory, setMoveHistory] = useState([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [capturedPieces, setCapturedPieces] = useState({
    white: [],
    black: [],
  })
  const [isCheck, setIsCheck] = useState(false)
  const [checkSquare, setCheckSquare] = useState("")
  const [lastMove, setLastMove] = useState(null)
  const [boardFlipped, setBoardFlipped] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [showAnalysisTools, setShowAnalysisTools] = useState(false)
  const [premoveEnabled, setPremoveEnabled] = useState(true)
  const [showLegalMoves, setShowLegalMoves] = useState(true)
  const [showThreats, setShowThreats] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { sender: "opponent", text: "Good luck!", time: "12:30" },
    { sender: "player", text: "Thanks, you too!", time: "12:31" },
  ])
  const chatInputRef = useRef(null)

  // Mock game data
  const game = {
    // id: params.id,
    player1: { name: "You", rating: 1850, avatar: "Y" },
    player2: { name: "Magnus", rating: 2200, avatar: "M" },
    betAmount: 200,
    timeControl: "5 min",
    increment: 2, // seconds added after each move
  }

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Start the game timer
  useEffect(() => {
    if (!gameStarted) {
      // Simulate opponent joining after 2 seconds
      const timer = setTimeout(() => {
        setGameStarted(true)
      }, 2000)
      return () => clearTimeout(timer)
    }

    if (isPaused) return

    // Run the game clock
    const interval = setInterval(() => {
      if (isPlayerTurn) {
        setTimeLeft1((prev) => Math.max(0, prev - 1))
      } else {
        setTimeLeft2((prev) => Math.max(0, prev - 1))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted, isPlayerTurn, isPaused])

  // Handle moves
  const handleMove = (from, to, piece) => {
    // Add time increment after move
    if (isPlayerTurn) {
      setTimeLeft1((prev) => prev + game.increment)
    } else {
      setTimeLeft2((prev) => prev + game.increment)
    }

    // Toggle turns
    setIsPlayerTurn((prev) => !prev)

    // Update last move
    setLastMove({ from, to })

    // Add to move history
    const newMove = { from, to, piece }
    setMoveHistory((prev) => [...prev, newMove])
    setCurrentMoveIndex(moveHistory.length)

    // Randomly set check (for demonstration)
    const randomCheck = Math.random() > 0.8
    setIsCheck(randomCheck)
    if (randomCheck) {
      setCheckSquare(isPlayerTurn ? "e8" : "e1")
    } else {
      setCheckSquare("")
    }

    // Simulate opponent move after 1-3 seconds
    if (isPlayerTurn) {
      const delay = 1000 + Math.random() * 2000
      setTimeout(() => {
        // Simulate a capture occasionally
        if (Math.random() > 0.7) {
          const capturedPiece = Math.random() > 0.5 ? "wP" : "wN"
          setCapturedPieces((prev) => ({
            ...prev,
            black: [...prev.black, capturedPiece],
          }))
        }

        setIsPlayerTurn(true)
      }, delay)
    }
  }

  // Handle chat message submission
  const handleSendMessage = () => {
    if (!chatInputRef.current?.value.trim()) return

    const newMessage = {
      sender: "player",
      text: chatInputRef.current.value,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setChatMessages((prev) => [...prev, newMessage])
    chatInputRef.current.value = ""
  }

  // Handle keyboard input for chat
  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Toggle board orientation
  const flipBoard = () => {
    setBoardFlipped((prev) => !prev)
  }

  // Toggle game pause
  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  // Navigate through move history
  const goToMove = (index) => {
    setCurrentMoveIndex(index)
    setShowAnalysisTools(true)
  }

  // Go to previous move
  const goToPreviousMove = () => {
    if (currentMoveIndex > -1) {
      setCurrentMoveIndex((prev) => prev - 1)
      setShowAnalysisTools(true)
    }
  }

  // Go to next move
  const goToNextMove = () => {
    if (currentMoveIndex < moveHistory.length - 1) {
      setCurrentMoveIndex((prev) => prev + 1)
    } else if (currentMoveIndex === moveHistory.length - 1) {
      setCurrentMoveIndex(-1) // Back to live game
      setShowAnalysisTools(false)
    }
  }

  // Offer draw
  const offerDraw = () => {
    // In a real app, this would send a draw offer to the opponent
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text: "You offered a draw",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])
  }

  // Resign game
  const resignGame = () => {
    // In a real app, this would end the game
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text: "You resigned the game",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])
  }

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
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={game.player2.name} />
                  <AvatarFallback>{game.player2.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm flex items-center">
                    {game.player2.name}
                    {!isPlayerTurn && gameStarted && <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{game.player2.rating}</div>
                </div>
              </div>

              {/* Time Control */}
              <div className="flex items-center px-3 py-1 bg-secondary rounded-md">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span className="font-mono font-medium">{formatTime(timeLeft2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Status */}
      {!gameStarted && (
        <div className="container py-2">
          <div className="bg-secondary/50 rounded-md p-3 text-center pulse">Waiting for opponent to join...</div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="container py-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chess Board */}
        <div className="md:col-span-2">
          <div className="relative">
            <Chessboard
            />

            {/* Captured Pieces */}
            <div className="mt-2">
              <CapturedPieces white={capturedPieces.white} black={capturedPieces.black} />
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
                  <Button variant="outline" size="sm" onClick={goToPreviousMove} disabled={currentMoveIndex === -1}>
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMove}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAnalysisTools(false)}>
                    Return to Game
                  </Button>
                </div>
              </div>
            )}

            {/* Game over overlay (shown when time runs out) */}
            {(timeLeft1 === 0 || timeLeft2 === 0) && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                <Trophy className="w-16 h-16 text-chess-highlight mb-4" />
                <h2 className="text-2xl font-bold mb-2">{timeLeft2 === 0 ? "You Won!" : "You Lost!"}</h2>
                <p className="text-muted-foreground mb-4">
                  {timeLeft2 === 0 ? "Your opponent ran out of time" : "You ran out of time"}
                </p>
                <div className="flex gap-3">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Collect ${game.betAmount}
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
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
            <MoveHistory moves={moveHistory} currentMove={currentMoveIndex} onSelectMove={goToMove} />
          </div>

          {/* Chat */}
          <Card className="bg-card border-border h-[calc(100%-316px)]">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-2 border-b border-border">
                <h3 className="text-sm font-medium">Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-72">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "player" ? "justify-end" : ""}`}>
                    {msg.sender === "system" && (
                      <div className="text-xs text-center w-full text-muted-foreground py-1">{msg.text}</div>
                    )}

                    {msg.sender !== "system" && (
                      <div
                        className={`max-w-[80%] ${msg.sender === "player" ? "bg-primary/20" : "bg-secondary"} rounded-lg p-2`}
                      >
                        <div className="text-sm">{msg.text}</div>
                        <div className="text-xs text-muted-foreground text-right">{msg.time}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border flex gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-1 text-sm border border-border rounded-md bg-secondary"
                  onKeyDown={handleChatKeyDown}
                />
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleSendMessage}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Player 1 Info */}
      <div className="container py-2">
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              {/* Player 1 (Bottom) */}
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-secondary">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={game.player1.name} />
                  <AvatarFallback>{game.player1.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm flex items-center">
                    {game.player1.name}
                    {isPlayerTurn && gameStarted && <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{game.player1.rating}</div>
                </div>
              </div>

              {/* Time Control */}
              <div className="flex items-center px-3 py-1 bg-secondary rounded-md">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span className="font-mono font-medium">{formatTime(timeLeft1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Controls */}
      <div className="container py-3">
        <div className="flex flex-wrap justify-between gap-2">
          <Button variant="outline" size="sm" className="border-border hover:bg-secondary" onClick={offerDraw}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Offer Draw
          </Button>
          <Button variant="outline" size="sm" className="border-border hover:bg-secondary" onClick={resignGame}>
            <Flag className="w-4 h-4 mr-2" />
            Resign
          </Button>
          <Button variant="outline" size="sm" className="border-border hover:bg-secondary" onClick={togglePause}>
            <Pause className="w-4 h-4 mr-2" />
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline" size="sm" className="border-border hover:bg-secondary" onClick={flipBoard}>
            <RotateCw className="w-4 h-4 mr-2" />
            Flip Board
          </Button>
        </div>
      </div>
    </main>
  )
}
