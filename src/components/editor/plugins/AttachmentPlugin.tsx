import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_NORMAL,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  PASTE_COMMAND,
  createCommand,
  type LexicalCommand,
} from "lexical";
import { INSERT_IMAGE_COMMAND } from "../nodes/ImageNode";

// Command to trigger the file picker for image upload
export const TRIGGER_IMAGE_UPLOAD_COMMAND: LexicalCommand<void> = createCommand(
  "TRIGGER_IMAGE_UPLOAD_COMMAND",
);

// Supported image MIME types
const SUPPORTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

// 25 MB max file size
const MAX_FILE_SIZE = 25 * 1024 * 1024;

function isSupportedImageType(type: string): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(type);
}

function getImageFromDataTransfer(dataTransfer: DataTransfer): File | null {
  const files = dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (isSupportedImageType(file.type)) {
      return file;
    }
  }
  return null;
}

// Convert file to base64 data URL for MVP (no server upload)
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AttachmentPlugin(): ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUpload = useCallback(
    async (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        console.error(
          `[AttachmentPlugin] File too large: ${file.size} bytes (max ${MAX_FILE_SIZE})`,
        );
        return;
      }

      if (!isSupportedImageType(file.type)) {
        console.error(`[AttachmentPlugin] Unsupported file type: ${file.type}`);
        return;
      }

      try {
        const dataUrl = await fileToDataUrl(file);
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: dataUrl,
          altText: file.name,
        });
      } catch (error) {
        console.error("[AttachmentPlugin] Failed to read file:", error);
      }
    },
    [editor],
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (isSupportedImageType(file.type)) {
            processUpload(file);
          }
        }
      }
      event.target.value = "";
    },
    [processUpload],
  );

  // Handle TRIGGER_IMAGE_UPLOAD_COMMAND - opens the file picker
  useEffect(() => {
    return editor.registerCommand(
      TRIGGER_IMAGE_UPLOAD_COMMAND,
      () => {
        fileInputRef.current?.click();
        return true;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [editor]);

  // Handle drag and drop
  useEffect(() => {
    return editor.registerCommand(
      DRAGOVER_COMMAND,
      (event) => {
        const dataTransfer = event.dataTransfer;
        if (dataTransfer && getImageFromDataTransfer(dataTransfer)) {
          event.preventDefault();
          setIsDragging(true);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        const dataTransfer = event.dataTransfer;
        if (!dataTransfer) return false;

        const file = getImageFromDataTransfer(dataTransfer);
        if (file) {
          event.preventDefault();
          setIsDragging(false);
          processUpload(file);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, processUpload]);

  // Handle paste
  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const clipboardData = event instanceof ClipboardEvent ? event.clipboardData : null;
        if (!clipboardData) return false;

        const file = getImageFromDataTransfer(clipboardData);
        if (file) {
          event.preventDefault();
          processUpload(file);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, processUpload]);

  // Handle drag leave
  useEffect(() => {
    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_IMAGE_TYPES.join(",")}
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />
      {isDragging && (
        <div className="fixed inset-0 bg-primary/10 border-2 border-dashed border-primary z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-popover/90 backdrop-blur-2xl rounded-2xl px-6 py-4 text-foreground text-sm shadow-2xl ring-1 ring-foreground/5">
            Drop image to upload
          </div>
        </div>
      )}
    </>
  );
}
