import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const TEAM_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#6b7280",
] as const

export type TeamFormState = {
  name: string
  identifier: string
  color: string
}

export function createEmptyTeamForm(): TeamFormState {
  return {
    name: "",
    identifier: "",
    color: TEAM_COLORS[0],
  }
}

type TeamFormProps = {
  form: TeamFormState
  onChange: (form: TeamFormState) => void
  onSubmit: () => void
  submitLabel: string
  disabled?: boolean
}

export function TeamForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  disabled = false,
}: TeamFormProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="team-name">Name</Label>
        <Input
          id="team-name"
          autoFocus
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
          placeholder="Platform"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="team-identifier">Identifier</Label>
        <Input
          id="team-identifier"
          value={form.identifier}
          onChange={(event) =>
            onChange({
              ...form,
              identifier: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
            })
          }
          maxLength={5}
          placeholder="ENG"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {TEAM_COLORS.map((color) => {
            const isSelected = form.color === color
            return (
              <button
                key={color}
                type="button"
                aria-label={`Select ${color}`}
                onClick={() => onChange({ ...form, color })}
                className={`size-8 rounded-full border-2 transition-transform hover:scale-105 ${
                  isSelected ? "border-foreground" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                disabled={disabled}
              />
            )
          })}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={disabled || !form.name.trim() || !form.identifier.trim()}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
