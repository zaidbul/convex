import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
  Maximize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/media")({
  component: MediaPage,
});

// ============================================================================
// PLACEHOLDER IMAGE DATA
// ============================================================================

const placeholderImages = [
  { id: 1, gradient: "from-blue-500 to-purple-600", label: "Mountain Sunset" },
  { id: 2, gradient: "from-green-500 to-teal-600", label: "Forest Path" },
  { id: 3, gradient: "from-orange-500 to-red-600", label: "Desert Dunes" },
  { id: 4, gradient: "from-pink-500 to-rose-600", label: "Cherry Blossoms" },
  { id: 5, gradient: "from-cyan-500 to-blue-600", label: "Ocean Waves" },
  { id: 6, gradient: "from-violet-500 to-purple-600", label: "Northern Lights" },
  { id: 7, gradient: "from-amber-500 to-orange-600", label: "Autumn Leaves" },
  { id: 8, gradient: "from-emerald-500 to-green-600", label: "Tropical Garden" },
  { id: 9, gradient: "from-indigo-500 to-blue-600", label: "Night Sky" },
  { id: 10, gradient: "from-rose-500 to-pink-600", label: "Spring Flowers" },
  { id: 11, gradient: "from-teal-500 to-cyan-600", label: "Coral Reef" },
  { id: 12, gradient: "from-yellow-500 to-amber-600", label: "Golden Hour" },
];

const masonryImages = [
  { id: 1, gradient: "from-blue-500 to-indigo-600", height: "h-48" },
  { id: 2, gradient: "from-green-500 to-emerald-600", height: "h-64" },
  { id: 3, gradient: "from-purple-500 to-violet-600", height: "h-40" },
  { id: 4, gradient: "from-orange-500 to-amber-600", height: "h-56" },
  { id: 5, gradient: "from-pink-500 to-rose-600", height: "h-44" },
  { id: 6, gradient: "from-cyan-500 to-teal-600", height: "h-52" },
  { id: 7, gradient: "from-red-500 to-orange-600", height: "h-36" },
  { id: 8, gradient: "from-indigo-500 to-purple-600", height: "h-60" },
  { id: 9, gradient: "from-emerald-500 to-green-600", height: "h-48" },
];

// ============================================================================
// IMAGE GRID COMPONENT
// ============================================================================

function ImageGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Grid</CardTitle>
        <CardDescription>
          Responsive grid layout for displaying multiple images uniformly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {placeholderImages.slice(0, 8).map((img) => (
            <div
              key={img.id}
              className={cn(
                "aspect-square rounded-lg bg-gradient-to-br cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
                img.gradient,
              )}
            >
              <div className="h-full w-full flex items-end p-3">
                <span className="text-xs text-white/80 font-medium">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MASONRY LAYOUT COMPONENT
// ============================================================================

function MasonryLayout() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Masonry Layout</CardTitle>
        <CardDescription>CSS columns-based masonry for variable height content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {masonryImages.map((img) => (
            <div
              key={img.id}
              className={cn(
                "break-inside-avoid rounded-lg bg-gradient-to-br cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
                img.gradient,
                img.height,
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LIGHTBOX COMPONENT
// ============================================================================

function Lightbox() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = placeholderImages.slice(0, 6);
  const currentImage = images.find((img) => img.id === selectedImage);

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImage);
    if (direction === "prev") {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      setSelectedImage(images[newIndex].id);
    } else {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      setSelectedImage(images[newIndex].id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lightbox Gallery</CardTitle>
        <CardDescription>
          Click images to view in a full-screen dialog with navigation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => (
            <Dialog
              key={img.id}
              open={selectedImage === img.id}
              onOpenChange={(open) => setSelectedImage(open ? img.id : null)}
            >
              <DialogTrigger
                render={
                  <button
                    className={cn(
                      "aspect-video rounded-lg bg-gradient-to-br cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg relative group",
                      img.gradient,
                    )}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                      <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                }
              />
              <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <div className="relative">
                  <div className={cn("aspect-video bg-gradient-to-br", currentImage?.gradient)}>
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-2xl text-white font-semibold">
                        {currentImage?.label}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => navigateImage("prev")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => navigateImage("next")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
                <DialogHeader className="p-4">
                  <DialogTitle>{currentImage?.label}</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CAROUSEL WITH THUMBNAILS
// ============================================================================

function CarouselWithThumbnails() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = placeholderImages.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carousel with Thumbnails</CardTitle>
        <CardDescription>Embla-based carousel with thumbnail navigation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Carousel */}
        <Carousel className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {images.map((img, _index) => (
              <CarouselItem key={img.id}>
                <div
                  className={cn(
                    "aspect-video rounded-lg bg-gradient-to-br flex items-center justify-center",
                    img.gradient,
                  )}
                >
                  <span className="text-xl text-white font-semibold">{img.label}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Thumbnails */}
        <div className="flex justify-center gap-2">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "w-16 h-12 rounded-md bg-gradient-to-br transition-all",
                img.gradient,
                selectedIndex === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-60 hover:opacity-100",
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// VIDEO PLAYER MOCKUP
// ============================================================================

function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([35]);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Player</CardTitle>
        <CardDescription>Custom video player UI with playback controls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-2xl mx-auto">
          {/* Video Container */}
          <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <FileVideo className="h-16 w-16 text-slate-600" />
            </div>
            {/* Play overlay */}
            {!isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="h-16 w-16 rounded-full bg-surface-lowest/90 flex items-center justify-center">
                  <Play className="h-8 w-8 text-slate-900 ml-1" />
                </div>
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="bg-slate-900 rounded-b-lg p-4 space-y-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-10">1:24</span>
              <Slider
                value={progress}
                onValueChange={(value) => setProgress(Array.isArray(value) ? [...value] : [value])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-slate-400 w-10">3:45</span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:text-white hover:bg-surface-lowest/10"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-surface-lowest/10"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:text-white hover:bg-surface-lowest/10"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:text-white hover:bg-surface-lowest/10"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={(value) => setVolume(Array.isArray(value) ? [...value] : [value])}
                  max={100}
                  step={1}
                  className="w-24"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:text-white hover:bg-surface-lowest/10"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// AUDIO PLAYER MOCKUP
// ============================================================================

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([45]);
  const [volume, setVolume] = useState([80]);

  const tracks = [
    { id: 1, title: "Morning Meditation", artist: "Calm Sounds", duration: "4:32" },
    { id: 2, title: "Ocean Waves", artist: "Nature Sounds", duration: "6:15" },
    { id: 3, title: "Forest Rain", artist: "Ambient Music", duration: "5:48" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Player</CardTitle>
        <CardDescription>Compact audio player with playlist support</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-md mx-auto space-y-4">
          {/* Now Playing */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
              <FileAudio className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Morning Meditation</p>
              <p className="text-sm text-on-surface-variant">Calm Sounds</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-on-surface-variant">2:05</span>
                <Slider
                  value={progress}
                  onValueChange={(value) =>
                    setProgress(Array.isArray(value) ? [...value] : [value])
                  }
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-on-surface-variant">4:32</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon-sm">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button size="icon-lg" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon-sm">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 justify-center">
            <Volume2 className="h-4 w-4 text-on-surface-variant" />
            <Slider
              value={volume}
              onValueChange={(value) => setVolume(Array.isArray(value) ? [...value] : [value])}
              max={100}
              step={1}
              className="w-32"
            />
          </div>

          {/* Playlist */}
          <div className="rounded-md space-y-2">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left hover:bg-surface-container transition-colors",
                  index === 0 && "bg-primary/5",
                )}
              >
                <div className="h-10 w-10 rounded bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
                  {index === 0 && isPlaying ? (
                    <Pause className="h-4 w-4 text-primary" />
                  ) : (
                    <Play className="h-4 w-4 text-on-surface-variant" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm truncate", index === 0 && "font-medium")}>
                    {track.title}
                  </p>
                  <p className="text-xs text-on-surface-variant">{track.artist}</p>
                </div>
                <span className="text-xs text-on-surface-variant">{track.duration}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// FILE PREVIEW CARDS
// ============================================================================

const fileTypes = [
  {
    icon: FileImage,
    name: "photo-album.jpg",
    size: "2.4 MB",
    type: "image",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: FileType,
    name: "report-2024.pdf",
    size: "1.8 MB",
    type: "pdf",
    gradient: "from-red-500 to-orange-600",
  },
  {
    icon: FileVideo,
    name: "presentation.mp4",
    size: "45.2 MB",
    type: "video",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: FileSpreadsheet,
    name: "budget.xlsx",
    size: "156 KB",
    type: "spreadsheet",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: FileText,
    name: "notes.docx",
    size: "89 KB",
    type: "document",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: FileAudio,
    name: "podcast.mp3",
    size: "12.3 MB",
    type: "audio",
    gradient: "from-amber-500 to-orange-600",
  },
];

function FilePreviewCards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Preview Cards</CardTitle>
        <CardDescription>Visual file previews with type-specific icons and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fileTypes.map((file) => {
            const Icon = file.icon;
            return (
              <div
                key={file.name}
                className="group rounded-md overflow-hidden hover:border-primary/50 transition-colors"
              >
                {/* Preview Area */}
                <div
                  className={cn(
                    "aspect-[4/3] bg-gradient-to-br flex items-center justify-center relative",
                    file.gradient,
                  )}
                >
                  <Icon className="h-12 w-12 text-white/80" />
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button size="icon-sm" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon-sm" variant="secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* File Info */}
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-on-surface-variant">{file.size}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// IMAGE ZOOM (HOVER EFFECT)
// ============================================================================

function ImageZoom() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Zoom on Hover</CardTitle>
        <CardDescription>CSS transform-based zoom effect with smooth transitions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {placeholderImages.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredId(img.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={cn(
                  "h-full w-full bg-gradient-to-br transition-transform duration-300 ease-out flex items-end p-3",
                  img.gradient,
                  hoveredId === img.id ? "scale-110" : "scale-100",
                )}
              >
                <span
                  className={cn(
                    "text-xs text-white font-medium transition-opacity duration-300",
                    hoveredId === img.id ? "opacity-100" : "opacity-60",
                  )}
                >
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison: Different zoom styles */}
        <Separator className="my-6" />
        <h4 className="text-sm font-medium mb-4">Zoom Variations</h4>
        <div className="grid grid-cols-3 gap-4">
          {/* Scale Zoom */}
          <div className="space-y-2">
            <div className="aspect-square rounded-lg overflow-hidden">
              <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 transition-transform duration-300 ease-out hover:scale-125" />
            </div>
            <p className="text-xs text-center text-on-surface-variant">Scale 1.25x</p>
          </div>

          {/* Container zoom with shadow */}
          <div className="space-y-2">
            <div className="aspect-square rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-full w-full bg-gradient-to-br from-green-500 to-emerald-600" />
            </div>
            <p className="text-xs text-center text-on-surface-variant">Lift + Shadow</p>
          </div>

          {/* Overlay reveal */}
          <div className="space-y-2">
            <div className="aspect-square rounded-lg overflow-hidden relative group">
              <div className="h-full w-full bg-gradient-to-br from-purple-500 to-pink-600 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <p className="text-xs text-center text-on-surface-variant">Overlay + Icon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function MediaPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/style-guide"
              className="flex items-center gap-2 text-on-surface-variant hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Style Guide</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">Media Galleries</h1>
              <p className="text-on-surface-variant text-sm">
                Patterns for displaying images, videos, and file previews
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <ImageGrid />
        <MasonryLayout />
        <Lightbox />
        <CarouselWithThumbnails />
        <VideoPlayer />
        <AudioPlayer />
        <FilePreviewCards />
        <ImageZoom />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
