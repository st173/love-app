import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCouple } from '../context/CoupleContext'
import { CuteButton, CuteCard, CuteInput, CuteTag } from '../components/common/CuteUI'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://boqhqohnzcnvqllkqthg.supabase.co',
  'sb_publishable_C7dzSyAlSqG3h4P_lfKFnw__uDUEhOE'
)

export default function Pair({ onNavigate }) {
  const { user, setUser, login } = useAuth()
  const { setCouple } = useCouple()
  const [mode, setMode] = useState('create')
  const [inviteCode, setInviteCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [myInviteCode, setMyInviteCode] = useState('')

  useEffect(() => {
    // 检查是否已经配对
    const savedUser = localStorage.getItem('tanDanUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (userData.coupleId) {
        // 已配对，直接跳转首页
        onNavigate('home')
        return
      }
      // 恢复昵称
      if (userData.nickname) {
        setNickname(userData.nickname)
      }
    }
    // 生成或恢复邀请码
    const savedCode = localStorage.getItem('tanDanMyInviteCode')
    if (savedCode) {
      setMyInviteCode(savedCode)
    } else {
      const newCode = 'TD' + Math.random().toString(36).substring(2, 6).toUpperCase()
      setMyInviteCode(newCode)
      localStorage.setItem('tanDanMyInviteCode', newCode)
    }
  }, [onNavigate])

  const handleCreateCouple = async () => {
    if (!nickname.trim()) {
      setError('请输入昵称')
      return
    }

    setLoading(true)
    setError('')
    try {
      let currentUser = user
      if (!currentUser) {
        currentUser = await login()
      }

      const coupleId = 'couple_' + myInviteCode.toLowerCase()

      // 保存到云端
      await supabase.from('couples').upsert({
        id: coupleId,
        invite_code: myInviteCode,
        creator_nickname: nickname.trim(),
        creator_avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${nickname}`,
        created_at: Date.now()
      })

      const coupleData = {
        id: coupleId,
        members: [currentUser.id],
        loveScore: 500,
        createdAt: new Date().toISOString(),
      }

      const updatedUser = {
        ...currentUser,
        nickname: nickname.trim(),
        inviteCode: myInviteCode,
        coupleId: coupleData.id,
      }

      localStorage.setItem('tanDanUser', JSON.stringify(updatedUser))
      localStorage.setItem('tanDanCouple', JSON.stringify(coupleData))

      setUser(updatedUser)
      setCouple(coupleData)

      onNavigate('home')
    } catch (err) {
      setError('创建失败，请重试')
      console.error(err)
    }
    setLoading(false)
  }

  const handleJoinCouple = async () => {
    if (!nickname.trim()) {
      setError('请输入昵称')
      return
    }
    if (!inviteCode.trim()) {
      setError('请输入邀请码')
      return
    }

    setLoading(true)
    setError('')
    try {
      let currentUser = user
      if (!currentUser) {
        currentUser = await login()
      }

      const code = inviteCode.trim().toUpperCase()
      const coupleId = 'couple_' + code.toLowerCase()

      // 检查房间是否存在
      const { data: existingCouple } = await supabase
        .from('couples')
        .select('*')
        .eq('invite_code', code)
        .single()

      if (!existingCouple) {
        setError('邀请码无效，请确认后重试')
        setLoading(false)
        return
      }

      // 更新加入者信息
      await supabase
        .from('couples')
        .update({
          joiner_nickname: nickname.trim(),
          joiner_avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${nickname}`,
          joined_at: Date.now()
        })
        .eq('invite_code', code)

      const coupleData = {
        id: coupleId,
        members: [currentUser.id, 'partner'],
        loveScore: 500,
        createdAt: new Date().toISOString(),
        partner: {
          nickname: existingCouple.creator_nickname,
          avatar: existingCouple.creator_avatar
        }
      }

      const updatedUser = {
        ...currentUser,
        nickname: nickname.trim(),
        partnerId: 'partner',
        coupleId: coupleData.id,
      }

      localStorage.setItem('tanDanUser', JSON.stringify(updatedUser))
      localStorage.setItem('tanDanCouple', JSON.stringify(coupleData))

      setUser(updatedUser)
      setCouple(coupleData)

      onNavigate('home')
    } catch (err) {
      setError('加入失败，请重试')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col p-6 relative overflow-hidden bg-gradient-love">
      {/* 背景装饰 */}
      <div className="absolute top-20 right-6 text-5xl opacity-10 animate-float">💕</div>
      <div className="absolute bottom-40 left-4 text-4xl opacity-10 animate-bounce-soft">✨</div>
      <div className="absolute top-1/3 left-8 text-3xl opacity-10 animate-pulse">🌸</div>
      <div className="absolute bottom-1/4 right-6 text-3xl opacity-10 animate-pulse" style={{animationDelay: '0.5s'}}>🌺</div>

      {/* 返回按钮 */}
      <button
        onClick={() => onNavigate('welcome')}
        className="self-start flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors mb-6"
      >
        <span>←</span>
        <span>返回</span>
      </button>

      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">情侣配对</h1>
        <p className="text-gray-400 text-sm">和TA一起开启甜蜜之旅</p>
      </div>

      {/* 模式切换 */}
      <div className="glass rounded-full p-1 mb-6 flex">
        <button
          onClick={() => setMode('create')}
          className={`flex-1 py-3 rounded-full transition-all font-medium ${
            mode === 'create' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'text-gray-500'
          }`}
        >
          🌟 创建房间
        </button>
        <button
          onClick={() => setMode('join')}
          className={`flex-1 py-3 rounded-full transition-all font-medium ${
            mode === 'join' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'text-gray-500'
          }`}
        >
          💕 加入房间
        </button>
      </div>

      {/* 昵称输入 */}
      <CuteInput
        label="你的昵称"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="让TA怎么称呼你？"
        className="mb-5"
      />

      {mode === 'create' ? (
        <div className="flex-1 animate-fadeInUp">
          {/* 邀请码展示 */}
          <CuteCard className="text-center mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-rose-200/30 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <p className="text-gray-500 mb-2">你的专属邀请码</p>
            <div className="relative">
              <p className="text-4xl font-bold gradient-text tracking-widest my-3">
                {myInviteCode}
              </p>
            </div>
            <CuteTag variant="pink" className="mt-2">
              📤 分享给TA，让TA输入这个码加入你的房间
            </CuteTag>
          </CuteCard>

          <CuteButton
            onClick={handleCreateCouple}
            disabled={loading}
            size="lg"
            className="w-full shadow-lg"
          >
            {loading ? '创建中...' : '创建房间 💕'}
          </CuteButton>
        </div>
      ) : (
        <div className="flex-1 animate-fadeInUp">
          {/* 邀请码输入 */}
          <CuteInput
            label="TA的邀请码"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="输入TA分享给你的邀请码"
            className="mb-5"
          />

          <CuteButton
            onClick={handleJoinCouple}
            disabled={loading}
            size="lg"
            className="w-full shadow-lg"
          >
            {loading ? '加入中...' : '加入TA的房间 💕'}
          </CuteButton>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mt-4 text-center text-red-400 text-sm bg-red-50 rounded-xl py-2">
          {error}
        </div>
      )}

      {/* 底部提示 */}
      <div className="mt-auto pt-6 text-center">
        <p className="text-xs text-gray-300">
          🐕 康康和球球在等着你们哦
        </p>
      </div>
    </div>
  )
}
