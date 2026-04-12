import { useState } from 'react'
import { CuteButton, CuteCard, CuteProgress } from '../components/common/CuteUI'

export default function TaskDetail({ onNavigate, task }) {
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const defaultTask = task || {
    title: '给TA发一条语音',
    description: '说出今天最想念TA的瞬间',
    icon: '🎤',
    points: 10,
    type: 'express',
  }

  const taskSteps = {
    express: [
      { title: '准备录音', desc: '找一个安静的地方，放松心情' },
      { title: '说出心里话', desc: '告诉TA今天最想念TA的瞬间' },
      { title: '发送给TA', desc: '让TA听到你的声音' },
    ],
    memory: [
      { title: '选择照片', desc: '翻翻相册，找一张你们的合照' },
      { title: '回忆故事', desc: '想想当时发生了什么' },
      { title: '分享给TA', desc: '把照片和故事发给TA' },
    ],
    create: [
      { title: '打开画板', desc: '准备好一起创作' },
      { title: '发挥创意', desc: '画出你们的故事' },
      { title: '保存作品', desc: '留下这份特别的回忆' },
    ],
    surprise: [
      { title: '想一个惊喜', desc: '可以是外卖、情书或小礼物' },
      { title: '准备惊喜', desc: '用心准备这份特别的心意' },
      { title: '给TA惊喜', desc: '看TA开心的样子' },
    ],
    chat: [
      { title: '找个话题', desc: '可以是未来、梦想或日常' },
      { title: '深入交流', desc: '真诚地分享你的想法' },
      { title: '倾听TA', desc: '理解TA的想法和感受' },
    ],
    game: [
      { title: '选择游戏', desc: '你画我猜或真心话大冒险' },
      { title: '开始游戏', desc: '享受游戏的乐趣' },
      { title: '互动交流', desc: '增进彼此的了解' },
    ],
    love: [
      { title: '想一句情话', desc: '可以是甜蜜或幽默的' },
      { title: '表达爱意', desc: '真诚地说给TA听' },
      { title: '看TA的反应', desc: '享受甜蜜时刻' },
    ],
    video: [
      { title: '找个好时间', desc: '确认TA有空' },
      { title: '开始视频', desc: '看看可爱的TA' },
      { title: '聊聊天', desc: '分享今天的故事' },
    ],
  }

  const steps = taskSteps[defaultTask.type] || taskSteps.express

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setCompleted(true)
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
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
          <span className="font-medium text-gray-700">任务详情</span>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {completed ? (
          <div className="h-full flex flex-col items-center justify-center animate-fadeInUp">
            <div className="text-8xl mb-6 animate-bounce-soft">🎉</div>
            <h2 className="text-2xl font-bold gradient-text mb-2">任务完成！</h2>
            <p className="text-gray-400 mb-4">太棒了，你们的爱又升温了</p>
            <div className="text-4xl font-bold text-pink-500 mb-6">+{defaultTask.points} 积分</div>
            <CuteButton onClick={() => onNavigate('home')} size="lg">
              返回首页
            </CuteButton>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 任务卡片 */}
            <CuteCard className="text-center">
              <div className="text-6xl mb-4">{defaultTask.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{defaultTask.title}</h2>
              <p className="text-gray-400">{defaultTask.description}</p>
              <CuteTag variant="pink" className="mt-3">
                +{defaultTask.points} 积分
              </CuteTag>
            </CuteCard>

            {/* 进度 */}
            <div className="px-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>完成进度</span>
                <span>{step + 1}/{steps.length}</span>
              </div>
              <CuteProgress value={step + 1} max={steps.length} color="pink" />
            </div>

            {/* 步骤列表 */}
            <div className="space-y-3">
              {steps.map((s, index) => (
                <CuteCard
                  key={index}
                  className={`transition-all ${
                    index === step
                      ? 'ring-2 ring-pink-400 shadow-lg'
                      : index < step
                        ? 'opacity-60'
                        : 'opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      index < step
                        ? 'bg-green-100 text-green-500'
                        : index === step
                          ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-white'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {index < step ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${index === step ? 'text-gray-800' : 'text-gray-500'}`}>
                        {s.title}
                      </h3>
                      <p className="text-sm text-gray-400">{s.desc}</p>
                    </div>
                  </div>
                </CuteCard>
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <CuteButton
                variant="secondary"
                onClick={handlePrev}
                disabled={step === 0}
                className="flex-1"
              >
                上一步
              </CuteButton>
              <CuteButton
                onClick={handleNext}
                className="flex-1"
              >
                {step === steps.length - 1 ? '完成任务' : '下一步'}
              </CuteButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
