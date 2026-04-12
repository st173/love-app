import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CuteButton, CuteCard } from '../components/common/CuteUI'

export default function Welcome({ onNavigate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleStart = () => {
    setLoading(true)
    try {
      const savedUser = localStorage.getItem('tanDanUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (userData.coupleId) {
          onNavigate('home')
          return
        }
      }
      onNavigate('pair')
    } catch (error) {
      console.error('Error:', error)
      onNavigate('pair')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-love">
      {/* 背景装饰 */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">💕</div>
      <div className="absolute top-20 right-8 text-4xl opacity-20 animate-bounce-soft" style={{animationDelay: '0.5s'}}>✨</div>
      <div className="absolute bottom-32 left-6 text-5xl opacity-20 animate-float" style={{animationDelay: '1s'}}>💖</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-bounce-soft" style={{animationDelay: '1.5s'}}>🌟</div>
      <div className="absolute top-1/4 left-1/4 text-3xl opacity-10 animate-pulse">🌸</div>
      <div className="absolute bottom-1/4 right-1/4 text-3xl opacity-10 animate-pulse" style={{animationDelay: '0.8s'}}>🌺</div>

      {/* Logo 区域 */}
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-pink-200/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative text-8xl animate-bounce-soft">💕</div>
      </div>

      {/* 标题 */}
      <h1 className="text-5xl font-bold gradient-text mb-3 tracking-wide">坦丹升温</h1>
      <p className="text-gray-500 mb-2 text-center font-medium">让爱更有温度</p>
      <p className="text-gray-400 text-sm mb-10 text-center max-w-xs">
        异地恋专属互动平台，每天一点小甜蜜
      </p>

      {/* 特性卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-10 w-full max-w-sm">
        <CuteCard className="text-center animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <div className="text-4xl mb-3">🎮</div>
          <div className="font-medium text-gray-700">每日任务</div>
          <div className="text-xs text-gray-400 mt-1">一起完成小目标</div>
        </CuteCard>
        <CuteCard className="text-center animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="text-4xl mb-3">🔥</div>
          <div className="font-medium text-gray-700">升温挑战</div>
          <div className="text-xs text-gray-400 mt-1">解锁更多甜蜜</div>
        </CuteCard>
        <CuteCard className="text-center animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          <div className="text-4xl mb-3">🐕</div>
          <div className="font-medium text-gray-700">萌宠养成</div>
          <div className="text-xs text-gray-400 mt-1">康康和球球陪你</div>
        </CuteCard>
        <CuteCard className="text-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
          <div className="text-4xl mb-3">❤️</div>
          <div className="font-medium text-gray-700">感情温度</div>
          <div className="text-xs text-gray-400 mt-1">记录爱的热度</div>
        </CuteCard>
      </div>

      {/* 开始按钮 */}
      <CuteButton
        onClick={handleStart}
        disabled={loading}
        size="lg"
        className="w-full max-w-xs shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            加载中...
          </span>
        ) : (
          '开启甜蜜之旅 💕'
        )}
      </CuteButton>

      {/* 底部提示 */}
      <p className="text-xs text-gray-300 mt-8">
        点击开始即表示同意服务条款
      </p>
    </div>
  )
}
