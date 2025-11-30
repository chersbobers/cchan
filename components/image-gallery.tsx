"use client"

interface Image {
  id: number
  title: string
  description: string
  image: string
  uploadedBy: string
  uploadedAt: string
}

interface ImageGalleryProps {
  images: Image[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img) => (
        <div
          key={img.id}
          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={img.image || "/placeholder.svg"}
              alt={img.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-foreground truncate">{img.title}</h3>
            {img.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{img.description}</p>}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              <span>by {img.uploadedBy}</span>
              <span>{img.uploadedAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
