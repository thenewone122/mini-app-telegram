import { LoadingSpinner } from "./loading-spinner"
import { ChessLoader } from "./chess-loader"
import { BoardLoader } from "./board-loader"
import { cn } from "@/lib/utils"


export function Loading({
  type = "spinner",
  size = "md",
  text,
  className,
  fullScreen = false,
  overlay = false,
}) {
  const Component = () => {
    switch (type) {
      case "pieces":
        return <ChessLoader size={size === "xl" ? "lg" : size} text={text} centered />
      case "board":
        return <BoardLoader size={size === "xl" ? "lg" : size} text={text} centered />
      case "minimal":
        return <LoadingSpinner size="sm" variant="secondary" text={text} centered />
      case "spinner":
      default:
        return <LoadingSpinner size={size} text={text} centered />
    }
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Component />
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
        <Component />
      </div>
    )
  }

  return <div className={cn("py-8", className)}>{Component()}</div>
}
