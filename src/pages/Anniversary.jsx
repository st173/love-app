import { useState } from 'react'
import { CuteButton, CuteCard, CuteInput, CuteTag, CuteProgress } from '../components/common/CuteUI'

export default function Anniversary({ onNavigate }) {
  const [anniversaries, setAnniversaries] = useState([
    { id: 1, title: '在一起的日子', date: '2024-01-01', icon: '💕', type: 'love' },
    { id: 2, title: '第一次约会', date: '2024-01-15', icon: '🎬', type: 'date' },
    { id: 3, title: '第一次旅行', date: '2024-03-20', icon: '✈️', type: 'travel' },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newIcon, setNewIcon] = useState('💕')

  const iconOptions = ['💕', '🎬', '✈️', '🎂', '💍', '🏠', '🎓', '🎁', '🌟', '❤️']

  const calculateDays = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const diffTime = today - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateNextAnniversary = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const nextDate = new Date(today.getFullYear(), date.getMonth(), date.getDate())

    if (nextDate < today) {
      nextDate.setFullYear(nextDate.getFullYear() + 1)
    }

    const diffTime = nextDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const addAnniversary = () => {
    if (!newTitle.trim() || !newDate) return

    const newAnniversary = {
      id: Date.now(),
      title: newTitle.trim(),
      date: newDate,
      icon: newIcon,
      type: 'custom'
    }

    setAnniversaries([...anniversaries, newAnniversary])
    setNewTitle('')
    setNewDate('')
    setNewIcon('💕')
    setShowAdd(false)
  }

  const deleteAnniversary = (id) => {
    setAnniversaries(anniversaries.filter(a => a.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-love">
      {/* 顶部导航 */}
      <div className="glass sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-pink-500">
            ← 返回
          </button>
          <span className="font-medium text-gray-700">📅 纪念日</span>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-pink-500 font-medium"
          >
            {showAdd ? '取消' : '+ 添加'}
          </button>
        </div>
      </div>

      {/* 添加表单 */}
      {showAdd && (
        <div className="p-4 animate-fadeInUp">
          <CuteCard className="space-y-4">
            <h3 className="font-bold text-gray-700">添加纪念日</h3>

            <CuteInput
              label="纪念日名称"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="例如：第一次见面"
            />

            <div>
              <label className="block text-gray-500 text-sm mb-2 ml-1">日期</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-white/80 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm mb-2 ml-1">图标</label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    className={`text-2xl p-2 rounded-xl transition-all ${
                      newIcon === icon ? 'bg-pink-100 ring-2 ring-pink-400' : 'bg-gray-50 hover:bg-pink-50'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <CuteButton onClick={addAnniversary} className="w-full">
              保存纪念日
            </CuteButton>
          </CuteCard>
        </div>
      )}

      {/* 纪念日列表 */}
      <div className="flex-1 p-4 space-y-4">
        {/* 主要纪念日卡片 */}
        {anniversaries.length > 0 && (
          <CuteCard className="text-center">
            <div className="text-5xl mb-3">{anniversaries[0].icon}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{anniversaries[0].title}</h2>
            <p className="text-gray-400 text-sm mb-3">{anniversaries[0].date}</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold gradient-text">{calculateDays(anniversaries[0].date)}</span>
              <span className="text-gray-500">天</span>
            </div>
            <p className="text-sm text-pink-500 mt-2">
              距离下一个纪念日还有 {calculateNextAnniversary(anniversaries[0].date)} 天
            </p>
          </CuteCard>
        )}

        {/* 其他纪念日 */}
        <div className="space-y-3">
          {anniversaries.slice(1).map((anniversary) => (
            <CuteCard key={anniversary.id} className="relative">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{anniversary.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{anniversary.title}</h3>
                  <p className="text-sm text-gray-400">{anniversary.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold gradient-text">{calculateDays(anniversary.date)}</p>
                  <p className="text-xs text-gray-400">天</p>
                </div>
              </div>
              <button
                onClick={() => deleteAnniversary(anniversary.id)}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-400 text-sm"
              >
                ✕
              </button>
            </CuteCard>
          ))}
        </div>

        {/* 感情进度 */}
        <CuteCard>
          <h3 className="font-bold text-gray-700 mb-3">💕 感情里程碑</h3>
          <div className="space-y-3">
            {[
              { days: 100, label: '百日纪念', icon: '🌸' },
              { days: 365, label: '一周年', icon: '🎂' },
              { days: 500, label: '500天', icon: '💎' },
              { days: 1000, label: '千日纪念', icon: '👑' },
            ].map((milestone) => {
              const days = calculateDays(anniversaries[0]?.date || new Date().toISOString())
              const progress = Math.min(100, (days / milestone.days) * 100)
              const achieved = days >= milestone.days

              return (
                <div key={milestone.days} className="flex items-center gap-3">
                  <span className={`text-xl ${achieved ? '' : 'grayscale opacity-50'}`}>
                    {milestone.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">{milestone.label}</span>
                      <span className="text-xs text-gray-400">{milestone.days}天</span>
                    </div>
                    <CuteProgress value={progress} max={100} color={achieved ? 'pink' : 'blue'} />
                  </div>
                  {achieved && <span className="text-green-500">✓</span>}
                </div>
              )
            })}
          </div>
        </CuteCard>

        {/* 空状态 */}
        {anniversaries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📅</div>
            <p className="text-gray-400">还没有添加纪念日</p>
            <p className="text-sm text-gray-300 mt-1">点击右上角添加你们的特别日子</p>
          </div>
        )}
      </div>
    </div>
  )
}
