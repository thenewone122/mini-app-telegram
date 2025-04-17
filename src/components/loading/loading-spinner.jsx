import { cn } from "@/lib/utils"



export function LoadingSpinner({
  size = "md",
  text,
  className,
  variant = "primary",
  centered = false,
}) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const variantClasses = {
    primary: "text-primary",
    secondary: "text-muted-foreground",
    light: "text-white",
  }

  return (
    <div
      className={cn("flex flex-col items-center", centered && "justify-center w-full h-full min-h-[100px]", className)}
    >
      <div className="relative" aria-label="Loading" role="status">
        <div className={cn("animate-spin", sizeClasses[size])}>
          <div className="absolute w-full h-full border-4 border-t-transparent border-b-transparent rounded-full opacity-30 border-chess-dark"></div>
          <div
            className={cn(
              "absolute w-full h-full border-4 border-l-transparent border-r-transparent rounded-full",
              variantClasses[variant],
            )}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-xs font-bold", variantClasses[variant])}>♟</span>
        </div>
      </div>
      {text && <p className={cn("mt-2 text-sm", variantClasses[variant])}>{text}</p>}
    </div>
  )
}
