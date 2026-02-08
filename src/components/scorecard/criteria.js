// Scorecard criteria definitions — the foundation of the evaluation system.
// Each category has a default weight (must sum to 100) and a list of criteria.
// Each criterion has a scoring guide to ensure consistent evaluation.

export const CATEGORIES = [
  {
    id: 'financial',
    name: 'Financial',
    description: 'Tax burden, land costs, and overall affordability',
    defaultWeight: 18,
    criteria: [
      {
        id: 'propertyTax',
        name: 'Property Tax Rate',
        description: 'Annual property tax as % of assessed value',
        guide: '10 = under 0.5% | 8 = 0.5–0.9% | 6 = 1.0–1.4% | 4 = 1.5–1.9% | 2 = 2.0%+',
      },
      {
        id: 'incomeTax',
        name: 'State Income Tax',
        description: 'State income tax rate (top marginal or flat)',
        guide: '10 = none | 8 = under 3% | 6 = 3–5% | 4 = 5–7% | 2 = over 7%',
      },
      {
        id: 'salesTax',
        name: 'Sales Tax',
        description: 'Combined state + local sales tax',
        guide: '10 = none | 8 = under 5% | 6 = 5–7% | 4 = 7–9% | 2 = over 9%',
      },
      {
        id: 'landCost',
        name: 'Land Cost per Acre',
        description: 'Average $/acre for 5–20 acre rural parcels',
        guide: '10 = under $5K | 8 = $5–15K | 6 = $15–25K | 4 = $25–40K | 2 = over $40K',
      },
      {
        id: 'costOfLiving',
        name: 'Overall Cost of Living',
        description: 'Groceries, utilities, services, everyday expenses',
        guide: '10 = very low | 8 = low | 6 = moderate | 4 = above avg | 2 = high',
      },
      {
        id: 'insurance',
        name: 'Insurance Costs',
        description: 'Homeowner, flood, fire, and wind insurance burden',
        guide: '10 = very low | 8 = low | 6 = moderate | 4 = above avg | 2 = high',
      },
      {
        id: 'constructionCost',
        name: 'Construction Cost ($/sqft)',
        description: 'Average new construction cost per square foot in the area',
        guide: '10 = under $100/sqft | 8 = $100–140 | 6 = $140–180 | 4 = $180–220 | 2 = over $220/sqft',
      },
      {
        id: 'resaleLiquidity',
        name: 'Resale & Liquidity',
        description: 'How quickly properties sell and retain value in this market',
        guide: '10 = hot market (<30 days avg) | 8 = healthy (30–60) | 6 = moderate (60–90) | 4 = slow (90–180) | 2 = stagnant (180+)',
      },
      {
        id: 'agExemption',
        name: 'Agricultural Tax Exemption',
        description: 'Availability of ag/timber exemptions for property tax savings',
        guide: '10=easy ag exempt, 80%+ tax reduction | 7=available with effort | 5=limited programs | 3=difficult/restrictive | 1=not available',
      },
    ],
  },
  {
    id: 'buildingFreedom',
    name: 'Building Freedom',
    description: 'Permitting ease, owner-builder rights, regulatory burden',
    defaultWeight: 13,
    criteria: [
      {
        id: 'permitProcess',
        name: 'Permit Process Ease',
        description: 'How complex is the building permit process?',
        guide: '10 = no permits needed | 8 = simple/fast | 6 = moderate | 4 = complex | 2 = very complex',
      },
      {
        id: 'ownerBuilder',
        name: 'Owner-Builder Allowance',
        description: 'Can you act as your own general contractor?',
        guide: '10 = fully allowed, self-certify | 8 = allowed with exam | 6 = allowed with limits | 4 = restricted | 2 = must hire licensed GC',
      },
      {
        id: 'codeStrictness',
        name: 'Code & Inspection Leniency',
        description: 'How strict are building codes and inspection requirements?',
        guide: '10 = minimal inspections | 8 = basic inspections | 6 = standard IRC | 4 = strict local codes | 2 = very strict + extra reqs',
      },
      {
        id: 'hoaFreedom',
        name: 'HOA / Deed Restriction Freedom',
        description: 'Availability of unrestricted rural parcels',
        guide: '10 = no HOAs anywhere | 8 = easy to find no-HOA | 6 = some HOA-free | 4 = most have HOA | 2 = nearly all restricted',
      },
      {
        id: 'zoningFlexibility',
        name: 'Zoning Flexibility',
        description: 'Agricultural/residential zoning flexibility for custom builds',
        guide: '10 = no zoning | 8 = very flexible ag/rural | 6 = standard residential | 4 = restrictive | 2 = very restrictive',
      },
      {
        id: 'contractorAvailability',
        name: 'Contractor Availability',
        description: 'Availability of quality builders, subs, and tradespeople',
        guide: '10 = many experienced builders | 8 = good selection | 6 = adequate | 4 = limited/long waits | 2 = very scarce',
      },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'MG treatment access, emergency care, medical infrastructure',
    defaultWeight: 14,
    criteria: [
      {
        id: 'mgDistance',
        name: 'MG Specialist Distance',
        description: 'Drive time to nearest myasthenia gravis treatment center',
        guide: '10 = under 30 min | 8 = 30–60 min | 6 = 60–90 min | 4 = 90–120 min | 2 = over 2 hrs',
      },
      {
        id: 'mgQuality',
        name: 'MG Center Quality',
        description: 'Quality/reputation of nearest MG treatment facility',
        guide: '10 = top-5 national (Mass General, Mayo) | 8 = major academic | 6 = regional center | 4 = general neuro | 2 = limited',
      },
      {
        id: 'emergencyCare',
        name: 'Emergency Care Access',
        description: 'Distance to nearest ER / Level I-II trauma center',
        guide: '10 = under 10 min | 8 = 10–20 min | 6 = 20–30 min | 4 = 30–45 min | 2 = over 45 min',
      },
      {
        id: 'generalMedical',
        name: 'General Medical Access',
        description: 'Primary care, dentist, urgent care availability',
        guide: '10 = excellent access | 8 = good | 6 = adequate | 4 = limited | 2 = very limited',
      },
      {
        id: 'pharmacySpecialist',
        name: 'Pharmacy & Specialist Access',
        description: 'Pharmacy, lab, and medical specialist availability',
        guide: '10 = full services nearby | 8 = good access | 6 = adequate | 4 = limited | 2 = must travel far',
      },
    ],
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Airport access, highway connectivity, metro proximity',
    defaultWeight: 10,
    criteria: [
      {
        id: 'airportDistance',
        name: 'Major Airport Distance',
        description: 'Drive time to nearest major international airport',
        guide: '10 = under 30 min | 8 = 30–60 min | 6 = 60–90 min | 4 = 90–120 min | 2 = over 2 hrs',
      },
      {
        id: 'airportQuality',
        name: 'Airport Quality & Routes',
        description: 'Number of direct flights, international routes, airline options',
        guide: '10 = top-10 hub (ORD, DFW, DEN) | 8 = major intl | 6 = regional intl | 4 = small regional | 2 = very limited',
      },
      {
        id: 'roadAccess',
        name: 'Highway & Road Access',
        description: 'Interstate/highway proximity, road quality',
        guide: '10 = on interstate | 8 = 10 min to interstate | 6 = 20 min | 4 = 30+ min | 2 = remote/poor roads',
      },
      {
        id: 'cityProximity',
        name: 'Metro / City Proximity',
        description: 'Drive time to nearest major city for services/culture',
        guide: '10 = under 20 min | 8 = 20–40 min | 6 = 40–60 min | 4 = 60–90 min | 2 = over 90 min',
      },
      {
        id: 'seasonalAccess',
        name: 'Seasonal Road Access',
        description: 'Year-round road access reliability (snow, mud, flooding)',
        guide: '10 = fully maintained year-round | 8 = reliable with minor closures | 6 = occasional issues | 4 = seasonal closures | 2 = frequently impassable',
      },
    ],
  },
  {
    id: 'climate',
    name: 'Climate & Environment',
    description: 'Temperature comfort, weather risks, sunshine, humidity',
    defaultWeight: 10,
    criteria: [
      {
        id: 'summerComfort',
        name: 'Summer Comfort',
        description: 'How tolerable are the summers? (heat, humidity)',
        guide: '10 = 75–85°F dry | 8 = 80–90°F | 6 = 90–95°F or humid | 4 = 95–100°F | 2 = 100°F+ or extreme humidity',
      },
      {
        id: 'winterComfort',
        name: 'Winter Comfort',
        description: 'How tolerable are the winters? (cold, snow/ice)',
        guide: '10 = mild (40°F+) | 8 = moderate (30–40°F) | 6 = cold (20–30°F) | 4 = harsh (10–20°F) | 2 = severe (under 10°F)',
      },
      {
        id: 'disasterRisk',
        name: 'Natural Disaster Risk',
        description: 'Risk of tornado, hurricane, earthquake, wildfire, flood',
        guide: '10 = minimal risk | 8 = low risk | 6 = moderate (1 type) | 4 = elevated (2+ types) | 2 = high risk zone',
      },
      {
        id: 'sunshine',
        name: 'Sunshine & Pleasant Days',
        description: 'Annual sunny/clear days',
        guide: '10 = 280+ days | 8 = 230–280 | 6 = 180–230 | 4 = 130–180 | 2 = under 130',
      },
      {
        id: 'humidity',
        name: 'Humidity & Air Comfort',
        description: 'Average humidity and air quality comfort',
        guide: '10 = dry/arid | 8 = low humidity | 6 = moderate | 4 = humid | 2 = very humid / poor air',
      },
      {
        id: 'climateResilience',
        name: 'Climate Change Resilience',
        description: 'Long-term water security, wildfire trend, heat trajectory over 30 years',
        guide: '10=excellent long-term outlook | 7=good resilience, minor concerns | 5=moderate risks emerging | 3=significant climate threats | 1=severe water/fire/heat crisis',
      },
    ],
  },
  {
    id: 'schools',
    name: 'Schools & Education',
    description: 'District quality, school choice, programs for future kids',
    defaultWeight: 10,
    criteria: [
      {
        id: 'districtRating',
        name: 'Public School District Rating',
        description: 'Overall district rating (GreatSchools, Niche, state rankings)',
        guide: '10 = top 5% statewide | 8 = top 15% | 6 = top 30% | 4 = average | 2 = below average',
      },
      {
        id: 'schoolChoice',
        name: 'School Choice Options',
        description: 'Private, charter, magnet, homeschool co-op availability',
        guide: '10 = many options nearby | 8 = several | 6 = some | 4 = few | 2 = public only',
      },
      {
        id: 'extracurriculars',
        name: 'Extracurricular & Sports Programs',
        description: 'Youth sports, STEM, arts, and activity programs',
        guide: '10 = extensive programs | 8 = good variety | 6 = adequate | 4 = limited | 2 = minimal',
      },
      {
        id: 'higherEd',
        name: 'Higher Education Proximity',
        description: 'Proximity to colleges/universities',
        guide: '10 = major university nearby | 8 = state college nearby | 6 = community college | 4 = distant | 2 = very limited',
      },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Internet, cell coverage, water, electricity reliability',
    defaultWeight: 5,
    criteria: [
      {
        id: 'internet',
        name: 'Internet Speed & Availability',
        description: 'Best available internet at rural parcels',
        guide: '10 = fiber 1Gbps+ | 8 = cable 100Mbps+ | 6 = DSL/fixed wireless 25Mbps+ | 4 = Starlink only | 2 = very limited',
      },
      {
        id: 'cellCoverage',
        name: 'Cell Phone Coverage',
        description: 'Major carrier signal strength in target areas',
        guide: '10 = all carriers strong | 8 = 2+ carriers good | 6 = 1 carrier good | 4 = spotty | 2 = dead zones',
      },
      {
        id: 'waterReliability',
        name: 'Water Source Reliability',
        description: 'Well depth, water table, municipal availability',
        guide: '10 = municipal + well option | 8 = reliable well | 6 = well with moderate depth | 4 = deep well required | 2 = water scarcity concern',
      },
      {
        id: 'electricReliability',
        name: 'Electric Grid Reliability',
        description: 'Power outage frequency and grid quality',
        guide: '10 = very reliable / co-op | 8 = reliable | 6 = occasional outages | 4 = frequent outages | 2 = unreliable',
      },
      {
        id: 'renewableEnergy',
        name: 'Renewable Energy Potential',
        description: 'Solar irradiance, wind potential, net metering laws, incentives',
        guide: '10 = excellent solar/wind + strong incentives | 8 = good potential | 6 = moderate | 4 = limited | 2 = poor potential / no incentives',
      },
    ],
  },
  {
    id: 'community',
    name: 'Community & Lifestyle',
    description: 'Culture, recreation, community feel, social connections',
    defaultWeight: 5,
    criteria: [
      {
        id: 'culturalAmenities',
        name: 'Cultural Amenities',
        description: 'Dining, shopping, arts, entertainment, nightlife',
        guide: '10 = major city access | 8 = good variety | 6 = some options | 4 = limited | 2 = very rural/none',
      },
      {
        id: 'outdoorRec',
        name: 'Outdoor Recreation',
        description: 'Hiking, fishing, hunting, lakes, parks, trails',
        guide: '10 = world-class outdoor access | 8 = excellent | 6 = good | 4 = adequate | 2 = limited',
      },
      {
        id: 'communityFeel',
        name: 'Community Character & Feel',
        description: 'Small-town charm, neighborliness, sense of belonging',
        guide: '10 = strong tight-knit community | 8 = welcoming | 6 = neutral | 4 = transient/sprawl | 2 = isolated/unwelcoming',
      },
      {
        id: 'friendsFamily',
        name: 'Proximity to Friends & Family',
        description: 'How easily can friends/family visit? (NJ friends, etc.)',
        guide: '10 = under 2 hr drive | 8 = 2–4 hr drive or short flight | 6 = 4–6 hr drive | 4 = long flight | 2 = very remote from family',
      },
      {
        id: 'agingInPlace',
        name: 'Aging-in-Place Friendliness',
        description: 'Senior services, healthcare access, walkability for future needs',
        guide: '10 = excellent senior infrastructure | 8 = good services nearby | 6 = adequate | 4 = limited | 2 = very rural/no services',
      },
      {
        id: 'dailyLifeAccess',
        name: 'Daily Life Accessibility',
        description: 'Walkability, errand convenience, delivery services, emergency response time for someone with chronic illness',
        guide: '10=walkable town, all services | 7=short drive, good services | 5=20-30min drives, some delivery | 3=remote, limited services | 1=very isolated',
      },
    ],
  },
  {
    id: 'safety',
    name: 'Safety & Risk',
    description: 'Crime, natural hazards, emergency services, stability',
    defaultWeight: 5,
    criteria: [
      {
        id: 'crimeRate',
        name: 'Crime Rate',
        description: 'Violent and property crime rates for the area',
        guide: '10 = very low | 8 = low | 6 = below national avg | 4 = at national avg | 2 = above national avg',
      },
      {
        id: 'naturalHazards',
        name: 'Natural Hazard Risk',
        description: 'Flood zone, wildfire, tornado, hurricane, earthquake risk',
        guide: '10 = minimal all categories | 8 = low | 6 = moderate (1 risk) | 4 = elevated | 2 = high risk',
      },
      {
        id: 'emergencyServices',
        name: 'Emergency Services Response',
        description: 'Fire dept, ambulance, police response times',
        guide: '10 = under 5 min | 8 = 5–10 min | 6 = 10–15 min | 4 = 15–25 min | 2 = over 25 min',
      },
      {
        id: 'regulatoryStability',
        name: 'Political & Regulatory Stability',
        description: 'Consistency of regulations, tax policy, governance',
        guide: '10 = very stable/predictable | 8 = stable | 6 = mostly stable | 4 = some volatility | 2 = unpredictable',
      },
      {
        id: 'environmentalRisk',
        name: 'Environmental Red Flags',
        description: 'Contamination, superfund sites, mining, industrial pollution, radon',
        guide: '10 = no known issues | 8 = minimal | 6 = minor concerns | 4 = some contamination nearby | 2 = major environmental issues',
      },
      {
        id: 'climateTrajectory',
        name: 'Long-Term Climate Risk',
        description: 'Wildfire risk trend, drought trajectory, flood pattern changes, insurance availability',
        guide: '10=improving or stable | 7=minor trend concerns | 5=notable worsening | 3=rapidly deteriorating | 1=crisis-level trajectory',
      },
    ],
  },
  {
    id: 'landQuality',
    name: 'Land & Property',
    description: 'Terrain, soil, water rights, views, privacy, appreciation',
    defaultWeight: 5,
    criteria: [
      {
        id: 'terrainViews',
        name: 'Terrain, Scenery & Views',
        description: 'Visual appeal — hills, trees, water, mountains, sunsets',
        guide: '10 = stunning views/mountains | 8 = beautiful rolling/wooded | 6 = pleasant | 4 = flat/plain | 2 = unattractive',
      },
      {
        id: 'soilQuality',
        name: 'Soil Quality',
        description: 'Soil for building foundations, gardening, septic',
        guide: '10 = deep rich loam | 8 = good loam/sand mix | 6 = acceptable | 4 = rocky/heavy clay | 2 = very poor/caliche',
      },
      {
        id: 'waterAccess',
        name: 'Water Access & Rights',
        description: 'Surface water, creeks, ponds, water rights clarity',
        guide: '10 = creek + pond + clear rights | 8 = good water features | 6 = well water reliable | 4 = deep well only | 2 = water scarcity',
      },
      {
        id: 'privacy',
        name: 'Privacy & Seclusion',
        description: 'How private/secluded can you be on 5–20 acres?',
        guide: '10 = very remote/private | 8 = well-separated | 6 = moderate privacy | 4 = some neighbors | 2 = dense/subdivision',
      },
      {
        id: 'selfSufficiency',
        name: 'Self-Sufficiency Potential',
        description: 'Ability to grow food, raise animals, collect rainwater, go off-grid',
        guide: '10 = excellent (long season, water, legal) | 8 = good | 6 = moderate | 4 = limited (climate/legal) | 2 = very difficult',
      },
      {
        id: 'septicFeasibility',
        name: 'Septic Feasibility',
        description: 'Soil perc test success rates, septic system viability',
        guide: '10 = excellent perc, any system | 8 = good soils | 6 = acceptable with engineered | 4 = challenging | 2 = very poor / requires alt system',
      },
      {
        id: 'waterRights',
        name: 'Water Rights & Well Permits',
        description: 'Clarity of water rights, ease of well drilling permits, aquifer health',
        guide: '10=clear rights, easy permits, strong aquifer | 7=straightforward process | 5=some restrictions | 3=complex/uncertain rights | 1=denied/depleted aquifer',
      },
    ],
  },
  {
    id: 'growthOutlook',
    name: 'Growth & Outlook',
    description: 'Population trends, economic vitality, housing appreciation, future trajectory',
    defaultWeight: 5,
    criteria: [
      {
        id: 'populationTrend',
        name: 'Population Trend',
        description: 'Is the area growing, stable, or declining?',
        guide: '10 = top-10 fastest growing | 8 = strong growth (3%+/yr) | 6 = moderate growth (1–3%) | 4 = stable/flat | 2 = declining',
      },
      {
        id: 'jobMarket',
        name: 'Job Market & Economy',
        description: 'Local employment opportunities and economic diversity',
        guide: '10 = booming/diverse economy | 8 = strong job market | 6 = adequate | 4 = limited/single-industry | 2 = weak/declining',
      },
      {
        id: 'housingAppreciation',
        name: 'Housing Appreciation',
        description: 'Historical and projected property value trends',
        guide: '10 = rapid appreciation (8%+/yr) | 8 = strong (5–8%) | 6 = moderate (3–5%) | 4 = slow (1–3%) | 2 = flat/declining',
      },
      {
        id: 'developmentPipeline',
        name: 'Development & Infrastructure Investment',
        description: 'Planned roads, schools, commercial development, public investment',
        guide: '10 = major projects planned | 8 = significant investment | 6 = moderate development | 4 = minimal | 2 = stagnant/no plans',
      },
      {
        id: 'remoteFriendly',
        name: 'Remote Work Viability',
        description: 'Infrastructure and culture supporting remote/WFH lifestyle',
        guide: '10 = excellent (fiber + coworking + culture) | 8 = good | 6 = adequate | 4 = challenging | 2 = very difficult',
      },
    ],
  },
]

// Helper: get flat list of all criteria
export function getAllCriteria() {
  return CATEGORIES.flatMap((cat) =>
    cat.criteria.map((c) => ({ ...c, categoryId: cat.id, categoryName: cat.name }))
  )
}

// Helper: get default weights
export function getDefaultWeights() {
  return Object.fromEntries(CATEGORIES.map((c) => [c.id, c.defaultWeight]))
}

// Helper: get active weights from scorecard state (supports weight profiles)
export function getActiveWeights(scorecard) {
  if (!scorecard) return getDefaultWeights()
  // If using weight profiles, find the active profile
  if (scorecard.weightProfiles && scorecard.activeProfileId) {
    const profile = scorecard.weightProfiles.find((p) => p.id === scorecard.activeProfileId)
    if (profile) return profile.weights
  }
  // Fallback: use flat weights (legacy or default)
  return scorecard.weights || getDefaultWeights()
}

// Score color based on value (1-10)
export function getScoreColor(score) {
  if (score >= 8) return 'green'
  if (score >= 6) return 'blue'
  if (score >= 4) return 'amber'
  return 'red'
}

export function getScoreLabel(score) {
  if (score >= 9) return 'Excellent'
  if (score >= 7) return 'Good'
  if (score >= 5) return 'Average'
  if (score >= 3) return 'Below Avg'
  return 'Poor'
}

// Calculate weighted composite score for an area
export function calculateCompositeScore(areaScores, weights) {
  if (!areaScores) return 0
  let totalWeight = 0
  let weightedSum = 0

  for (const cat of CATEGORIES) {
    const w = weights[cat.id] ?? cat.defaultWeight
    const catScores = areaScores[cat.id]
    if (!catScores) continue

    const vals = cat.criteria
      .map((c) => catScores[c.id]?.score)
      .filter((v) => v != null && v > 0)

    if (vals.length === 0) continue

    const catAvg = vals.reduce((a, b) => a + b, 0) / vals.length
    weightedSum += catAvg * w
    totalWeight += w
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

// Calculate category average for an area
export function calculateCategoryAvg(areaScores, categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId)
  if (!cat || !areaScores?.[categoryId]) return 0

  const vals = cat.criteria
    .map((c) => areaScores[categoryId][c.id]?.score)
    .filter((v) => v != null && v > 0)

  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}
