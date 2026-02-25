import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Static credentials
const STATIC_USERNAME = 'admin'
const STATIC_PASSWORD = 'admin123'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (username, password) => {
    if (username === STATIC_USERNAME && password === STATIC_PASSWORD) {
      setUser({ name: STATIC_USERNAME })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
