import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { CuteButton, CuteCard, CuteBubble, CuteAvatar } from '../components/common/CuteUI'
import {
  sendMessage,
  getMessages,
  setCurrentTopic,
  getCurrentTopic,
  clearMessages,
  isCloudConfigured,
  addIntimacy,
  getIntimacy
} from '../services/cloudService'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://boqhqohnzcnvqllkqthg.supabase.co',
  'sb_publishable_C7dzSyAlSqG3h4P_lfKFnw__uDUEhOE'
)

export default function Chat({ onNavigate, topic }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [currentTopic, setCurrentTopicState] = useState(null)
  const [syncStatus, setSyncStatus] = useState('connected')
  const [partner, setPartner] = useState(null)
  const [intimacy, setIntimacy] = useState({ level: 1, points: 0, totalPoints: 0 })
  const messagesEndRef = useRef(null)

  const emojis = ['💕', '❤️', '😘', '🥰', '😍', '🤗', '😊', '🌟', '✨', '💖', '🥺', '😢', '😂', '🤭', '😴', '💪']

  const userData = user || JSON.parse(localStorage.getItem('tanDanUser') || '{}')
  const coupleData = JSON.parse(localStorage.getItem('tanDanCouple') || '{}')
  // 优先使用用户数据中的 coupleId
  const coupleId = userData?.coupleId || coupleData?.id || 'default_couple'
  const myId = userData?.id || 'user_1'

  useEffect(() => {
    loadPartnerInfo()
    loadMessages()
    loadCurrentTopic()
    loadIntimacy()

    if (topic) {
      handleSetTopic(topic)
    }

    const interval = setInterval(() => {
      loadMessages()
      loadCurrentTopic()
      loadPartnerInfo()
    }, 2000)

    return () => clearInterval(interval)
  }, [topic])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadPartnerInfo = async () => {
    try {
      // 直接从localStorage获取最新的用户数据
      const savedUser = localStorage.getItem('tanDanUser')
      const currentUser = savedUser ? JSON.parse(savedUser) : userData

      const { data } = await supabase
        .from('couples')
        .select('*')
        .eq('id', coupleId)
        .single()

      if (data) {
        // 判断我是创建者还是加入者
        const isCreator = data.creator_nickname === currentUser?.nickname
        const partnerNickname = isCreator ? data.joiner_nickname : data.creator_nickname
        const partnerAvatar = isCreator ? data.joiner_avatar : data.creator_avatar

        if (partnerNickname) {
          setPartner({
            nickname: partnerNickname,
            avatar: partnerAvatar
          })
        }
      }
    } catch (error) {
      console.error('获取对方信息失败:', error)
    }
  }

  const loadIntimacy = async () => {
    const int = await getIntimacy(coupleId)
    setIntimacy(int)
  }

  const loadMessages = async () => {
    const msgs = await getMessages(coupleId)
    setMessages(msgs)
  }

  const loadCurrentTopic = async () => {
    const t = await getCurrentTopic(coupleId)
    setCurrentTopicState(t)
  }

  const handleSetTopic = async (newTopic) => {
    await setCurrentTopic(coupleId, newTopic)
    setCurrentTopicState(newTopic)
  }

  const handleSendMessage = async (text) => {
    if (!text.trim()) return

    const newMessage = {
      senderId: myId,
      senderName: userData?.nickname || '我',
      text: text.trim(),
      timestamp: Date.now()
    }

    await sendMessage(coupleId, newMessage)
    setInputText('')
    setShowEmojis(false)

    setTimeout(loadMessages, 100)
  }

  const handleCompleteTopic = async () => {
    // 使用 currentTopic 或 topic prop
    const topicToComplete = currentTopic || topic
    if (!topicToComplete) {
      console.log('没有话题可完成')
      return
    }

    console.log('完成话题:', topicToComplete)
    console.log('话题类型:', topicToComplete.type)

    // 标记当前话题为已完成
    const savedCompletedTopics = localStorage.getItem('tanDanCompletedTopics')
    let completedTopics = savedCompletedTopics ? JSON.parse(savedCompletedTopics) : []

    if (!completedTopics.includes(topicToComplete.id)) {
      completedTopics.push(topicToComplete.id)
      localStorage.setItem('tanDanCompletedTopics', JSON.stringify(completedTopics))
    }

    // 获取今日该类型的所有话题ID
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('tanDanMissionDate')

    console.log('=== 话题完成检查 ===')
    console.log('当前日期:', today)
    console.log('保存日期:', savedDate)
    console.log('话题类型:', topicToComplete.type)

    // 获取该类型的今日话题
    let todayTopicIds = []
    const topicType = topicToComplete.type // 'light', 'medium', 'heavy'
    const storageKey = `tanDan${topicType.charAt(0).toUpperCase() + topicType.slice(1)}Missions`
    const savedTopics = localStorage.getItem(storageKey)

    console.log('存储Key:', storageKey)
    console.log('存储数据:', savedTopics ? '有数据' : '无数据')

    if (savedTopics) {
      try {
        const topics = JSON.parse(savedTopics)
        todayTopicIds = topics.map(t => t.id)
        console.log('今日话题IDs:', todayTopicIds)
      } catch (e) {
        console.error('解析话题数据失败:', e)
      }
    } else {
      console.log('话题数据不存在，可能需要先进入话题页面')
    }

    // 检查该类型所有话题是否都完成
    const completedCount = todayTopicIds.filter(id => completedTopics.includes(id)).length
    const allTopicsCompleted = todayTopicIds.length > 0 && completedCount >= todayTopicIds.length

    console.log('已完成数量:', completedCount)
    console.log('总数量:', todayTopicIds.length)
    console.log('是否全部完成:', allTopicsCompleted)

    if (allTopicsCompleted) {
      // 检查是否已经获得过该类型的奖励
      const savedRewardedTypes = localStorage.getItem('tanDanRewardedTypes')
      let rewardedTypes = savedRewardedTypes ? JSON.parse(savedRewardedTypes) : []
      const rewardKey = `${topicType}_${today}`

      if (!rewardedTypes.includes(rewardKey)) {
        rewardedTypes.push(rewardKey)
        localStorage.setItem('tanDanRewardedTypes', JSON.stringify(rewardedTypes))

        // 增加亲密度 - 根据话题类型确定奖励
        let rewardPoints = 8 // 默认轻度
        if (topicType === 'medium') {
          rewardPoints = 15
        } else if (topicType === 'heavy') {
          rewardPoints = 30
        }

        console.log('全部完成！准备增加亲密度:', rewardPoints)

        const newIntimacy = await addIntimacy(coupleId, rewardPoints)
        console.log('增加后的亲密度:', newIntimacy)
        setIntimacy(newIntimacy)

        const typeNames = { light: '轻度', medium: '中度', heavy: '重度' }
        alert(`🎉 ${typeNames[topicType]}话题全部完成！亲密度 +${rewardPoints}\n当前等级: Lv.${newIntimacy.level}`)
      } else {
        alert('✓ 话题已标记完成！（已获得过该类型奖励）')
      }
    } else {
      const typeNames = { light: '轻度', medium: '中度', heavy: '重度' }
      const total = todayTopicIds.length || 3
      alert(`✓ 话题已标记完成！\n${typeNames[topicType]}话题进度: ${completedCount}/${total}\n完成全部可获得亲密度奖励！`)
    }

    await setCurrentTopic(coupleId, null)
    setCurrentTopicState(null)
    onNavigate('home')
  }

  const isMyMessage = (msg) => msg.senderId === myId

  return (
    <div className="min-h-screen flex flex-col bg-gradient-love">
      {/* 顶部导航 */}
      <div className="glass sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-pink-500">
            ← 返回
          </button>
          <div className="flex items-center gap-2">
            {partner?.avatar ? (
              <img src={partner.avatar} alt="TA" className="w-8 h-8 rounded-full bg-pink-100" />
            ) : (
              <CuteAvatar name={partner?.nickname || 'TA'} size="sm" />
            )}
            <div className="text-center">
              <span className="font-medium text-gray-700">{partner?.nickname || 'TA'}</span>
              <p className="text-xs text-gray-400">Lv.{intimacy.level}</p>
            </div>
          </div>
          <div className="text-center">
            <span className="text-lg">💕</span>
            <p className="text-xs text-gray-400">{intimacy.totalPoints}</p>
          </div>
        </div>
      </div>

      {/* 当前话题 */}
      {currentTopic && (
        <div className="px-4 py-2">
          <CuteCard className="bg-gradient-to-r from-pink-100 to-purple-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTopic.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{currentTopic.title}</p>
                <p className="text-xs text-gray-500">{currentTopic.desc}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <CuteButton
                onClick={handleCompleteTopic}
                size="sm"
                className="flex-1"
              >
                ✓ 完成任务
              </CuteButton>
              <CuteButton
                variant="secondary"
                onClick={() => { setCurrentTopicState(null); setCurrentTopic(coupleId, null) }}
                size="sm"
              >
                取消
              </CuteButton>
            </div>
          </CuteCard>
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center">
          <span className="text-xs text-gray-400 bg-white/50 px-3 py-1 rounded-full">
            今天 · 消息同步中
          </span>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">💬</div>
            <p className="text-gray-400">开始聊天吧</p>
            <p className="text-xs text-gray-300 mt-1">你们的消息会实时同步</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id || msg.timestamp}
            className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}
          >
            {!isMyMessage(msg) && (
              partner?.avatar ? (
                <img src={partner.avatar} alt={msg.senderName} className="w-8 h-8 rounded-full bg-pink-100 mr-2 self-end" />
              ) : (
                <CuteAvatar name={msg.senderName} size="sm" className="mr-2 self-end" />
              )
            )}
            <div className={`max-w-[70%] ${isMyMessage(msg) ? 'order-1' : ''}`}>
              <CuteBubble position={isMyMessage(msg) ? 'right' : 'left'}>
                <p className="text-gray-700">{msg.text}</p>
              </CuteBubble>
              <p className={`text-xs text-gray-400 mt-1 ${isMyMessage(msg) ? 'text-right' : 'text-left'}`}>
                {msg.senderName} · {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 表情面板 */}
      {showEmojis && (
        <div className="px-4 py-3 bg-white/80 border-t border-pink-100">
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputText(prev => prev + emoji)
                  setShowEmojis(false)
                }}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="glass p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojis(!showEmojis)}
            className="text-2xl hover:scale-110 transition-transform"
          >
            😊
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="说点什么..."
            className="flex-1 bg-white/80 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-pink-300"
          />
          <CuteButton
            onClick={() => handleSendMessage(inputText)}
            size="sm"
            className="px-4"
          >
            发送
          </CuteButton>
        </div>
      </div>
    </div>
  )
}
