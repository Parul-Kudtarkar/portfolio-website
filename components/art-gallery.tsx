"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function ArtGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const exhibitions = [
    "Swiss Riviera – Armory Center for the Arts (2018)",
    "California Wine – Caltech Art Gallery (2019)",
    "Grecian Dreams – Caltech Art Gallery (2020)",
  ]

  const artworks = [
    { title: "Swiss Riviera", src: "/swiss-riviera-landscape-painting.png" },
    { title: "Grecian Dreams", src: "/grecian-dreams-classical-art.jpg" },
    { title: "California Wine", src: "/california-wine-country-painting.jpg" },
    { title: "Colors", src: "/abstract-color-composition-art.jpg" },
    { title: "Thar Desert, India", src: "/thar-desert-india.png" },
    { title: "Lavande en Provence", src: "/lavande-en-provence-lavender-fields.jpg" },
  ]

  return (
    <section>
      {/* Exhibitions Section */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="typography-section-label" role="heading" aria-level={2}>
            Exhibitions
          </p>
          <div className="space-y-3">
            {exhibitions.map((exhibit, index) => (
              <div key={index} className="flex items-center justify-center gap-3">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <p className="typography-exhibition-line m-0">{exhibit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Gallery Grid */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="typography-section-label" role="heading" aria-level={2}>
          Featured Works
        </p>

        {/* Premium Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.title}
              className="group relative rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300 cursor-pointer bg-background"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted/20">
                <img
                  src={artwork.src || "/placeholder.svg"}
                  alt={artwork.title}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6 pointer-events-none">
                  <p className="typography-content-title text-foreground" role="heading" aria-level={3}>
                    {artwork.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Light Box Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X size={32} />
            </button>

            <div className="flex-1 flex items-center justify-center min-h-0">
              <img
                src={artworks[selectedImage].src || "/placeholder.svg"}
                alt={artworks[selectedImage].title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="text-center mt-6">
              <p className="typography-content-title text-white mb-2" role="heading" aria-level={3}>
                {artworks[selectedImage].title}
              </p>
              <p className="text-[12px] font-normal text-neutral-400">
                {selectedImage + 1} / {artworks.length}
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setSelectedImage((selectedImage - 1 + artworks.length) % artworks.length)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setSelectedImage((selectedImage + 1) % artworks.length)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
