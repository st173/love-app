# 坦丹升温 - 产品设计文档

> 生成时间: 2026-04-12
> 模式: Builder Mode (纯娱乐/自用)
> 目标: 1周上线 MVP

---

## 一、产品定位

### 产品名称
**坦丹升温** (Love Warming)

### 一句话描述
一款游戏化、成人向、基于心理学的异地恋情侣虚拟养成网站

### 目标用户
- **核心用户**: 异地恋情侣（18-35岁）
- **痛点**: 无共同活动、话题枯竭、缺少亲密感、安全感缺失
- **场景**: 随时随地，碎片化互动

### 产品性格
- 🎮 **游戏化**: 像玩游戏一样恋爱，有等级、成就、奖励
- 🔥 **成人向**: 大胆的升温挑战，循序渐进的亲密内容
- 🧠 **心理学**: 基于依恋理论、爱情三角理论设计互动
- 🐾 **虚拟养成**: 共同养宠物，培养责任感和共同话题

---

## 二、核心功能模块

### 2.1 情侣配对系统
```
用户A注册 → 生成专属邀请码 → 分享给伴侣B
用户B输入邀请码 → 配对成功 → 创建情侣空间
```

### 2.2 每日任务系统（心理学驱动）
| 任务类型 | 示例 | 心理学原理 |
|---------|------|-----------|
| 表达类 | "发一条语音说今天最想TA的瞬间" | 情感表达训练 |
| 回忆类 | "分享一张你们的合照并说出当时的故事" | 共同记忆强化 |
| 创造类 | "一起画一幅画/写一首诗" | 共同创造体验 |
| 惊喜类 | "给对方点一份外卖惊喜" | 爱的语言-礼物 |

### 2.3 升温挑战系统（三档可选）

用户可在设置中选择挑战等级，随时可调整：

**🌸 轻度模式（纯爱向）**
- 适合：刚开始的情侣、比较害羞的情侣
- 内容：甜蜜互动、回忆分享、日常表白
- 示例：牵手任务、早安晚安打卡、分享童年照片

**💕 中度模式（情侣向）**
- 适合：稳定关系的情侣
- 内容：亲密话题、深度对话、轻微暧昧
- 示例：深夜话题、真心话大冒险、描述对方最迷人的地方

**🔥 重度模式（成人向）**
- 适合：关系亲密、愿意探索的情侣
- 内容：大胆挑战、角色扮演、激情互动
- 示例：亲密挑战、语音任务、视频任务

**解锁机制**: 每个模式内部仍有等级递进，完成任务解锁下一关

### 2.4 虚拟宠物养成
- 共同领养一只宠物（猫/狗/兔子）
- 每日喂食、玩耍、清洁需要双方配合
- 宠物成长反映感情温度
- **宠物不会死亡**，但会生病、不开心、离家出走
- 长期不照顾会触发"感情危机提醒"

### 2.5 话题卡片库
- 每日推送3个话题
- 分类：深度对话、轻松闲聊、未来规划、亲密话题
- AI生成个性化话题（后期）

### 2.6 感情温度计
- 基于互动频率、任务完成率、宠物状态计算
- 可视化展示感情"温度"
- 温度下降时提醒双方

---

## 三、用户流程

### 新用户流程
```
打开网站 → 设置昵称/头像 → 生成邀请码 → 分享伴侣
→ 伴侣输入邀请码 → 配对成功 → 选择挑战模式 → 领养宠物 → 开始每日任务
```

### 日常使用流程
```
打开网站 → 查看今日任务 → 完成任务获得积分
→ 查看伴侣完成情况 → 互动留言 → 升温挑战解锁
→ 宠物互动 → 查看感情温度
```

---

## 四、技术架构

### 前端
- **框架**: React 18 + Vite
- **样式**: Tailwind CSS
- **状态管理**: React Context
- **动画**: Framer Motion

### 后端
- **Firebase Authentication** - 用户认证
- **Cloud Firestore** - 实时数据库
- **Firebase Hosting** - 免费托管

### 数据结构
```javascript
// 用户数据
const user = {
  id: 'user_xxx',
  nickname: '小甜心',
  avatar: '🐱',
  inviteCode: 'LOVE2024',
  partnerId: 'user_yyy',
  challengeMode: 'medium', // light/medium/heavy
  createdAt: '2024-01-01'
}

// 情侣数据
const couple = {
  id: 'couple_xxx',
  members: ['user_xxx', 'user_yyy'],
  pet: {
    type: 'cat',
    name: '小橘',
    level: 5,
    health: 80,
    happiness: 90
  },
  loveScore: 850,
  currentChallengeLevel: 2,
  completedTasks: [...],
  createdAt: '2024-01-01'
}

// 任务数据
const dailyTask = {
  id: 'task_xxx',
  type: 'express', // express/memory/create/surprise
  title: '给TA发一条语音',
  description: '说出今天最想念TA的瞬间',
  points: 10,
  completed: { user_xxx: true, user_yyy: false }
}
```

---

## 五、确认范围（CEO Review 后）

### 核心功能 (P0) - 第1-3天
- [ ] 情侣配对（邀请码机制）
- [ ] 每日任务（3个/天）
- [ ] 升温挑战（三档可选：轻度/中度/重度）
- [ ] 虚拟宠物（基础养成，不死亡）
- [ ] 感情温度计

### 扩展功能 (P1) - 第4-7天
- [ ] AI个性化话题（接入AI API）
- [ ] 多媒体互动（语音/视频/图片）
- [ ] 智能提醒系统（纪念日/节日）
- [ ] 实时双人游戏（你画我猜、真心话）

### 暂缓功能 (P2) - 后期迭代
- [ ] 情侣社区
- [ ] 情侣共同日记
- [ ] 成就徽章系统

**预计开发时间**: 约10天

---

## 六、技术架构 (Eng Review 确认)

### 技术栈
- **前端**: React 18 + Vite + TypeScript + Tailwind CSS
- **后端**: LeanCloud (国内可访问的 BaaS 服务)
- **数据库**: LeanCloud 数据存储
- **实时通信**: LeanCloud 实时消息 (后期)
- **存储**: LeanCloud 文件存储 (多媒体)
- **托管**: Vercel / Netlify / 本地
- **AI**: 本地模型 (免费)

### 认证流程
- 首次打开自动匿名登录
- UID 存储在 localStorage
- 换设备时通过邀请码关联

### 数据模型
```
users/{userId}
├── nickname, avatar, inviteCode, partnerId
├── challengeMode: 'light' | 'medium' | 'heavy'
└── createdAt

couples/{coupleId}
├── members: [userId1, userId2]
├── loveScore, pet, anniversaries
└── createdAt

tasks/{taskId}
├── coupleId, date, tasks[]
└── generatedAt

games/{gameId} (Realtime DB)
├── coupleId, type, state, status
└── 实时同步游戏数据
```

### 文件结构
```
src/
├── components/     # UI组件
│   ├── common/     # 通用组件
│   ├── tasks/      # 任务相关
│   ├── pet/        # 宠物相关
│   └── games/      # 游戏相关
├── pages/          # 页面
├── hooks/          # 自定义Hooks
├── services/       # Firebase服务
├── context/        # React Context
├── utils/          # 工具函数
├── data/           # 预设数据
└── App.jsx
```

### 测试策略
- 单元测试 + 集成测试 + E2E 测试
- 覆盖率目标: 80%+
- 测试框架: Vitest + Testing Library

---

## 七、页面结构

```
/               首页（欢迎页/配对入口）
/pair           配对页面
/home           情侣主页（今日任务、宠物、温度计）
/tasks          任务列表
/challenge      升温挑战
/pet            宠物详情
/settings       设置（挑战模式切换）
```

---

## 七、视觉风格

### 色彩
- 主色: #FF6B9D（粉红）
- 辅色: #FFB6C1（浅粉）
- 强调: #FF4757（热情红）
- 背景: #FFF5F7（粉白渐变）

### 风格
- 圆角、柔和、温馨
- 卡片式布局
- 可爱插画风格
- 微动效增强互动感

---

## 八、10x版本（未来规划）

如果时间充裕，可以加入：
- **AI个性化**: AI生成个性化话题和挑战
- **多媒体互动**: 视频/语音互动功能
- **智能提醒**: 纪念日/节日自动提醒和策划
- **社区功能**: 情侣社区，分享经验和故事

---

## 九、Firebase 配置

需要创建 Firebase 项目并启用：
1. Authentication（匿名/邮箱登录）
2. Cloud Firestore（数据库）
3. Hosting（托管）

配置信息将存储在 `.env.local`:
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

---

**状态**: ✅ 审查完成
**审查记录**:
- ✅ Office Hours (Builder Mode)
- ✅ CEO Review (选择性扩张)
- ✅ Eng Review (技术架构确认)

**下一步**: 开始 MVP 开发
