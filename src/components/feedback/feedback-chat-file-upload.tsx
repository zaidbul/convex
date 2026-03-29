import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const ACCEPTED_TYPES = {
  "text/plain": [".txt"],
  "text/markdown": [".md"],
  "text/csv": [".csv"],
  "application/json": [".json"],
}

export type UploadedFile = {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  rawContent: string
}

interface FeedbackChatFileUploadProps {
  onFilesReady: (files: UploadedFile[]) => void
  disabled?: boolean
  compact?: boolean
}

export function FeedbackChatFileUpload({
  onFilesReady,
  disabled,
  compact,
}: FeedbackChatFileUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const processed: UploadedFile[] = []

      for (const file of acceptedFiles) {
        const rawContent = await file.text()
        processed.push({
          id: crypto.randomUUID(),
          fileName: file.name,
          fileType: file.type || "text/plain",
          fileSize: file.size,
          rawContent,
        })
      }

      if (processed.length > 0) {
        onFilesReady(processed)
      }
    },
    [onFilesReady]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    disabled,
    multiple: true,
  })

  if (compact) {
    return (
      <button
        type="button"
        {...getRootProps()}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="size-3.5" />
        <span>Upload files</span>
      </button>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
        isDragActive
          ? "border-primary/50 bg-primary/5"
          : "border-muted-foreground/20 hover:border-muted-foreground/40",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />
      <FileText className="size-8 text-muted-foreground/60" />
      {isDragActive ? (
        <p className="text-sm text-primary">Drop files here...</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Drag & drop feedback files, or click to browse
          </p>
          <p className="text-xs text-muted-foreground/60">
            Supports .txt, .md, .csv, .json
          </p>
        </>
      )}
    </div>
  )
}
