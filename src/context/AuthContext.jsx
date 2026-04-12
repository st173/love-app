import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async () => {
    const inviteCode = 'LOVE' + Math.random().toString(36).substring(2, 6).toUpperCase()
    const userData = {
      id: 'user_' + Date.now(),
      nickname: '',
      avatar: '💕',
      inviteCode,
      partnerId: null,
      coupleId: null,
      challengeMode: 'medium',
    }
    setUser(userData)
    localStorage.setItem('tanDanUser', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tanDanUser')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
