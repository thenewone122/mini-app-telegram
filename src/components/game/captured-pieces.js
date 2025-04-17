import { cn } from "@/lib/utils"

// Chess piece Unicode characters
const pieces = {
  wP: "♙",
  wR: "♖",
  wN: "♘",
  wB: "♗",
  wQ: "♕",
  wK: "♔",
  bP: "♟",
  bR: "♜",
  bN: "♞",
  bB: "♝",
  bQ: "♛",
  bK: "♚",
}

// Piece values for sorting
const pieceValues = {
  P: 1,
  N: 3,
  B: 3,
  R: 5,
  Q: 9,
  K: 0,
}

export function CapturedPieces({ white, black, className }) {
  // Sort pieces by value
  const sortPieces = (pieces) => {
    return [...pieces].sort((a, b) => {
      const pieceA = a.charAt(1)
      const pieceB = b.charAt(1)
      return pieceValues[pieceA] - pieceValues[pieceB]
    })
  }

  const sortedWhite = sortPieces(white)
  const sortedBlack = sortPieces(black)

  // Calculate material advantage
  const calculateAdvantage = () => {
    let whiteValue = 0
    let blackValue = 0

    white.forEach((piece) => {
      whiteValue += pieceValues[piece.charAt(1)]
    })

    black.forEach((piece) => {
      blackValue += pieceValues[piece.charAt(1)]
    })

    const advantage = blackValue - whiteValue

    if (advantage === 0) return null

    return {
      side: advantage > 0 ? "black" : "white",
      value: Math.abs(advantage),
    }
  }

  const advantage = calculateAdvantage()

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1">
        {sortedBlack.map((piece, index) => (
          <span key={index} className="captured-piece text-black">
            {pieces[piece]}
          </span>
        ))}
        {advantage && advantage.side === "white" && (
          <span className="text-xs font-medium ml-auto text-white">+{advantage.value}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {sortedWhite.map((piece, index) => (
          <span key={index} className="captured-piece text-white">
            {pieces[piece]}
          </span>
        ))}
        {advantage && advantage.side === "black" && (
          <span className="text-xs font-medium ml-auto text-black">+{advantage.value}</span>
        )}
      </div>
    </div>
  )
}
