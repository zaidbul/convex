import { useState } from "react"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateFeedbackImportMutation } from "@/query/mutations/tickets"

function getKindFromFilename(name: string): "txt" | "md" | "csv" | "json" {
  const lower = name.toLowerCase()
  if (lower.endsWith(".md")) return "md"
  if (lower.endsWith(".csv")) return "csv"
  if (lower.endsWith(".json")) return "json"
  return "txt"
}

export function FeedbackImportForm() {
  const [sourceName, setSourceName] = useState("Manual import")
  const [sourceDescription, setSourceDescription] = useState("")
  const [rawText, setRawText] = useState("")
  const createImport = useCreateFeedbackImportMutation()

  async function handleFileChange(file: File | null) {
    if (!file) return

    try {
      const text = await file.text()
      const kind = getKindFromFilename(file.name)
      const payload =
        kind === "json"
          ? {
              kind,
              sourceName: file.name,
              sourceDescription: sourceDescription || undefined,
              rawContent: text,
              rawPayloadJson: JSON.parse(text),
            }
          : {
              kind,
              sourceName: file.name,
              sourceDescription: sourceDescription || undefined,
              rawContent: text,
            }

      const result = await createImport.mutateAsync(payload)
      toast.success(`Imported ${result.itemCount} feedback items`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to import file")
    }
  }

  async function handlePasteImport() {
    if (!rawText.trim()) return

    try {
      const result = await createImport.mutateAsync({
        kind: "paste",
        sourceName,
        sourceDescription: sourceDescription || undefined,
        rawContent: rawText,
      })
      setRawText("")
      toast.success(`Imported ${result.itemCount} feedback items`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to import feedback")
    }
  }

  return (
    <Card className="border-outline-variant/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Import Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="feedback-source-name">Source name</Label>
            <Input
              id="feedback-source-name"
              value={sourceName}
              onChange={(event) => setSourceName(event.target.value)}
              placeholder="Customer support export"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback-source-description">Notes</Label>
            <Input
              id="feedback-source-description"
              value={sourceDescription}
              onChange={(event) => setSourceDescription(event.target.value)}
              placeholder="Optional context for this dump"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-paste-box">Paste text dump</Label>
          <Textarea
            id="feedback-paste-box"
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            placeholder="Paste raw feedback here. Separate items with headings or blank lines."
            className="min-h-40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handlePasteImport} disabled={!rawText.trim() || createImport.isPending}>
            Import pasted feedback
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Upload className="size-4" strokeWidth={1.75} />
            <span>Upload `.txt`, `.md`, `.csv`, or `.json`</span>
            <input
              type="file"
              accept=".txt,.md,.csv,.json,application/json,text/plain,text/csv,text/markdown"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                void handleFileChange(file)
                event.currentTarget.value = ""
              }}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
