"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"
import ImageBoard from "@/components/image-board"
import Navigation from "@/components/navigation"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("charlie_user")
    if (savedUser) {
      setUsername(savedUser)
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (user: string) => {
    setUsername(user)
    setIsLoggedIn(true)
    localStorage.setItem("charlie_user", user)
  }

  const handleLogout = () => {
    setUsername("")
    setIsLoggedIn(false)
    localStorage.removeItem("charlie_user")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {isLoggedIn && <Navigation username={username} onLogout={handleLogout} />}
      {!isLoggedIn ? <LoginForm onLogin={handleLogin} /> : <ImageBoard username={username} />}
    </div>
  )
}
