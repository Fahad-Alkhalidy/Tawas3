import { useEffect, useMemo, useState } from 'react'
import type { LocalizationPlanSubmission, RoadmapRequest } from '../types'
import {
  getInteractionKeyForStep,
  getOptionsForStep,
  type StepChoiceOption,
} from '../services/localizationStepOptions'
import { useAppStore } from '../store/useAppStore'
import { Badge, Button, EmptyState } from './ui'

type Props = {
  companyId: string
  request: RoadmapRequest
}

export function LocalizationProcessPanel({ companyId, request }: Props) {
  const ensureSubmission = useAppStore((s) => s.ensureLocalizationSubmission)
  const setStepChoice = useAppStore((s) => s.setLocalizationStepChoice)
  const submitPlan = useAppStore((s) => s.submitLocalizationPlan)
  const submission = useAppStore((s) =>
    s.localizationSubmissions.find(
      (sub) => sub.companyId === companyId && sub.roadmapRequestId === request.id,
    ),
  )

  useEffect(() => {
    ensureSubmission(companyId, request.id)
  }, [companyId, request.id, ensureSubmission])

  const [activeStepOrder, setActiveStepOrder] = useState<number | null>(null)
  const [pendingOptionId, setPendingOptionId] = useState<string>('')

  const steps = request.generatedSteps
  const country = request.targetCountry

  const selectionByOrder = useMemo(() => {
    const map = new Map<number, LocalizationPlanSubmission['selections'][0]>()
    submission?.selections.forEach((s) => map.set(s.stepOrder, s))
    return map
  }, [submission?.selections])

  const allChosen = steps.every((step) => selectionByOrder.has(step.order))
  const isSubmitted = submission != null && submission.status !== 'draft'

  if (!submission) {
    return (
      <div className="p-8 text-sm text-ink-muted text-center">Loading process…</div>
    )
  }

  const activeStep = activeStepOrder != null ? steps.find((s) => s.order === activeStepOrder) : null
  const activeOptions: StepChoiceOption[] = activeStep
    ? getOptionsForStep(activeStep, country)
    : []

  const openStep = (order: number) => {
    if (isSubmitted) return
    setActiveStepOrder(order)
    const existing = selectionByOrder.get(order)
    setPendingOptionId(existing?.selectedOptionId ?? '')
  }

  const saveChoice = () => {
    if (!activeStep || !pendingOptionId) return
    const key = getInteractionKeyForStep(activeStep, country)
    const opt = getOptionsForStep(activeStep, country).find((o) => o.id === pendingOptionId)
    if (!opt) return
    setStepChoice(submission.id, {
      stepOrder: activeStep.order,
      stepTitle: activeStep.title,
      interactionKey: key,
      selectedOptionId: opt.id,
      selectedOptionLabel: opt.label,
    })
    setActiveStepOrder(null)
  }

  const onSubmit = () => {
    const result = submitPlan(submission.id)
    if (!result.ok) alert(result.reason)
  }

  return (
    <>
      <div className="px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-muted">
          {country} · {steps.length} steps — choose an option for each, then submit to operations.
        </p>
        {isSubmitted ? (
          <Badge tone="success">Submitted to operations</Badge>
        ) : (
          <Badge tone="warning">{selectionByOrder.size}/{steps.length} completed</Badge>
        )}
      </div>

      <ol className="p-5 space-y-3 flex-1 overflow-y-auto max-h-[520px]">
        {steps.map((step) => {
          const sel = selectionByOrder.get(step.order)
          return (
            <li key={step.order}>
              <button
                type="button"
                disabled={isSubmitted}
                onClick={() => openStep(step.order)}
                className={`w-full text-left border rounded-sm p-4 transition-colors ${
                  sel ? 'border-teal bg-teal-soft/30' : 'border-border bg-surface hover:border-teal/50'
                } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex gap-3 items-start">
                  <span className="font-display text-teal-dark text-lg shrink-0 w-6">{step.order}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink">{step.title}</p>
                    <p className="mt-1 text-sm text-ink-muted line-clamp-2">{step.description}</p>
                    {sel ? (
                      <p className="mt-2 text-sm text-teal-dark">
                        Selected: <strong>{sel.selectedOptionLabel}</strong>
                      </p>
                    ) : (
                      <p className="mt-2 text-xs uppercase tracking-wide text-terracotta">
                        {isSubmitted ? 'No selection recorded' : 'Click to choose'}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="p-5 border-t border-border">
        {isSubmitted ? (
          <p className="text-sm text-ink-muted">
            Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : ''}.
            The operations team is processing your file.
          </p>
        ) : (
          <>
            <Button className="w-full sm:w-auto" disabled={!allChosen} onClick={onSubmit}>
              Submit to operations team
            </Button>
            {!allChosen && (
              <p className="mt-2 text-xs text-ink-muted">Complete every step above to enable submit.</p>
            )}
          </>
        )}
      </div>

      {activeStep && !isSubmitted && (
        <div className="fixed inset-0 bg-ink/50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-surface-raised border border-border rounded-sm p-6 max-h-[85vh] overflow-y-auto">
            <h2 className="font-display text-xl text-ink">{activeStep.title}</h2>
            <p className="mt-2 text-sm text-ink-muted">{activeStep.description}</p>
            <ul className="mt-6 space-y-2">
              {activeOptions.map((opt) => (
                <li key={opt.id}>
                  <label className="flex gap-3 p-3 border border-border rounded-sm cursor-pointer hover:border-teal has-[:checked]:border-teal has-[:checked]:bg-teal-soft/40">
                    <input
                      type="radio"
                      name="step-option"
                      className="mt-1 accent-teal"
                      checked={pendingOptionId === opt.id}
                      onChange={() => setPendingOptionId(opt.id)}
                    />
                    <span>
                      <span className="font-medium text-ink block">{opt.label}</span>
                      <span className="text-sm text-ink-muted">{opt.description}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setActiveStepOrder(null)}>
                Cancel
              </Button>
              <Button disabled={!pendingOptionId} onClick={saveChoice}>
                Save choice
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function LocalizationProcessEmpty() {
  return (
    <div className="p-8 flex-1 flex items-center justify-center">
      <EmptyState
        title="Steps in preparation"
        description="An admin will attach localization requirements for each of your paid markets."
      />
    </div>
  )
}
