import { generateId } from '../utils/ids'

export const defaultSettings = {
  theme: 'dark',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.2',
  homeValue: 400000,
  homePurchasePrice: 500000,
  mortgageBalance: 0,
  budgetMin: 750000,
  budgetMax: 1250000,
  targetYear: 2030,
  acreageMin: 5,
  acreageMax: 20,
}

export const defaultFinances = {
  savings: 0,
  monthlyContribution: 0,
  categories: [
    { id: generateId(), name: 'Land Purchase', estimate: 200000, allocated: 0, spent: 0 },
    { id: generateId(), name: 'Architect & Design', estimate: 60000, allocated: 0, spent: 0 },
    { id: generateId(), name: 'Permits & Fees', estimate: 15000, allocated: 0, spent: 0 },
    { id: generateId(), name: 'Site Work', estimate: 80000, allocated: 0, spent: 0 },
    { id: generateId(), name: 'Construction', estimate: 500000, allocated: 0, spent: 0 },
    { id: generateId(), name: 'Infrastructure', estimate: 50000, allocated: 0, spent: 0 },
    { id: generateId(), name: 'Interior & Finishes', estimate: 100000, allocated: 0, spent: 0 },
    { id: generateId(), name: 'Landscaping', estimate: 40000, allocated: 0, spent: 0 },
    { id: generateId(), name: 'Contingency', estimate: 155000, allocated: 0, spent: 0 },
  ],
}

export const defaultRequirements = [
  {
    id: generateId(),
    item: '10-Gig networking throughout',
    category: 'Infrastructure',
    priority: 'must-have',
    notes: 'Cat6a minimum, fiber backbone preferred',
    done: false,
    estimatedCost: 15000,
    addedBy: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    item: 'Dedicated network rack / server room',
    category: 'Infrastructure',
    priority: 'must-have',
    notes: 'Climate-controlled closet with UPS',
    done: false,
    estimatedCost: 8000,
    addedBy: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    item: 'Home theater room',
    category: 'Interior',
    priority: 'must-have',
    notes: 'Dedicated room with sound isolation',
    done: false,
    estimatedCost: 35000,
    addedBy: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    item: 'Detached shop / workshop',
    category: 'Exterior',
    priority: 'must-have',
    notes: 'Minimum 30x40, insulated, with power',
    done: false,
    estimatedCost: 50000,
    addedBy: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    item: '5-20 acres of land',
    category: 'Land',
    priority: 'must-have',
    notes: 'Rural area, 1-2 hours from Houston',
    done: false,
    estimatedCost: 200000,
    addedBy: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    item: 'Dedicated home office',
    category: 'Interior',
    priority: 'must-have',
    notes: 'Separate from living areas, good natural light',
    done: false,
    estimatedCost: 10000,
    addedBy: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    item: 'Solar-ready wiring',
    category: 'Infrastructure',
    priority: 'nice-to-have',
    notes: 'Pre-wire for future solar panel installation',
    done: false,
    estimatedCost: 5000,
    addedBy: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    item: 'Open concept kitchen',
    category: 'Interior',
    priority: 'nice-to-have',
    notes: 'Kitchen flows into living/dining area',
    done: false,
    estimatedCost: 0,
    addedBy: 'system',
    createdAt: new Date().toISOString(),
  },
]

export const defaultTimeline = [
  // Phase 1: Research & Planning (Jun 2025 – Dec 2025)
  { id: generateId(), milestone: 'Define requirements & wishlist', phase: 'Research & Planning', targetDate: '2025-06-30', status: 'not-started', notes: '', completedDate: null },
  { id: generateId(), milestone: 'Research locations & land options', phase: 'Research & Planning', targetDate: '2025-09-30', status: 'not-started', notes: '', completedDate: null },
  { id: generateId(), milestone: 'Finalize budget & financing plan', phase: 'Research & Planning', targetDate: '2025-12-31', status: 'not-started', notes: '', completedDate: null },

  // Phase 2: Land Acquisition (Jan 2026 – Jun 2026)
  { id: generateId(), milestone: 'Select and purchase land', phase: 'Land Acquisition', targetDate: '2026-03-31', status: 'not-started', notes: '', completedDate: null },
  { id: generateId(), milestone: 'Survey & soil testing', phase: 'Land Acquisition', targetDate: '2026-06-30', status: 'not-started', notes: '', completedDate: null },

  // Phase 3: Design & Permits (Jul 2026 – Mar 2027)
  { id: generateId(), milestone: 'Hire architect', phase: 'Design & Permits', targetDate: '2026-08-31', status: 'not-started', notes: '', completedDate: null },
  { id: generateId(), milestone: 'Complete house plans', phase: 'Design & Permits', targetDate: '2027-01-31', status: 'not-started', notes: '', completedDate: null },
  { id: generateId(), milestone: 'Obtain building permits', phase: 'Design & Permits', targetDate: '2027-03-31', status: 'not-started', notes: '', completedDate: null },

  // Phase 4: Site Preparation (Apr 2027 – Jun 2027)
  { id: generateId(), milestone: 'Clear & grade site', phase: 'Site Preparation', targetDate: '2027-05-31', status: 'not-started', notes: '', completedDate: null },

  // Phase 5: Construction (Jul 2027 – Mar 2029)
  { id: generateId(), milestone: 'Foundation & framing', phase: 'Construction', targetDate: '2027-12-31', status: 'not-started', notes: '', completedDate: null },
  { id: generateId(), milestone: 'Systems rough-in (electrical, plumbing, HVAC)', phase: 'Construction', targetDate: '2028-06-30', status: 'not-started', notes: '', completedDate: null },
  { id: generateId(), milestone: 'Interior finishes & landscaping', phase: 'Construction', targetDate: '2029-03-31', status: 'not-started', notes: '', completedDate: null },

  // Phase 6: Move In (Apr 2029 – Jun 2029)
  { id: generateId(), milestone: 'Final inspection & move in', phase: 'Move In', targetDate: '2029-06-30', status: 'not-started', notes: '', completedDate: null },
]

export const defaultLocations = []

export const defaultChatHistory = []

export const defaultState = {
  settings: defaultSettings,
  finances: defaultFinances,
  requirements: defaultRequirements,
  timeline: defaultTimeline,
  locations: defaultLocations,
  chatHistory: defaultChatHistory,
}
