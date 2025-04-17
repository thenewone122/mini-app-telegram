"use client"

import { cn } from "@/lib/utils"



// Map piece codes to symbols
const pieceSymbols = {
  wP: "",
  wR: "R",
  wN: "N",
  wB: "B",
  wQ: "Q",
  wK: "K",
  bP: "",
  bR: "R",
  bN: "N",
  bB: "B",
  bQ: "Q",
  bK: "K",
}

export function MoveHistory({ moves, currentMove = -1, onSelectMove, className }) {
  // Format move in algebraic notation
  const formatMove = (move, index) => {
    const pieceSymbol = pieceSymbols[move.piece] || ""
    const captureSymbol = move.captured ? "x" : ""
    return `${pieceSymbol}${move.from}${captureSymbol}${move.to}`
  }

  return (
    <div className={cn("bg-card rounded-md p-2 h-full overflow-auto", className)}>
      <h3 className="text-sm font-medium mb-2 px-2">Move History</h3>
      <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
        {moves.length === 0 && (
          <div className="col-span-2 text-center text-sm text-muted-foreground py-4">No moves yet</div>
        )}

        {moves.map((move, index) => (
          <div key={index} className={index % 2 === 0 ? "" : ""}>
            {index % 2 === 0 && (
              <div className="flex items-center">
                <span className="w-6 text-xs text-muted-foreground">{Math.floor(index / 2) + 1}.</span>
                <div
                  className={cn("move-history-item flex-1", currentMove === index && "active")}
                  onClick={() => onSelectMove?.(index)}
                >
                  {formatMove(move, index)}
                </div>
              </div>
            )}
            {index % 2 === 1 && (
              <div
                className={cn("move-history-item", currentMove === index && "active")}
                onClick={() => onSelectMove?.(index)}
              >
                {formatMove(move, index)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
