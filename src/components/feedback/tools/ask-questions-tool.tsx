import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ToolPart } from "../feedback-chat-types"

// --- Types ---

export type AskQuestionsQuestion = {
  question: string
  questionRephrase: string
  type: "text" | "number" | "select" | "multi-select"
  options?: string[]
}

export type AskQuestionsOutput = {
  answers: Array<{ question: string; answer: string | string[] }>
}

type QuestionAnswerState = {
  answer: string | string[]
  otherValue: string
  isOtherSelected: boolean
}

// --- Extraction helpers ---

function isValidQuestion(value: unknown): value is AskQuestionsQuestion {
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  if (typeof record.question !== "string" || record.question.trim().length === 0) return false
  if (typeof record.questionRephrase !== "string" || record.questionRephrase.trim().length === 0) return false
  if (!["text", "number", "select", "multi-select"].includes(record.type as string)) return false
  if (
    (record.type === "select" || record.type === "multi-select") &&
    (!Array.isArray(record.options) || record.options.length === 0)
  ) return false
  return true
}

function extractQuestions(value: unknown): AskQuestionsQuestion[] {
  if (!value || typeof value !== "object") return []
  const source = value as Record<string, unknown>
  const questionsRaw = source.questions
  if (!Array.isArray(questionsRaw)) return []
  return questionsRaw.filter(isValidQuestion) as AskQuestionsQuestion[]
}

function extractOutput(value: unknown): AskQuestionsOutput | null {
  if (typeof value === "string") {
    try { return extractOutput(JSON.parse(value)) } catch { return null }
  }
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  if (!Array.isArray(record.answers)) return null

  const answers = record.answers
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const a = item as Record<string, unknown>
      const question = typeof a.question === "string" ? a.question.trim() : ""
      const answerRaw = a.answer
      const answer =
        typeof answerRaw === "string"
          ? answerRaw
          : Array.isArray(answerRaw) && answerRaw.every((v) => typeof v === "string")
            ? (answerRaw as string[])
            : null
      if (!question || answer === null) return null
      return { question, answer }
    })
    .filter((item): item is { question: string; answer: string | string[] } => item !== null)

  return { answers }
}

// --- SingleQuestionInput ---

function SingleQuestionInput({
  question,
  state,
  onStateChange,
  questionIndex,
  isReadOnly,
}: {
  question: AskQuestionsQuestion
  state: QuestionAnswerState
  onStateChange: (newState: QuestionAnswerState) => void
  questionIndex: number
  isReadOnly?: boolean
}) {
  const { answer, otherValue, isOtherSelected } = state

  if (question.type === "select" || question.type === "multi-select") {
    const options = question.options || []
    const hasOther = options.some((o) => o.toLowerCase() === "other")
    const displayOptions = hasOther ? options : [...options, "Other"]

    const hasLongOption = displayOptions.some((opt) => opt.length > 32)
    const hasManyOptions = displayOptions.length > 4
    const useVerticalLayout = hasLongOption || hasManyOptions

    const handleSelect = (option: string) => {
      if (isReadOnly) return

      if (option.toLowerCase() === "other") {
        onStateChange({
          ...state,
          isOtherSelected: !isOtherSelected,
          answer: question.type === "select" ? "" : state.answer,
        })
        return
      }

      if (question.type === "multi-select") {
        const arr = Array.isArray(answer) ? answer : []
        if (arr.includes(option)) {
          onStateChange({ ...state, isOtherSelected: false, answer: arr.filter((item) => item !== option) })
        } else {
          onStateChange({ ...state, isOtherSelected: false, answer: [...arr, option] })
        }
      } else {
        onStateChange({ ...state, isOtherSelected: false, answer: option })
      }
    }

    return (
      <div className="space-y-3">
        <div className={cn("w-full gap-2", useVerticalLayout ? "flex flex-col" : "flex flex-wrap")}>
          {displayOptions.map((option) => {
            const isSelected =
              option.toLowerCase() === "other"
                ? isOtherSelected
                : Array.isArray(answer)
                  ? answer.includes(option)
                  : answer === option

            return (
              <Button
                key={option}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelect(option)}
                disabled={isReadOnly}
                className={cn(
                  "transition-all whitespace-normal",
                  useVerticalLayout ? "w-full justify-start h-auto py-3 px-4 text-left" : "h-9",
                )}
              >
                {isSelected && useVerticalLayout && <Check className="mr-2 size-3.5 shrink-0" />}
                <span className="leading-snug">{option}</span>
              </Button>
            )
          })}
        </div>

        {isOtherSelected && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <Label
              htmlFor={`other-input-${questionIndex}`}
              className="mb-1.5 block text-xs text-muted-foreground"
            >
              Please specify
            </Label>
            <Input
              id={`other-input-${questionIndex}`}
              value={otherValue}
              onChange={isReadOnly ? undefined : (e) => onStateChange({ ...state, otherValue: e.target.value })}
              placeholder="Type your answer here..."
              className="bg-background"
              disabled={isReadOnly}
            />
          </div>
        )}
      </div>
    )
  }

  if (question.type === "number") {
    return (
      <Input
        type="number"
        value={answer as string}
        onChange={isReadOnly ? undefined : (e) => onStateChange({ ...state, answer: e.target.value })}
        placeholder="Enter a number..."
        className="bg-background"
        disabled={isReadOnly}
      />
    )
  }

  return (
    <Textarea
      value={answer as string}
      onChange={isReadOnly ? undefined : (e) => onStateChange({ ...state, answer: e.target.value })}
      placeholder="Type your answer..."
      className="min-h-[80px] bg-background"
      disabled={isReadOnly}
    />
  )
}

// --- AskQuestionsForm ---

function AskQuestionsForm({
  questions,
  onSubmit,
  mode = "edit",
  initialOutput,
}: {
  questions: AskQuestionsQuestion[]
  onSubmit?: (output: AskQuestionsOutput) => void
  mode?: "edit" | "readonly"
  initialOutput?: AskQuestionsOutput | null
}) {
  const isReadOnly = mode === "readonly"
  const [currentStep, setCurrentStep] = useState(0)
  const [showReview, setShowReview] = useState(isReadOnly)

  const emptyAnswerStateForQuestion = useCallback(
    (question: AskQuestionsQuestion): QuestionAnswerState => ({
      answer: question.type === "multi-select" ? [] : "",
      otherValue: "",
      isOtherSelected: false,
    }),
    []
  )

  const outputByQuestion = useMemo(() => {
    const map = new Map<string, string | string[]>()
    for (const item of initialOutput?.answers ?? []) {
      map.set(item.question, item.answer)
    }
    return map
  }, [initialOutput?.answers])

  const answerStateFromOutput = useCallback(
    (question: AskQuestionsQuestion): QuestionAnswerState => {
      const empty = emptyAnswerStateForQuestion(question)
      const answerRaw = outputByQuestion.get(question.question)
      if (answerRaw === undefined) return empty

      const values = Array.isArray(answerRaw) ? answerRaw : [answerRaw]
      const options = question.options ?? []

      if (question.type === "multi-select") {
        const known = values.filter((v) => options.includes(v))
        const unknown = values.filter((v) => !options.includes(v))
        return { ...empty, answer: known, isOtherSelected: unknown.length > 0, otherValue: unknown.join(", ") }
      }

      if (question.type === "select") {
        const selected = values.find((v) => options.includes(v))
        if (selected) return { ...empty, answer: selected }
        const other = values.find((v) => v.trim().length > 0) ?? ""
        return { ...empty, answer: "", isOtherSelected: other.trim().length > 0, otherValue: other }
      }

      return { ...empty, answer: Array.isArray(answerRaw) ? answerRaw.join(", ") : answerRaw }
    },
    [emptyAnswerStateForQuestion, outputByQuestion]
  )

  const [answerStates, setAnswerStates] = useState<QuestionAnswerState[]>(() =>
    isReadOnly ? questions.map(answerStateFromOutput) : questions.map(emptyAnswerStateForQuestion)
  )

  // Reset state when questions change
  const resetKey = useMemo(() => {
    const questionsKey = questions
      .map((q) => `${q.question}\u0002${q.type}\u0002${(q.options ?? []).join("\u0001")}`)
      .join("\u0003")
    const outputKey = isReadOnly ? JSON.stringify(initialOutput?.answers ?? []) : ""
    return `${isReadOnly ? "ro" : "edit"}\u0004${questionsKey}\u0004${outputKey}`
  }, [initialOutput?.answers, isReadOnly, questions])

  const lastResetKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (lastResetKeyRef.current === resetKey) return
    lastResetKeyRef.current = resetKey
    setAnswerStates(
      isReadOnly ? questions.map(answerStateFromOutput) : questions.map(emptyAnswerStateForQuestion)
    )
    setCurrentStep(0)
    setShowReview(isReadOnly)
  }, [resetKey, emptyAnswerStateForQuestion, answerStateFromOutput, isReadOnly, questions])

  if (questions.length === 0) return null

  const updateQuestionState = (index: number, newState: QuestionAnswerState) => {
    setAnswerStates((prev) => {
      const updated = [...prev]
      updated[index] = newState
      return updated
    })
  }

  const getFinalAnswer = (question: AskQuestionsQuestion, state: QuestionAnswerState): string | string[] => {
    if (state.isOtherSelected && state.otherValue) {
      if (question.type === "multi-select" && Array.isArray(state.answer)) {
        return [...state.answer, state.otherValue]
      }
      return state.otherValue
    }
    return state.answer
  }

  const isQuestionAnswered = (question: AskQuestionsQuestion, state: QuestionAnswerState): boolean => {
    if (state.isOtherSelected) {
      if (state.otherValue) return true
      if (question.type === "multi-select" && Array.isArray(state.answer)) return state.answer.length > 0
      return false
    }
    const answer = state.answer
    return Array.isArray(answer) ? answer.length > 0 : !!answer
  }

  const currentQuestion = questions[currentStep]
  const currentAnswerState = answerStates[currentStep]
  const isCurrentAnswered = isQuestionAnswered(currentQuestion, currentAnswerState)
  const answeredCount = questions.filter((q, i) => isQuestionAnswered(q, answerStates[i])).length
  const isLastQuestion = currentStep === questions.length - 1
  const isFirstQuestion = currentStep === 0

  const handleNext = () => {
    if (isLastQuestion) setShowReview(true)
    else setCurrentStep((prev) => Math.min(prev + 1, questions.length - 1))
  }

  const handlePrevious = () => {
    if (showReview) setShowReview(false)
    else setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSkip = () => {
    updateQuestionState(currentStep, emptyAnswerStateForQuestion(questions[currentStep]))
    handleNext()
  }

  const handleGoToQuestion = (index: number) => {
    setShowReview(false)
    setCurrentStep(index)
  }

  const handleSubmitWithStates = (states: QuestionAnswerState[]) => {
    if (isReadOnly || !onSubmit) return
    const answers = questions.map((q, i) => ({
      question: q.question,
      answer: getFinalAnswer(q, states[i]),
    }))
    onSubmit({ answers })
  }

  const handleSubmit = () => handleSubmitWithStates(answerStates)

  const formatAnswer = (question: AskQuestionsQuestion, state: QuestionAnswerState): string => {
    const answer = getFinalAnswer(question, state)
    return Array.isArray(answer) ? answer.join(", ") : answer || "—"
  }

  // Single question -- simplified layout
  if (questions.length === 1 && !showReview) {
    return (
      <div className="flex w-full flex-col gap-2 animate-in fade-in duration-150">
        <p className="text-xs font-medium leading-relaxed text-foreground">
          {currentQuestion.question}
        </p>
        <SingleQuestionInput
          question={currentQuestion}
          state={currentAnswerState}
          onStateChange={(newState) => updateQuestionState(0, newState)}
          questionIndex={0}
          isReadOnly={isReadOnly}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-2 pt-1">
            {!isCurrentAnswered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const nextStates = [...answerStates]
                  nextStates[0] = emptyAnswerStateForQuestion(questions[0])
                  handleSubmitWithStates(nextStates)
                }}
                className="text-muted-foreground"
              >
                Skip
              </Button>
            )}
            <Button onClick={handleSubmit} size="sm" disabled={!isCurrentAnswered}>
              Submit
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Review screen
  if (showReview) {
    return (
      <div className="flex w-full flex-col gap-2 animate-in fade-in duration-150">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="font-medium uppercase tracking-wide">Review</span>
          <span>{answeredCount}/{questions.length} answered</span>
        </div>

        <div className="max-h-[200px] space-y-1 overflow-y-auto">
          {questions.map((question, index) => {
            const state = answerStates[index]
            const answered = isQuestionAnswered(question, state)
            return (
              <button
                key={index}
                onClick={() => handleGoToQuestion(index)}
                className={cn(
                  "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] transition-colors",
                  answered ? "bg-muted/30 hover:bg-muted/50" : "bg-amber-500/10 hover:bg-amber-500/20"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-medium",
                    answered ? "bg-primary/20 text-primary" : "bg-amber-500/30 text-amber-600"
                  )}
                >
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-muted-foreground">{question.question}</span>
                <span
                  className={cn(
                    "max-w-[100px] shrink-0 truncate font-medium",
                    answered ? "text-foreground" : "text-amber-600"
                  )}
                >
                  {answered ? formatAnswer(question, state) : "—"}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button variant="ghost" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="mr-0.5 size-3" />
            Back
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSubmit} size="sm">
              Submit
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Multi-question step view
  return (
    <div className="flex w-full flex-col gap-2 animate-in fade-in duration-150">
      {/* Progress dots */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-0.5">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                index === currentStep
                  ? "bg-primary"
                  : isQuestionAnswered(questions[index], answerStates[index])
                    ? "bg-primary/40"
                    : "bg-muted hover:bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
        <span className="shrink-0 text-[10px] text-muted-foreground">
          {currentStep + 1}/{questions.length}
        </span>
      </div>

      {/* Current question */}
      <div>
        <p className="mb-2 text-xs font-medium leading-relaxed text-foreground">
          {currentQuestion.question}
        </p>
        <SingleQuestionInput
          question={currentQuestion}
          state={currentAnswerState}
          onStateChange={(newState) => updateQuestionState(currentStep, newState)}
          questionIndex={currentStep}
          isReadOnly={isReadOnly}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className={cn(isFirstQuestion && "invisible")}
        >
          <ChevronLeft className="size-3" />
        </Button>

        <div className="flex items-center gap-1.5">
          {!isReadOnly && !isCurrentAnswered && (
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
              Skip
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleNext}
            disabled={!isReadOnly && !isCurrentAnswered && !isLastQuestion}
          >
            {isLastQuestion ? "Review" : "Next"}
            <ChevronRight className="ml-0.5 size-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function PreparingQuestionsNotice() {
  return (
    <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
      Preparing questions...
    </div>
  )
}

// --- Main component ---

interface AskQuestionsToolProps {
  part: ToolPart
  onSubmit?: (toolCallId: string, output: AskQuestionsOutput) => void
}

export function AskQuestionsTool({ part, onSubmit }: AskQuestionsToolProps) {
  const state = part.state

  if (state === "output-error" || state === "output-denied") {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        An error occurred while preparing questions.
      </div>
    )
  }

  const questions = extractQuestions(part.input)
  const toolCallId = part.toolCallId
  const submittedOutput =
    state === "output-available" ? extractOutput(part.output) : null
  const canSubmit = typeof onSubmit === "function" && !!toolCallId

  return (
    <div className="my-2 max-h-[380px] overflow-hidden rounded-lg border bg-card/50">
      <div className="max-h-[380px] overflow-y-auto p-3">
        {state === "input-streaming" ? (
          <PreparingQuestionsNotice />
        ) : state === "input-available" && canSubmit && questions.length > 0 ? (
          <AskQuestionsForm
            questions={questions}
            onSubmit={(output) => onSubmit(toolCallId, output)}
            mode="edit"
          />
        ) : submittedOutput ? (
          <AskQuestionsForm questions={questions} mode="readonly" initialOutput={submittedOutput} />
        ) : (
          <PreparingQuestionsNotice />
        )}
      </div>
    </div>
  )
}
