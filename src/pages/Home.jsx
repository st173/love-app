import { useState, useEffect } from 'react'
import { useCouple } from '../context/CoupleContext'
import { useAuth } from '../context/AuthContext'
import { CuteCard, CuteProgress, CuteTag, CuteAvatar, CuteButton } from '../components/common/CuteUI'
import {
  getIntimacy,
  savePets,
  getPets,
  savePoints,
  getPoints,
  saveTaskProgress,
  getTaskProgress,
  isCloudConfigured,
  loadAllData
} from '../services/cloudService'

// 三角洲行动任务池
const deltaMissionPool = [
  { id: 'evac_1', title: '成功撤离1次', desc: '任意模式成功撤离', icon: '🚁', difficulty: 'easy', points: 15 },
  { id: 'evac_2', title: '成功撤离3次', desc: '任意模式成功撤离3次', icon: '🚁', difficulty: 'medium', points: 30 },
  { id: 'evac_3', title: '绝密模式撤离', desc: '绝密难度成功撤离', icon: '🚀', difficulty: 'hard', points: 45 },
  { id: 'evac_4', title: '零伤亡撤离', desc: '不受伤完成一次撤离', icon: '🛡️', difficulty: 'hard', points: 50 },
  { id: 'kill_1', title: '击杀10名敌人', desc: '累计击杀敌人', icon: '🎯', difficulty: 'easy', points: 15 },
  { id: 'kill_2', title: '击杀25名敌人', desc: '累计击杀敌人', icon: '🎯', difficulty: 'medium', points: 25 },
  { id: 'kill_3', title: '爆头击杀5人', desc: '爆头击杀敌人', icon: '💀', difficulty: 'medium', points: 30 },
  { id: 'kill_4', title: '击杀Boss', desc: '击杀任意Boss', icon: '👹', difficulty: 'hard', points: 40 },
  { id: 'collect_1', title: '单局获得50万', desc: '单局收集50万以上物资', icon: '💰', difficulty: 'medium', points: 25 },
  { id: 'collect_2', title: '单局获得100万', desc: '单局收集100万以上物资', icon: '💰', difficulty: 'hard', points: 35 },
  { id: 'collect_3', title: '单局获得500万', desc: '单局收集500万以上物资', icon: '💎', difficulty: 'extreme', points: 50 },
  { id: 'collect_4', title: '获得1个小金', desc: '单局获得任意小金物品', icon: '🥇', difficulty: 'medium', points: 20 },
  { id: 'collect_5', title: '单局3个小金', desc: '单局获得3个以上小金', icon: '🥇', difficulty: 'hard', points: 40 },
  { id: 'collect_6', title: '获得1个大红', desc: '单局获得任意大红物品', icon: '💎', difficulty: 'hard', points: 35 },
  { id: 'collect_7', title: '单局2个大红', desc: '单局获得2个以上大红', icon: '💎', difficulty: 'extreme', points: 55 },
  { id: 'team_1', title: '救援队友3次', desc: '拉起倒地的队友', icon: '🤝', difficulty: 'easy', points: 20 },
  { id: 'team_2', title: '全队安全撤离', desc: '全队成员都成功撤离', icon: '👥', difficulty: 'hard', points: 45 },
  { id: 'team_3', title: '双人组队撤离', desc: '和TA一起成功撤离', icon: '💕', difficulty: 'medium', points: 35 },
  { id: 'special_1', title: '完成航天撤离', desc: '航天模式成功撤离', icon: '🚀', difficulty: 'hard', points: 40 },
  { id: 'special_2', title: '完成零号大坝', desc: '零号大坝成功撤离', icon: '🌊', difficulty: 'hard', points: 40 },
]

const singMissionPool = [
  { id: 'sing_1', title: '一起唱一首歌', desc: '任意歌曲', icon: '🎤', difficulty: 'easy', points: 15 },
  { id: 'sing_2', title: '唱一首情歌', desc: '唱给TA听', icon: '💕', difficulty: 'easy', points: 20 },
  { id: 'sing_3', title: '合唱一首歌', desc: '一起合唱', icon: '🎵', difficulty: 'easy', points: 20 },
  { id: 'sing_4', title: 'K歌马拉松3首', desc: '一起唱3首歌', icon: '🎤', difficulty: 'medium', points: 30 },
]

const movieMissionPool = [
  { id: 'movie_1', title: '一起看一部电影', desc: '任意电影', icon: '🎬', difficulty: 'easy', points: 15 },
  { id: 'movie_2', title: '看一部恐怖电影', desc: '一起看恐怖片', icon: '👻', difficulty: 'medium', points: 25 },
  { id: 'movie_3', title: '看一部爱情电影', desc: '浪漫爱情片', icon: '💕', difficulty: 'easy', points: 20 },
  { id: 'movie_4', title: '恐怖电影马拉松', desc: '一起看2部恐怖片', icon: '🎃', difficulty: 'hard', points: 40 },
]

// 话题池
const lightTopicsPool = [
  { id: 'l1', title: '今天最开心的事', desc: '分享今天让你开心的事情', icon: '😊', type: 'light' },
  { id: 'l2', title: '最喜欢的食物', desc: '聊聊你们爱吃的美食', icon: '🍜', type: 'light' },
  { id: 'l3', title: '童年趣事', desc: '分享小时候的有趣经历', icon: '👶', type: 'light' },
  { id: 'l4', title: '最想去的地方', desc: '聊聊想一起去的旅行地', icon: '✈️', type: 'light' },
  { id: 'l5', title: '喜欢的电影', desc: '推荐一部你喜欢的电影', icon: '🎬', type: 'light' },
  { id: 'l6', title: '最近在听的歌', desc: '分享你的歌单', icon: '🎵', type: 'light' },
]

const mediumTopicsPool = [
  { id: 'm1', title: '第一次见面的印象', desc: '聊聊你们第一次见面', icon: '👀', type: 'medium' },
  { id: 'm2', title: '最感动的瞬间', desc: '分享TA让你感动的时刻', icon: '🥹', type: 'medium' },
  { id: 'm3', title: '我们的未来', desc: '聊聊对未来的规划', icon: '🏠', type: 'medium' },
  { id: 'm4', title: '最害怕的事', desc: '分享你的恐惧和担忧', icon: '😰', type: 'medium' },
  { id: 'm5', title: '理想的生活', desc: '描述你理想中的生活', icon: '✨', type: 'medium' },
  { id: 'm6', title: '最难忘的约会', desc: '回忆最难忘的一次约会', icon: '💕', type: 'medium' },
]

const heavyTopicsPool = [
  { id: 'h1', title: '最敏感的地方', desc: '聊聊身体最敏感的部位', icon: '💋', type: 'heavy' },
  { id: 'h2', title: '最难忘的亲密时刻', desc: '回忆最难忘的亲密经历', icon: '🔥', type: 'heavy' },
  { id: 'h3', title: '最喜欢的姿势', desc: '聊聊最喜欢的亲密姿势', icon: '💕', type: 'heavy' },
  { id: 'h4', title: '最想尝试的事', desc: '聊聊想一起尝试的新事物', icon: '✨', type: 'heavy' },
  { id: 'h5', title: '最性感的样子', desc: '说说TA什么时候最性感', icon: '😍', type: 'heavy' },
  { id: 'h6', title: '幻想的场景', desc: '聊聊你的亲密幻想', icon: '💭', type: 'heavy' },
]

// 宠物心情
const petMoods = {
  ecstatic: { emoji: '🥰', text: '超级开心', color: 'text-pink-500' },
  happy: { emoji: '😊', text: '很开心', color: 'text-green-500' },
  content: { emoji: '😌', text: '满足', color: 'text-blue-500' },
  normal: { emoji: '😐', text: '一般', color: 'text-yellow-500' },
  sad: { emoji: '😢', text: '有点难过', color: 'text-orange-500' },
}

const petActions = [
  { id: 'pet', emoji: '🤗', title: '抚摸', cost: 0, happiness: 5 },
  { id: 'play', emoji: '🎾', title: '玩耍', cost: 5, happiness: 15, hunger: -5 },
  { id: 'feed', emoji: '🍖', title: '喂食', cost: 10, hunger: 20, happiness: 5 },
  { id: 'train', emoji: '🎯', title: '训练', cost: 15, happiness: 10, health: 5 },
  { id: 'walk', emoji: '🦮', title: '散步', cost: 8, happiness: 20, hunger: -10, health: 10 },
  { id: 'groom', emoji: '✨', title: '美容', cost: 20, health: 15, happiness: 10 },
]

const defaultPets = [
  { id: 'kangkang', name: '康康', emoji: '🐕', breed: '金毛', level: 1, exp: 0, health: 100, happiness: 80, hunger: 70 },
  { id: 'qiuqiu', name: '球球', emoji: '🐶', breed: '柯基', level: 1, exp: 0, health: 100, happiness: 90, hunger: 60 },
]

// 生成每日任务
const generateDailyMissions = () => {
  const today = new Date().toDateString()
  const savedDate = localStorage.getItem('tanDanMissionDate')

  if (savedDate === today) {
    return {
      delta: JSON.parse(localStorage.getItem('tanDanDeltaMissions') || '[]'),
      sing: JSON.parse(localStorage.getItem('tanDanSingMissions') || '[]'),
      movie: JSON.parse(localStorage.getItem('tanDanMovieMissions') || '[]'),
      light: JSON.parse(localStorage.getItem('tanDanLightMissions') || '[]'),
      medium: JSON.parse(localStorage.getItem('tanDanMediumMissions') || '[]'),
      heavy: JSON.parse(localStorage.getItem('tanDanHeavyMissions') || '[]'),
    }
  }

  // 新的一天，清空昨日完成记录
  localStorage.removeItem('tanDanCompletedMissions')
  localStorage.removeItem('tanDanCompletedTopics')

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

  const missions = {
    delta: shuffle(deltaMissionPool).slice(0, 4),
    sing: shuffle(singMissionPool).slice(0, 2),
    movie: shuffle(movieMissionPool).slice(0, 2),
    light: shuffle(lightTopicsPool).slice(0, 3),
    medium: shuffle(mediumTopicsPool).slice(0, 3),
    heavy: shuffle(heavyTopicsPool).slice(0, 3),
  }

  localStorage.setItem('tanDanMissionDate', today)
  Object.entries(missions).forEach(([key, value]) => {
    localStorage.setItem(`tanDan${key.charAt(0).toUpperCase() + key.slice(1)}Missions`, JSON.stringify(value))
  })

  return missions
}

export default function Home({ onNavigate }) {
  const { user } = useAuth()
  const { couple } = useCouple()
  const [activeTab, setActiveTab] = useState('mission')
  const [selectedPet, setSelectedPet] = useState(0)
  const [pets, setPets] = useState(defaultPets)
  const [points, setPoints] = useState(100)
  const [intimacy, setIntimacy] = useState({ level: 1, points: 0, totalPoints: 0 })
  const [dailyMissions, setDailyMissions] = useState({ delta: [], sing: [], movie: [], light: [], medium: [], heavy: [] })
  const [completedMissions, setCompletedMissions] = useState([])
  const [selectedGame, setSelectedGame] = useState('delta')
  const [heavyUnlocked, setHeavyUnlocked] = useState(false)
  const [syncStatus, setSyncStatus] = useState('checking')
  const [showConfig, setShowConfig] = useState(false)
  const [configForm, setConfigForm] = useState({
    url: localStorage.getItem('supabase_url') || '',
    key: localStorage.getItem('supabase_key') || ''
  })
  const [signedToday, setSignedToday] = useState(false)
  const [signStreak, setSignStreak] = useState(0)
  const [partner, setPartner] = useState(null)
  const [completedTopics, setCompletedTopics] = useState([])

  const coupleData = couple || JSON.parse(localStorage.getItem('tanDanCouple') || '{}')
  const coupleId = coupleData?.id || 'default_couple'
  const userData = user || JSON.parse(localStorage.getItem('tanDanUser') || '{}')

  // 加载对方信息
  const loadPartnerInfo = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://boqhqohnzcnvqllkqthg.supabase.co',
        'sb_publishable_C7dzSyAlSqG3h4P_lfKFnw__uDUEhOE'
      )
      const { data } = await supabase
        .from('couples')
        .select('*')
        .eq('id', coupleId)
        .single()

      if (data) {
        const isCreator = data.creator_nickname === userData?.nickname
        setPartner({
          nickname: isCreator ? data.joiner_nickname : data.creator_nickname,
          avatar: isCreator ? data.joiner_avatar : data.creator_avatar
        })
      }
    } catch (error) {
      console.error('获取对方信息失败:', error)
    }
  }

  useEffect(() => {
    const initData = async () => {
      // 检查云服务配置
      if (isCloudConfigured()) {
        setSyncStatus('connected')
        // 从云端加载数据
        await loadAllData(coupleId)
        // 加载对方信息
        await loadPartnerInfo()
      } else {
        setSyncStatus('not_configured')
      }

      // 加载本地数据
      const savedPets = localStorage.getItem('tanDanPets')
      if (savedPets) setPets(JSON.parse(savedPets))

      const savedPoints = localStorage.getItem('tanDanPoints')
      if (savedPoints) setPoints(parseInt(savedPoints))

      const savedIntimacy = localStorage.getItem('tanDanIntimacy')
      if (savedIntimacy) setIntimacy(JSON.parse(savedIntimacy))

      const savedCompleted = localStorage.getItem('tanDanCompletedMissions')
      if (savedCompleted) setCompletedMissions(JSON.parse(savedCompleted))

      const lastSign = localStorage.getItem('tanDanLastSign')
      if (lastSign === new Date().toDateString()) setSignedToday(true)

      const savedStreak = localStorage.getItem('tanDanSignStreak')
      if (savedStreak) setSignStreak(parseInt(savedStreak))

      const savedHeavy = localStorage.getItem('tanDanHeavyUnlocked')
      if (savedHeavy) setHeavyUnlocked(JSON.parse(savedHeavy))

      // 加载已完成的话题
      const savedCompletedTopics = localStorage.getItem('tanDanCompletedTopics')
      if (savedCompletedTopics) setCompletedTopics(JSON.parse(savedCompletedTopics))

      // 生成每日任务
      setDailyMissions(generateDailyMissions())
    }

    initData()

    // 定期刷新数据（每3秒）
    const refreshInterval = setInterval(async () => {
      const savedIntimacy = localStorage.getItem('tanDanIntimacy')
      if (savedIntimacy) setIntimacy(JSON.parse(savedIntimacy))

      const savedCompletedTopics = localStorage.getItem('tanDanCompletedTopics')
      if (savedCompletedTopics) setCompletedTopics(JSON.parse(savedCompletedTopics))

      await loadPartnerInfo()
    }, 3000)

    return () => clearInterval(refreshInterval)
  }, [coupleId])

  // 保存数据到云端
  const saveDataToCloud = async () => {
    if (isCloudConfigured()) {
      await savePets(coupleId, pets)
      await savePoints(coupleId, points)
    }
  }

  const getPetMood = (pet) => {
    const avg = (pet.happiness + pet.health + pet.hunger) / 3
    if (avg >= 90) return 'ecstatic'
    if (avg >= 75) return 'happy'
    if (avg >= 60) return 'content'
    if (avg >= 45) return 'normal'
    return 'sad'
  }

  const handleDailySign = async () => {
    if (signedToday) return

    const today = new Date().toDateString()
    const lastSign = localStorage.getItem('tanDanLastSign')
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let newStreak = 1
    if (lastSign === yesterday) {
      newStreak = signStreak + 1
    }

    const basePoints = 10
    const bonusPoints = Math.min(newStreak * 2, 20)
    const totalPoints = basePoints + bonusPoints

    const newPoints = points + totalPoints
    setPoints(newPoints)
    await savePoints(coupleId, newPoints)

    setSignStreak(newStreak)
    setSignedToday(true)

    localStorage.setItem('tanDanLastSign', today)
    localStorage.setItem('tanDanSignStreak', newStreak.toString())
  }

  const handlePetAction = async (action) => {
    if (points < action.cost) return

    const newPets = [...pets]
    const pet = newPets[selectedPet]

    const newPoints = points - action.cost
    setPoints(newPoints)
    await savePoints(coupleId, newPoints)

    if (action.happiness) pet.happiness = Math.min(100, Math.max(0, pet.happiness + action.happiness))
    if (action.hunger) pet.hunger = Math.min(100, Math.max(0, pet.hunger + action.hunger))
    if (action.health) pet.health = Math.min(100, Math.max(0, pet.health + action.health))

    pet.exp = (pet.exp || 0) + 5
    if (pet.exp >= pet.level * 100) {
      pet.level += 1
      pet.exp = 0
    }

    setPets(newPets)
    await savePets(coupleId, newPets)
  }

  const completeMission = async (mission) => {
    if (completedMissions.includes(mission.id)) return

    const newPoints = points + mission.points
    setPoints(newPoints)
    await savePoints(coupleId, newPoints)

    const newCompleted = [...completedMissions, mission.id]
    setCompletedMissions(newCompleted)
    localStorage.setItem('tanDanCompletedMissions', JSON.stringify(newCompleted))

    await saveTaskProgress(coupleId, mission.id, { completed: true, timestamp: Date.now() })
  }

  const unlockHeavyMode = async () => {
    if (points < 50) return

    const newPoints = points - 50
    setPoints(newPoints)
    await savePoints(coupleId, newPoints)

    setHeavyUnlocked(true)
    localStorage.setItem('tanDanHeavyUnlocked', 'true')
  }

  const handleSaveConfig = () => {
    localStorage.setItem('supabase_url', configForm.url)
    localStorage.setItem('supabase_key', configForm.key)
    setShowConfig(false)
    setSyncStatus('connected')
    window.location.reload()
  }

  const currentMissions = selectedGame === 'delta' ? dailyMissions.delta :
                          selectedGame === 'sing' ? dailyMissions.sing :
                          dailyMissions.movie

  // 大惊喜等级
  const bigSurpriseLevel = 100
  const reachedBigSurprise = intimacy.level >= bigSurpriseLevel

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-gradient-love">
      {/* 顶部状态栏 */}
      <div className="glass sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CuteAvatar name={userData?.nickname} size="md" />
            <div>
              <p className="font-bold text-gray-800">{userData?.nickname || '小可爱'}</p>
              <p className="text-xs text-gray-400">连续签到 {signStreak} 天</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('chat')} className="text-center hover:scale-110 transition-transform">
              <span className="text-2xl">💬</span>
              <p className="text-xs text-gray-400">聊天</p>
            </button>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <span className="text-xl">💎</span>
                <span className="text-xl font-bold gradient-text">{points}</span>
              </div>
              <p className="text-xs text-gray-400">积分</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <span className="text-xl">💕</span>
                <span className="text-xl font-bold gradient-text">Lv.{intimacy.level}</span>
              </div>
              <p className="text-xs text-gray-400">亲密度</p>
            </div>
          </div>
        </div>

        {/* 签到按钮 */}
        <div className="mt-3">
          <CuteButton onClick={handleDailySign} disabled={signedToday} size="sm" className="w-full" variant={signedToday ? 'secondary' : 'primary'}>
            {signedToday ? '✓ 今日已签到' : '📅 每日签到 (+10~30积分)'}
          </CuteButton>
        </div>
      </div>

      {/* 同步状态 */}
      {syncStatus === 'not_configured' && (
        <div className="px-4 py-2">
          <CuteCard className="bg-yellow-50 border-yellow-200 cursor-pointer" onClick={() => setShowConfig(true)}>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <p className="text-sm text-yellow-700">点击配置云同步，防止数据丢失</p>
            </div>
          </CuteCard>
        </div>
      )}

      {/* 大惊喜提示 */}
      {reachedBigSurprise && (
        <div className="px-4 py-2">
          <CuteCard className="bg-gradient-to-r from-yellow-100 to-orange-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="font-bold text-orange-600">恭喜！已获得大惊喜！</p>
                <p className="text-xs text-orange-500">亲密度达到 Lv.{intimacy.level}</p>
              </div>
            </div>
          </CuteCard>
        </div>
      )}

      {/* 主内容 */}
      <div className="flex-1 p-4">
        {activeTab === 'mission' && (
          <div className="animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">🎯 每日任务</h2>
              <CuteTag variant="orange">今日刷新</CuteTag>
            </div>

            <div className="flex gap-2 mb-4">
              {[
                { id: 'delta', label: '三角洲', icon: '🎮' },
                { id: 'sing', label: '唱歌', icon: '🎤' },
                { id: 'movie', label: '电影', icon: '🎬' },
              ].map(g => (
                <button key={g.id} onClick={() => setSelectedGame(g.id)}
                  className={`flex-1 py-2 rounded-xl text-sm ${selectedGame === g.id ? 'bg-pink-500 text-white' : 'bg-white/80 text-gray-600'}`}>
                  {g.icon} {g.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {currentMissions.map((mission) => {
                const isCompleted = completedMissions.includes(mission.id)
                return (
                  <CuteCard
                    key={mission.id}
                    className={`${isCompleted ? 'opacity-60' : 'cursor-pointer'}`}
                    onClick={() => !isCompleted && onNavigate('dailyTask', { mission })}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{mission.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{mission.title}</h3>
                        <p className="text-sm text-gray-400">{mission.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-pink-500 font-bold">+{mission.points}</span>
                        <p className="text-xs text-gray-400 mt-1">
                          {isCompleted ? '✓ 已完成' : '点击提交'}
                        </p>
                      </div>
                    </div>
                  </CuteCard>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'pet' && (
          <div className="animate-fadeInUp">
            <CuteCard className="text-center mb-4">
              <p className="text-sm text-gray-500">当前积分</p>
              <p className="text-3xl font-bold gradient-text">{points}</p>
            </CuteCard>

            <div className="flex gap-3 mb-4">
              {pets.map((pet, index) => {
                const mood = petMoods[getPetMood(pet)]
                return (
                  <CuteCard key={pet.id} onClick={() => setSelectedPet(index)}
                    className={`text-center cursor-pointer flex-1 ${selectedPet === index ? 'ring-2 ring-pink-400' : ''}`}>
                    <div className="text-4xl mb-1 animate-bounce-soft">{pet.emoji}</div>
                    <p className="font-bold text-gray-800">{pet.name}</p>
                    <p className="text-xs text-gray-400">Lv.{pet.level}</p>
                    <span className={`text-xs ${mood.color}`}>{mood.emoji}</span>
                  </CuteCard>
                )
              })}
            </div>

            <CuteCard className="text-center mb-4">
              <div className="text-7xl mb-2 animate-bounce-soft">{pets[selectedPet].emoji}</div>
              <h2 className="text-xl font-bold text-gray-800">{pets[selectedPet].name}</h2>
              <p className="text-gray-400 text-sm">{pets[selectedPet].breed}</p>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg w-8">❤️</span>
                  <CuteProgress value={pets[selectedPet].health} max={100} color="pink" className="flex-1" />
                  <span className="text-sm text-gray-600 w-10">{pets[selectedPet].health}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg w-8">😊</span>
                  <CuteProgress value={pets[selectedPet].happiness} max={100} color="orange" className="flex-1" />
                  <span className="text-sm text-gray-600 w-10">{pets[selectedPet].happiness}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg w-8">🍖</span>
                  <CuteProgress value={pets[selectedPet].hunger} max={100} color="green" className="flex-1" />
                  <span className="text-sm text-gray-600 w-10">{pets[selectedPet].hunger}%</span>
                </div>
              </div>
            </CuteCard>

            <div className="grid grid-cols-3 gap-2">
              {petActions.map((action) => {
                const canAfford = points >= action.cost
                return (
                  <CuteCard key={action.id} onClick={() => canAfford && handlePetAction(action)}
                    className={`text-center cursor-pointer ${!canAfford ? 'opacity-50' : ''}`}>
                    <div className="text-2xl mb-1">{action.emoji}</div>
                    <div className="text-xs text-gray-700 font-medium">{action.title}</div>
                    {action.cost > 0 && <div className={`text-xs ${canAfford ? 'text-pink-500' : 'text-red-400'}`}>💎{action.cost}</div>}
                  </CuteCard>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'topic' && (
          <div className="animate-fadeInUp">
            {/* 亲密度展示 */}
            <CuteCard className="mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">💕</span>
                  <span className="text-2xl font-bold gradient-text">Lv.{intimacy.level}</span>
                </div>
                <CuteProgress value={intimacy.points} max={100} color="pink" className="w-32 mx-auto" />
                <p className="text-xs text-gray-400 mt-1">
                  {intimacy.points}/100 升级 · 总亲密度: {intimacy.totalPoints}
                </p>
                {!reachedBigSurprise && (
                  <p className="text-xs text-pink-500 mt-2">
                    再升级 {bigSurpriseLevel - intimacy.level} 级获得大惊喜 🎁
                  </p>
                )}
              </div>
            </CuteCard>

            {/* 轻度话题 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-700">🌸 轻度话题</h3>
                <span className="text-xs text-gray-400">
                  {completedTopics.filter(id => dailyMissions.light.some(t => t.id === id)).length}/{dailyMissions.light.length} 完成 +8亲密度
                </span>
              </div>
              <div className="space-y-2">
                {dailyMissions.light.map((topic) => {
                  const isCompleted = completedTopics.includes(topic.id)
                  return (
                    <CuteCard
                      key={topic.id}
                      className={`cursor-pointer ${isCompleted ? 'opacity-60' : ''}`}
                      onClick={() => !isCompleted && onNavigate('chat', { topic })}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{topic.title}</h4>
                          <p className="text-xs text-gray-400">{topic.desc}</p>
                        </div>
                        {isCompleted ? (
                          <span className="text-green-500 text-sm">✓ 已完成</span>
                        ) : (
                          <span className="text-gray-300">→</span>
                        )}
                      </div>
                    </CuteCard>
                  )
                })}
              </div>
            </div>

            {/* 中度话题 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-700">💕 中度话题</h3>
                <span className="text-xs text-gray-400">
                  {completedTopics.filter(id => dailyMissions.medium.some(t => t.id === id)).length}/{dailyMissions.medium.length} 完成 +15亲密度
                </span>
              </div>
              <div className="space-y-2">
                {dailyMissions.medium.map((topic) => {
                  const isCompleted = completedTopics.includes(topic.id)
                  return (
                    <CuteCard
                      key={topic.id}
                      className={`cursor-pointer ${isCompleted ? 'opacity-60' : ''}`}
                      onClick={() => !isCompleted && onNavigate('chat', { topic })}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{topic.title}</h4>
                          <p className="text-xs text-gray-400">{topic.desc}</p>
                        </div>
                        {isCompleted ? (
                          <span className="text-green-500 text-sm">✓ 已完成</span>
                        ) : (
                          <span className="text-gray-300">→</span>
                        )}
                      </div>
                    </CuteCard>
                  )
                })}
              </div>
            </div>

            {/* 重度话题 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-700">🔥 重度话题</h3>
                <span className="text-xs text-gray-400">
                  {heavyUnlocked ? `${completedTopics.filter(id => dailyMissions.heavy.some(t => t.id === id)).length}/${dailyMissions.heavy.length} 完成 +30亲密度` : '需50积分解锁'}
                </span>
              </div>
              {!heavyUnlocked ? (
                <CuteCard className="text-center">
                  <div className="text-4xl mb-2">🔒</div>
                  <p className="text-gray-500 mb-3">解锁重度话题模式</p>
                  <CuteButton onClick={unlockHeavyMode} disabled={points < 50}>
                    {points >= 50 ? '💎 50积分解锁' : `需要50积分 (当前${points})`}
                  </CuteButton>
                </CuteCard>
              ) : (
                <div className="space-y-2">
                  {dailyMissions.heavy.map((topic) => {
                    const isCompleted = completedTopics.includes(topic.id)
                    return (
                      <CuteCard
                        key={topic.id}
                        className={`cursor-pointer border-pink-200 ${isCompleted ? 'opacity-60' : ''}`}
                        onClick={() => !isCompleted && onNavigate('chat', { topic })}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{topic.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{topic.title}</h4>
                            <p className="text-xs text-gray-400">{topic.desc}</p>
                          </div>
                          {isCompleted ? (
                            <span className="text-green-500 text-sm">✓ 已完成</span>
                          ) : (
                            <span className="text-gray-300">→</span>
                          )}
                        </div>
                      </CuteCard>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fadeInUp">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ 设置</h2>

            {/* 双方信息 */}
            <CuteCard className="mb-4">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="我" className="w-16 h-16 rounded-full bg-pink-100 mx-auto mb-2" />
                  ) : (
                    <CuteAvatar name={userData?.nickname} size="lg" className="mx-auto mb-2" />
                  )}
                  <p className="font-bold text-gray-800">{userData?.nickname || '我'}</p>
                  <p className="text-xs text-gray-400">我</p>
                </div>
                <div className="text-3xl">💕</div>
                <div className="text-center">
                  {partner?.avatar ? (
                    <img src={partner.avatar} alt="TA" className="w-16 h-16 rounded-full bg-pink-100 mx-auto mb-2" />
                  ) : (
                    <CuteAvatar name={partner?.nickname || 'TA'} size="lg" className="mx-auto mb-2" />
                  )}
                  <p className="font-bold text-gray-800">{partner?.nickname || '等待中...'}</p>
                  <p className="text-xs text-gray-400">TA</p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">邀请码: <span className="text-pink-500 font-bold">{userData?.inviteCode || '---'}</span></p>
              </div>
            </CuteCard>

            {/* 数据统计 */}
            <CuteCard className="mb-4">
              <p className="text-sm text-gray-500 mb-3">我们的数据</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold gradient-text">{points}</p>
                  <p className="text-xs text-gray-400">积分</p>
                </div>
                <div>
                  <p className="text-xl font-bold gradient-text">{intimacy.level}</p>
                  <p className="text-xs text-gray-400">亲密度</p>
                </div>
                <div>
                  <p className="text-xl font-bold gradient-text">{signStreak}</p>
                  <p className="text-xs text-gray-400">签到</p>
                </div>
                <div>
                  <p className="text-xl font-bold gradient-text">{completedMissions.length}</p>
                  <p className="text-xs text-gray-400">任务</p>
                </div>
              </div>
            </CuteCard>

            {/* 云同步设置 */}
            <CuteCard className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">云同步</p>
                  <p className="text-xs text-gray-400">
                    {syncStatus === 'connected' ? '已连接，数据自动同步' : '未配置，数据仅本地保存'}
                  </p>
                </div>
                <CuteButton size="sm" onClick={() => setShowConfig(true)}>
                  {syncStatus === 'connected' ? '设置' : '配置'}
                </CuteButton>
              </div>
            </CuteCard>

            <button onClick={() => { localStorage.clear(); onNavigate('welcome') }}
              className="w-full py-3 text-gray-400 text-sm hover:text-red-400 transition-colors">
              退出登录
            </button>
          </div>
        )}
      </div>

      {/* 配置弹窗 */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <CuteCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-gray-800 mb-4">⚙️ 云同步配置</h3>

            <div className="bg-blue-50 rounded-xl p-3 mb-4">
              <p className="text-sm text-blue-700 font-medium">使用 Supabase（免费）</p>
              <p className="text-xs text-blue-600 mt-1">
                1. 访问 <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a> 注册<br/>
                2. 创建项目后，在 Settings → API 获取配置
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-500 text-sm mb-2">Project URL</label>
                <input type="text" value={configForm.url}
                  onChange={(e) => setConfigForm({ ...configForm, url: e.target.value })}
                  placeholder="https://xxx.supabase.co"
                  className="w-full bg-white/80 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-pink-300" />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-2">Anon Key</label>
                <input type="text" value={configForm.key}
                  onChange={(e) => setConfigForm({ ...configForm, key: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIs..."
                  className="w-full bg-white/80 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-pink-300" />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <CuteButton variant="secondary" onClick={() => setShowConfig(false)} className="flex-1">取消</CuteButton>
              <CuteButton onClick={handleSaveConfig} className="flex-1">保存</CuteButton>
            </div>

            <div className="mt-4 bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-2">在 Supabase SQL Editor 执行：</p>
              <pre className="text-xs text-green-400 whitespace-pre-wrap">{`CREATE TABLE couple_data (
  id BIGSERIAL PRIMARY KEY,
  couple_id TEXT NOT NULL UNIQUE,
  points INTEGER DEFAULT 100,
  intimacy JSONB DEFAULT '{"level":1,"points":0,"totalPoints":0}',
  pets JSONB,
  updated_at BIGINT
);

ALTER TABLE couple_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON couple_data FOR ALL USING (true);`}</pre>
            </div>
          </CuteCard>
        </div>
      )}

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bottom-nav">
        <div className="flex justify-around py-2 px-4">
          {[
            { id: 'mission', icon: '🎯', label: '任务' },
            { id: 'pet', icon: '🐕', label: '宠物' },
            { id: 'topic', icon: '💕', label: '话题' },
            { id: 'settings', icon: '⚙️', label: '我的' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-6 rounded-2xl ${activeTab === tab.id ? 'text-pink-500 bg-pink-50' : 'text-gray-400'}`}>
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs mt-0.5 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
