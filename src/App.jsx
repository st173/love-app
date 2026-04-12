import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CoupleProvider } from './context/CoupleContext'
import Welcome from './pages/Welcome'
import Pair from './pages/Pair'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Drawing from './pages/Drawing'
import Anniversary from './pages/Anniversary'
import TopicTask from './pages/TopicTask'
import DailyTask from './pages/DailyTask'
import { loadAllData } from './services/cloudService'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('welcome')
  const [pageParams, setPageParams] = useState({})

  useEffect(() => {
    const initApp = async () => {
      const savedUser = localStorage.getItem('tanDanUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (userData.coupleId) {
          // 从云端加载数据
          await loadAllData(userData.coupleId)
          setCurrentPage('home')
        } else {
          setCurrentPage('pair')
        }
      }
    }
    initApp()
  }, [])

  const navigate = (page, params = {}) => {
    setCurrentPage(page)
    setPageParams(params)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-love">
        <div className="text-6xl animate-bounce-soft mb-4">💕</div>
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome onNavigate={navigate} />
      case 'pair':
        return <Pair onNavigate={navigate} />
      case 'home':
        return <Home onNavigate={navigate} />
      case 'chat':
        return <Chat onNavigate={navigate} topic={pageParams.topic} />
      case 'drawing':
        return <Drawing onNavigate={navigate} />
      case 'anniversary':
        return <Anniversary onNavigate={navigate} />
      case 'topicTask':
        return <TopicTask onNavigate={navigate} topic={pageParams.topic} />
      case 'dailyTask':
        return <DailyTask onNavigate={navigate} mission={pageParams.mission} />
      default:
        return <Welcome onNavigate={navigate} />
    }
  }

  return (
    <CoupleProvider>
      <div className="min-h-screen bg-gradient-love">
        {renderPage()}
      </div>
    </CoupleProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
