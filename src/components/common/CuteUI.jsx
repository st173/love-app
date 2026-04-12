import { gradients, shadows } from '../../utils/theme'

// 可爱按钮组件
export function CuteButton({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyle = 'font-bold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95'

  const variants = {
    primary: 'text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white text-pink-500 border-2 border-pink-200 hover:border-pink-400',
    ghost: 'bg-transparent text-pink-500 hover:bg-pink-50',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variant === 'primary' ? { background: gradients.pink } : {}}
      {...props}
    >
      {children}
    </button>
  )
}

// 可爱卡片组件
export function CuteCard({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        bg-white/90 backdrop-blur-sm rounded-3xl p-5
        border border-white/50
        ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg' : ''}
        ${className}
      `}
      style={{ boxShadow: shadows.sm }}
      {...props}
    >
      {children}
    </div>
  )
}

// 可爱进度条组件
export function CuteProgress({ value = 0, max = 100, color = 'pink', showLabel = false, className = '' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const colors = {
    pink: 'from-pink-400 to-rose-400',
    purple: 'from-purple-400 to-pink-400',
    orange: 'from-orange-400 to-amber-400',
    green: 'from-green-400 to-teal-400',
    blue: 'from-blue-400 to-cyan-400',
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="h-3 bg-pink-50 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}

// 可爱标签组件
export function CuteTag({ children, variant = 'pink', className = '' }) {
  const variants = {
    pink: 'bg-pink-50 text-pink-500',
    purple: 'bg-purple-50 text-purple-500',
    orange: 'bg-orange-50 text-orange-500',
    green: 'bg-green-50 text-green-500',
    blue: 'bg-blue-50 text-blue-500',
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// 可爱头像组件
export function CuteAvatar({ src, name, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl',
  }

  const initial = name?.charAt(0)?.toUpperCase() || '💕'

  return (
    <div
      className={`
        rounded-full flex items-center justify-center
        bg-gradient-to-br from-pink-400 to-rose-400
        text-white font-bold shadow-md
        ${sizes[size]} ${className}
      `}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initial
      )}
    </div>
  )
}

// 可爱输入框组件
export function CuteInput({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-500 text-sm mb-2 ml-1">{label}</label>
      )}
      <input
        className={`
          w-full bg-white/80 backdrop-blur-sm
          rounded-2xl px-5 py-4
          outline-none transition-all duration-300
          border-2 border-transparent
          focus:border-pink-300 focus:bg-white
          placeholder-gray-300 text-gray-700
          ${error ? 'border-red-300' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm mt-2 ml-1">{error}</p>
      )}
    </div>
  )
}

// 可爱徽章组件
export function CuteBadge({ count, color = 'pink', className = '' }) {
  const colors = {
    pink: 'bg-pink-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
  }

  if (!count) return null

  return (
    <span
      className={`
        absolute -top-1 -right-1
        min-w-[20px] h-5 px-1.5
        ${colors[color]} text-white text-xs font-bold
        rounded-full flex items-center justify-center
        ${className}
      `}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

// 可爱开关组件
export function CuteToggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`
            w-12 h-6 rounded-full transition-colors duration-300
            ${checked ? 'bg-pink-400' : 'bg-gray-200'}
          `}
        />
        <div
          className={`
            absolute top-0.5 left-0.5 w-5 h-5
            bg-white rounded-full shadow-md
            transition-transform duration-300
            ${checked ? 'translate-x-6' : ''}
          `}
        />
      </div>
      {label && (
        <span className="ml-3 text-gray-600">{label}</span>
      )}
    </label>
  )
}

// 可爱气泡消息组件
export function CuteBubble({ children, position = 'left' }) {
  const positions = {
    left: 'self-start',
    right: 'self-end',
  }

  return (
    <div className={`${positions[position]} max-w-[80%]`}>
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm relative">
        {children}
        <div
          className={`
            absolute bottom-0 w-3 h-3 bg-white
            ${position === 'left' ? 'left-3 -translate-x-1/2' : 'right-3 translate-x-1/2'}
            transform rotate-45 translate-y-1
          `}
        />
      </div>
    </div>
  )
}

// 可爱加载动画组件
export function CuteLoader({ text = '加载中' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="text-4xl animate-bounce">💕</div>
      <p className="text-gray-400 text-sm">{text}...</p>
    </div>
  )
}

// 可爱空状态组件
export function CuteEmpty({ icon = '🔍', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-gray-600 font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm">{description}</p>
      )}
    </div>
  )
}
