import { generateId } from '../utils/ids'
import { getDefaultWeights } from '../components/scorecard/criteria'
import { defaultState } from './defaults'

export const ActionTypes = {
  SET_THEME: 'SET_THEME',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_FINANCES: 'UPDATE_FINANCES',
  ADD_BUDGET_CATEGORY: 'ADD_BUDGET_CATEGORY',
  UPDATE_BUDGET_CATEGORY: 'UPDATE_BUDGET_CATEGORY',
  DELETE_BUDGET_CATEGORY: 'DELETE_BUDGET_CATEGORY',
  ADD_REQUIREMENT: 'ADD_REQUIREMENT',
  UPDATE_REQUIREMENT: 'UPDATE_REQUIREMENT',
  DELETE_REQUIREMENT: 'DELETE_REQUIREMENT',
  ADD_MILESTONE: 'ADD_MILESTONE',
  UPDATE_MILESTONE: 'UPDATE_MILESTONE',
  DELETE_MILESTONE: 'DELETE_MILESTONE',
  // Areas (regions/counties)
  ADD_AREA: 'ADD_AREA',
  UPDATE_AREA: 'UPDATE_AREA',
  DELETE_AREA: 'DELETE_AREA',
  // Properties (specific parcels under an area)
  ADD_PROPERTY: 'ADD_PROPERTY',
  UPDATE_PROPERTY: 'UPDATE_PROPERTY',
  DELETE_PROPERTY: 'DELETE_PROPERTY',
  // Legacy compat
  ADD_LOCATION: 'ADD_AREA',
  UPDATE_LOCATION: 'UPDATE_AREA',
  DELETE_LOCATION: 'DELETE_AREA',
  // Scorecard
  UPDATE_SCORECARD_WEIGHTS: 'UPDATE_SCORECARD_WEIGHTS',
  UPDATE_SCORECARD_SCORE: 'UPDATE_SCORECARD_SCORE',
  UPDATE_SCORECARD_NOTES: 'UPDATE_SCORECARD_NOTES',
  // Weight profiles
  ADD_WEIGHT_PROFILE: 'ADD_WEIGHT_PROFILE',
  UPDATE_WEIGHT_PROFILE: 'UPDATE_WEIGHT_PROFILE',
  DELETE_WEIGHT_PROFILE: 'DELETE_WEIGHT_PROFILE',
  SET_ACTIVE_WEIGHT_PROFILE: 'SET_ACTIVE_WEIGHT_PROFILE',
  RENAME_WEIGHT_PROFILE: 'RENAME_WEIGHT_PROFILE',
  // Chat
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  CLEAR_CHAT: 'CLEAR_CHAT',
  IMPORT_STATE: 'IMPORT_STATE',
  RESET_STATE: 'RESET_STATE',
}

export function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      return {
        ...state,
        settings: { ...state.settings, theme: action.payload },
      }

    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }

    case ActionTypes.UPDATE_FINANCES:
      return {
        ...state,
        finances: { ...state.finances, ...action.payload },
      }

    case ActionTypes.ADD_BUDGET_CATEGORY:
      return {
        ...state,
        finances: {
          ...state.finances,
          categories: [
            ...state.finances.categories,
            { id: generateId(), estimate: 0, allocated: 0, spent: 0, ...action.payload },
          ],
        },
      }

    case ActionTypes.UPDATE_BUDGET_CATEGORY:
      return {
        ...state,
        finances: {
          ...state.finances,
          categories: state.finances.categories.map((c) =>
            c.id === action.payload.id ? { ...c, ...action.payload } : c
          ),
        },
      }

    case ActionTypes.DELETE_BUDGET_CATEGORY:
      return {
        ...state,
        finances: {
          ...state.finances,
          categories: state.finances.categories.filter((c) => c.id !== action.payload),
        },
      }

    case ActionTypes.ADD_REQUIREMENT:
      return {
        ...state,
        requirements: [
          ...state.requirements,
          {
            id: generateId(),
            done: false,
            estimatedCost: 0,
            addedBy: 'user',
            createdAt: new Date().toISOString(),
            ...action.payload,
          },
        ],
      }

    case ActionTypes.UPDATE_REQUIREMENT:
      return {
        ...state,
        requirements: state.requirements.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      }

    case ActionTypes.DELETE_REQUIREMENT:
      return {
        ...state,
        requirements: state.requirements.filter((r) => r.id !== action.payload),
      }

    case ActionTypes.ADD_MILESTONE:
      return {
        ...state,
        timeline: [
          ...state.timeline,
          {
            id: generateId(),
            status: 'not-started',
            notes: '',
            completedDate: null,
            ...action.payload,
          },
        ],
      }

    case ActionTypes.UPDATE_MILESTONE:
      return {
        ...state,
        timeline: state.timeline.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload } : m
        ),
      }

    case ActionTypes.DELETE_MILESTONE:
      return {
        ...state,
        timeline: state.timeline.filter((m) => m.id !== action.payload),
      }

    // Areas (regions/counties)
    case ActionTypes.ADD_AREA:
      return {
        ...state,
        locations: [
          ...state.locations,
          {
            id: generateId(),
            tags: [],
            pros: [],
            cons: [],
            rating: 3,
            coordinates: { lat: null, lng: null },
            climate: { avgHighSummer: '', avgLowWinter: '', annualRainfall: '', hardiness: '' },
            infrastructure: { internetProviders: '', waterSource: '', electricProvider: '', cellCoverage: '' },
            landInfo: { avgPricePerAcre: 0, typicalLotSize: '', terrain: '', soilType: '' },
            taxInfo: { propertyTaxRate: '', homesteadExemption: '' },
            researchChecklist: { calledCounty: false, talkedToBuilder: false, checkedInternet: false, visitedArea: false, talkedToResidents: false, checkedWaterRights: false },
            tier: null,
            landAvailability: 'unknown',
            createdAt: new Date().toISOString(),
            ...action.payload,
          },
        ],
      }

    case ActionTypes.UPDATE_AREA:
      return {
        ...state,
        locations: state.locations.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      }

    case ActionTypes.DELETE_AREA:
      return {
        ...state,
        locations: state.locations.filter((a) => a.id !== action.payload),
        // Also remove all properties in this area
        properties: (state.properties || []).filter((p) => p.areaId !== action.payload),
      }

    // Properties (specific parcels)
    case ActionTypes.ADD_PROPERTY:
      return {
        ...state,
        properties: [
          ...(state.properties || []),
          {
            id: generateId(),
            pros: [],
            cons: [],
            rating: 3,
            status: 'researching',
            estSiteWorkCost: 0,
            estInfrastructureCost: 0,
            createdAt: new Date().toISOString(),
            ...action.payload,
          },
        ],
      }

    case ActionTypes.UPDATE_PROPERTY:
      return {
        ...state,
        properties: (state.properties || []).map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }

    case ActionTypes.DELETE_PROPERTY:
      return {
        ...state,
        properties: (state.properties || []).filter((p) => p.id !== action.payload),
      }

    // Scorecard — update weights (works with profiles if active)
    case ActionTypes.UPDATE_SCORECARD_WEIGHTS: {
      const sc = state.scorecard || {}
      // If weight profiles exist and one is active, update that profile's weights
      if (sc.weightProfiles && sc.activeProfileId) {
        return {
          ...state,
          scorecard: {
            ...sc,
            weightProfiles: sc.weightProfiles.map((p) =>
              p.id === sc.activeProfileId
                ? { ...p, weights: { ...p.weights, ...action.payload } }
                : p
            ),
          },
        }
      }
      // Legacy fallback: update flat weights
      return {
        ...state,
        scorecard: {
          ...sc,
          weights: { ...sc.weights, ...action.payload },
        },
      }
    }

    case ActionTypes.ADD_WEIGHT_PROFILE: {
      const sc2 = state.scorecard || {}
      const newProfile = {
        id: generateId(),
        name: action.payload.name || 'New Profile',
        weights: action.payload.weights || getDefaultWeights(),
      }
      return {
        ...state,
        scorecard: {
          ...sc2,
          weightProfiles: [...(sc2.weightProfiles || []), newProfile],
          activeProfileId: newProfile.id,
        },
      }
    }

    case ActionTypes.DELETE_WEIGHT_PROFILE: {
      const sc3 = state.scorecard || {}
      const remaining = (sc3.weightProfiles || []).filter((p) => p.id !== action.payload)
      return {
        ...state,
        scorecard: {
          ...sc3,
          weightProfiles: remaining,
          activeProfileId: remaining.length > 0 ? remaining[0].id : null,
        },
      }
    }

    case ActionTypes.SET_ACTIVE_WEIGHT_PROFILE:
      return {
        ...state,
        scorecard: {
          ...state.scorecard,
          activeProfileId: action.payload,
        },
      }

    case ActionTypes.RENAME_WEIGHT_PROFILE: {
      const { id: profileId, name: newName } = action.payload
      return {
        ...state,
        scorecard: {
          ...state.scorecard,
          weightProfiles: (state.scorecard.weightProfiles || []).map((p) =>
            p.id === profileId ? { ...p, name: newName } : p
          ),
        },
      }
    }

    case ActionTypes.UPDATE_SCORECARD_SCORE: {
      const { areaId, categoryId, criterionId, score } = action.payload
      const sc = state.scorecard || { weights: {}, scores: {} }
      const areaScores = sc.scores[areaId] || {}
      const catScores = areaScores[categoryId] || {}
      return {
        ...state,
        scorecard: {
          ...sc,
          scores: {
            ...sc.scores,
            [areaId]: {
              ...areaScores,
              [categoryId]: {
                ...catScores,
                [criterionId]: { ...(catScores[criterionId] || {}), score },
              },
            },
          },
        },
      }
    }

    case ActionTypes.UPDATE_SCORECARD_NOTES: {
      const { areaId: aid, categoryId: cid, criterionId: crid, notes } = action.payload
      const scard = state.scorecard || { weights: {}, scores: {} }
      const aScores = scard.scores[aid] || {}
      const cScores = aScores[cid] || {}
      return {
        ...state,
        scorecard: {
          ...scard,
          scores: {
            ...scard.scores,
            [aid]: {
              ...aScores,
              [cid]: {
                ...cScores,
                [crid]: { ...(cScores[crid] || {}), notes },
              },
            },
          },
        },
      }
    }

    case ActionTypes.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      }

    case ActionTypes.CLEAR_CHAT:
      return {
        ...state,
        chatHistory: [],
      }

    case ActionTypes.IMPORT_STATE:
      return { ...defaultState, ...action.payload }

    case ActionTypes.RESET_STATE:
      return { ...defaultState }

    default:
      return state
  }
}
