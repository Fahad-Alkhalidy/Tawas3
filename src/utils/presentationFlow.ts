import { DEMO_COMPANY_ID } from '../data/seed'
import type { Company, LocalizationPlanSubmission, RoadmapRequest } from '../types'
import {
  companyMarketsConfigured,
  companyHasPaid,
  isListedForVisitors,
} from './companyAccess'

export type PresentationStep = {
  id: string
  order: number
  title: string
  hint: string
  who: 'admin' | 'company' | 'visitor'
  done: boolean
  current: boolean
}

export function getDemoCompany(companies: Company[]): Company | undefined {
  return companies.find((c) => c.id === DEMO_COMPANY_ID) ?? companies[0]
}

function submissionBelongsToCompany(
  s: LocalizationPlanSubmission,
  companyId: string,
  roadmapRequests: RoadmapRequest[],
): boolean {
  if (s.companyId === companyId) return true
  const roadmap = roadmapRequests.find((r) => r.id === s.roadmapRequestId)
  return roadmap?.companyId === companyId
}

function isFilingSubmitted(s: LocalizationPlanSubmission): boolean {
  return (
    s.submittedAt != null ||
    s.status === 'submitted' ||
    s.status === 'in_review' ||
    s.status === 'completed'
  )
}

/** Step 5 — company pressed “Submit to operations” (not when admin completes review). */
export function hasSubmittedLocalizationFiling(
  companyId: string,
  submissions: LocalizationPlanSubmission[],
  roadmapRequests: RoadmapRequest[] = [],
): boolean {
  return submissions.some(
    (s) => submissionBelongsToCompany(s, companyId, roadmapRequests) && isFilingSubmitted(s),
  )
}

export function buildPresentationSteps(
  company: Company | undefined,
  roadmapRequests: RoadmapRequest[],
  submissions: LocalizationPlanSubmission[],
): PresentationStep[] {
  if (!company) {
    return [
      {
        id: 'apply',
        order: 1,
        title: 'Company submits application',
        hint: 'Use Company → Application or Getting started on the home page.',
        who: 'company',
        done: false,
        current: true,
      },
    ]
  }

  const companyId = company.id
  const companyRoadmaps = roadmapRequests.filter((r) => r.companyId === companyId)
  const companySubs = submissions.filter((s) => s.companyId === companyId)
  const filed = hasSubmittedLocalizationFiling(companyId, submissions, roadmapRequests)
  const opsDone = companySubs.some((s) => s.status === 'completed')
  const listed = isListedForVisitors(company)

  const flags = {
    applied: true,
    approved: company.status === 'approved',
    paid: companyHasPaid(company),
    markets: companyMarketsConfigured(company),
    stepsSent: companyRoadmaps.length > 0,
    filed,
    ops: opsDone,
    listed,
  }

  const raw: Omit<PresentationStep, 'current'>[] = [
    {
      id: 'apply',
      order: 1,
      title: 'Application submitted',
      hint: `${company.name}: survey on file, awaiting review.`,
      who: 'company',
      done: flags.applied,
    },
    {
      id: 'approve',
      order: 2,
      title: 'Admin approves application',
      hint: 'Applications → Review → set status to approved.',
      who: 'admin',
      done: flags.approved,
    },
    {
      id: 'subscribe',
      order: 3,
      title: 'Company chooses tier & market',
      hint: 'Company → Subscribe, then confirm one GCC country (demo: Bahrain).',
      who: 'company',
      done: flags.markets,
    },
    {
      id: 'prepare',
      order: 4,
      title: 'Admin sends localization steps',
      hint: 'Applications → Prepare localization steps (after markets are set).',
      who: 'admin',
      done: flags.stepsSent,
    },
    {
      id: 'process',
      order: 5,
      title: 'Company completes process & submits',
      hint: 'Company dashboard → fill each step → Submit to operations.',
      who: 'company',
      done: flags.filed,
    },
    {
      id: 'operations',
      order: 6,
      title: 'Admin processes filing',
      hint: 'Operations queue → review choices → mark completed.',
      who: 'admin',
      done: flags.ops,
    },
    {
      id: 'browse',
      order: 7,
      title: 'Visitor browses directory',
      hint: 'Home → Browse businesses, then filter by Bahrain to see the demo listing.',
      who: 'visitor',
      done: flags.listed,
    },
  ]

  const firstOpen = raw.findIndex((s) => !s.done)
  return raw.map((step, i) => ({
    ...step,
    current: firstOpen === -1 ? i === raw.length - 1 : i === firstOpen,
  }))
}
