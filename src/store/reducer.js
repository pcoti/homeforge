import { generateId } from '../utils/ids'
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
  ADD_LOCATION: 'ADD_LOCATION',
  UPDATE_LOCATION: 'UPDATE_LOCATION',
  DELETE_LOCATION: 'DELETE_LOCATION',
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

    case ActionTypes.ADD_LOCATION:
      return {
        ...state,
        locations: [
          ...state.locations,
          {
            id: generateId(),
            pros: [],
            cons: [],
            rating: 3,
            createdAt: new Date().toISOString(),
            ...action.payload,
          },
        ],
      }

    case ActionTypes.UPDATE_LOCATION:
      return {
        ...state,
        locations: state.locations.map((l) =>
          l.id === action.payload.id ? { ...l, ...action.payload } : l
        ),
      }

    case ActionTypes.DELETE_LOCATION:
      return {
        ...state,
        locations: state.locations.filter((l) => l.id !== action.payload),
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
