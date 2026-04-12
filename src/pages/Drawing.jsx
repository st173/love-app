import { useState, useRef, useEffect } from 'react'
import { CuteButton, CuteCard } from '../components/common/CuteUI'

export default function Drawing({ onNavigate }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#FF6B9D')
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState('brush')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const colors = [
    '#FF6B9D', '#FF4757', '#FF8C42', '#FFD135',
    '#4CAF50', '#2196F3', '#9C27B0', '#000000',
    '#FFFFFF', '#888888', '#FFB6C1', '#A78BFF'
  ]

  const tools = [
    { id: 'brush', icon: '🖌️', label: '画笔' },
    { id: 'eraser', icon: '🧹', label: '橡皮' },
    { id: 'fill', icon: '🪣', label: '填充' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // 设置白色背景
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 保存初始状态
    saveToHistory()
  }, [])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL()
    setHistory(prev => [...prev.slice(0, historyIndex + 1), imageData])
    setHistoryIndex(prev => prev + 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      loadFromHistory(history[newIndex])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      loadFromHistory(history[newIndex])
    }
  }

  const loadFromHistory = (imageData) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = imageData
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory()
    }
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()

    let x, y
    if (e.touches) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = brushSize

    if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF'
    } else {
      ctx.strokeStyle = color
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `我们的画作_${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-love">
      {/* 顶部导航 */}
      <div className="glass sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-pink-500">
            ← 返回
          </button>
          <span className="font-medium text-gray-700">🎨 一起画画</span>
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="text-xl disabled:opacity-30"
            >
              ↩️
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="text-xl disabled:opacity-30"
            >
              ↪️
            </button>
          </div>
        </div>
      </div>

      {/* 画布区域 */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-full">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full touch-none cursor-crosshair"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>

      {/* 工具栏 */}
      <div className="glass p-4 space-y-4">
        {/* 工具选择 */}
        <div className="flex justify-center gap-2">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`px-4 py-2 rounded-xl transition-all ${
                tool === t.id
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md'
                  : 'bg-white/80 text-gray-600'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="ml-1 text-sm">{t.label}</span>
            </button>
          ))}
        </div>

        {/* 颜色选择 */}
        <div className="flex justify-center gap-2 flex-wrap">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-transform ${
                color === c ? 'scale-125 ring-2 ring-pink-400 ring-offset-2' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c, border: c === '#FFFFFF' ? '1px solid #ddd' : 'none' }}
            />
          ))}
        </div>

        {/* 画笔大小 */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-gray-500">画笔大小</span>
          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-32 accent-pink-500"
          />
          <span className="text-sm text-gray-600 w-6">{brushSize}</span>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <CuteButton variant="secondary" onClick={clearCanvas} className="flex-1">
            🗑️ 清空
          </CuteButton>
          <CuteButton onClick={saveDrawing} className="flex-1">
            💾 保存
          </CuteButton>
        </div>
      </div>
    </div>
  )
}
