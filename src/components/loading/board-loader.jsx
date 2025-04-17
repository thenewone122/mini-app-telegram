import { cn } from "@/lib/utils"


export function BoardLoader({ size = "md", text, className, centered = false }) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  }

  return (
    <div
      className={cn("flex flex-col items-center", centered && "justify-center w-full h-full min-h-[100px]", className)}
      aria-label="Loading chess board"
      role="status"
    >
      <div className={cn("relative", sizeClasses[size])}>
        <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
          {Array.from({ length: 16 }).map((_, i) => {
            const row = Math.floor(i / 4)
            const col = i % 4
            const isBlack = (row + col) % 2 === 1
            return (
              <div
                key={i}
                className={cn(
                  "animate-pulse",
                  isBlack ? "bg-chess-dark" : "bg-chess-light",
                  `animation-delay-${i * 50}`,
                )}
              ></div>
            )
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary text-lg">♟</span>
          </div>
        </div>
      </div>
      {text && <p className="mt-3 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}
