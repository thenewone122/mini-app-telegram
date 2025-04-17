"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Trophy, DollarSign, User, CastleIcon as ChessKnight } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/create-game", label: "Play", icon: ChessKnight },
    { href: "/transactions", label: "Wallet", icon: DollarSign },
    { href: "/leaderboard", label: "Ranks", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <div className="mobile-nav md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link key={item.href} href={item.href}>
            <div className={cn("mobile-nav-item", isActive && "active")}>
              <Icon className="w-5 h-5" />
              <span className="mobile-nav-item-text">{item.label}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
