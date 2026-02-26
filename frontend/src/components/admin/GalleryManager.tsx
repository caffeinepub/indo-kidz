import { useState, useRef } from "react";
import { useGalleryPhotos, useAddPhoto, useDeletePhoto } from "../../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Image, Upload, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function GalleryManager() {
  const { data: photos, isLoading } = useGalleryPhotos();
  const addPhoto = useAddPhoto();
  const deletePhoto = useDeletePhoto();

  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setPreview(null);
    setBase64(null);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!base64) {
      toast.error("Please select an image first.");
      return;
    }
    try {
      await addPhoto.mutateAsync({ url: base64, caption });
      toast.success("Photo uploaded successfully! ✅");
      clearSelection();
    } catch {
      toast.error("Failed to upload photo.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePhoto.mutateAsync(id);
      toast.success("Photo deleted.");
    } catch {
      toast.error("Failed to delete photo.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5 text-primary" />
        <h2 className="font-fredoka text-2xl text-foreground">Manage Gallery</h2>
      </div>

      {/* Upload Section */}
      <div className="border border-border rounded-xl p-5 bg-muted/30">
        <h3 className="font-semibold text-foreground mb-4">Upload New Photo</h3>
        <div className="space-y-4">
          {preview ? (
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-36 object-cover rounded-xl border border-border"
              />
              <button
                onClick={clearSelection}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to select an image</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 2MB</p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div>
            <Label>Caption (optional)</Label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe this photo..."
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!base64 || addPhoto.isPending}
            className="bg-gradient-hero text-white hover:opacity-90"
          >
            {addPhoto.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload Photo
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Photos Grid */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">
          Existing Photos ({photos?.length ?? 0})
        </h3>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id.toString()} className="relative group rounded-xl overflow-hidden border border-border">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full aspect-square object-cover"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs p-2 truncate">
                    {photo.caption}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-9 h-9 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The photo will be permanently removed from the gallery.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(photo.id)}
                          className="bg-destructive text-white hover:bg-destructive/80"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <Image className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No photos yet. Upload your first photo above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
