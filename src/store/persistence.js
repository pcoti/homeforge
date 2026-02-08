import { defaultState } from './defaults'

const STORAGE_KEY = 'homeforge-data'

function deepMerge(target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key])
    } else if (source[key] !== undefined) {
      result[key] = source[key]
    }
  }
  return result
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const saved = JSON.parse(raw)
    // Deep merge with defaults so new schema fields get default values
    return deepMerge(defaultState, saved)
  } catch {
    return defaultState
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
