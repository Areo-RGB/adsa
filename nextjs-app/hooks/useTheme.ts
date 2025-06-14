import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'
type HighlightColor = 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'magenta' | 'teal' | 'brown' | 'dark' | 'night'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')
  const [highlightColor, setHighlightColor] = useState<HighlightColor>('blue')

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('app-theme') as Theme
    const savedHighlight = localStorage.getItem('app-highlight-color') as HighlightColor
    
    if (savedTheme) setTheme(savedTheme)
    if (savedHighlight) setHighlightColor(savedHighlight)
  }, [])

  useEffect(() => {
    // Apply theme to body
    document.body.className = `theme-${theme}`
    document.body.setAttribute('data-highlight', `highlight-${highlightColor}`)
  }, [theme, highlightColor])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
  }, [theme])

  const changeHighlightColor = useCallback((color: HighlightColor) => {
    setHighlightColor(color)
    localStorage.setItem('app-highlight-color', color)
  }, [])

  return {
    theme,
    highlightColor,
    toggleTheme,
    changeHighlightColor
  }
}