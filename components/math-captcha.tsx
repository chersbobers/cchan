"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MathCaptchaProps {
  onValidate: (isValid: boolean) => void
}

export default function MathCaptcha({ onValidate }: MathCaptchaProps) {
  const [problem, setProblem] = useState<{ a: number; b: number; op: string }>({ a: 0, b: 0, op: "+" })
  const [answer, setAnswer] = useState("")
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    generateProblem()
  }, [])

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const ops = ["+", "-", "*"]
    const op = ops[Math.floor(Math.random() * ops.length)]
    setProblem({ a, b, op })
    setAnswer("")
    setSolved(false)
    onValidate(false)
  }

  const checkAnswer = () => {
    const userAnswer = Number.parseInt(answer)
    let correct = false

    if (problem.op === "+") correct = userAnswer === problem.a + problem.b
    else if (problem.op === "-") correct = userAnswer === problem.a - problem.b
    else if (problem.op === "*") correct = userAnswer === problem.a * problem.b

    if (correct) {
      setSolved(true)
      onValidate(true)
    } else {
      setAnswer("")
      alert("Incorrect answer. Try again!")
    }
  }

  if (solved) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
        <span className="text-sm font-medium text-green-700">✓ Bot check passed</span>
        <button
          type="button"
          onClick={generateProblem}
          className="text-xs text-green-600 hover:text-green-700 underline"
        >
          Reset
        </button>
      </div>
    )
  }

  return (
    <div className="bg-muted border border-border rounded-lg p-4 space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Bot Check: Solve {problem.a} {problem.op} {problem.b}
      </label>
      <div className="flex gap-2">
        <Input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
          onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
          className="flex-1"
        />
        <Button type="button" onClick={checkAnswer} variant="outline">
          Verify
        </Button>
      </div>
    </div>
  )
}
