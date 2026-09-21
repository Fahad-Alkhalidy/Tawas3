import { DEMO_COMPANY_ID } from '../data/seed'
import type { Company, LocalizationPlanSubmission, RoadmapRequest } from '../types'
import {
  companyMarketsConfigured,
  companyHasPaid,
  isListedForCustomers,
} from './companyAccess'

export type PresentationStep = {
  id: string
  order: number
  title: string
  hint: string
  who: 'admin' | 'company' | 'customer'
  done: boolean
  current: boolean
}

export function getDemoCompany(companies: Company[]): Company | undefined {
  return companies.find((c) => c.id === DEMO_COMPANY_ID) ?? companies[0]
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

  const companyRoadmaps = roadmapRequests.filter((r) => r.companyId === company.id)
  const companySubs = submissions.filter((s) => s.companyId === company.id)
  const submitted = companySubs.some((s) => s.status === 'submitted' || s.status === 'in_review')
  const opsDone = companySubs.some((s) => s.status === 'completed')
  const listed = isListedForCustomers(company)

  const flags = {
    applied: true,
    approved: company.status === 'approved',
    paid: companyHasPaid(company),
    markets: companyMarketsConfigured(company),
    stepsSent: companyRoadmaps.length > 0,
    filed: submitted,
    ops: opsDone,
    listed,
  }

  const raw: Omit<PresentationStep, 'current'>[] = [
    {
      id: 'apply',
      order: 1,
      title: 'Application submitted',
      hint: `${company.name} — survey on file, awaiting review.`,
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
      title: 'Customer browses directory',
      hint: 'Customer → Directory — filter by Bahrain to see Gulf Thread listed.',
      who: 'customer',
      done: flags.listed,
    },
  ]

  const firstOpen = raw.findIndex((s) => !s.done)
  return raw.map((step, i) => ({
    ...step,
    current: firstOpen === -1 ? i === raw.length - 1 : i === firstOpen,
  }))
}
