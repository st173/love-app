import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { CuteButton, CuteCard, CuteProgress, CuteTag, CuteAvatar } from '../components/common/CuteUI'
import { submitTopicTask, isTopicCompleted, getIntimacy } from '../services/cloudService'

export default function TopicTask({ onNavigate, topic }) {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [intimacy, setIntimacy] = useState({ level: 1, points: 0, totalPoints: 0 })

  const userData = user || JSON.parse(localStorage.getItem('tanDanUser') || '{}')
  const coupleData = JSON.parse(localStorage.getItem('tanDanCouple') || '{}')
  const coupleId = coupleData?.id || 'default_couple'

  const defaultTopic = topic || {
    id: 'default',
    title: '分享今天的心情',
    desc: '和TA分享你今天的心情',
    icon: '💕',
    type: 'light'
  }

  // 亲密度奖励
  const intimacyRewards = {
    light: 8,
    medium: 15,
    heavy: 30
  }

  useEffect(() => {
    const checkCompleted = async () => {
      const completed = await isTopicCompleted(coupleId, defaultTopic.id)
      setAlreadyCompleted(completed)

      const int = await getIntimacy(coupleId)
      setIntimacy(int)
    }
    checkCompleted()
  }, [coupleId, defaultTopic.id])

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

    await submitTopicTask(coupleId, defaultTopic, imagePreview, userData?.id)

    // 更新亲密度
    const newIntimacy = await getIntimacy(coupleId)
    setIntimacy(newIntimacy)
    setSubmitted(true)
  }

  const steps = [
    { title: '了解任务', desc: '阅读任务要求' },
    { title: '完成任务', desc: '和TA一起完成' },
    { title: '上传截图', desc: '提交完成证明' }
  ]

  // 计算下一等级需要多少亲密度
  const nextLevelPoints = intimacy.level * 100
  const progressPercent = (intimacy.points / 100) * 100

  // 检查是否达到大惊喜条件
  const bigSurpriseLevel = 100 // 100级时获得大惊喜
  const reachedBigSurprise = intimacy.level >= bigSurpriseLevel

  return (
    <div className="min-h-screen flex flex-col bg-gradient-love">
      {/* 顶部导航 */}
      <div className="glass sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-pink-500">
            ← 返回
          </button>
          <span className="font-medium text-gray-700">话题任务</span>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {submitted || alreadyCompleted ? (
          <div className="h-full flex flex-col items-center justify-center animate-fadeInUp">
            <div className="text-8xl mb-6 animate-bounce-soft">🎉</div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              {alreadyCompleted ? '已完成' : '提交成功！'}
            </h2>
            <p className="text-gray-400 mb-4">亲密度 +{intimacyRewards[defaultTopic.type]}</p>

            {/* 亲密度展示 */}
            <CuteCard className="w-full max-w-xs mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">💕</span>
                  <span className="text-2xl font-bold gradient-text">Lv.{intimacy.level}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">亲密度等级</p>
                <CuteProgress value={intimacy.points} max={100} color="pink" />
                <p className="text-xs text-gray-400 mt-1">
                  {intimacy.points}/100 升级
                </p>
                <p className="text-xs text-gray-400">
                  总亲密度: {intimacy.totalPoints}
                </p>
              </div>
            </CuteCard>

            {/* 大惊喜提示 */}
            {reachedBigSurprise ? (
              <CuteCard className="w-full max-w-xs mb-6 bg-gradient-to-r from-yellow-100 to-orange-100">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎁</div>
                  <p className="font-bold text-orange-600">恭喜！获得大惊喜！</p>
                  <p className="text-sm text-orange-500">请联系对方领取</p>
                </div>
              </CuteCard>
            ) : (
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">
                  再升级 <span className="text-pink-500 font-bold">{bigSurpriseLevel - intimacy.level}</span> 级
                </p>
                <p className="text-xs text-gray-400">即可获得神秘大惊喜 🎁</p>
              </div>
            )}

            <CuteButton onClick={() => onNavigate('home')} size="lg">
              返回首页
            </CuteButton>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 亲密度状态 */}
            <CuteCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">当前亲密度</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold gradient-text">Lv.{intimacy.level}</span>
                    <span className="text-sm text-gray-400">({intimacy.totalPoints}点)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">完成奖励</p>
                  <p className="text-xl font-bold text-pink-500">+{intimacyRewards[defaultTopic.type]}</p>
                </div>
              </div>
              <div className="mt-3">
                <CuteProgress value={intimacy.points} max={100} color="pink" />
              </div>
            </CuteCard>

            {/* 步骤指示器 */}
            <div className="flex justify-between px-4">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= i ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step > i ? '✓' : i + 1}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{s.title}</p>
                </div>
              ))}
            </div>

            {/* 任务卡片 */}
            <CuteCard className="text-center">
              <div className="text-5xl mb-3">{defaultTopic.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{defaultTopic.title}</h2>
              <p className="text-gray-400 text-sm mb-3">{defaultTopic.desc}</p>
              <CuteTag variant={defaultTopic.type === 'heavy' ? 'orange' : defaultTopic.type === 'medium' ? 'purple' : 'pink'}>
                {defaultTopic.type === 'heavy' ? '🔥 重度话题' : defaultTopic.type === 'medium' ? '💕 中度话题' : '🌸 轻度话题'}
              </CuteTag>
            </CuteCard>

            {/* 步骤内容 */}
            {step === 0 && (
              <div className="animate-fadeInUp">
                <CuteCard>
                  <h3 className="font-bold text-gray-800 mb-2">📋 任务说明</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    完成这个话题任务，和TA一起互动，增进感情！
                  </p>
                  <div className="bg-pink-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-pink-600">
                      💡 完成后记得截图保存，作为任务完成的证明
                    </p>
                  </div>
                  <CuteButton onClick={() => setStep(1)} className="w-full">
                    开始任务
                  </CuteButton>
                </CuteCard>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fadeInUp">
                <CuteCard>
                  <h3 className="font-bold text-gray-800 mb-2">🎯 进行中</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    和TA一起完成这个话题的互动，完成后点击下方按钮上传截图
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-green-500">✓</span>
                      <span>和TA讨论这个话题</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-green-500">✓</span>
                      <span>截图保存聊天记录</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-green-500">✓</span>
                      <span>上传截图完成任务</span>
                    </div>
                  </div>
                  <CuteButton onClick={() => setStep(2)} className="w-full mt-4">
                    我已完成，上传截图
                  </CuteButton>
                </CuteCard>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fadeInUp">
                <CuteCard>
                  <h3 className="font-bold text-gray-800 mb-2">📸 上传截图</h3>

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
        )}
      </div>
    </div>
  )
}
