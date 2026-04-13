import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CuteButton, CuteCard } from '../components/common/CuteUI'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://boqhqohnzcnvqllkqthg.supabase.co',
  'sb_publishable_C7dzSyAlSqG3h4P_lfKFnw__uDUEhOE'
)

export default function Welcome({ onNavigate }) {
  const { setUser } = useAuth()
  const [coupleCode, setCoupleCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNickname, setShowNickname] = useState(false)

  // 处理输入，只允许字母，自动转大写
  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '')
    if (value.length <= 6) {
      setCoupleCode(value)
      setError('')
    }
  }

  // 验证情侣码格式
  const isValidCode = (code) => {
    return /^[A-Z]{6}$/.test(code)
  }

  // 进入/创建房间
  const handleEnter = async () => {
    if (!isValidCode(coupleCode)) {
      setError('请输入6个字母的情侣码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const coupleId = 'couple_' + coupleCode.toLowerCase()
      console.log('检查情侣码:', coupleCode, 'coupleId:', coupleId)

      // 检查房间是否存在
      const { data: existingCouple, error: queryError } = await supabase
        .from('couples')
        .select('*')
        .eq('id', coupleId)
        .single()

      console.log('查询结果:', existingCouple, '错误:', queryError)

      if (existingCouple) {
        // 房间已存在，恢复数据
        const savedUser = localStorage.getItem('tanDanUser')
        let userData = savedUser ? JSON.parse(savedUser) : null

        // 检查是否是同一个用户
        if (userData && userData.coupleId === coupleId) {
          // 同一用户，直接进入
          setUser(userData)
          onNavigate('home')
        } else {
          // 新设备或新用户，需要设置昵称
          setShowNickname(true)
        }
      } else {
        // 房间不存在，需要创建
        setShowNickname(true)
      }
    } catch (err) {
      // 查询出错，可能是房间不存在
      console.error('查询异常:', err)
      setShowNickname(true)
    }

    setLoading(false)
  }

  // 创建/加入房间
  const handleCreateOrJoin = async () => {
    if (!nickname.trim()) {
      setError('请输入昵称')
      return
    }

    setLoading(true)
    setError('')

    try {
      const coupleId = 'couple_' + coupleCode.toLowerCase()

      // 检查房间是否存在
      const { data: existingCouple } = await supabase
        .from('couples')
        .select('*')
        .eq('id', coupleId)
        .single()

      const userId = 'user_' + Date.now()
      const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${nickname}`

      if (existingCouple) {
        // 加入已有房间
        // 检查是否已经有加入者
        if (!existingCouple.joiner_nickname) {
          // 作为加入者加入
          await supabase
            .from('couples')
            .update({
              joiner_nickname: nickname.trim(),
              joiner_avatar: avatar,
              joined_at: Date.now()
            })
            .eq('id', coupleId)
        }

        const userData = {
          id: userId,
          nickname: nickname.trim(),
          avatar,
          coupleId,
          partnerId: 'partner',
        }

        localStorage.setItem('tanDanUser', JSON.stringify(userData))
        setUser(userData)
        onNavigate('home')
      } else {
        // 创建新房间
        const { error: insertError } = await supabase.from('couples').insert({
          id: coupleId,
          invite_code: coupleCode,
          creator_nickname: nickname.trim(),
          creator_avatar: avatar,
          created_at: Date.now()
        })

        if (insertError) {
          // 可能是并发创建，尝试再次查询并加入
          console.log('插入失败，可能是并发创建，尝试加入')
          const { data: retryCouple } = await supabase
            .from('couples')
            .select('*')
            .eq('id', coupleId)
            .single()

          if (retryCouple && !retryCouple.joiner_nickname) {
            await supabase
              .from('couples')
              .update({
                joiner_nickname: nickname.trim(),
                joiner_avatar: avatar,
                joined_at: Date.now()
              })
              .eq('id', coupleId)
          }

          const userData = {
            id: userId,
            nickname: nickname.trim(),
            avatar,
            coupleId,
          }

          localStorage.setItem('tanDanUser', JSON.stringify(userData))
          setUser(userData)
          onNavigate('home')
          return
        }

        const userData = {
          id: userId,
          nickname: nickname.trim(),
          avatar,
          coupleId,
          inviteCode: coupleCode,
        }

        localStorage.setItem('tanDanUser', JSON.stringify(userData))
        setUser(userData)
        onNavigate('home')
      }
    } catch (err) {
      setError('操作失败，请重试')
      console.error(err)
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
      <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">
        输入你们的专属情侣码，数据永久保存
      </p>

      {/* 情侣码输入 */}
      <CuteCard className="w-full max-w-sm mb-6">
        <div className="text-center">
          <p className="text-gray-600 mb-3 font-medium">🔑 情侣码</p>
          <input
            type="text"
            value={coupleCode}
            onChange={handleCodeChange}
            placeholder="输入6个字母"
            className="w-full text-center text-3xl font-bold tracking-widest bg-white/80 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-pink-300 uppercase"
            maxLength={6}
            disabled={showNickname}
          />
          <p className="text-xs text-gray-400 mt-2">
            例如：LOVEUS、FOREVR、SWEETY
          </p>
        </div>
      </CuteCard>

      {/* 昵称输入（首次进入时显示） */}
      {showNickname && (
        <CuteCard className="w-full max-w-sm mb-6 animate-fadeInUp">
          <div className="text-center">
            <p className="text-gray-600 mb-3 font-medium">😊 你的昵称</p>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="让TA怎么称呼你？"
              className="w-full text-center text-xl bg-white/80 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-pink-300"
              maxLength={10}
            />
          </div>
        </CuteCard>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 text-center text-red-400 text-sm bg-red-50 rounded-xl py-2 px-4">
          {error}
        </div>
      )}

      {/* 按钮 */}
      <CuteButton
        onClick={showNickname ? handleCreateOrJoin : handleEnter}
        disabled={loading || coupleCode.length !== 6}
        size="lg"
        className="w-full max-w-xs shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            处理中...
          </span>
        ) : showNickname ? (
          '进入房间 💕'
        ) : (
          '输入情侣码进入 💕'
        )}
      </CuteButton>

      {/* 提示 */}
      <div className="mt-6 text-center max-w-xs">
        <p className="text-xs text-gray-400">
          💡 两人使用相同的情侣码即可同步数据
        </p>
        <p className="text-xs text-gray-300 mt-1">
          记住你们的情侣码，下次登录数据还在
        </p>
      </div>
    </div>
  )
}
