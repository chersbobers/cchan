"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ImageUploadForm from "@/components/image-upload-form"
import ImageGallery from "@/components/image-gallery"

interface ImageBoardProps {
  username: string
}

export default function ImageBoard({ username }: ImageBoardProps) {
  const [images, setImages] = useState<any[]>([])
  const [showUpload, setShowUpload] = useState(false)

  const handleImageUpload = (imageData: any) => {
    setImages([
      { ...imageData, id: Date.now(), uploadedBy: username, uploadedAt: new Date().toLocaleString() },
      ...images,
    ])
    setShowUpload(false)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Image Board</h1>
          <p className="text-muted-foreground mt-1">Share and explore images with your school</p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)} className="bg-primary">
          {showUpload ? "Cancel" : "Upload Image"}
        </Button>
      </div>

      {showUpload && (
        <div className="mb-8 bg-card border border-border rounded-lg p-6">
          <ImageUploadForm onUpload={handleImageUpload} />
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No images yet. Be the first to share!</p>
          <Button onClick={() => setShowUpload(true)} variant="outline">
            Upload an Image
          </Button>
        </div>
      ) : (
        <ImageGallery images={images} />
      )}
    </main>
  )
}
