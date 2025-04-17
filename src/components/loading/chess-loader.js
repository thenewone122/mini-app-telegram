import { cn } from "@/lib/utils"



export function ChessLoader({ size = "md", text, className, variant = "primary", centered = false }) {
  const sizeClasses = {
    sm: "w-24 h-6",
    md: "w-32 h-8",
    lg: "w-40 h-10",
  }

  const pieceSize = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
  }

  const variantClasses = {
    primary: "text-primary",
    secondary: "text-muted-foreground",
    light: "text-white",
  }

  return (
    <div
      className={cn("flex flex-col items-center", centered && "justify-center w-full h-full min-h-[100px]", className)}
      aria-label="Loading"
      role="status"
    >
      <div className={cn("relative", sizeClasses[size])}>
        <div className="absolute inset-0 flex items-center justify-between">
          <span className={cn("chess-piece pawn animate-bounce", pieceSize[size], variantClasses[variant])}>♙</span>
          <span
            className={cn(
              "chess-piece knight animate-bounce",
              pieceSize[size],
              variantClasses[variant],
              "animation-delay-100",
            )}
          >
            ♘
          </span>
          <span
            className={cn(
              "chess-piece bishop animate-bounce",
              pieceSize[size],
              variantClasses[variant],
              "animation-delay-200",
            )}
          >
            ♗
          </span>
          <span
            className={cn(
              "chess-piece rook animate-bounce",
              pieceSize[size],
              variantClasses[variant],
              "animation-delay-300",
            )}
          >
            ♖
          </span>
          <span
            className={cn(
              "chess-piece queen animate-bounce",
              pieceSize[size],
              variantClasses[variant],
              "animation-delay-400",
            )}
          >
            ♕
          </span>
          <span
            className={cn(
              "chess-piece king animate-bounce",
              pieceSize[size],
              variantClasses[variant],
              "animation-delay-500",
            )}
          >
            ♔
          </span>
        </div>
      </div>
      {text && <p className={cn("mt-3 text-sm", variantClasses[variant])}>{text}</p>}
    </div>
  )
}
