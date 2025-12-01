"use client"

interface Image {
  id: number
  title: string
  description: string
  image: string | null
  uploadedBy: string
  uploadedAt: string
}

interface ImageGalleryProps {
  images: Image[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="space-y-2 font-mono text-xs">
      {images.map((img) => (
        <div key={img.id} className="border border-foreground bg-background p-2">
          {/* Post header */}
          <div className="flex gap-2 mb-2 border-b border-foreground pb-1">
            <span className="font-bold text-foreground">{img.uploadedBy}</span>
            <span className="text-muted-foreground">{img.uploadedAt}</span>
            <span className="text-muted-foreground ml-auto">No. {img.id}</span>
          </div>

          {/* Post content */}
          <div>
            {img.title && <div className="font-bold text-foreground mb-1">{img.title}</div>}
            {img.description && (
              <div className="text-foreground mb-2 whitespace-pre-wrap break-words">{img.description}</div>
            )}
            {img.image && (
              <div className="mt-2 mb-2 max-w-full">
                <img
                  src={img.image || "/placeholder.svg"}
                  alt={img.title}
                  className="max-w-xs border border-foreground"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
