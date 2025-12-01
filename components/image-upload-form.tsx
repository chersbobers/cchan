"use client"

import type React from "react"
import { useState } from "react"

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

    if (!title.trim() && !description.trim()) {
      alert("Post something!")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    onUpload({
      title,
      description,
      image: preview || null,
    })

    setTitle("")
    setDescription("")
    setPreview("")
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 font-mono text-xs">
      <div>
        <label htmlFor="title" className="block font-bold text-foreground mb-1">
          Subject
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Subject (optional)"
          disabled={loading}
          className="w-full px-2 py-1 border border-foreground bg-background text-foreground placeholder-muted-foreground focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-bold text-foreground mb-1">
          Comment
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's on your mind?"
          disabled={loading}
          rows={4}
          className="w-full px-2 py-1 border border-foreground bg-background text-foreground placeholder-muted-foreground focus:outline-none font-mono text-xs"
        />
      </div>

      <div>
        <label htmlFor="image" className="block font-bold text-foreground mb-1">
          Image (optional)
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="text-xs cursor-pointer"
        />
        {preview && (
          <img src={preview || "/placeholder.svg"} alt="Preview" className="mt-2 max-w-xs border border-foreground" />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-3 py-1 border border-foreground bg-background text-foreground hover:bg-foreground hover:text-background font-bold text-xs disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  )
}
