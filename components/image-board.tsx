"use client"

import { useState, useEffect } from "react"
import ImageUploadForm from "@/components/image-upload-form"
import ImageGallery from "@/components/image-gallery"

interface ImageBoardProps {
  username: string
}

export default function ImageBoard({ username }: ImageBoardProps) {
  const [images, setImages] = useState<any[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("charlie_posts")
    if (saved) {
      try {
        setImages(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load posts:", e)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("charlie_posts", JSON.stringify(images))
    }
  }, [images, loading])

  const handleImageUpload = (imageData: any) => {
    const newPost = {
      ...imageData,
      id: Date.now(),
      uploadedBy: username,
      uploadedAt: new Date().toLocaleString(),
    }
    setImages([newPost, ...images])
    setShowUpload(false)
  }

  if (loading) {
    return <div className="p-4 text-foreground">Loading...</div>
  }

  return (
    <main className="max-w-4xl mx-auto p-2 font-mono text-sm">
      <div className="border border-foreground mb-4 p-2 bg-background">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-foreground font-bold text-lg">/charlie/ - Charlie Board</h1>
        </div>
        <div className="text-xs text-muted-foreground border-t border-foreground pt-2 mb-2">
          A place for school posts
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-3 py-1 border border-foreground bg-background text-foreground hover:bg-foreground hover:text-background text-xs font-bold"
        >
          {showUpload ? "Cancel" : "New Post"}
        </button>
      </div>

      {showUpload && (
        <div className="border border-foreground mb-4 p-4 bg-background">
          <ImageUploadForm onUpload={handleImageUpload} />
        </div>
      )}

      <div className="space-y-2">
        {images.length === 0 ? (
          <div className="border border-foreground p-4 text-center text-muted-foreground text-xs">
            No posts yet. Be the first!
          </div>
        ) : (
          <ImageGallery images={images} />
        )}
      </div>
    </main>
  )
}
