"use client"

import { Button } from "@/components/ui/button"

interface NavigationProps {
  username: string
  onLogout: () => void
}

export default function Navigation({ username, onLogout }: NavigationProps) {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">charlie</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">{username}</span>
          </span>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
