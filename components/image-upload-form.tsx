"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageUploadFormProps {
  onUpload: (imageData: any) => void
}

export default function ImageUploadForm({ onUpload }: ImageUploadFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [preview, setPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !preview) {
      alert("Please add a title and select an image")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    onUpload({
      title,
      description,
      image: preview,
    })

    setTitle("")
    setDescription("")
    setPreview("")
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-foreground mb-2">
          Select Image
        </label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="cursor-pointer"
        />
        {preview && (
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="mt-4 max-h-48 rounded-lg border border-border"
          />
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
          Title
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your image a title"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description"
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
        />
      </div>

      <Button type="submit" disabled={loading || !preview} className="w-full">
        {loading ? "Uploading..." : "Upload Image"}
      </Button>
    </form>
  )
}
