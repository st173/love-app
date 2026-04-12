import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

const CoupleContext = createContext(null)

export const useCouple = () => {
  const context = useContext(CoupleContext)
  if (!context) {
    throw new Error('useCouple must be used within a CoupleProvider')
  }
  return context
}

export const CoupleProvider = ({ children }) => {
  const { user } = useAuth()
  const [couple, setCouple] = useState(null)
  const [loading, setLoading] = useState(false)

  const refreshCouple = async () => {
    // 暂时从本地存储读取
    const savedCouple = localStorage.getItem('loveWarmingCouple')
    if (savedCouple) {
      setCouple(JSON.parse(savedCouple))
    }
  }

  return (
    <CoupleContext.Provider value={{ couple, loading, refreshCouple, setCouple }}>
      {children}
    </CoupleContext.Provider>
  )
}

export default CoupleContext
