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
  const coupleId = coupleData?.id || 'default_couple'
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
      const { data } = await supabase
        .from('couples')
        .select('*')
        .eq('id', coupleId)
        .single()

      if (data) {
        // 判断我是创建者还是加入者
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
    if (!currentTopic) return

    // 检查是否已经获得过亲密度奖励
    const savedRewardedTopics = localStorage.getItem('tanDanRewardedTopics')
    let rewardedTopics = savedRewardedTopics ? JSON.parse(savedRewardedTopics) : []

    // 标记当前话题为已完成
    const savedCompletedTopics = localStorage.getItem('tanDanCompletedTopics')
    let completedTopics = savedCompletedTopics ? JSON.parse(savedCompletedTopics) : []

    if (!completedTopics.includes(currentTopic.id)) {
      completedTopics.push(currentTopic.id)
      localStorage.setItem('tanDanCompletedTopics', JSON.stringify(completedTopics))
    }

    // 如果还没有获得过亲密度奖励，则增加亲密度
    if (!rewardedTopics.includes(currentTopic.id)) {
      rewardedTopics.push(currentTopic.id)
      localStorage.setItem('tanDanRewardedTopics', JSON.stringify(rewardedTopics))

      // 增加亲密度
      const rewards = { light: 8, medium: 15, heavy: 30 }
      const points = rewards[currentTopic.type] || 8

      const newIntimacy = await addIntimacy(coupleId, points)
      setIntimacy(newIntimacy)

      const typeNames = { light: '轻度', medium: '中度', heavy: '重度' }
      alert(`🎉 ${typeNames[currentTopic.type]}话题完成！亲密度 +${points}`)
    } else {
      alert('✓ 话题已标记完成！')
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
