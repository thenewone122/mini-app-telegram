"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CastleIcon as ChessKnight,
  Settings,
  Zap,
  Clock,
  Coins,
} from "lucide-react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export function CreateGameModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleQuickStart = () => {

// socket.emit('create-bet',{
//     userId:1,
//     amount:20,
//     timeControl:10

// })

    setOpen(false);
    router.push("/waiting-for-opponent");
  };

  const handleCustomize = () => {
    setOpen(false);
    router.push("/create-game");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <ChessKnight className="w-4 h-4 mr-2" />
          Create Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ChessKnight className="w-5 h-5 mr-2 text-primary" />
            Create a Game
          </DialogTitle>
          <DialogDescription>
            Choose how you want to start your game
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 py-3 ">
          <Button
            onClick={handleQuickStart}
            className="flex items-center justify-start h-auto py-4 sm:py-6 bg-secondary hover:bg-secondary/80 border border-border"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 sm:mr-4">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Quick Start</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Start with default settings: 5+2 time control, $100 bet
              </div>
            </div>
          </Button>

          <Button
            onClick={handleCustomize}
            className="flex items-center justify-start h-auto py-4 sm:py-6 bg-secondary hover:bg-secondary/80 border border-border"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 sm:mr-4">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">Customize Game</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Set your own time control, bet amount, and other options
              </div>
            </div>
          </Button>
        </div>
        <div className="bg-secondary/50 p-2 sm:p-3 rounded-md">
          <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
            Quick Start Default Settings
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <div className="flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
              <span>5+2 minutes</span>
            </div>
            <div className="flex items-center">
              <Coins className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
              <span>$100 bet</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
