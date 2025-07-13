import { useState, useEffect } from 'react'

export function useChromeStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue)

  // Initialize from Chrome storage
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get([key], (result) => {
        if (result[key] !== undefined) {
          setStoredValue(result[key])
        }
      })
    }
  }, [key])

  // Return a wrapped version of useState's setter function that persists the new value to Chrome storage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [key]: valueToStore })
      }
    } catch (error) {
      console.error(`Error setting Chrome storage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
} 