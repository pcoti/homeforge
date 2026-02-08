// Discovery Wizard question definitions and scoring engine.
// Each answer modifies weights and/or filters areas.

import { CATEGORIES, calculateCategoryAvg, getActiveWeights } from '../scorecard/criteria'

export const QUESTIONS = [
  {
    id: 'dealbreakers',
    title: 'Deal-Breakers',
    subtitle: 'Select anything that is an absolute must-have for you.',
    type: 'multi',
    options: [
      {
        id: 'noIncomeTax',
        label: 'No state income tax',
        description: 'States like WA, TX, NH have zero income tax',
        filter: (areaScores) => (areaScores?.financial?.incomeTax?.score || 0) >= 10,
      },
      {
        id: 'mgClose',
        label: 'MG specialist within 90 min',
        description: 'Neuromuscular center for myasthenia gravis treatment',
        filter: (areaScores) => (areaScores?.healthcare?.mgDistance?.score || 0) >= 4,
      },
      {
        id: 'airportClose',
        label: 'Major international airport within 90 min',
        description: 'Hub airport with direct international flights',
        filter: (areaScores) => (areaScores?.transportation?.airportDistance?.score || 0) >= 4,
      },
      {
        id: 'topSchools',
        label: 'Top-rated school district',
        description: 'Top 15% rated public school district',
        filter: (areaScores) => (areaScores?.schools?.districtRating?.score || 0) >= 8,
      },
      {
        id: 'ownerBuild',
        label: 'Owner-builder / easy permitting',
        description: 'Can self-certify or act as own GC with minimal red tape',
        filter: (areaScores) => (areaScores?.buildingFreedom?.ownerBuilder?.score || 0) >= 7,
      },
    ],
  },
  {
    id: 'budget',
    title: 'Budget Priority',
    subtitle: 'How much does cost drive your decision?',
    type: 'single',
    options: [
      {
        id: 'budgetFirst',
        label: 'Cheapest possible',
        description: 'Maximize acreage and value — cost is the top priority',
        weightMods: { financial: 2.0, landQuality: 0.7, community: 0.5 },
      },
      {
        id: 'budgetBalanced',
        label: 'Good balance',
        description: 'Reasonable cost but willing to pay for quality of life',
        weightMods: {},
      },
      {
        id: 'qualityFirst',
        label: 'Quality over cost',
        description: 'Will pay more for the right schools, community, and lifestyle',
        weightMods: { financial: 0.5, schools: 1.8, community: 1.5, safety: 1.5 },
      },
    ],
  },
  {
    id: 'climate',
    title: 'Climate Preference',
    subtitle: 'What weather are you looking for?',
    type: 'single',
    options: [
      {
        id: 'mildWinters',
        label: 'Mild winters — hate the cold',
        description: 'Prefer areas where winter stays above 35°F',
        weightMods: { climate: 1.8 },
        scoreFilter: (areaScores) => (areaScores?.climate?.winterComfort?.score || 0) >= 7,
      },
      {
        id: 'fourSeasons',
        label: 'Four real seasons, no extreme heat',
        description: 'Want fall foliage and spring blooms, but summer under 95°F',
        weightMods: { climate: 1.5 },
        scoreFilter: (areaScores) => (areaScores?.climate?.summerComfort?.score || 0) >= 5,
      },
      {
        id: 'drySunny',
        label: 'Dry climate with lots of sunshine',
        description: 'Low humidity and 250+ sunny days per year',
        weightMods: { climate: 1.5 },
        scoreFilter: (areaScores) => (areaScores?.climate?.sunshine?.score || 0) >= 8,
      },
      {
        id: 'climateCheap',
        label: 'Whatever is cheapest',
        description: "I'll tolerate any climate if the price is right",
        weightMods: { climate: 0.3, financial: 1.5 },
      },
    ],
  },
  {
    id: 'building',
    title: 'Building & Permitting',
    subtitle: 'How important is construction freedom?',
    type: 'single',
    options: [
      {
        id: 'maxFreedom',
        label: 'Maximum freedom',
        description: 'Owner-build, self-certify, minimal inspections',
        weightMods: { buildingFreedom: 2.5 },
      },
      {
        id: 'standardOk',
        label: 'Standard process is fine',
        description: "I'll follow the process as long as it's reasonable",
        weightMods: {},
      },
      {
        id: 'hireGC',
        label: "I'll hire a contractor",
        description: "Permitting complexity doesn't affect me much",
        weightMods: { buildingFreedom: 0.3 },
      },
    ],
  },
  {
    id: 'social',
    title: 'Friends & Family',
    subtitle: 'How important is proximity to your NJ/NE social circle?',
    type: 'single',
    options: [
      {
        id: 'mustDrive',
        label: 'Must be driveable from NJ',
        description: 'Within 4-5 hours so friends can visit on weekends',
        scoreFilter: (areaScores) => (areaScores?.community?.friendsFamily?.score || 0) >= 6,
        weightMods: { community: 1.8 },
      },
      {
        id: 'directFlights',
        label: 'Direct flights to East Coast work',
        description: 'Near a major airport with frequent East Coast routes',
        weightMods: { community: 1.3, transportation: 1.3 },
      },
      {
        id: 'locationFree',
        label: 'Location independent',
        description: "We'll go wherever is best — friends can fly",
        weightMods: { community: 0.7 },
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Priorities',
    subtitle: 'What matters most for your day-to-day life? (Pick all that apply)',
    type: 'multi',
    options: [
      {
        id: 'outdoor',
        label: 'Mountain / hiking / outdoor adventure',
        description: 'Access to trails, national parks, skiing, climbing',
        scoreBonuses: { community: { outdoorRec: 2 }, landQuality: { terrainViews: 2 } },
      },
      {
        id: 'cultural',
        label: 'Restaurants, arts, events',
        description: 'Within reach of a real cultural scene',
        scoreBonuses: { community: { culturalAmenities: 2 } },
      },
      {
        id: 'water',
        label: 'Lake / river / water recreation',
        description: 'Swimming, fishing, kayaking, waterfront',
        scoreBonuses: { landQuality: { waterAccess: 3 } },
      },
      {
        id: 'privacy',
        label: 'Rural privacy and seclusion',
        description: "Can't see neighbors, quiet, off the beaten path",
        scoreBonuses: { landQuality: { privacy: 3 } },
      },
      {
        id: 'communityFeel',
        label: 'Small-town community feel',
        description: 'Know your neighbors, local events, tight-knit',
        scoreBonuses: { community: { communityFeel: 2 } },
      },
    ],
  },
  {
    id: 'healthcare',
    title: 'Healthcare Urgency',
    subtitle: 'How close do you need to be to MG specialist care?',
    type: 'single',
    options: [
      {
        id: 'mgCritical',
        label: 'Within 30 minutes',
        description: 'Active treatment, need immediate access to neurologist',
        weightMods: { healthcare: 2.5 },
        scoreFilter: (areaScores) => (areaScores?.healthcare?.mgDistance?.score || 0) >= 8,
      },
      {
        id: 'mgImportant',
        label: '60-90 minutes is fine',
        description: 'Stable condition, quarterly visits, manageable drive',
        weightMods: { healthcare: 1.5 },
      },
      {
        id: 'mgFlexible',
        label: "I'll travel for specialist care",
        description: 'Willing to fly for appointments, telemedicine for routine',
        weightMods: { healthcare: 0.7 },
      },
    ],
  },
  {
    id: 'region',
    title: 'Region Preference',
    subtitle: 'Any regions you want to focus on? (Skip to see all)',
    type: 'multi',
    options: [
      { id: 'pnw', label: 'Pacific Northwest', description: 'WA, OR — no income tax (WA), mild climate, green', tagFilter: 'pnw' },
      { id: 'southwest', label: 'Southwest', description: 'AZ — owner-builder paradise, dry sunshine, cheap', tagFilter: 'southwest' },
      { id: 'texas', label: 'Texas Hill Country', description: 'No income tax, Hill Country beauty, Austin/SA access', tagFilter: 'texas' },
      { id: 'southeast', label: 'Southeast', description: 'TN, NC, SC — no income tax (TN), mild 4 seasons, growing', tagFilter: 'southeast' },
      { id: 'mountainwest', label: 'Mountain West', description: 'ID, NV, MT, UT — scenic, outdoor lifestyle, growing', tagFilter: 'mountain west' },
      { id: 'midwest', label: 'Midwest', description: 'IN, CO — low taxes, affordable, 4 seasons', tagFilter: 'midwest' },
      { id: 'northeast', label: 'Northeast', description: 'NH, MA, ME — Mass General access, NJ friends, top schools', tagFilter: 'northeast' },
    ],
  },
]

// Calculate wizard-adjusted scores for all areas
export function calculateWizardResults(areas, scorecardState, answers) {
  const baseWeights = getActiveWeights(scorecardState)
  const allScores = scorecardState.scores || {}

  // Step 1: Build modified weights from answers
  const modifiedWeights = { ...baseWeights }
  for (const q of QUESTIONS) {
    const answer = answers[q.id]
    if (!answer) continue

    if (q.type === 'single') {
      const option = q.options.find((o) => o.id === answer)
      if (option?.weightMods) {
        for (const [catId, multiplier] of Object.entries(option.weightMods)) {
          modifiedWeights[catId] = (modifiedWeights[catId] || 5) * multiplier
        }
      }
    }
    // multi-select weight mods not used currently
  }

  // Normalize weights to sum to 100
  const totalW = Object.values(modifiedWeights).reduce((a, b) => a + b, 0)
  if (totalW > 0) {
    for (const k of Object.keys(modifiedWeights)) {
      modifiedWeights[k] = (modifiedWeights[k] / totalW) * 100
    }
  }

  // Step 2: Filter areas
  let filtered = areas.map((area) => {
    const areaScores = allScores[area.id] || {}
    let eliminated = false
    const eliminationReasons = []

    // Deal-breaker filters
    const dealbreakers = answers.dealbreakers || []
    for (const dbId of dealbreakers) {
      const opt = QUESTIONS[0].options.find((o) => o.id === dbId)
      if (opt?.filter && !opt.filter(areaScores)) {
        eliminated = true
        eliminationReasons.push(opt.label)
      }
    }

    // Single-select score filters (climate, social, healthcare)
    for (const q of QUESTIONS) {
      if (q.type !== 'single') continue
      const answer = answers[q.id]
      if (!answer) continue
      const opt = q.options.find((o) => o.id === answer)
      if (opt?.scoreFilter && !opt.scoreFilter(areaScores)) {
        eliminated = true
        eliminationReasons.push(`${q.title}: ${opt.label}`)
      }
    }

    // Region filter
    const regionAnswers = answers.region || []
    if (regionAnswers.length > 0) {
      const regionTags = regionAnswers
        .map((rId) => QUESTIONS.find((q) => q.id === 'region')?.options.find((o) => o.id === rId)?.tagFilter)
        .filter(Boolean)
      const areaTags = area.tags || []
      if (!regionTags.some((tag) => areaTags.includes(tag))) {
        eliminated = true
        eliminationReasons.push('Region preference')
      }
    }

    return { area, areaScores, eliminated, eliminationReasons }
  })

  // Step 3: Calculate adjusted composite scores with bonuses
  const lifestyleAnswers = answers.lifestyle || []
  const lifestyleBonuses = {}
  for (const lId of lifestyleAnswers) {
    const opt = QUESTIONS.find((q) => q.id === 'lifestyle')?.options.find((o) => o.id === lId)
    if (opt?.scoreBonuses) {
      for (const [catId, criteria] of Object.entries(opt.scoreBonuses)) {
        if (!lifestyleBonuses[catId]) lifestyleBonuses[catId] = {}
        for (const [crId, bonus] of Object.entries(criteria)) {
          lifestyleBonuses[catId][crId] = (lifestyleBonuses[catId][crId] || 0) + bonus
        }
      }
    }
  }

  const results = filtered.map(({ area, areaScores, eliminated, eliminationReasons }) => {
    // Calculate composite with modified weights + lifestyle bonuses
    let totalWeight = 0
    let weightedSum = 0

    for (const cat of CATEGORIES) {
      const w = modifiedWeights[cat.id] ?? cat.defaultWeight
      const catScores = areaScores[cat.id]
      if (!catScores) continue

      const vals = cat.criteria.map((c) => {
        let score = catScores[c.id]?.score || 0
        // Apply lifestyle bonus
        const bonus = lifestyleBonuses[cat.id]?.[c.id] || 0
        return Math.min(10, score + bonus) // cap at 10
      }).filter((v) => v > 0)

      if (vals.length === 0) continue
      const catAvg = vals.reduce((a, b) => a + b, 0) / vals.length
      weightedSum += catAvg * w
      totalWeight += w
    }

    const compositeScore = totalWeight > 0 ? weightedSum / totalWeight : 0

    // Generate match insights
    const insights = generateInsights(area, areaScores, answers)

    return {
      area,
      compositeScore,
      eliminated,
      eliminationReasons,
      insights,
      modifiedWeights,
    }
  })

  // Sort: non-eliminated first by score, then eliminated
  results.sort((a, b) => {
    if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1
    return b.compositeScore - a.compositeScore
  })

  return results
}

function generateInsights(area, areaScores, answers) {
  const strengths = []
  const concerns = []

  // Financial
  const propTax = areaScores?.financial?.propertyTax?.score || 0
  const incomeTax = areaScores?.financial?.incomeTax?.score || 0
  const landCost = areaScores?.financial?.landCost?.score || 0
  if (incomeTax >= 10) strengths.push('No state income tax')
  if (propTax >= 8) strengths.push('Very low property tax')
  if (propTax <= 4) concerns.push('High property tax')
  if (landCost >= 8) strengths.push('Very affordable land')
  if (landCost <= 4) concerns.push('Expensive land')

  // Building
  const ownerBuilder = areaScores?.buildingFreedom?.ownerBuilder?.score || 0
  if (ownerBuilder >= 9) strengths.push('Owner-builder paradise')
  else if (ownerBuilder <= 4) concerns.push('Strict permitting')

  // Healthcare
  const mgDist = areaScores?.healthcare?.mgDistance?.score || 0
  const mgQual = areaScores?.healthcare?.mgQuality?.score || 0
  if (mgDist >= 8 && mgQual >= 8) strengths.push('Excellent MG care nearby')
  else if (mgDist <= 4) concerns.push('MG specialist is far')

  // Climate
  const summer = areaScores?.climate?.summerComfort?.score || 0
  const winter = areaScores?.climate?.winterComfort?.score || 0
  const sunshine = areaScores?.climate?.sunshine?.score || 0
  if (summer >= 8) strengths.push('Comfortable summers')
  if (summer <= 3) concerns.push('Extreme summer heat')
  if (winter <= 3) concerns.push('Harsh winters')
  if (sunshine >= 9) strengths.push('300+ days of sunshine')

  // Schools
  const schools = areaScores?.schools?.districtRating?.score || 0
  if (schools >= 9) strengths.push('Top-rated school district')
  else if (schools <= 5) concerns.push('Average schools')

  // Social
  const friends = areaScores?.community?.friendsFamily?.score || 0
  if (friends >= 7) strengths.push('Easy access for NJ friends')
  else if (friends <= 3 && answers.social === 'mustDrive') concerns.push('Far from NJ friends')

  // Infrastructure
  const internet = areaScores?.infrastructure?.internet?.score || 0
  if (internet >= 8) strengths.push('Fiber internet available')
  else if (internet <= 4) concerns.push('Limited internet options')

  return { strengths: strengths.slice(0, 5), concerns: concerns.slice(0, 4) }
}
