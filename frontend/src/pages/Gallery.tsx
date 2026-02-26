import { useGalleryPhotos } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Image, X } from "lucide-react";
import { useState } from "react";

export default function Gallery() {
  const { data: photos, isLoading } = useGalleryPhotos();
  const [lightbox, setLightbox] = useState<{ url: string; caption: string } | null>(null);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/assets/generated/pattern-bg.dim_400x400.png')`, backgroundRepeat: "repeat" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Image className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-fredoka text-5xl sm:text-6xl text-white mb-4">Gallery</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Glimpses of joy, learning, and growth at INDO KIDZ — where every moment is a memory.
          </p>
        </div>
      </section>

      {/* Photos */}
      <section className="py-16 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : photos && photos.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <Badge className="bg-primary/10 text-primary border-primary/20">{photos.length} Photos</Badge>
              </div>
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id.toString()}
                    className="break-inside-avoid rounded-2xl overflow-hidden shadow-card cursor-pointer group relative"
                    onClick={() => setLightbox({ url: photo.url, caption: photo.caption })}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Image className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="font-fredoka text-2xl text-foreground mb-2">Gallery Coming Soon</h3>
              <p className="text-muted-foreground">Photos will be added by the school administration soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="max-h-[80vh] max-w-full rounded-xl object-contain" />
            {lightbox.caption && <p className="text-white text-center">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
