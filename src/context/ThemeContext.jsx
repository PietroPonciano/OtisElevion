/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
