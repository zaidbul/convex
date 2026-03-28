import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ClipboardCopy,
  CloudUpload,
  Crop,
  Edit2,
  Eye,
  EyeOff,
  FileImage,
  FileText,
  ImageIcon,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/data-entry")({
  component: DataEntryPage,
});

// ============================================================================
// FORM VALIDATION STATES
// ============================================================================

function FormValidationStates() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const emailValid = email.includes("@") && email.includes(".");
  const usernameValid = username.length >= 3;
  const bioWarning = bio.length > 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Validation States</CardTitle>
        <CardDescription>Error, success, and warning states for form inputs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error State */}
        <div className="space-y-2">
          <Label htmlFor="email-error">Email (Error State)</Label>
          <div className="relative">
            <Input
              id="email-error"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                email && !emailValid && "border-destructive focus-visible:ring-destructive",
              )}
            />
            {email && !emailValid && (
              <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
            )}
            {email && emailValid && (
              <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
            )}
          </div>
          {email && !emailValid && (
            <p className="text-sm text-destructive">Please enter a valid email address</p>
          )}
          {email && emailValid && <p className="text-sm text-success">Email looks good!</p>}
        </div>

        {/* Success State */}
        <div className="space-y-2">
          <Label htmlFor="username-success">Username (Success State)</Label>
          <div className="relative">
            <Input
              id="username-success"
              placeholder="Choose a username (min 3 chars)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn(
                username && usernameValid && "border-success focus-visible:ring-success",
              )}
            />
            {username && usernameValid && (
              <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
            )}
          </div>
          {username && usernameValid && (
            <p className="text-sm text-success">Username is available!</p>
          )}
        </div>

        {/* Warning State */}
        <div className="space-y-2">
          <Label htmlFor="bio-warning">Bio (Warning State)</Label>
          <Textarea
            id="bio-warning"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={cn(bioWarning && "border-warning focus-visible:ring-warning")}
            rows={3}
          />
          <div className="flex items-center justify-between text-sm">
            <p className={cn(bioWarning ? "text-warning-foreground" : "text-on-surface-variant")}>
              {bioWarning ? "Consider keeping your bio concise" : ""}
            </p>
            <span className={cn(bioWarning ? "text-warning-foreground" : "text-on-surface-variant")}>
              {bio.length}/150 characters
            </span>
          </div>
        </div>

        {/* Alert Examples */}
        <div className="space-y-3 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Please fix the errors above before submitting.</AlertDescription>
          </Alert>

          <Alert className="border-success/30 bg-success/5">
            <Check className="h-4 w-4 text-success" />
            <AlertTitle className="text-success-foreground">Success</AlertTitle>
            <AlertDescription>All fields are valid. Ready to submit!</AlertDescription>
          </Alert>

          <Alert className="border-warning/30 bg-warning/5">
            <AlertCircle className="h-4 w-4 text-warning-foreground" />
            <AlertTitle className="text-warning-foreground">Warning</AlertTitle>
            <AlertDescription>
              Some fields have warnings but you can still proceed.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// FILE UPLOAD WITH DRAG & DROP
// ============================================================================

function FileUploadDragDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
      }, 200);
    });
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
    setUploadProgress((prev) => {
      const next = { ...prev };
      delete next[fileName];
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload with Drag & Drop</CardTitle>
        <CardDescription>Drag and drop files or click to browse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-surface-container",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files || []);
              addFiles(selectedFiles);
            }}
          />
          <CloudUpload
            className={cn(
              "h-12 w-12 mb-4 transition-colors",
              isDragging ? "text-primary" : "text-on-surface-variant",
            )}
          />
          <p className="text-sm font-medium">
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">or click to browse</p>
          <p className="text-xs text-on-surface-variant mt-4">
            Supports: PDF, DOC, DOCX, JPG, PNG (max 10MB)
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files</Label>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.name} className="flex items-center gap-3 rounded-md bg-surface-high p-3">
                  <FileText className="h-8 w-8 text-on-surface-variant shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                      <Progress value={uploadProgress[file.name]} className="h-1 mt-2" />
                    )}
                  </div>
                  {uploadProgress[file.name] >= 100 ? (
                    <Check className="h-5 w-5 text-success shrink-0" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-on-surface-variant shrink-0" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.name);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// FILE UPLOAD WITH PREVIEW
// ============================================================================

function FileUploadWithPreview() {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));

    const newImages = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload with Preview</CardTitle>
        <CardDescription>Upload images and see previews before submitting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Image Previews */}
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group h-32 w-32 rounded-md overflow-hidden bg-surface-container"
            >
              <img src={img.preview} alt={img.file.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="icon-sm" onClick={() => removeImage(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Badge
                variant="secondary"
                className="absolute bottom-1 left-1 right-1 text-xs truncate"
              >
                {img.file.name}
              </Badge>
            </div>
          ))}

          {/* Add Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-surface-container transition-colors"
          >
            <Upload className="h-6 w-6 text-on-surface-variant mb-2" />
            <span className="text-xs text-on-surface-variant">Add Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {images.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-on-surface-variant">
              {images.length} image{images.length !== 1 ? "s" : ""} selected
            </span>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// IMAGE CROPPER (Mockup)
// ============================================================================

function ImageCropperMockup() {
  const [showCropper, setShowCropper] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Cropper</CardTitle>
        <CardDescription>Crop and resize images before upload (mockup/placeholder)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showCropper ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8">
            <FileImage className="h-12 w-12 text-on-surface-variant mb-4" />
            <Button onClick={() => setShowCropper(true)}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Select Image to Crop
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mock Cropper UI */}
            <div className="relative aspect-video rounded-md bg-surface-container overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-3/4 aspect-square border-2 border-white border-dashed">
                  {/* Corner handles */}
                  <div className="absolute -top-1 -left-1 h-3 w-3 bg-white rounded-full border-2 border-primary" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-primary" />
                  <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-white rounded-full border-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-primary" />

                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white/30" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Dimmed overlay */}
              <div className="absolute inset-0 bg-black/50 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 aspect-square bg-transparent mix-blend-destination-out" />
                </div>
              </div>

              {/* Placeholder image icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-on-surface-variant/50" />
              </div>
            </div>

            {/* Crop controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Crop className="h-4 w-4 mr-2" />
                  1:1
                </Button>
                <Button variant="outline" size="sm">
                  16:9
                </Button>
                <Button variant="outline" size="sm">
                  4:3
                </Button>
                <Button variant="outline" size="sm">
                  Free
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowCropper(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Image cropped successfully!");
                    setShowCropper(false);
                  }}
                >
                  Apply Crop
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// RICH TEXT EDITOR PLACEHOLDER
// ============================================================================

function RichTextEditorPlaceholder() {
  const [content, setContent] = useState(
    "This is a placeholder for a rich text editor. In a real implementation, you would integrate a library like TipTap, Slate, or Lexical.",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rich Text Editor</CardTitle>
        <CardDescription>Placeholder for a rich text editing component</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high">
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-surface-container rounded-t-md">
            <Button variant="ghost" size="icon-sm" className="font-bold">
              B
            </Button>
            <Button variant="ghost" size="icon-sm" className="italic">
              I
            </Button>
            <Button variant="ghost" size="icon-sm" className="underline">
              U
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="icon-sm">
              H1
            </Button>
            <Button variant="ghost" size="icon-sm">
              H2
            </Button>
            <Button variant="ghost" size="icon-sm">
              H3
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="sm">
              List
            </Button>
            <Button variant="ghost" size="sm">
              Quote
            </Button>
            <Button variant="ghost" size="sm">
              Code
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="sm">
              Link
            </Button>
            <Button variant="ghost" size="sm">
              Image
            </Button>
          </div>

          {/* Content Area */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] border-0 rounded-none rounded-b-lg resize-none focus-visible:ring-0"
            placeholder="Start typing..."
          />
        </div>

        <p className="text-xs text-on-surface-variant mt-2">
          Note: This is a mockup. For production, consider using TipTap, Slate, Lexical, or
          Editor.js
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// AUTO-SAVE INDICATOR
// ============================================================================

function AutoSaveIndicator() {
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (content) {
      setSaveStatus("saving");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        // Simulate save
        const success = Math.random() > 0.1;
        setSaveStatus(success ? "saved" : "error");

        // Reset to idle after a delay
        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Save Indicator</CardTitle>
        <CardDescription>Visual feedback for automatic saving functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save-input">Document Content</Label>
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === "idle" && (
                <span className="text-on-surface-variant">
                  <Save className="h-4 w-4 inline mr-1" />
                  All changes saved
                </span>
              )}
              {saveStatus === "saving" && (
                <span className="text-on-surface-variant">
                  <Loader2 className="h-4 w-4 inline mr-1 animate-spin" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-success">
                  <Check className="h-4 w-4 inline mr-1" />
                  Saved just now
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-destructive">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Save failed
                </span>
              )}
            </div>
          </div>
          <Textarea
            id="auto-save-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing and watch the auto-save indicator..."
            rows={4}
          />
        </div>

        {/* Status Examples */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Save className="h-4 w-4" />
            Idle
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <Check className="h-4 w-4" />
            Saved
          </div>
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Error
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// INLINE EDITING
// ============================================================================

function InlineEditing() {
  const [items, setItems] = useState([
    { id: 1, title: "Project Alpha", editing: false },
    { id: 2, title: "Marketing Campaign", editing: false },
    { id: 3, title: "Q4 Budget Review", editing: false },
  ]);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = (id: number, currentTitle: string) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        editing: item.id === id,
      })),
    );
    setEditValue(currentTitle);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const saveEdit = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: editValue || item.title, editing: false } : item,
      ),
    );
    toast.success("Changes saved");
  };

  const cancelEdit = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, editing: false } : item)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inline Editing</CardTitle>
        <CardDescription>Click to edit text directly without opening a modal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-md bg-surface-high p-3">
              {item.editing ? (
                <>
                  <Input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item.id);
                      if (e.key === "Escape") cancelEdit(item.id);
                    }}
                    className="flex-1"
                  />
                  <Button size="icon-sm" onClick={() => saveEdit(item.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => cancelEdit(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => startEditing(item.id, item.title)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-on-surface-variant mt-4">
          Tip: Press Enter to save, Escape to cancel
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COPY TO CLIPBOARD
// ============================================================================

function CopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const items = [
    { id: "api-key", label: "API Key", value: "sk-1234567890abcdef" },
    { id: "invite-link", label: "Invite Link", value: "https://app.example.com/invite/abc123" },
    { id: "code", label: "Code Snippet", value: "npm install @example/sdk" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Copy to Clipboard</CardTitle>
        <CardDescription>One-click copy functionality for text and codes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            <Label>{item.label}</Label>
            <div className="flex gap-2">
              <Input value={item.value} readOnly className="font-mono text-sm bg-surface-container" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  void copyToClipboard(item.value, item.id);
                }}
              >
                {copiedId === item.id ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <ClipboardCopy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}

        {/* Inline Copy Button */}
        <div className="pt-4">
          <Label className="mb-2 block">Inline Copy Buttons</Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => {
                void copyToClipboard("user@example.com", "email");
              }}
            >
              user@example.com
              {copiedId === "email" ? (
                <Check className="h-3 w-3 ml-1 text-success" />
              ) : (
                <ClipboardCopy className="h-3 w-3 ml-1" />
              )}
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => {
                void copyToClipboard("ORD-12345", "order");
              }}
            >
              ORD-12345
              {copiedId === "order" ? (
                <Check className="h-3 w-3 ml-1 text-success" />
              ) : (
                <ClipboardCopy className="h-3 w-3 ml-1" />
              )}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PASSWORD STRENGTH INDICATOR
// ============================================================================

function calculatePasswordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;

  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;

  if (score <= 2) return { score: (score / 6) * 100, label: "Weak", color: "bg-destructive" };
  if (score <= 4) return { score: (score / 6) * 100, label: "Fair", color: "bg-warning" };
  return { score: (score / 6) * 100, label: "Strong", color: "bg-success" };
}

function PasswordStrengthIndicator() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = calculatePasswordStrength(password);

  const requirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: password.length >= 12, text: "At least 12 characters" },
    { met: /[a-z]/.test(password), text: "Lowercase letter" },
    { met: /[A-Z]/.test(password), text: "Uppercase letter" },
    { met: /[0-9]/.test(password), text: "Number" },
    { met: /[^a-zA-Z0-9]/.test(password), text: "Special character" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Strength Indicator</CardTitle>
        <CardDescription>Visual feedback for password requirements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password-strength">Password</Label>
          <div className="relative">
            <Input
              id="password-strength"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-on-surface-variant" />
              ) : (
                <Eye className="h-4 w-4 text-on-surface-variant" />
              )}
            </Button>
          </div>
        </div>

        {/* Strength Bar */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Password strength</span>
              <span
                className={cn(
                  strength.label === "Weak" && "text-destructive",
                  strength.label === "Fair" && "text-warning-foreground",
                  strength.label === "Strong" && "text-success",
                )}
              >
                {strength.label}
              </span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i < Math.ceil(strength.score / 25) ? strength.color : "bg-surface-container",
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Requirements List */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          {requirements.map((req, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 text-sm",
                req.met ? "text-success" : "text-on-surface-variant",
              )}
            >
              {req.met ? (
                <Check className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4 rounded-full border-outline-variant/15" />
              )}
              {req.text}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CHARACTER COUNT / LIMITS
// ============================================================================

function CharacterCountLimits() {
  const [shortText, setShortText] = useState("");
  const [longText, setLongText] = useState("");

  const shortLimit = 50;
  const longLimit = 280;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Character Count / Limits</CardTitle>
        <CardDescription>Show remaining characters and enforce limits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Short Input with Counter */}
        <div className="space-y-2">
          <Label htmlFor="short-text">Username</Label>
          <div className="relative">
            <Input
              id="short-text"
              value={shortText}
              onChange={(e) => {
                if (e.target.value.length <= shortLimit) {
                  setShortText(e.target.value);
                }
              }}
              placeholder="Choose a username"
              className={cn(shortText.length >= shortLimit && "border-destructive")}
            />
            <span
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-xs",
                shortText.length >= shortLimit * 0.9 ? "text-destructive" : "text-on-surface-variant",
              )}
            >
              {shortText.length}/{shortLimit}
            </span>
          </div>
        </div>

        {/* Long Text with Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="long-text">Tweet</Label>
            <span
              className={cn(
                "text-xs",
                longText.length >= longLimit
                  ? "text-destructive"
                  : longText.length >= longLimit * 0.8
                    ? "text-warning-foreground"
                    : "text-on-surface-variant",
              )}
            >
              {longLimit - longText.length} characters remaining
            </span>
          </div>
          <Textarea
            id="long-text"
            value={longText}
            onChange={(e) => {
              if (e.target.value.length <= longLimit) {
                setLongText(e.target.value);
              }
            }}
            placeholder="What's happening?"
            rows={3}
            className={cn(longText.length >= longLimit && "border-destructive")}
          />
          <Progress
            value={(longText.length / longLimit) * 100}
            className={cn(
              "h-1",
              longText.length >= longLimit
                ? "[&>div]:bg-destructive"
                : longText.length >= longLimit * 0.8
                  ? "[&>div]:bg-warning"
                  : "",
            )}
          />
        </div>

        {/* Word Count Example */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="word-count">Article Summary</Label>
            <span className="text-xs text-on-surface-variant">
              {longText.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <Textarea id="word-count" placeholder="Write a brief summary..." rows={4} />
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Recommended: 50-100 words</span>
            <span>0/100 words</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function DataEntryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-display font-bold tracking-tight">Data Entry Patterns</h1>
          <p className="text-on-surface-variant mt-1">
            Form inputs, uploads, and interactive data entry components
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="py-8 px-8 space-y-16">
        <FormValidationStates />
        <FileUploadDragDrop />
        <FileUploadWithPreview />
        <ImageCropperMockup />
        <RichTextEditorPlaceholder />
        <AutoSaveIndicator />
        <InlineEditing />
        <CopyToClipboard />
        <PasswordStrengthIndicator />
        <CharacterCountLimits />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
