import { useState } from 'react'
import { CuteButton, CuteCard, CuteProgress, CuteTag } from '../components/common/CuteUI'

export default function ChallengeDetail({ onNavigate, challenge }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [currentTask, setCurrentTask] = useState(0)
  const [taskCompleted, setTaskCompleted] = useState([])

  const defaultChallenge = challenge || {
    title: '真心话大冒险',
    desc: '互相问3个真心话问题',
    icon: '🎭',
    type: 'truth',
  }

  // 不同模式的挑战内容
  const challengeContent = {
    truth: {
      title: '真心话大冒险',
      type: 'quiz',
      questions: [
        {
          question: '你最喜欢我哪一点？',
          options: ['性格温柔', '外貌出众', '才华横溢', '全部都喜欢'],
        },
        {
          question: '我们第一次见面时，你对我的印象是？',
          options: ['很可爱', '很特别', '一见钟情', '没什么印象'],
        },
        {
          question: '你最想和我一起去哪里旅行？',
          options: ['海边度假', '雪山探险', '古城漫步', '哪里都行'],
        },
      ],
    },
    night: {
      title: '深夜话题',
      type: 'quiz',
      questions: [
        {
          question: '你最浪漫的回忆是什么？',
          options: ['第一次约会', '第一次牵手', '第一次接吻', '每一天都很浪漫'],
        },
        {
          question: '你梦想中的婚礼是什么样的？',
          options: ['海边婚礼', '教堂婚礼', '中式婚礼', '只要有你就好'],
        },
        {
          question: '你希望我们的未来是怎样的？',
          options: ['环游世界', '安稳生活', '一起创业', '只要在一起就好'],
        },
      ],
    },
    light: {
      title: '轻度挑战',
      type: 'tasks',
      tasks: [
        { title: '说一句情话', desc: '用最甜的话表达爱意', icon: '💕', points: 5 },
        { title: '分享一张合照', desc: '回忆美好的瞬间', icon: '📸', points: 5 },
        { title: '给TA一个拥抱', desc: '下次见面时记得哦', icon: '🤗', points: 5 },
        { title: '说声我爱你', desc: '简单但有力', icon: '❤️', points: 5 },
      ],
    },
    medium: {
      title: '中度挑战',
      type: 'tasks',
      tasks: [
        { title: '真心话大冒险', desc: '互相问3个问题', icon: '🎭', points: 10 },
        { title: '深夜话题', desc: '聊聊你们的未来', icon: '🌙', points: 10 },
        { title: '角色扮演', desc: '扮演对方的理想型', icon: '👑', points: 15 },
        { title: '写一封情书', desc: '用心写下你的感受', icon: '💌', points: 15 },
      ],
    },
    heavy: {
      title: '重度挑战',
      type: 'tasks',
      tasks: [
        { title: '亲密挑战', desc: '完成TA的一个心愿', icon: '🔥', points: 20 },
        { title: '惊喜计划', desc: '为TA策划一个惊喜', icon: '🎁', points: 20 },
        { title: '角色扮演进阶', desc: '扮演对方幻想的角色', icon: '✨', points: 25 },
        { title: '大胆告白', desc: '说出你最深的心声', icon: '💖', points: 25 },
      ],
    },
  }

  const content = challengeContent[defaultChallenge.type] || challengeContent.truth

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    setAnswers([...answers, index])

    setTimeout(() => {
      if (currentQuestion < content.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
      }
    }, 800)
  }

  const handleTaskComplete = (index) => {
    const newCompleted = [...taskCompleted]
    newCompleted[index] = true
    setTaskCompleted(newCompleted)
    setCurrentTask(index + 1)

    if (newCompleted.filter(Boolean).length === content.tasks.length) {
      setShowResult(true)
    }
  }

  const getScore = () => answers.length

  // 任务类型页面
  if (content.type === 'tasks') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-love">
        <div className="glass sticky top-0 z-10 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-pink-500">
              ← 返回
            </button>
            <span className="font-medium text-gray-700">{content.title}</span>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="flex-1 p-4">
          {showResult ? (
            <div className="h-full flex flex-col items-center justify-center animate-fadeInUp">
              <div className="text-8xl mb-6 animate-bounce-soft">🎉</div>
              <h2 className="text-2xl font-bold gradient-text mb-2">挑战完成！</h2>
              <p className="text-gray-400 mb-4">太棒了，你们的爱又升温了</p>
              <div className="text-4xl font-bold text-pink-500 mb-6">
                +{content.tasks.reduce((sum, t) => sum + t.points, 0)} 积分
              </div>
              <CuteButton onClick={() => onNavigate('home')} size="lg">
                返回首页
              </CuteButton>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 进度 */}
              <div className="text-center">
                <CuteTag variant="purple">
                  完成 {taskCompleted.filter(Boolean).length}/{content.tasks.length} 个任务
                </CuteTag>
              </div>

              <CuteProgress
                value={taskCompleted.filter(Boolean).length}
                max={content.tasks.length}
                color="pink"
              />

              {/* 任务列表 */}
              <div className="space-y-3 mt-4">
                {content.tasks.map((task, index) => (
                  <CuteCard
                    key={index}
                    className={`${taskCompleted[index] ? 'opacity-60' : ''} ${
                      index === currentTask ? 'ring-2 ring-pink-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        taskCompleted[index] ? 'bg-green-100' : 'bg-gradient-to-br from-pink-400 to-rose-400'
                      }`}>
                        {taskCompleted[index] ? '✓' : task.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${taskCompleted[index] ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-400">{task.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-pink-500 font-bold">+{task.points}</span>
                        {!taskCompleted[index] && (
                          <CuteButton
                            size="sm"
                            onClick={() => handleTaskComplete(index)}
                            className="mt-1"
                          >
                            完成
                          </CuteButton>
                        )}
                      </div>
                    </div>
                  </CuteCard>
                ))}
              </div>

              {/* 提示 */}
              <div className="text-center text-sm text-gray-400 mt-4">
                💡 完成所有任务获得额外奖励
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 问答类型页面
  return (
    <div className="min-h-screen flex flex-col bg-gradient-love">
      <div className="glass sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-pink-500">
            ← 返回
          </button>
          <span className="font-medium text-gray-700">{defaultChallenge.icon} {content.title}</span>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {showResult ? (
          <div className="h-full flex flex-col items-center justify-center animate-fadeInUp">
            <div className="text-8xl mb-6 animate-bounce-soft">
              🎉
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-2">挑战完成！</h2>
            <p className="text-gray-400 mb-4">
              回答了 {answers.length} 个问题
            </p>
            <CuteProgress
              value={answers.length}
              max={content.questions.length}
              color="pink"
              className="w-48 mb-6"
            />
            <p className="text-gray-500 text-center mb-6 px-8">
              你们越来越了解对方了！
            </p>
            <div className="flex gap-3">
              <CuteButton variant="secondary" onClick={() => {
                setCurrentQuestion(0)
                setAnswers([])
                setShowResult(false)
                setSelectedAnswer(null)
              }}>
                再来一次
              </CuteButton>
              <CuteButton onClick={() => onNavigate('home')}>
                返回首页
              </CuteButton>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 进度 */}
            <div className="text-center">
              <CuteTag variant="purple">
                问题 {currentQuestion + 1}/{content.questions.length}
              </CuteTag>
            </div>

            {/* 问题卡片 */}
            <CuteCard className="text-center">
              <div className="text-4xl mb-4">💭</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {content.questions[currentQuestion].question}
              </h2>
              <p className="text-sm text-gray-400">选择你的答案</p>
            </CuteCard>

            {/* 选项 */}
            <div className="space-y-3">
              {content.questions[currentQuestion].options.map((option, index) => (
                <CuteCard
                  key={index}
                  onClick={() => selectedAnswer === null && handleAnswer(index)}
                  className={`cursor-pointer transition-all ${
                    selectedAnswer === null
                      ? 'hover:ring-2 hover:ring-pink-300'
                      : selectedAnswer === index
                        ? 'ring-2 ring-pink-400 bg-pink-50'
                        : 'opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedAnswer === index
                        ? 'bg-pink-400 text-white'
                        : 'bg-pink-100 text-pink-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-gray-700">{option}</span>
                    {selectedAnswer === index && (
                      <span className="ml-auto text-pink-500">✓</span>
                    )}
                  </div>
                </CuteCard>
              ))}
            </div>

            {/* 提示 */}
            <p className="text-center text-sm text-gray-400">
              💡 认真思考，选择最符合你们情况的答案
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
