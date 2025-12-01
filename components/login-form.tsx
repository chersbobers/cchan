"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MathCaptcha from "@/components/math-captcha"

interface LoginFormProps {
  onLogin: (username: string) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [captchaValid, setCaptchaValid] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required")
      return
    }

    if (!captchaValid) {
      setError("Please complete the CAPTCHA verification")
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    // Simulate auth delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // For now, just allow login (integrate Supabase later)
    onLogin(username)

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">charlie</h1>
          <p className="text-muted-foreground">A simple school image board</p>
        </div>

        <div className="bg-card border border-border p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsSignUp(false)
                setError("")
              }}
              className={`flex-1 py-2 px-4 font-medium ${
                !isSignUp ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true)
                setError("")
              }}
              className={`flex-1 py-2 px-4 font-medium ${
                isSignUp ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>
            )}

            <div className="py-2">
              <MathCaptcha onValidate={setCaptchaValid} />
            </div>

            {error && <div className="bg-destructive text-destructive-foreground text-sm p-3">{error}</div>}

            <Button type="submit" disabled={loading || !captchaValid} className="w-full">
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isSignUp ? "Already have an account? Sign in above" : "Don't have an account? Sign up above"}
        </p>
      </div>
    </div>
  )
}
