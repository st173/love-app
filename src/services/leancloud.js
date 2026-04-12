import AV from 'leancloud-storage'

// LeanCloud 配置 - 需要替换为你的配置
// 去 https://leancloud.cn 注册账号，创建应用，获取 App ID 和 App Key
AV.init({
  appId: import.meta.env.VITE_LEANCLOUD_APP_ID,
  appKey: import.meta.env.VITE_LEANCLOUD_APP_KEY,
  serverURL: import.meta.env.VITE_LEANCLOUD_SERVER_URL, // 如: https://xxx.leancloud.cn
})

// 数据模型
export const User = AV.Object.extend('User')
export const Couple = AV.Object.extend('Couple')
export const Task = AV.Object.extend('Task')
export const Challenge = AV.Object.extend('Challenge')
export const Media = AV.Object.extend('Media')

export default AV
