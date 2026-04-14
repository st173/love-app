import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { CuteButton, CuteCard, CuteProgress, CuteTag } from '../components/common/CuteUI'
import { saveTaskProgress, getTaskProgress, savePoints, getPoints } from '../services/cloudService'

export default function DailyTask({ onNavigate, mission }) {
  const { user } = useAuth()
  const [imagePreview, setImagePreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [points, setPoints] = useState(0)

  const userData = user || JSON.parse(localStorage.getItem('tanDanUser') || '{}')
  const coupleData = JSON.parse(localStorage.getItem('tanDanCouple') || '{}')
  const coupleId = coupleData?.id || 'default_couple'

  const defaultMission = mission || {
    id: 'default',
    title: '完成任务',
    desc: '上传截图证明',
    icon: '🎯',
    difficulty: 'easy',
    points: 15
  }

  useEffect(() => {
    const loadData = async () => {
      const savedPoints = await getPoints(coupleId)
      setPoints(savedPoints)
    }
    loadData()
  }, [coupleId])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!imagePreview) {
      alert('请先上传截图')
      return
    }

    // 保存任务进度
    await saveTaskProgress(coupleId, defaultMission.id, { completed: true, timestamp: Date.now() })

    // 增加积分
    const newPoints = points + defaultMission.points
    await savePoints(coupleId, newPoints)
    setPoints(newPoints)

    // 更新本地完成记录
    const savedCompleted = localStorage.getItem('tanDanCompletedMissions')
    const completed = savedCompleted ? JSON.parse(savedCompleted) : []
    if (!completed.includes(defaultMission.id)) {
      completed.push(defaultMission.id)
      localStorage.setItem('tanDanCompletedMissions', JSON.stringify(completed))
    }

    setSubmitted(true)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'green'
      case 'medium': return 'orange'
      case 'hard': return 'red'
      case 'extreme': return 'purple'
      default: return 'pink'
    }
  }

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '简单'
      case 'medium': return '中等'
      case 'hard': return '困难'
      case 'extreme': return '极难'
      default: return '普通'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-love">
      {/* 顶部导航 */}
      <div className="glass sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-pink-500">
            ← 返回
          </button>
          <span className="font-medium text-gray-700">每日任务</span>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {submitted ? (
          <div className="h-full flex flex-col items-center justify-center animate-fadeInUp">
            <div className="text-8xl mb-6 animate-bounce-soft">🎉</div>
            <h2 className="text-2xl font-bold gradient-text mb-2">提交成功！</h2>
            <p className="text-gray-400 mb-4">积分 +{defaultMission.points}</p>

            <CuteCard className="w-full max-w-xs mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">💎</span>
                  <span className="text-2xl font-bold gradient-text">{points}</span>
                </div>
                <p className="text-sm text-gray-500">当前积分</p>
              </div>
            </CuteCard>

            <CuteButton onClick={() => onNavigate('home')} size="lg">
              返回首页
            </CuteButton>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 任务卡片 */}
            <CuteCard className="text-center">
              <div className="text-5xl mb-3">{defaultMission.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{defaultMission.title}</h2>
              <p className="text-gray-400 text-sm mb-3">{defaultMission.desc}</p>
              <div className="flex items-center justify-center gap-3">
                <CuteTag variant={getDifficultyColor(defaultMission.difficulty)}>
                  {getDifficultyText(defaultMission.difficulty)}
                </CuteTag>
                <span className="text-pink-500 font-bold">+{defaultMission.points} 积分</span>
              </div>
            </CuteCard>

            {/* 任务说明 */}
            <CuteCard>
              <h3 className="font-bold text-gray-800 mb-2">📋 任务说明</h3>
              <p className="text-sm text-gray-600 mb-4">
                完成任务后，截图上传作为完成证明，审核通过后即可获得积分奖励。
              </p>
              <div className="bg-pink-50 rounded-xl p-3">
                <p className="text-sm text-pink-600">
                  💡 确保截图清晰显示任务完成状态
                </p>
              </div>
            </CuteCard>

            {/* 上传截图 */}
            <CuteCard>
              <h3 className="font-bold text-gray-800 mb-3">📸 上传截图</h3>

              {imagePreview ? (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="截图预览"
                    className="w-full rounded-xl border-2 border-pink-200"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="w-full mt-2 text-sm text-gray-400 hover:text-red-400"
                  >
                    重新选择
                  </button>
                </div>
              ) : (
                <label className="block">
                  <div className="border-2 border-dashed border-pink-200 rounded-xl p-8 text-center cursor-pointer hover:border-pink-400 transition-colors">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-500">点击上传截图</p>
                    <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}

              <CuteButton
                onClick={handleSubmit}
                disabled={!imagePreview}
                className="w-full mt-4"
              >
                提交任务
              </CuteButton>
            </CuteCard>
          </div>
        )}
      </div>
    </div>
  )
}
